import { mockStore } from '../data/mockStore.js';

export const getPredictions = async (req, res) => {
  try {
    const predictions = [
      {
        id: 'pred_ac_1',
        applianceName: 'Master Bedroom Split AC',
        category: 'Air Conditioner',
        severity: 'high',
        title: 'Annual Pre-Season Servicing Due: Master Bedroom Split AC',
        description: 'Your AC was last serviced 11 months ago. Annual coil jet-cleaning and freon pressure audit cuts power bills by ~18% and prevents sudden compressor failure.',
        actionCategory: 'Air Conditioner',
        recommendedService: 'Pre-Season Deep Jet Pump AC Service',
        estimatedCost: { min: 499, max: 799 },
        suggestedSavings: 'Prevents ₹4,000+ compressor replacement'
      },
      {
        id: 'pred_wash_1',
        applianceName: 'Kitchen Front-Load Washing Machine',
        category: 'Appliance Technician',
        severity: 'high',
        title: 'Diagnostic Overhaul Recommended: Kitchen Washing Machine',
        description: 'You had 3 spot repairs in the last 7 months (drain pump, belt, sensor). Repeated patch fixes indicate motor bearing vibration. A comprehensive diagnostic overhaul saves money vs continuous spot calls.',
        actionCategory: 'Appliance Technician',
        recommendedService: 'Comprehensive Diagnostic & Bearing Audit',
        estimatedCost: { min: 499, max: 899 },
        suggestedSavings: 'Saves up to ₹2,500 vs repetitive emergency spot-fixes'
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        totalHistoryEntries: mockStore.serviceHistory.length,
        predictionsCount: predictions.length,
        predictions
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate predictions' });
  }
};

export const getCustomerServiceTimeline = async (req, res) => {
  try {
    const tree = {
      'Home (Indiranagar)': {
        'Master Bedroom Split AC (Daikin 1.5 Ton)': {
          brand: 'Daikin 1.5 Ton',
          category: 'Air Conditioner',
          events: [mockStore.serviceHistory[0]]
        },
        'Kitchen Washing Machine (Bosch 7kg)': {
          brand: 'Bosch 7kg',
          category: 'Appliance Technician',
          events: mockStore.serviceHistory.slice(1)
        }
      }
    };

    return res.status(200).json({
      success: true,
      count: mockStore.serviceHistory.length,
      timelineTree: tree,
      historyList: mockStore.serviceHistory
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch timeline' });
  }
};

export const addServiceHistoryEntry = async (req, res) => {
  return res.status(201).json({ success: true, message: 'Service history entry recorded' });
};
