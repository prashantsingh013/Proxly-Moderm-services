import datetime
import math

BANGALORE_LOCALITIES = [
    {"name": "Indiranagar", "coordinates": [77.6408, 12.9784], "pincode": "560038"},
    {"name": "Koramangala", "coordinates": [77.6271, 12.9352], "pincode": "560034"},
    {"name": "HSR Layout", "coordinates": [77.6389, 12.9121], "pincode": "560102"},
    {"name": "Whitefield", "coordinates": [77.7499, 12.9698], "pincode": "560066"},
    {"name": "Jayanagar", "coordinates": [77.5838, 12.9308], "pincode": "560041"},
    {"name": "Malleshwaram", "coordinates": [77.5684, 13.0031], "pincode": "560003"},
    {"name": "BTM Layout", "coordinates": [77.6101, 12.9166], "pincode": "560076"},
    {"name": "Marathahalli", "coordinates": [77.7011, 12.9591], "pincode": "560037"},
    {"name": "JP Nagar", "coordinates": [77.5855, 12.9063], "pincode": "560078"},
    {"name": "Bellandur", "coordinates": [77.6770, 12.9304], "pincode": "560103"}
]

CATEGORIES_DATA = [
    {
        "name": "Electrician",
        "slug": "electrician",
        "icon": "Zap",
        "description": "Wiring, MCB tripping, lighting installations, short-circuits & home electrical repairs",
        "isPopular": True
    },
    {
        "name": "Plumber",
        "slug": "plumber",
        "icon": "Droplet",
        "description": "Pipe leaks, taps, geysers, drain unclogging & bathroom sanitary fitting repairs",
        "isPopular": True
    },
    {
        "name": "Air Conditioner",
        "slug": "air-conditioner",
        "icon": "Wind",
        "description": "Split & window AC servicing, gas refill, cooling diagnostics & coil cleaning",
        "isPopular": True
    },
    {
        "name": "Appliance Technician",
        "slug": "appliance-technician",
        "icon": "Cpu",
        "description": "Washing machines, refrigerators, microwaves, dishwashers & RO purifiers",
        "isPopular": True
    },
    {
        "name": "Carpenter",
        "slug": "carpenter",
        "icon": "Hammer",
        "description": "Furniture repair, door locks, hinges, custom wood crafting & modular fittings",
        "isPopular": True
    },
    {
        "name": "Home Cleaning",
        "slug": "home-cleaning",
        "icon": "Sparkles",
        "description": "Deep bathroom cleaning, kitchen degreasing, sofa shampooing & full home sanitization",
        "isPopular": True
    }
]

class MemoryStore:
    def __init__(self):
        self.users = []
        self.providers = []
        self.services = []
        self.categories = []
        self.bookings = []
        self.quotations = []
        self.reviews = []
        self.reports = []
        self.service_history = []
        self.trust_score_history = []
        self.endorsements = []
        self.init_data()

    def init_data(self):
        # 1. Categories
        self.categories = [
            {**c, "_id": f"cat_{i+1}", "serviceCount": 4}
            for i, c in enumerate(CATEGORIES_DATA)
        ]

        # 2. Services
        self.services = [
            {"_id": "srv_1", "name": "Switchboard & Socket Repair", "category": "Electrician", "basePriceRange": {"min": 249, "max": 499}, "isEmergencyEligible": True, "description": "Fix sparking switches, loose wiring, and burned sockets."},
            {"_id": "srv_2", "name": "MCB Tripping & Fuse Troubleshooting", "category": "Electrician", "basePriceRange": {"min": 399, "max": 899}, "isEmergencyEligible": True, "description": "Rapid diagnostic for short circuits and tripping main circuit breakers."},
            {"_id": "srv_3", "name": "Water Pipe Leakage Repair", "category": "Plumber", "basePriceRange": {"min": 349, "max": 799}, "isEmergencyEligible": True, "description": "Emergency leak sealing and sanitary pipeline fitting."},
            {"_id": "srv_4", "name": "Drain & Sink Unclogging", "category": "Plumber", "basePriceRange": {"min": 399, "max": 899}, "isEmergencyEligible": True, "description": "Heavy-duty drain snake unclogging for kitchens and bathrooms."},
            {"_id": "srv_5", "name": "Split AC Deep Foam Cleaning", "category": "Air Conditioner", "basePriceRange": {"min": 499, "max": 899}, "isEmergencyEligible": False, "description": "Jet pump foam wash, indoor filter cleaning & coil check."},
            {"_id": "srv_6", "name": "AC Gas Charging & Leak Detection", "category": "Air Conditioner", "basePriceRange": {"min": 1499, "max": 2499}, "isEmergencyEligible": True, "description": "Freon gas pressure recharge and nitrogen leak testing."},
            {"_id": "srv_7", "name": "Washing Machine Drum & Motor Repair", "category": "Appliance Technician", "basePriceRange": {"min": 499, "max": 1399}, "isEmergencyEligible": True, "description": "Fix unspinning drums, error codes, and water pump faults."},
            {"_id": "srv_8", "name": "Door Lock & Latch Replacement", "category": "Carpenter", "basePriceRange": {"min": 299, "max": 699}, "isEmergencyEligible": True, "description": "High security latch installation and jammed lock fixing."},
            {"_id": "srv_9", "name": "Deep Kitchen Degreasing", "category": "Home Cleaning", "basePriceRange": {"min": 899, "max": 1899}, "isEmergencyEligible": False, "description": "Anti-grease foam wash for tiles, cabinets and countertops."}
        ]

        # 3. Admin User
        self.users.append({
            "_id": "usr_admin",
            "name": "Admin Moderator",
            "email": "admin@skillbridge.in",
            "role": "admin",
            "phone": "+91 98765 00000",
            "preferredLanguage": "en",
            "addresses": [{"locality": "Indiranagar", "city": "Bangalore", "location": {"coordinates": [77.6408, 12.9784]}}]
        })

        # 4. Customers
        for i in range(1, 26):
            loc = BANGALORE_LOCALITIES[(i - 1) % len(BANGALORE_LOCALITIES)]
            self.users.append({
                "_id": f"usr_cust_{i}",
                "name": f"Customer {i} ({loc['name']})",
                "email": f"customer{i}@skillbridge.in",
                "role": "customer",
                "phone": f"+91 98000 {10000 + i}",
                "preferredLanguage": "hi" if i % 3 == 0 else "en",
                "addresses": [{
                    "label": "Home",
                    "addressLine": f"100ft Road, {loc['name']}",
                    "locality": loc["name"],
                    "city": "Bangalore",
                    "pincode": loc["pincode"],
                    "location": {"coordinates": loc["coordinates"]}
                }]
            })

        # 5. Providers
        raw_providers = [
            {"name": "Suresh Kumar", "business": "Suresh Quick Electricals", "cat": ["Electrician"], "tier": "Locally Endorsed", "loc": "Indiranagar", "rate": 450, "score": 94, "rating": 4.9, "jobs": 184, "resp": 10, "cancel": 1, "emerg": True, "bio": "Master Electrician with 14 yrs exp in Indiranagar. Carries genuine Schneider & Havells MCBs."},
            {"name": "Ramesh Reddy", "business": "Reddy Plumbing Solutions", "cat": ["Plumber"], "tier": "Locally Endorsed", "loc": "Koramangala", "rate": 499, "score": 91, "rating": 4.8, "jobs": 142, "resp": 12, "cancel": 2, "emerg": True, "bio": "Specialist in concealed bathroom leaks, pressure boosters, and unclogging without tile damage."},
            {"name": "Manjunath Gowda", "business": "Bangalore Cool Air Conditioning", "cat": ["Air Conditioner"], "tier": "Locally Endorsed", "loc": "HSR Layout", "rate": 699, "score": 93, "rating": 4.9, "jobs": 210, "resp": 15, "cancel": 1, "emerg": True, "bio": "Uses high-pressure water jet pumps, anti-microbial foam wash, and genuine gas refills."},
            {"name": "Priya & Vinay", "business": "CleanNest Pro Sanitization", "cat": ["Home Cleaning"], "tier": "Community Verified", "loc": "Whitefield", "rate": 1299, "score": 89, "rating": 4.9, "jobs": 96, "resp": 25, "cancel": 2, "emerg": False, "bio": "Non-toxic biodegradable degreasers safe for children and pets. Restores stained kitchen tiles."},
            {"name": "Kishore Hegde", "business": "DoorGuard 24/7 Locksmith", "cat": ["Carpenter", "Locksmith"], "tier": "Locally Endorsed", "loc": "Malleshwaram", "rate": 450, "score": 92, "rating": 4.9, "jobs": 118, "resp": 9, "cancel": 0, "emerg": True, "bio": "Emergency door lock assistance without frame damage. Installs Yale and Godrej biometric smart locks."},
            {"name": "Praveen Nair", "business": "Nair Pipe & Geyser Tech", "cat": ["Plumber", "Appliance Technician"], "tier": "Locally Endorsed", "loc": "Jayanagar", "rate": 399, "score": 95, "rating": 4.8, "jobs": 89, "resp": 10, "cancel": 1, "emerg": True, "bio": "Expert repair of AO Smith, Racold, and Bajaj water heaters with original manufacturer warranty spares."},
            {"name": "Deepak Sharma", "business": "Apex Home Appliances", "cat": ["Appliance Technician"], "tier": "Community Verified", "loc": "BTM Layout", "rate": 550, "score": 88, "rating": 4.7, "jobs": 74, "resp": 15, "cancel": 2, "emerg": True, "bio": "Specialist for Bosch, IFB, and Samsung front-load washing machines with on-site PCB troubleshooting."},
            {"name": "Arun Menon", "business": "PureWater Climate Care", "cat": ["Appliance Technician", "Air Conditioner"], "tier": "Locally Endorsed", "loc": "Bellandur", "rate": 480, "score": 93, "rating": 4.9, "jobs": 130, "resp": 12, "cancel": 1, "emerg": True, "bio": "TDS testing and membrane replacement for Kent, Aquaguard, and Pureit with food-grade filters."}
        ]

        for idx, p in enumerate(raw_providers):
            u_id = f"usr_prov_{idx + 1}"
            p_id = f"prov_{idx + 1}"
            loc = next((l for l in BANGALORE_LOCALITIES if l["name"] == p["loc"]), BANGALORE_LOCALITIES[0])

            user_obj = {
                "_id": u_id,
                "name": p["name"],
                "email": f"provider{idx + 1}@skillbridge.in",
                "role": "provider",
                "phone": f"+91 97400 {20000 + idx}",
                "preferredLanguage": "en",
                "addresses": [{"locality": p["loc"], "city": "Bangalore", "location": {"coordinates": loc["coordinates"]}}]
            }
            self.users.append(user_obj)

            prov_obj = {
                "_id": p_id,
                "userId": user_obj,
                "businessName": p["business"],
                "bio": p["bio"],
                "categories": p["cat"],
                "skills": ["Diagnostics", "Emergency Repair", "Installation", "Parts Replacement"],
                "hourlyRate": p["rate"],
                "location": {"type": "Point", "coordinates": loc["coordinates"]},
                "address": {"locality": p["loc"], "city": "Bangalore", "pincode": loc["pincode"]},
                "verificationTier": p["tier"],
                "completedJobsCount": p["jobs"],
                "baseRating": p["rating"],
                "responseTimeMinutes": p["resp"],
                "cancellationRate": p["cancel"],
                "isEmergencyAvailable": p["emerg"],
                "endorsementCount": 4,
                "neighborhoodFavoriteCount": 18,
                "trustScoreCache": {
                    "score": p["score"],
                    "level": "Elite Champion" if p["score"] >= 90 else "Highly Trusted",
                    "factors": {
                        "rating": p["rating"],
                        "completedJobs": p["jobs"],
                        "completionRate": 100 - p["cancel"],
                        "cancellationRate": p["cancel"],
                        "responseTimeMinutes": p["resp"],
                        "verificationTier": p["tier"],
                        "verificationBonus": 100 if p["tier"] == "Locally Endorsed" else 85
                    }
                }
            }
            self.providers.append(prov_obj)

        # 6. Bookings with Escrow & Quotations
        b1_id = "bk_1082"
        self.bookings.append({
            "_id": b1_id,
            "customerId": self.users[1], # customer1
            "providerId": self.providers[0], # Suresh Kumar
            "serviceName": "Emergency Switchboard Spark & MCB Tripping Troubleshooting",
            "category": "Electrician",
            "locality": "Indiranagar",
            "status": "CONFIRMED",
            "finalAmount": 450,
            "isEmergency": True,
            "description": "Main circuit breaker tripping with spark sound in kitchen switchboard.",
            "createdAt": (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat(),
            "escrow": {
                "amount": 450,
                "status": "held",
                "heldAt": datetime.datetime.now().isoformat(),
                "autoReleaseDate": (datetime.datetime.now() + datetime.timedelta(hours=48)).isoformat(),
                "disputeReason": ""
            }
        })

        b2_id = "bk_1083"
        self.bookings.append({
            "_id": b2_id,
            "customerId": self.users[1],
            "providerId": self.providers[1], # Ramesh Reddy
            "serviceName": "High-Pressure Heavy-Duty Drain Snake & Leak Sealing",
            "category": "Plumber",
            "locality": "Indiranagar",
            "status": "COMPLETED",
            "finalAmount": 499,
            "isEmergency": False,
            "description": "Kitchen sink pipe clogged with standing water.",
            "createdAt": (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat(),
            "escrow": {
                "amount": 499,
                "status": "released",
                "heldAt": (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat(),
                "releasedAt": (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat()
            }
        })

        # 7. Peer Endorsements
        self.endorsements = [
            {
                "_id": "end_1",
                "fromProviderId": self.providers[1],
                "toProviderId": self.providers[0],
                "relationship": "co_worked",
                "endorsementText": "Suresh solved a dangerous 3-phase short circuit while I was doing plumbing at a villa in Defence Colony. Extremely knowledgeable with electrical codes.",
                "skillsEndorsed": ["Short Circuit Isolation", "MCB Sizing"],
                "createdAt": (datetime.datetime.now() - datetime.timedelta(days=12)).isoformat()
            },
            {
                "_id": "end_2",
                "fromProviderId": self.providers[2],
                "toProviderId": self.providers[0],
                "relationship": "referred_clients",
                "endorsementText": "Always refer Suresh when my AC customers have indoor wiring or socket burnouts. Fast 10m arrival in Indiranagar.",
                "skillsEndorsed": ["AC Power Points", "Voltage Stabilizer Wiring"],
                "createdAt": (datetime.datetime.now() - datetime.timedelta(days=25)).isoformat()
            }
        ]

        # 8. Service History for Predictive Care
        self.service_history = [
            {
                "_id": "sh_1",
                "customerId": "usr_cust_1",
                "applianceName": "Daikin 1.5 Ton Inverter AC",
                "category": "Air Conditioner",
                "brand": "Daikin",
                "serviceType": "Deep Jet Wash & Gas Check",
                "date": (datetime.datetime.now() - datetime.timedelta(days=320)).isoformat(),
                "cost": 699,
                "providerName": "Bangalore Cool Air Conditioning"
            },
            {
                "_id": "sh_2",
                "customerId": "usr_cust_1",
                "applianceName": "Kent Grand Plus RO Water Purifier",
                "category": "Appliance Technician",
                "brand": "Kent",
                "serviceType": "Sediment & Carbon Filter Replacement",
                "date": (datetime.datetime.now() - datetime.timedelta(days=195)).isoformat(),
                "cost": 480,
                "providerName": "PureWater Climate Care"
            },
            {
                "_id": "sh_3",
                "customerId": "usr_cust_1",
                "applianceName": "IFB 7kg Front Load Washing Machine",
                "category": "Appliance Technician",
                "brand": "IFB",
                "serviceType": "Descaling & Drain Pump Filter Clean",
                "date": (datetime.datetime.now() - datetime.timedelta(days=90)).isoformat(),
                "cost": 550,
                "providerName": "Apex Home Appliances"
            }
        ]

        # 9. TrustScore History
        for prov in self.providers[:3]:
            for offset in [60, 30, 0]:
                self.trust_score_history.append({
                    "_id": f"tsh_{prov['_id']}_{offset}",
                    "providerId": prov["_id"],
                    "date": (datetime.datetime.now() - datetime.timedelta(days=offset)).isoformat(),
                    "score": prov["trustScoreCache"]["score"] - (2 if offset == 60 else (1 if offset == 30 else 0)),
                    "level": prov["trustScoreCache"]["level"],
                    "note": "Scheduled bi-weekly trust audit"
                })

db = MemoryStore()
