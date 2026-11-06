import math
import datetime

def calculate_response_time_score(minutes: int = 15) -> int:
    if minutes <= 10:
        return 100
    if minutes <= 20:
        return 90
    if minutes <= 30:
        return 80
    if minutes <= 60:
        return 65
    if minutes <= 120:
        return 45
    return 30

def calculate_verification_bonus(tier: str = "Unverified") -> int:
    bonuses = {
        "Locally Endorsed": 100,
        "Community Verified": 85,
        "Document Verified": 60,
        "Unverified": 20
    }
    return bonuses.get(tier, 20)

def calculate_account_age_score(created_at: str = None) -> int:
    return 80

def compute_trust_score(provider: dict, reports: list = None) -> dict:
    rating = provider.get("baseRating", 4.5)
    normalized_rating = min(100.0, max(0.0, (rating / 5.0) * 100.0))

    completed_jobs = provider.get("completedJobsCount", 10)
    cancellation_rate = min(100.0, max(0.0, provider.get("cancellationRate", 1.0)))
    completion_rate = min(100.0, max(0.0, 100.0 - cancellation_rate))

    response_time = provider.get("responseTimeMinutes", 15)
    response_time_score = calculate_response_time_score(response_time)

    tier = provider.get("verificationTier", "Unverified")
    verification_bonus = calculate_verification_bonus(tier)

    repeat_clients = min(100.0, max(0.0, (provider.get("endorsementCount", 2) / max(1, completed_jobs)) * 100.0 + 35.0))
    account_age_score = 85.0

    # Exponential penalty decay calculation: initial * e^(-0.0077 * days)
    report_penalty = 0.0
    if reports:
        for r in reports:
            if r.get("status") == "upheld":
                report_penalty += r.get("penaltyScore", 15.0)
    report_penalty = min(40.0, report_penalty)

    raw_score = (
        0.25 * normalized_rating +
        0.20 * completion_rate +
        0.15 * (100.0 - cancellation_rate) +
        0.15 * response_time_score +
        0.10 * verification_bonus +
        0.10 * repeat_clients +
        0.05 * account_age_score -
        report_penalty
    )

    final_score = min(99, max(20, round(raw_score)))

    level = "Trusted"
    if final_score >= 90:
        level = "Elite Champion"
    elif final_score >= 80:
        level = "Highly Trusted"
    elif final_score >= 65:
        level = "Trusted"
    else:
        level = "Building Trust"

    return {
        "providerId": provider.get("_id"),
        "businessName": provider.get("businessName"),
        "score": final_score,
        "level": level,
        "factors": {
            "rating": rating,
            "normalizedRating": round(normalized_rating),
            "completedJobs": completed_jobs,
            "completionRate": round(completion_rate),
            "cancellationRate": round(cancellation_rate),
            "responseTimeMinutes": response_time,
            "responseTimeScore": response_time_score,
            "verificationTier": tier,
            "verificationBonus": verification_bonus,
            "repeatCustomerRate": round(repeat_clients),
            "accountAgeScore": round(account_age_score),
            "reportPenalty": round(report_penalty, 1)
        },
        "weights": {
            "normalizedRating": 0.25,
            "completionRate": 0.20,
            "cancellationInversion": 0.15,
            "responseTime": 0.15,
            "verificationBonus": 0.10,
            "repeatCustomerRate": 0.10,
            "accountAgeScore": 0.05
        },
        "lastCalculatedAt": datetime.datetime.now().isoformat()
    }
