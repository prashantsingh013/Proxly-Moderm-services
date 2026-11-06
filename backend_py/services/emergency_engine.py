import datetime
from .smart_match_engine import calculate_distance_km

def calculate_emergency_surcharge(base_amount: int = 450) -> dict:
    now = datetime.datetime.now()
    hour = now.hour

    breakdowns = []
    flat_fee = 150
    total_multiplier = 0

    breakdowns.append({
        "name": "Rapid Emergency Dispatch Fee",
        "amount": flat_fee,
        "type": "flat",
        "reason": "Priority allocation and instant provider rerouting"
    })

    if hour >= 22 or hour < 6:
        night_surge = round(base_amount * 0.25)
        total_multiplier += 25
        breakdowns.append({
            "name": "Late Night Surge (10 PM - 6 AM)",
            "amount": night_surge,
            "percentage": 25,
            "type": "percentage",
            "reason": "Off-hours emergency night call-out"
        })
    elif 18 <= hour < 22:
        peak_surge = round(base_amount * 0.15)
        total_multiplier += 15
        breakdowns.append({
            "name": "Evening Peak Demand Surge",
            "amount": peak_surge,
            "percentage": 15,
            "type": "percentage",
            "reason": "High volume dispatch period"
        })

    surcharge_amount = sum(b["amount"] for b in breakdowns)
    total_estimated = base_amount + surcharge_amount

    return {
        "baseAmount": base_amount,
        "flatFee": flat_fee,
        "totalPercentMultiplier": total_multiplier,
        "surchargeAmount": surcharge_amount,
        "totalEstimatedCost": total_estimated,
        "breakdowns": breakdowns,
        "transparencyNotice": "All surcharges are locked upfront prior to dispatch confirmation with zero surprise add-ons."
    }

def find_emergency_providers(providers: list, category: str, coordinates: list = [77.6408, 12.9784], tier: int = 1) -> dict:
    tier_map = {
        1: {"maxKm": 5.0, "label": "Immediate Locality (5 km)"},
        2: {"maxKm": 10.0, "label": "Extended Zone (10 km)"},
        3: {"maxKm": 25.0, "label": "City-Wide Rapid Net (25 km)"}
    }
    tier_info = tier_map.get(tier, tier_map[1])
    cat_lower = category.lower()

    candidates = []
    for p in providers:
        p_cats = [c.lower() for c in p.get("categories", [])]
        if any(cat_lower in c for c in p_cats) or cat_lower in p.get("businessName", "").lower():
            coords = p.get("location", {}).get("coordinates", [77.6408, 12.9784])
            dist = calculate_distance_km(coordinates, coords)
            if dist <= tier_info["maxKm"] and p.get("isEmergencyAvailable", True):
                eta_minutes = max(8, round(dist * 3.5))
                candidates.append({
                    "provider": p,
                    "distanceKm": dist,
                    "etaMinutes": eta_minutes,
                    "isAvailableNow": True
                })

    candidates.sort(key=lambda x: x["distanceKm"])

    return {
        "tier": tier,
        "tierLabel": tier_info["label"],
        "maxRadiusKm": tier_info["maxKm"],
        "count": len(candidates),
        "providers": candidates
    }
