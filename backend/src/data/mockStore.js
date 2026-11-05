import { BANGALORE_LOCALITIES, CATEGORIES_DATA } from '../seed/indianLocalities.js';

class MockStore {
  constructor() {
    this.users = [];
    this.providers = [];
    this.services = [];
    this.categories = [];
    this.bookings = [];
    this.quotations = [];
    this.reviews = [];
    this.reports = [];
    this.serviceHistory = [];
    this.trustScoreHistory = [];
    this.endorsements = [];
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    // Categories
    this.categories = CATEGORIES_DATA.map((c, i) => ({ ...c, _id: `cat_${i + 1}`, serviceCount: 4 }));

    // Services
    this.services = [
      { _id: 'srv_1', name: 'Switchboard & Socket Repair', category: 'Electrician', basePriceRange: { min: 249, max: 499 }, isEmergencyEligible: true, description: 'Fix sparking switches, loose wiring, and burned sockets.' },
      { _id: 'srv_2', name: 'MCB Tripping & Fuse Troubleshooting', category: 'Electrician', basePriceRange: { min: 399, max: 899 }, isEmergencyEligible: true, description: 'Rapid diagnostic for short circuits and tripping main circuit breakers.' },
      { _id: 'srv_3', name: 'Water Pipe Leakage Repair', category: 'Plumber', basePriceRange: { min: 349, max: 799 }, isEmergencyEligible: true, description: 'Emergency leak sealing and sanitary pipeline fitting.' },
      { _id: 'srv_4', name: 'Drain & Sink Unclogging', category: 'Plumber', basePriceRange: { min: 399, max: 899 }, isEmergencyEligible: true, description: 'Heavy-duty drain snake unclogging for kitchens and bathrooms.' },
      { _id: 'srv_5', name: 'Split AC Deep Foam Cleaning', category: 'Air Conditioner', basePriceRange: { min: 499, max: 899 }, isEmergencyEligible: false, description: 'Jet pump foam wash, indoor filter cleaning & coil check.' },
      { _id: 'srv_6', name: 'AC Gas Charging & Leak Detection', category: 'Air Conditioner', basePriceRange: { min: 1499, max: 2499 }, isEmergencyEligible: true, description: 'Freon gas pressure recharge and nitrogen leak testing.' },
      { _id: 'srv_7', name: 'Washing Machine Drum & Motor Repair', category: 'Appliance Technician', basePriceRange: { min: 499, max: 1399 }, isEmergencyEligible: true, description: 'Fix unspinning drums, error codes, and water pump faults.' },
      { _id: 'srv_8', name: 'Door Lock & Latch Replacement', category: 'Carpenter', basePriceRange: { min: 299, max: 699 }, isEmergencyEligible: true, description: 'High security latch installation and jammed lock fixing.' },
      { _id: 'srv_9', name: 'Deep Kitchen Degreasing', category: 'Home Cleaning', basePriceRange: { min: 899, max: 1899 }, isEmergencyEligible: false, description: 'Anti-grease foam wash for tiles, cabinets and countertops.' }
    ];

    // Admin User
    const adminId = 'usr_admin';
    this.users.push({
      _id: adminId,
      name: 'Admin Moderator',
      email: 'admin@skillbridge.in',
      role: 'admin',
      phone: '+91 98765 00000',
      preferredLanguage: 'en',
      addresses: [{ locality: 'Indiranagar', city: 'Bangalore', location: { coordinates: [77.6408, 12.9784] } }]
    });

    // Customer Users
    for (let i = 1; i <= 25; i++) {
      const loc = BANGALORE_LOCALITIES[(i - 1) % BANGALORE_LOCALITIES.length];
      this.users.push({
        _id: `usr_cust_${i}`,
        name: `Customer ${i} (${loc.name})`,
        email: `customer${i}@skillbridge.in`,
        role: 'customer',
        phone: `+91 98000 ${10000 + i}`,
        preferredLanguage: i % 3 === 0 ? 'hi' : 'en',
        addresses: [{
          label: 'Home',
          addressLine: `100ft Road, ${loc.name}`,
          locality: loc.name,
          city: 'Bangalore',
          pincode: loc.pincode,
          location: { coordinates: loc.coordinates }
        }]
      });
    }

    // Providers
    const providerList = [
      { name: 'Suresh Kumar', business: 'Suresh Quick Electricals', cat: ['Electrician'], tier: 'Locally Endorsed', loc: 'Indiranagar', rate: 400, score: 94, rating: 4.9, jobs: 184, resp: 10, cancel: 1, emerg: true },
      { name: 'Ramesh Reddy', business: 'Reddy Plumbing Solutions', cat: ['Plumber'], tier: 'Locally Endorsed', loc: 'Indiranagar', rate: 450, score: 91, rating: 4.8, jobs: 142, resp: 12, cancel: 2, emerg: true },
      { name: 'Manjunath Gowda', business: 'Bangalore Cool Air Conditioning', cat: ['Air Conditioner'], tier: 'Locally Endorsed', loc: 'Indiranagar', rate: 550, score: 93, rating: 4.9, jobs: 210, resp: 15, cancel: 1, emerg: true },
      { name: 'Venkatesh Iyer', business: 'Iyer Precision Electricals', cat: ['Electrician', 'CCTV & Security'], tier: 'Locally Endorsed', loc: 'Koramangala', rate: 450, score: 92, rating: 4.9, jobs: 165, resp: 8, cancel: 1, emerg: true },
      { name: 'Prasad Bhat', business: 'AquaFix Flow Plumbers', cat: ['Plumber'], tier: 'Community Verified', loc: 'Koramangala', rate: 400, score: 86, rating: 4.7, jobs: 89, resp: 16, cancel: 2, emerg: true },
      { name: 'Praveen Nair', business: 'Nair Pipe & Geyser Tech', cat: ['Plumber', 'Appliance Technician'], tier: 'Locally Endorsed', loc: 'HSR Layout', rate: 480, score: 95, rating: 4.9, jobs: 195, resp: 10, cancel: 1, emerg: true },
      { name: 'Deepak Sharma', business: 'Apex Home Electricals', cat: ['Electrician'], tier: 'Community Verified', loc: 'HSR Layout', rate: 350, score: 84, rating: 4.6, jobs: 84, resp: 15, cancel: 3, emerg: true },
      { name: 'Arun Menon', business: 'CoolTech Climate Care', cat: ['Air Conditioner'], tier: 'Locally Endorsed', loc: 'Whitefield', rate: 520, score: 93, rating: 4.9, jobs: 178, resp: 12, cancel: 1, emerg: true },
      { name: 'Raghavan Shetty', business: 'South Bangalore Electricals', cat: ['Electrician'], tier: 'Locally Endorsed', loc: 'Jayanagar', rate: 380, score: 96, rating: 4.9, jobs: 230, resp: 9, cancel: 0, emerg: true },
      { name: 'Harish Gowda', business: 'Heritage Wood & Locksmiths', cat: ['Carpenter', 'Locksmith'], tier: 'Locally Endorsed', loc: 'Malleshwaram', rate: 360, score: 89, rating: 4.8, jobs: 140, resp: 14, cancel: 1, emerg: true },
      { name: 'Vinay Kumar', business: 'CleanNest Pro Sanitization', cat: ['Home Cleaning'], tier: 'Community Verified', loc: 'Malleshwaram', rate: 650, score: 87, rating: 4.7, jobs: 82, resp: 25, cancel: 3, emerg: false },
      { name: 'Kishore Hegde', business: 'DoorGuard 24/7 Locksmith', cat: ['Locksmith', 'Carpenter'], tier: 'Locally Endorsed', loc: 'Indiranagar', rate: 450, score: 92, rating: 4.9, jobs: 118, resp: 9, cancel: 0, emerg: true }
    ];

    providerList.forEach((p, idx) => {
      const uId = `usr_prov_${idx + 1}`;
      const pId = `prov_${idx + 1}`;
      const loc = BANGALORE_LOCALITIES.find(l => l.name === p.loc) || BANGALORE_LOCALITIES[0];

      const pUser = {
        _id: uId,
        name: p.name,
        email: `provider${idx + 1}@skillbridge.in`,
        role: 'provider',
        phone: `+91 97400 ${20000 + idx}`,
        preferredLanguage: 'en',
        addresses: [{ locality: p.loc, city: 'Bangalore', location: { coordinates: loc.coordinates } }]
      };
      this.users.push(pUser);

      const pDoc = {
        _id: pId,
        userId: pUser,
        businessName: p.business,
        bio: `Verified specialist with 8+ years experience in ${p.cat.join(', ')}. Zero advance deposit, transparent rate lock.`,
        categories: p.cat,
        skills: ['Diagnostics', 'Wiring', 'Safety Standards', 'Genuine Parts'],
        experienceYears: 6,
        hourlyRate: p.rate,
        location: { type: 'Point', coordinates: loc.coordinates },
        address: { street: '100ft Road', locality: p.loc, city: 'Bangalore', pincode: loc.pincode },
        verificationTier: p.tier,
        baseRating: p.rating,
        totalReviews: Math.round(p.jobs * 0.7),
        completedJobsCount: p.jobs,
        cancellationRate: p.cancel,
        responseTimeMinutes: p.resp,
        isEmergencyAvailable: p.emerg,
        emergencySurchargePercent: 20,
        emergencyBaseFee: 150,
        trustScoreCache: {
          score: p.score,
          level: p.score >= 90 ? 'Elite Champion' : 'Highly Trusted',
          lastCalculatedAt: new Date(),
          factors: {
            rating: p.rating,
            normalizedRating: Math.round((p.rating / 5) * 100),
            completedJobs: p.jobs,
            completionRate: 100 - p.cancel,
            cancellationRate: p.cancel,
            responseTimeMinutes: p.resp,
            responseTimeScore: 90,
            verificationTier: p.tier,
            verificationBonus: p.tier === 'Locally Endorsed' ? 100 : 85,
            repeatCustomerRate: 28,
            accountAgeScore: 85,
            reportPenalty: 0,
            reportCount: 0
          }
        },
        endorsementCount: p.tier === 'Locally Endorsed' ? 4 : 1,
        neighborhoodFavoriteCount: p.tier === 'Locally Endorsed' ? 18 : 6
      };
      this.providers.push(pDoc);

      // TrustScore history
      const days = [60, 45, 30, 15, 0];
      days.forEach((d, i) => {
        const snapDate = new Date();
        snapDate.setDate(snapDate.getDate() - d);
        this.trustScoreHistory.push({
          providerId: pId,
          date: snapDate,
          score: Math.max(70, p.score - Math.round((d / 60) * 8) + i * 2),
          level: p.score >= 90 ? 'Elite Champion' : 'Highly Trusted',
          factorsSnapshot: pDoc.trustScoreCache.factors,
          delta: i > 0 ? 2 : 0
        });
      });
    });

    // Endorsements
    this.endorsements = [
      {
        _id: 'end_1',
        fromProviderId: this.providers[0],
        toProviderId: this.providers[1],
        relationship: 'co_worked',
        note: 'Co-worked on multiple apartment renovations in Indiranagar. Reliable pipeline work and zero leaks.',
        locality: 'Indiranagar',
        createdAt: new Date()
      },
      {
        _id: 'end_2',
        fromProviderId: this.providers[1],
        toProviderId: this.providers[0],
        relationship: 'referred',
        note: 'Suresh is my primary referral for heavy electrical wiring and MCB tripping jobs in East Bangalore.',
        locality: 'Indiranagar',
        createdAt: new Date()
      },
      {
        _id: 'end_3',
        fromProviderId: this.providers[2],
        toProviderId: this.providers[0],
        relationship: 'co_worked',
        note: 'Top notch electrician. Always routes dedicated 16A lines for AC compressor installations safely.',
        locality: 'Indiranagar',
        createdAt: new Date()
      }
    ];

    // Bookings
    const statuses = ['COMPLETED', 'CONFIRMED', 'QUOTATIONS_RECEIVED', 'IN_PROGRESS', 'DISPUTED'];
    for (let i = 1; i <= 20; i++) {
      const cust = this.users[i % 10 + 1];
      const prov = this.providers[i % this.providers.length];
      const status = statuses[i % statuses.length];
      const price = prov.hourlyRate + 150;

      const booking = {
        _id: `bk_${i}`,
        customerId: cust,
        providerId: prov,
        category: prov.categories[0],
        serviceName: `${prov.categories[0]} Diagnostic & Repair`,
        description: `Inspect and resolve issue at ${cust.addresses[0]?.locality}`,
        locality: cust.addresses[0]?.locality,
        addressText: `100ft Road, ${cust.addresses[0]?.locality}, Bangalore`,
        location: cust.addresses[0]?.location,
        isEmergency: i % 4 === 0,
        status,
        finalAmount: price,
        ratingGiven: status === 'COMPLETED',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000), actor: 'customer', note: 'Booking requested.' },
          { status: 'CONFIRMED', timestamp: new Date(Date.now() - (i - 0.5) * 24 * 60 * 60 * 1000), actor: 'customer', note: `Quotation accepted. ₹${price} locked in escrow.` }
        ],
        escrow: {
          amount: price,
          status: status === 'COMPLETED' ? 'released' : (status === 'DISPUTED' ? 'disputed' : 'held'),
          heldAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          releasedAt: status === 'COMPLETED' ? new Date() : null,
          disputeReason: status === 'DISPUTED' ? 'Motor noise unresolved' : ''
        }
      };
      this.bookings.push(booking);

      // Quotation
      this.quotations.push({
        _id: `qt_${i}`,
        bookingId: booking._id,
        providerId: prov,
        priceRange: { min: price - 50, max: price + 100, exact: price },
        etaMinutes: 25,
        validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
        warrantyDays: 30,
        notes: 'Includes 30-day workmanship warranty and genuine replacement parts.',
        status: status === 'REQUESTED' ? 'pending' : 'accepted'
      });
    }

    // Predictive Care Service History for Customer 1
    this.serviceHistory = [
      {
        _id: 'hist_1',
        customerId: this.users[1]._id,
        category: 'Air Conditioner',
        applianceName: 'Master Bedroom Split AC',
        brand: 'Daikin 1.5 Ton',
        locationLabel: 'Home',
        date: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000), // 11 months ago -> Trigger AC servicing due
        cost: 650,
        repairType: 'routine_service',
        notes: 'Deep foam cleaning and gas pressure check.'
      },
      {
        _id: 'hist_2',
        customerId: this.users[1]._id,
        category: 'Appliance Technician',
        applianceName: 'Kitchen Washing Machine',
        brand: 'Bosch 7kg',
        locationLabel: 'Home',
        date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        cost: 450,
        repairType: 'spot_fix',
        notes: 'Drain pump filter cleared.'
      },
      {
        _id: 'hist_3',
        customerId: this.users[1]._id,
        category: 'Appliance Technician',
        applianceName: 'Kitchen Washing Machine',
        brand: 'Bosch 7kg',
        locationLabel: 'Home',
        date: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        cost: 550,
        repairType: 'spot_fix',
        notes: 'Belt adjustment.'
      },
      {
        _id: 'hist_4',
        customerId: this.users[1]._id,
        category: 'Appliance Technician',
        applianceName: 'Kitchen Washing Machine',
        brand: 'Bosch 7kg',
        locationLabel: 'Home',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 3 repairs in 7 months -> Trigger diagnostic overhaul
        cost: 600,
        repairType: 'spot_fix',
        notes: 'Door lock sensor error.'
      }
    ];

    // Reports
    this.reports = [
      {
        _id: 'rep_1',
        reportedBy: { name: 'Customer 2', role: 'customer' },
        reportedAgainst: { name: 'Apex Home Electricals', role: 'provider' },
        reportType: 'no_show',
        reason: 'Confirmed emergency dispatch but did not arrive.',
        status: 'pending',
        createdAt: new Date()
      }
    ];

    this.isInitialized = true;
    console.log('⚡ In-Memory Seed Data Store fully initialized.');
  }
}

export const mockStore = new MockStore();
mockStore.init();
