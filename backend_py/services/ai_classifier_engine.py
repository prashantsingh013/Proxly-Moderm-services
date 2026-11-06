import re

CATEGORY_RULES = [
    {
        "category": "Electrician",
        "keywords": ["electric", "spark", "sparking", "short circuit", "fuse", "mcb", "tripping", "switch", "switchboard", "wire", "wiring", "shock", "power cut", "no power", "socket", "light", "fan", "burning smell"],
        "urgency_high": ["spark", "sparking", "shock", "burning smell", "smoke", "short circuit", "tripping constantly", "blast"],
        "default_price": {"min": 300, "max": 800},
        "suggested_action": "Isolate the main MCB power switch before attempting any pipeline or socket inspection."
    },
    {
        "category": "Plumber",
        "keywords": ["plumb", "pipe", "leak", "leaking", "water", "burst", "tap", "faucet", "drain", "clog", "clogged", "sink", "toilet", "flush", "geyser", "overflow", "shower", "sewage", "pipeline", "low pressure"],
        "urgency_high": ["burst", "flooding", "overflowing", "major leak", "sewage backup", "water gushing"],
        "default_price": {"min": 350, "max": 950},
        "suggested_action": "Shut off the overhead tank main gate valve to stop active flooding."
    },
    {
        "category": "Air Conditioner",
        "keywords": ["ac", "air conditioner", "cooling", "not cooling", "compressor", "gas refill", "freon", "water dripping from ac", "ac noise", "split ac", "window ac", "filter", "servicing", "coil"],
        "urgency_high": ["water leaking inside bedroom", "burning smell from ac", "compressor loud bang"],
        "default_price": {"min": 499, "max": 1800},
        "suggested_action": "Turn off the AC unit to prevent compressor coil burnout."
    },
    {
        "category": "Appliance Technician",
        "keywords": ["washing machine", "refrigerator", "fridge", "microwave", "oven", "dishwasher", "ro water purifier", "geyser", "water heater", "chimney", "dryer"],
        "urgency_high": ["fridge not cooling spoiling food", "washing machine leaking water all over", "geyser shocking"],
        "default_price": {"min": 399, "max": 1200},
        "suggested_action": "Unplug the appliance power cord safely and ensure dry flooring."
    },
    {
        "category": "Carpenter",
        "keywords": ["carpenter", "wood", "door", "lock", "handle", "hinge", "cabinet", "wardrobe", "bed", "furniture", "table", "chair", "drawer", "shelf"],
        "urgency_high": ["door lock jammed", "locked inside", "broken main latch"],
        "default_price": {"min": 300, "max": 850},
        "suggested_action": "Do not force jammed tumblers with excessive leverage to avoid cylinder breakage."
    },
    {
        "category": "Home Cleaning",
        "keywords": ["clean", "deep clean", "bathroom", "kitchen", "tiles", "sofa", "carpet", "pest", "sanitize", "stain", "mould"],
        "urgency_high": ["pest infestation", "chemical spill"],
        "default_price": {"min": 899, "max": 1899},
        "suggested_action": "Keep windows ventilated while waiting for pro degreaser teams."
    }
]

def classify_issue_deterministic(problem_text: str) -> dict:
    text_lower = problem_text.lower()

    best_category = "Electrician"
    max_matches = 0
    secondary_category = None
    urgency = "low"
    suggested_action = "Our verified local specialist will perform a diagnostic inspection on arrival."
    price_band = {"min": 350, "max": 800}

    for rule in CATEGORY_RULES:
        count = sum(1 for kw in rule["keywords"] if kw in text_lower)
        if count > max_matches:
            if max_matches > 0:
                secondary_category = best_category
            max_matches = count
            best_category = rule["category"]
            price_band = rule["default_price"]
            suggested_action = rule["suggested_action"]

            # Urgency check
            if any(uh in text_lower for uh in rule["urgency_high"]):
                urgency = "emergency"
            elif count >= 2:
                urgency = "medium"

    return {
        "primaryCategory": best_category,
        "secondaryCategory": secondary_category if secondary_category != best_category else None,
        "severity": urgency,
        "isEmergencyRecommended": urgency == "emergency",
        "confidenceScore": 0.92 if max_matches > 1 else 0.75,
        "suggestedAction": suggested_action,
        "estimatedPriceBand": price_band,
        "engine": "SkillBridge Rule-Based Deterministic Engine (Zero Latency)"
    }
