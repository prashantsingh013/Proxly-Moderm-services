import { ServiceHistory } from '../models/ServiceHistory.js';

/**
 * Analyzes customer's service history and appliance logs to generate AI-assisted predictive care reminders
 */
export const generatePredictiveCareSuggestions = async (customerId) => {
  const history = await ServiceHistory.find({ customerId })
    .populate('providerId', 'businessName')
    .sort({ date: -1 });

  const predictions = [];
  const now = new Date();

  // Group service events by appliance name / category
  const applianceGroups = {};

  history.forEach(item => {
    const key = `${item.category}__${item.applianceName}`;
    if (!applianceGroups[key]) {
      applianceGroups[key] = {
        category: item.category,
        applianceName: item.applianceName,
        brand: item.brand,
        events: []
      };
    }
    applianceGroups[key].events.push(item);
  });

  // Rule 1: High Frequency Spot Repairs (e.g. >= 3 repairs within 9 months)
  Object.values(applianceGroups).forEach(group => {
    const events = group.events;
    if (events.length >= 3) {
      const oldestInGroup = events[events.length - 1].date;
      const monthsDiff = (now - new Date(oldestInGroup)) / (1000 * 60 * 60 * 24 * 30);
      if (monthsDiff <= 9) {
        predictions.push({
          id: `pred_freq_${group.applianceName.replace(/\s+/g, '_')}`,
          applianceName: group.applianceName,
          category: group.category,
          type: 'repeated_repair_warning',
          severity: 'high',
          title: `Diagnostic Overhaul Recommended for ${group.applianceName}`,
          description: `You have had ${events.length} repairs in the last ${Math.round(monthsDiff)} months. Multiple spot fixes often indicate an underlying motor or PCB fault. A full diagnostic check is more cost-effective than continuous patch repairs.`,
          actionCategory: group.category,
          recommendedService: 'Comprehensive Diagnostic & Health Check',
          estimatedCost: { min: 499, max: 899 },
          suggestedSavings: 'Saves up to ₹2,500 vs repetitive emergency spot-fixes'
        });
      }
    }

    // Rule 2: Annual Servicing Due for ACs (>= 10 months since last service)
    if (group.category === 'Air Conditioner' || group.applianceName.toLowerCase().includes('ac')) {
      const lastService = events[0];
      const monthsSinceLast = (now - new Date(lastService.date)) / (1000 * 60 * 60 * 24 * 30);

      if (monthsSinceLast >= 10) {
        predictions.push({
          id: `pred_ac_${group.applianceName.replace(/\s+/g, '_')}`,
          applianceName: group.applianceName,
          category: 'Air Conditioner',
          type: 'annual_maintenance_due',
          severity: monthsSinceLast >= 12 ? 'high' : 'medium',
          title: `Annual Servicing Due: ${group.applianceName}`,
          description: `Your AC was last serviced ${Math.round(monthsSinceLast)} months ago (${new Date(lastService.date).toLocaleDateString('en-IN')}). Routine coil cleaning and gas level check prevents compressor burnouts and cuts power bills by ~18%.`,
          actionCategory: 'Air Conditioner',
          recommendedService: 'Pre-Season Deep Jet Pump AC Service',
          estimatedCost: { min: 499, max: 799 },
          suggestedSavings: 'Prevents ₹4,000+ compressor replacement'
        });
      }
    }

    // Rule 3: RO Water Purifier Filter Cycle (>= 6 months)
    if (group.category === 'Appliance Technician' && group.applianceName.toLowerCase().includes('ro')) {
      const lastService = events[0];
      const monthsSinceLast = (now - new Date(lastService.date)) / (1000 * 60 * 60 * 24 * 30);

      if (monthsSinceLast >= 6) {
        predictions.push({
          id: `pred_ro_${group.applianceName.replace(/\s+/g, '_')}`,
          applianceName: group.applianceName,
          category: 'Appliance Technician',
          type: 'filter_replacement_due',
          severity: 'medium',
          title: `RO Membrane & Sediment Filter Due: ${group.applianceName}`,
          description: `Last filter check was ${Math.round(monthsSinceLast)} months ago. High TDS in urban groundwater wears down membrane life. A quick TDS check & sediment renewal ensures safe drinking water.`,
          actionCategory: 'Appliance Technician',
          recommendedService: 'RO TDS Calibration & Multi-stage Filter Check',
          estimatedCost: { min: 399, max: 999 },
          suggestedSavings: 'Maintains optimal pure water TDS (<100)'
        });
      }
    }
  });

  // Default suggestions if customer is new or has sparse history
  if (predictions.length === 0) {
    predictions.push({
      id: 'pred_default_electric',
      applianceName: 'Home Electrical & MCB Panel',
      category: 'Electrician',
      type: 'preventive_check',
      severity: 'low',
      title: 'Seasonal Home Electrical & Earthing Health Check',
      description: 'Pre-monsoon electrical surge inspection ensures your home MCBs and earthing circuits prevent appliance tripping.',
      actionCategory: 'Electrician',
      recommendedService: 'Whole-Home Electrical & Earthing Audit',
      estimatedCost: { min: 349, max: 599 },
      suggestedSavings: 'Protects costly electronics from voltage spikes'
    });
  }

  return {
    customerId,
    totalHistoryEntries: history.length,
    predictionsCount: predictions.length,
    predictions,
    generatedAt: new Date()
  };
};
