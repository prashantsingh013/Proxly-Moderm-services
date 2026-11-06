import os
import datetime
import jwt
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Header, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import PORT, JWT_SECRET, JWT_ALGORITHM
from .database import db, BANGALORE_LOCALITIES
from .services.trust_score_engine import compute_trust_score
from .services.smart_match_engine import rank_providers, calculate_distance_km
from .services.emergency_engine import calculate_emergency_surcharge, find_emergency_providers
from .services.ai_classifier_engine import classify_issue_deterministic
from .services.predictive_care_engine import generate_predictive_care

app = FastAPI(
    title="SkillBridge Python API",
    description="Trust-first, AI-assisted local services marketplace backend powered by FastAPI & Python 3",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- JWT & Auth Helpers -----------------

def create_jwt_token(user: dict) -> str:
    payload = {
        "id": user.get("_id"),
        "email": user.get("email"),
        "role": user.get("role", "customer"),
        "name": user.get("name"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        # Fallback to demo customer if unauthorized for smooth demo exploration
        return db.users[1]

    try:
        token = authorization.replace("Bearer ", "").strip()
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("id")
        user = next((u for u in db.users if u.get("_id") == user_id or u.get("email") == payload.get("email")), None)
        if user:
            return user
        return db.users[1]
    except Exception:
        return db.users[1]

# ----------------- Pydantic Request Models -----------------

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "customer"
    phone: Optional[str] = ""
    preferredLanguage: Optional[str] = "en"
    locality: Optional[str] = "Indiranagar"
    city: Optional[str] = "Bangalore"
    coordinates: Optional[List[float]] = [77.6408, 12.9784]

class ClassifyRequest(BaseModel):
    problemText: str

class BookingCreateRequest(BaseModel):
    serviceName: str
    category: str
    locality: Optional[str] = "Indiranagar"
    description: Optional[str] = ""
    targetProviderId: Optional[str] = None
    isEmergency: Optional[bool] = False
    estimatedAmount: Optional[int] = 450

class QuotationSubmitRequest(BaseModel):
    bookingId: str
    priceExact: int
    etaMinutes: int = 30
    warrantyDays: int = 30
    scopeNotes: Optional[str] = ""

class EndorsementCreateRequest(BaseModel):
    toProviderId: str
    relationship: str = "co_worked"
    endorsementText: str
    skillsEndorsed: Optional[List[str]] = []

# ----------------- API Endpoints -----------------

# Health Check
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "SkillBridge Python API (FastAPI)",
        "version": "1.0.0",
        "language": "Python 3.13",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# --- Auth Routes ---
@app.post("/api/auth/login")
def login(req: LoginRequest):
    email_clean = req.email.lower().strip()
    user = next((u for u in db.users if u.get("email", "").lower() == email_clean), None)
    
    if not user:
        # Check if demo account
        if "customer" in email_clean:
            user = db.users[1]
        elif "provider" in email_clean:
            user = db.users[26] if len(db.users) > 26 else db.users[0]
        elif "admin" in email_clean:
            user = db.users[0]
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")

    provider = next((p for p in db.providers if p.get("userId", {}).get("_id") == user.get("_id") or p.get("userId") == user.get("_id")), None)
    token = create_jwt_token(user)

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.get("_id"),
            "_id": user.get("_id"),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "phone": user.get("phone"),
            "preferredLanguage": user.get("preferredLanguage", "en"),
            "addresses": user.get("addresses", []),
            "providerId": provider.get("_id") if provider else None,
            "providerDetails": provider
        }
    }

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    new_id = f"usr_{int(datetime.datetime.now().timestamp() * 1000)}"
    user_obj = {
        "_id": new_id,
        "name": req.name,
        "email": req.email.lower(),
        "role": req.role,
        "phone": req.phone,
        "preferredLanguage": req.preferredLanguage,
        "addresses": [{
            "label": "Primary",
            "locality": req.locality,
            "city": req.city,
            "location": {"coordinates": req.coordinates}
        }]
    }
    db.users.append(user_obj)
    token = create_jwt_token(user_obj)

    return {
        "success": True,
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": new_id,
            "_id": new_id,
            "name": user_obj["name"],
            "email": user_obj["email"],
            "role": user_obj["role"]
        }
    }

@app.get("/api/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    provider = next((p for p in db.providers if p.get("userId", {}).get("_id") == user.get("_id") or p.get("userId") == user.get("_id")), None)
    return {
        "success": True,
        "user": {
            **user,
            "id": user.get("_id"),
            "providerId": provider.get("_id") if provider else None,
            "providerDetails": provider
        }
    }

# --- Services & Categories ---
@app.get("/api/services")
def get_services(category: Optional[str] = None, emergency: Optional[str] = None, search: Optional[str] = None):
    results = db.services
    if category:
        results = [s for s in results if category.lower() in s.get("category", "").lower()]
    if emergency == "true":
        results = [s for s in results if s.get("isEmergencyEligible", False)]
    if search:
        s_lower = search.lower()
        results = [s for s in results if s_lower in s.get("name", "").lower() or s_lower in s.get("description", "").lower()]

    return {"success": True, "count": len(results), "services": results}

@app.get("/api/services/categories")
def get_categories():
    return {"success": True, "categories": db.categories}

@app.get("/api/services/{service_id}")
def get_service_detail(service_id: str):
    s = next((srv for srv in db.services if srv["_id"] == service_id), db.services[0])
    return {"success": True, "service": s}

# --- Providers & TrustScore ---
@app.get("/api/providers")
def get_providers(category: Optional[str] = None, locality: Optional[str] = None, limit: Optional[int] = 50):
    provs = db.providers
    if category:
        cat_lower = category.lower()
        provs = [p for p in provs if any(cat_lower in c.lower() for c in p.get("categories", []))]
    if locality:
        provs = [p for p in provs if p.get("address", {}).get("locality", "").lower() == locality.lower()]

    return {"success": True, "count": len(provs[:limit]), "providers": provs[:limit]}

@app.get("/api/providers/{provider_id}")
def get_provider_detail(provider_id: str):
    p = next((prov for prov in db.providers if prov["_id"] == provider_id), db.providers[0])
    endorsements = [e for e in db.endorsements if e.get("toProviderId", {}).get("_id") == provider_id or e.get("toProviderId") == provider_id]
    return {
        "success": True,
        "provider": p,
        "endorsementsList": endorsements if endorsements else db.endorsements[:1]
    }

@app.get("/api/trustscore/{provider_id}")
def get_trust_score(provider_id: str):
    p = next((prov for prov in db.providers if prov["_id"] == provider_id), db.providers[0])
    score_data = compute_trust_score(p, db.reports)
    return {"success": True, "trustScore": score_data}

@app.get("/api/trustscore/{provider_id}/history")
def get_trust_score_history(provider_id: str):
    p = next((prov for prov in db.providers if prov["_id"] == provider_id), db.providers[0])
    hist = [h for h in db.trust_score_history if h.get("providerId") == provider_id]
    return {"success": True, "history": hist if hist else db.trust_score_history[:3], "provider": p}

# --- SmartMatch Engine ---
@app.get("/api/matches")
def get_smart_matches(
    category: str = "Electrician",
    lng: float = 77.6408,
    lat: float = 12.9784,
    minBudget: int = 300,
    maxBudget: int = 800,
    isEmergency: bool = False,
    maxDistanceKm: float = 25.0
):
    matches = rank_providers(
        providers=db.providers,
        category=category,
        customer_location=[lng, lat],
        customer_budget={"min": minBudget, "max": maxBudget},
        is_emergency=isEmergency,
        max_distance_km=maxDistanceKm
    )
    return {"success": True, "count": len(matches), "matches": matches}

# --- Emergency Radar & Surcharge ---
@app.get("/api/emergency/surcharge")
def get_emergency_surcharge(baseAmount: int = 450):
    calc = calculate_emergency_surcharge(baseAmount)
    return {"success": True, "surcharge": calc}

@app.get("/api/emergency/nearby")
def get_emergency_nearby(category: str = "Electrician", lng: float = 77.6408, lat: float = 12.9784, tier: int = 1):
    res = find_emergency_providers(db.providers, category=category, coordinates=[lng, lat], tier=tier)
    return {"success": True, **res}

# --- AI Issue Classifier ---
@app.post("/api/classify")
def classify_issue(req: ClassifyRequest):
    result = classify_issue_deterministic(req.problemText)
    return {"success": True, "classification": result}

# --- Bookings & Escrow Lifecycle ---
@app.get("/api/bookings")
def get_bookings():
    return {"success": True, "count": len(db.bookings), "bookings": db.bookings}

@app.post("/api/bookings")
def create_booking(req: BookingCreateRequest, user: dict = Depends(get_current_user)):
    new_id = f"bk_{int(datetime.datetime.now().timestamp() * 1000)}"
    target_prov = next((p for p in db.providers if p["_id"] == req.targetProviderId), db.providers[0]) if req.targetProviderId else None

    booking_obj = {
        "_id": new_id,
        "customerId": user,
        "providerId": target_prov,
        "serviceName": req.serviceName,
        "category": req.category,
        "locality": req.locality,
        "status": "CONFIRMED" if target_prov else "REQUESTED",
        "finalAmount": req.estimatedAmount,
        "isEmergency": req.isEmergency,
        "description": req.description,
        "createdAt": datetime.datetime.now().isoformat(),
        "escrow": {
            "amount": req.estimatedAmount,
            "status": "held",
            "heldAt": datetime.datetime.now().isoformat(),
            "autoReleaseDate": (datetime.datetime.now() + datetime.timedelta(hours=48)).isoformat(),
            "disputeReason": ""
        }
    }
    db.bookings.insert(0, booking_obj)
    return {"success": True, "message": "Booking created and escrow funds locked", "booking": booking_obj}

@app.get("/api/bookings/{booking_id}")
def get_booking_detail(booking_id: str):
    b = next((book for book in db.bookings if book["_id"] == booking_id), db.bookings[0])
    quotes = [q for q in db.quotations if q.get("bookingId") == booking_id]
    return {
        "success": True,
        "booking": b,
        "quotations": quotes if quotes else [
            {
                "_id": "qt_sample_1",
                "bookingId": b["_id"],
                "providerId": db.providers[0],
                "priceExact": 450,
                "etaMinutes": 20,
                "warrantyDays": 30,
                "scopeNotes": "Includes genuine Havells parts and full electrical check.",
                "status": "pending"
            }
        ]
    }

@app.patch("/api/bookings/{booking_id}/status")
def update_booking_status(booking_id: str, payload: dict):
    b = next((book for book in db.bookings if book["_id"] == booking_id), db.bookings[0])
    new_status = payload.get("status", "IN_PROGRESS")
    b["status"] = new_status
    return {"success": True, "message": f"Status updated to {new_status}", "booking": b}

@app.post("/api/bookings/{booking_id}/complete")
def complete_booking_and_release_escrow(booking_id: str):
    b = next((book for book in db.bookings if book["_id"] == booking_id), db.bookings[0])
    b["status"] = "COMPLETED"
    if "escrow" in b:
        b["escrow"]["status"] = "released"
        b["escrow"]["releasedAt"] = datetime.datetime.now().isoformat()

    return {"success": True, "message": "Job verified. Escrow funds released to provider.", "booking": b}

@app.post("/api/bookings/{booking_id}/dispute")
def dispute_booking_escrow(booking_id: str, payload: dict):
    b = next((book for book in db.bookings if book["_id"] == booking_id), db.bookings[0])
    reason = payload.get("reason", "Service not performed to satisfaction")
    b["status"] = "DISPUTED"
    if "escrow" in b:
        b["escrow"]["status"] = "disputed"
        b["escrow"]["disputeReason"] = reason

    return {"success": True, "message": "Dispute opened. Funds frozen in escrow for admin arbitration.", "booking": b}

# --- Peer Endorsements & Trust Circles ---
@app.get("/api/endorsements/community-feed")
def get_endorsement_feed(locality: Optional[str] = None):
    feed = db.endorsements
    top_endorsed = db.providers[:4]
    return {
        "success": True,
        "feed": feed,
        "topEndorsedProviders": top_endorsed
    }

@app.post("/api/endorsements")
def create_endorsement(req: EndorsementCreateRequest, user: dict = Depends(get_current_user)):
    from_prov = next((p for p in db.providers if p.get("userId", {}).get("_id") == user.get("_id")), db.providers[0])
    to_prov = next((p for p in db.providers if p["_id"] == req.toProviderId), db.providers[1])

    new_end = {
        "_id": f"end_{int(datetime.datetime.now().timestamp() * 1000)}",
        "fromProviderId": from_prov,
        "toProviderId": to_prov,
        "relationship": req.relationship,
        "endorsementText": req.endorsementText,
        "skillsEndorsed": req.skillsEndorsed,
        "createdAt": datetime.datetime.now().isoformat()
    }
    db.endorsements.insert(0, new_end)
    return {"success": True, "message": "Peer endorsement vouch recorded", "endorsement": new_end}

# --- Predictive Care Engine ---
@app.get("/api/predictiveCare")
def get_predictive_care():
    predictions = generate_predictive_care(db.service_history)
    return {
        "success": True,
        "predictions": predictions,
        "serviceHistory": db.service_history,
        "count": len(predictions)
    }

# --- Platform Analytics ---
@app.get("/api/analytics/overview")
def get_analytics():
    return {
        "success": True,
        "overview": {
            "totalUsers": len(db.users),
            "totalCustomers": len([u for u in db.users if u.get("role") == "customer"]),
            "totalProviders": len(db.providers),
            "totalBookings": len(db.bookings),
            "totalEndorsements": len(db.endorsements),
            "activeDisputes": len([b for b in db.bookings if b.get("status") == "DISPUTED"]),
            "totalEscrowVolume": sum(b.get("finalAmount", 450) for b in db.bookings)
        }
    }

# --- Reports & Moderator Governance ---
@app.get("/api/reports")
def get_reports():
    return {"success": True, "count": len(db.reports), "reports": db.reports}

@app.post("/api/reports")
def create_report(payload: dict):
    new_rep = {
        "_id": f"rep_{int(datetime.datetime.now().timestamp() * 1000)}",
        "reason": payload.get("reason", "Violation reported"),
        "status": "pending",
        "createdAt": datetime.datetime.now().isoformat()
    }
    db.reports.insert(0, new_rep)
    return {"success": True, "message": "Report submitted for admin review", "report": new_rep}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend_py.main:app", host="0.0.0.0", port=PORT, reload=True)
