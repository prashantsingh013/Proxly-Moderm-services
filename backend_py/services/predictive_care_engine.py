import datetime

def generate_predictive_care(history: list) -> list:
    predictions = []
    now = datetime.datetime.now()

    # Rule 1: AC maintenance
    ac_events = [h for h in history if h.get("category") == "Air Conditioner" or "ac" in h.get("applianceName", "").lower()]
    if ac_events:
        predictions.append({
            "id": "pred_ac_1",
            "applianceName": "Daikin 1.5 Ton Split AC",
            "category": "Air Conditioner",
            "type": "annual_maintenance_due",
            "severity": "medium",
            "title": "Annual Pre-Summer Deep Servicing Due",
            "description": "Your AC was last serviced 10 months ago. Routine coil cleaning and gas pressure check prevents compressor burnouts and cuts power bills by ~18%.",
            "actionCategory": "Air Conditioner",
            "recommendedService": "Split AC Deep Foam Cleaning",
            "estimatedCost": {"min": 499, "max": 799},
            "suggestedSavings": "Prevents ₹4,000+ compressor coil burnout"
        })

    # Rule 2: RO Purifier
    ro_events = [h for h in history if "ro" in h.get("applianceName", "").lower()]
    if ro_events or not predictions:
        predictions.append({
            "id": "pred_ro_1",
            "applianceName": "Kent Grand Plus RO Water Purifier",
            "category": "Appliance Technician",
            "type": "filter_replacement_due",
            "severity": "high",
            "title": "Sediment & Carbon Filter Renewal Recommended",
            "description": "It has been 6 months since your last filter check. Fresh carbon block membranes ensure optimal TDS levels and protect reverse osmosis pumps.",
            "actionCategory": "Appliance Technician",
            "recommendedService": "RO Water Purifier Membrane & Filter Service",
            "estimatedCost": {"min": 450, "max": 850},
            "suggestedSavings": "Maintains 99.8% water purity & pump lifespan"
        })

    # Rule 3: Washing Machine
    predictions.append({
        "id": "pred_wm_1",
        "applianceName": "IFB 7kg Front Load Washing Machine",
        "category": "Appliance Technician",
        "type": "routine_checkup",
        "severity": "low",
        "title": "Quarterly Descaling & Drum Balance Check",
        "description": "Hard water scaling in Bangalore municipal water can strain drum bearings. Proactive descaling preserves motor smoothness.",
        "actionCategory": "Appliance Technician",
        "recommendedService": "Washing Machine Drum & Motor Diagnostics",
        "estimatedCost": {"min": 399, "max": 650},
        "suggestedSavings": "Avoids ₹2,500 drum replacement"
    })

    return predictions
