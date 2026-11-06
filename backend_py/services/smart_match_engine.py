import math

def calculate_distance_km(coord1: list, coord2: list) -> float:
    if not coord1 or not coord2 or len(coord1) < 2 or len(coord2) < 2:
        return 3.0
    lon1, lat1 = coord1
    lon2, lat2 = coord2

    R = 6371.0  # Earth's radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2.0) ** 2 +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
        math.sin(d_lon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 1)

def rank_providers(
    providers: list,
    category: str,
    customer_location: list = [77.6408, 12.9784],
    customer_budget: dict = {"min": 300, "max": 700},
    is_emergency: bool = False,
    max_distance_km: float = 25.0
) -> list:
    filtered = []
    cat_lower = category.lower()

    for p in providers:
        p_cats = [c.lower() for c in p.get("categories", [])]
        if any(cat_lower in c for c in p_cats) or cat_lower in p.get("businessName", "").lower():
            if is_emergency and not p.get("isEmergencyAvailable", False):
                continue
            filtered.append(p)

    if not filtered:
        filtered = providers[:5]

    scored = []
    for prov in filtered:
        coords = prov.get("location", {}).get("coordinates", [77.6408, 12.9784])
        distance_km = calculate_distance_km(customer_location, coords)

        # 1. TrustScore (0-100)
        trust_score = prov.get("trustScoreCache", {}).get("score", 75)

        # 2. Proximity (0-100)
        proximity_score = max(0, min(100, round((1.0 - (distance_km / max_distance_km)) * 100.0)))

        # 3. Availability (0-100)
        avail_score = 95 if prov.get("isEmergencyAvailable", True) else 60

        # 4. Price Band Fit (0-100)
        rate = prov.get("hourlyRate", 400)
        target_mid = (customer_budget.get("min", 300) + customer_budget.get("max", 700)) / 2.0
        price_diff = abs(rate - target_mid)
        price_fit = max(20, min(100, round(100.0 - (price_diff / max(1.0, target_mid)) * 60.0)))

        # 5. Past Success
        completed = prov.get("completedJobsCount", 10)
        rating = prov.get("baseRating", 4.8)
        past_success = min(100, round((completed / 50.0) * 40.0 + (rating / 5.0) * 60.0))

        # SmartMatch Weighted Formula:
        # MatchScore = 0.30*TrustScore + 0.25*Proximity + 0.20*Availability + 0.15*PriceFit + 0.10*PastSuccess
        raw_match = (
            0.30 * trust_score +
            0.25 * proximity_score +
            0.20 * avail_score +
            0.15 * price_fit +
            0.10 * past_success
        )
        match_score = min(100, max(15, round(raw_match)))

        # Explainable Positive Reasons
        why_recommended = []
        if trust_score >= 85:
            why_recommended.append(f"🛡️ High TrustScore ({trust_score}/100) - {prov.get('trustScoreCache', {}).get('level', 'Trusted')}")
        if distance_km <= 3.0:
            why_recommended.append(f"📍 Hyperlocal — only {distance_km} km away in your area")
        elif distance_km <= 6.0:
            why_recommended.append(f"🚗 Nearby — {distance_km} km away")
        if prov.get("verificationTier") == "Locally Endorsed":
            why_recommended.append("🤝 Locally Endorsed by peer verified providers")
        if prov.get("responseTimeMinutes", 15) <= 15:
            why_recommended.append(f"⚡ Rapid {prov.get('responseTimeMinutes')}m typical response")
        if price_fit >= 80:
            why_recommended.append(f"💰 Great budget fit (₹{rate}/hr matches your preference)")

        # Score Drags for Lower Ranked
        drag_factors = []
        if distance_km > 7.0:
            drag_factors.append(f"Further away ({distance_km} km distance)")
        if price_fit < 70:
            drag_factors.append(f"Hourly rate ₹{rate} is higher than mid-budget")
        if trust_score < 80:
            drag_factors.append("Newer profile with fewer accumulated endorsements")

        scored.append({
            "provider": prov,
            "providerId": prov.get("_id"),
            "businessName": prov.get("businessName"),
            "matchScore": match_score,
            "distanceKm": distance_km,
            "hourlyRate": rate,
            "trustScore": trust_score,
            "verificationTier": prov.get("verificationTier", "Unverified"),
            "scoreBreakdown": {
                "trustScoreNormalized": trust_score,
                "proximityScore": proximity_score,
                "availabilityScore": avail_score,
                "priceBandFit": price_fit,
                "pastSuccess": past_success
            },
            "whyRecommended": why_recommended if why_recommended else ["Verified local service provider"],
            "scoreDragFactors": drag_factors
        })

    # Sort descending by MatchScore
    scored.sort(key=lambda x: x["matchScore"], reverse=True)
    return scored
