import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Provider } from '../models/Provider.js';
import { Category } from '../models/Category.js';
import { Service } from '../models/Service.js';
import { Booking } from '../models/Booking.js';
import { Quotation } from '../models/Quotation.js';
import { Review } from '../models/Review.js';
import { Report } from '../models/Report.js';
import { ServiceHistory } from '../models/ServiceHistory.js';
import { TrustScoreHistory } from '../models/TrustScoreHistory.js';
import { Endorsement } from '../models/Endorsement.js';
import { NeighborhoodFavorite } from '../models/NeighborhoodFavorite.js';
import { BANGALORE_LOCALITIES, CATEGORIES_DATA } from './indianLocalities.js';
import { calculateTrustScore } from '../services/trustScoreEngine.js';

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Kabir', 'Ananya', 'Diya', 'Gauri', 'Aadhya', 'Pari',
  'Anushka', 'Navya', 'Sneha', 'Riya', 'Ira', 'Myra', 'Kavya', 'Tanvi', 'Meera', 'Pooja',
  'Rahul', 'Rohan', 'Amit', 'Vikram', 'Deepak', 'Sanjay', 'Sunil', 'Rajesh', 'Manoj', 'Kiran',
  'Priya', 'Neha', 'Shweta', 'Divya', 'Preeti', 'Swati', 'Anjali', 'Archana', 'Jyoti', 'Sunita'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Nair', 'Menon', 'Iyer', 'Pillai', 'Hegde',
  'Deshmukh', 'Kulkarni', 'Joshi', 'Bhat', 'Shetty', 'Gowda', 'Kumar', 'Singh', 'Mishra', 'Pandey',
  'Gupta', 'Agarwal', 'Chatterjee', 'Banerjee', 'Ghosh', 'Mukherjee', 'Dutta', 'Das', 'Sen', 'Chowdhury'
];

export const seedDatabase = async () => {
  console.log('🌱 Starting SkillBridge Database Seeding...');

  // Clean collections
  await Promise.all([
    User.deleteMany({}),
    Provider.deleteMany({}),
    Category.deleteMany({}),
    Service.deleteMany({}),
    Booking.deleteMany({}),
    Quotation.deleteMany({}),
    Review.deleteMany({}),
    Report.deleteMany({}),
    ServiceHistory.deleteMany({}),
    TrustScoreHistory.deleteMany({}),
    Endorsement.deleteMany({}),
    NeighborhoodFavorite.deleteMany({})
  ]);

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Admin User
  const adminUser = await User.create({
    name: 'Admin Moderator',
    email: 'admin@skillbridge.in',
    passwordHash: adminPasswordHash,
    role: 'admin',
    phone: '+91 98765 00000',
    preferredLanguage: 'en',
    addresses: [{
      label: 'Headquarters',
      addressLine: '100 Feet Road, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      location: { type: 'Point', coordinates: [77.6408, 12.9784] }
    }]
  });

  // 2. Create Categories
  const categoryDocs = await Category.insertMany(CATEGORIES_DATA);
  console.log(`✅ Seeded ${categoryDocs.length} Categories`);

  // 3. Create Services
  const servicesList = [
    // Electrician
    { name: 'Switchboard & Socket Repair', category: 'Electrician', subCategory: 'Switches', basePriceRange: { min: 249, max: 499 }, isEmergencyEligible: true },
    { name: 'MCB Tripping & Fuse Troubleshooting', category: 'Electrician', subCategory: 'Fuse/MCB', basePriceRange: { min: 399, max: 899 }, isEmergencyEligible: true },
    { name: 'Ceiling Fan Installation & Repair', category: 'Electrician', subCategory: 'Fans', basePriceRange: { min: 299, max: 599 }, isEmergencyEligible: false },
    { name: 'Complete House Wiring Inspection', category: 'Electrician', subCategory: 'Audit', basePriceRange: { min: 799, max: 1899 }, isEmergencyEligible: false },
    { name: 'Inverter & Battery Wiring Setup', category: 'Electrician', subCategory: 'Inverter', basePriceRange: { min: 499, max: 1299 }, isEmergencyEligible: true },
    // Plumber
    { name: 'Water Pipe Leakage Repair', category: 'Plumber', subCategory: 'Leaks', basePriceRange: { min: 349, max: 799 }, isEmergencyEligible: true },
    { name: 'Drain & Sink Unclogging', category: 'Plumber', subCategory: 'Clogs', basePriceRange: { min: 399, max: 899 }, isEmergencyEligible: true },
    { name: 'Tap & Shower Mixer Replacement', category: 'Plumber', subCategory: 'Fittings', basePriceRange: { min: 299, max: 699 }, isEmergencyEligible: false },
    { name: 'Geyser Water Heater Plumbing Connection', category: 'Plumber', subCategory: 'Geyser', basePriceRange: { min: 449, max: 999 }, isEmergencyEligible: true },
    { name: 'Overhead Water Tank Cleaning & Valve Check', category: 'Plumber', subCategory: 'Tanks', basePriceRange: { min: 899, max: 1999 }, isEmergencyEligible: false },
    // AC
    { name: 'Split AC Deep Foam Cleaning & Filter Wash', category: 'Air Conditioner', subCategory: 'Deep Clean', basePriceRange: { min: 499, max: 899 }, isEmergencyEligible: false },
    { name: 'AC Gas Charging & Leak Detection', category: 'Air Conditioner', subCategory: 'Gas Refill', basePriceRange: { min: 1499, max: 2499 }, isEmergencyEligible: true },
    { name: 'AC Water Leakage & Drain Clearing', category: 'Air Conditioner', subCategory: 'Leakage', basePriceRange: { min: 399, max: 749 }, isEmergencyEligible: true },
    { name: 'Compressor PCB Diagnostics & Overhaul', category: 'Air Conditioner', subCategory: 'PCB Repair', basePriceRange: { min: 899, max: 2199 }, isEmergencyEligible: true },
    // Appliances
    { name: 'Front Load Washing Machine Drum & Motor Repair', category: 'Appliance Technician', subCategory: 'Washing Machine', basePriceRange: { min: 499, max: 1399 }, isEmergencyEligible: true },
    { name: 'Refrigerator Cooling & Compressor Diagnostics', category: 'Appliance Technician', subCategory: 'Fridge', basePriceRange: { min: 449, max: 1499 }, isEmergencyEligible: true },
    { name: 'RO Water Purifier Membrane & Filter Replacement', category: 'Appliance Technician', subCategory: 'RO Purifier', basePriceRange: { min: 399, max: 1199 }, isEmergencyEligible: false },
    { name: 'Microwave Oven Magnetron & Spark Fix', category: 'Appliance Technician', subCategory: 'Microwave', basePriceRange: { min: 349, max: 899 }, isEmergencyEligible: false },
    // Carpenter
    { name: 'Door Lock & Latch Replacement', category: 'Carpenter', subCategory: 'Locks', basePriceRange: { min: 299, max: 699 }, isEmergencyEligible: true },
    { name: 'Bed & Wardrobe Modular Assembly', category: 'Carpenter', subCategory: 'Furniture', basePriceRange: { min: 599, max: 1599 }, isEmergencyEligible: false },
    { name: 'Cabinet Hinge & Drawer Slider Repair', category: 'Carpenter', subCategory: 'Fittings', basePriceRange: { min: 249, max: 599 }, isEmergencyEligible: false },
    // Cleaning
    { name: 'Deep Kitchen Degreasing & Tile Scrubbing', category: 'Home Cleaning', subCategory: 'Kitchen', basePriceRange: { min: 899, max: 1899 }, isEmergencyEligible: false },
    { name: 'Bathroom Acid-Free Anti-Scale Deep Wash', category: 'Home Cleaning', subCategory: 'Bathroom', basePriceRange: { min: 499, max: 1099 }, isEmergencyEligible: false },
    { name: 'Fabric Sofa & Carpet Shampooing', category: 'Home Cleaning', subCategory: 'Sofa/Carpet', basePriceRange: { min: 799, max: 1699 }, isEmergencyEligible: false },
    // Pest Control
    { name: 'Herbal Cockroach Gel Kitchen Treatment', category: 'Pest Control', subCategory: 'Cockroaches', basePriceRange: { min: 699, max: 1299 }, isEmergencyEligible: false },
    { name: 'Sub-Terranean Termite Barrier Protection', category: 'Pest Control', subCategory: 'Termites', basePriceRange: { min: 1499, max: 3999 }, isEmergencyEligible: false },
    // Painter
    { name: 'Single Room Emulsion Wall Painting', category: 'Painter', subCategory: 'Interior', basePriceRange: { min: 1499, max: 3499 }, isEmergencyEligible: false },
    { name: 'Damp Wall Waterproof Chemical Seal', category: 'Painter', subCategory: 'Waterproofing', basePriceRange: { min: 999, max: 2499 }, isEmergencyEligible: true }
  ];

  const serviceDocs = await Service.insertMany(servicesList);
  console.log(`✅ Seeded ${serviceDocs.length} Services`);

  // 4. Create 50 Customer Users
  const customerUsers = [];
  for (let i = 0; i < 50; i++) {
    const fn = INDIAN_FIRST_NAMES[i % INDIAN_FIRST_NAMES.length];
    const ln = INDIAN_LAST_NAMES[(i * 3) % INDIAN_LAST_NAMES.length];
    const locality = BANGALORE_LOCALITIES[i % BANGALORE_LOCALITIES.length];

    // Jitter coordinates slightly within 2km
    const jitterLng = locality.coordinates[0] + (Math.random() - 0.5) * 0.02;
    const jitterLat = locality.coordinates[1] + (Math.random() - 0.5) * 0.02;

    customerUsers.push({
      name: `${fn} ${ln}`,
      email: `customer${i + 1}@skillbridge.in`,
      passwordHash: defaultPasswordHash,
      role: 'customer',
      phone: `+91 ${98000 + i} ${10000 + (i * 123) % 90000}`,
      preferredLanguage: i % 4 === 0 ? 'hi' : 'en',
      addresses: [{
        label: 'Home',
        addressLine: `#${10 + i}, ${locality.name} Main Road`,
        locality: locality.name,
        city: 'Bangalore',
        pincode: locality.pincode,
        location: { type: 'Point', coordinates: [jitterLng, jitterLat] }
      }]
    });
  }

  const seededCustomers = await User.insertMany(customerUsers);
  console.log(`✅ Seeded ${seededCustomers.length} Customers`);

  // 5. Create 32 Providers across categories
  const providerConfigs = [
    // Indiranagar Cluster (Trust Circle)
    { name: 'Suresh Kumar', business: 'Suresh Quick Electricals', cat: ['Electrician'], tier: 'Locally Endorsed', locality: 'Indiranagar', rate: 400, rating: 4.9, jobs: 184, resp: 10, cancel: 1, emerg: true },
    { name: 'Ramesh Reddy', business: 'Reddy Plumbing Solutions', cat: ['Plumber'], tier: 'Locally Endorsed', locality: 'Indiranagar', rate: 450, rating: 4.8, jobs: 142, resp: 12, cancel: 2, emerg: true },
    { name: 'Manjunath Gowda', business: 'Bangalore Cool Air Conditioning', cat: ['Air Conditioner'], tier: 'Locally Endorsed', locality: 'Indiranagar', rate: 550, rating: 4.9, jobs: 210, resp: 15, cancel: 1, emerg: true },
    { name: 'Anand Verma', business: 'Master Appliance Doctor', cat: ['Appliance Technician'], tier: 'Community Verified', locality: 'Indiranagar', rate: 420, rating: 4.7, jobs: 98, resp: 18, cancel: 3, emerg: true },
    { name: 'Karthik Rao', business: 'Karthik Woodcraft & Locks', cat: ['Carpenter', 'Locksmith'], tier: 'Community Verified', locality: 'Indiranagar', rate: 380, rating: 4.6, jobs: 75, resp: 20, cancel: 4, emerg: false },
    // Koramangala
    { name: 'Venkatesh Iyer', business: 'Iyer Precision Electricals', cat: ['Electrician', 'CCTV & Security'], tier: 'Locally Endorsed', locality: 'Koramangala', rate: 450, rating: 4.9, jobs: 165, resp: 8, cancel: 1, emerg: true },
    { name: 'Prasad Bhat', business: 'AquaFix Flow Plumbers', cat: ['Plumber'], tier: 'Community Verified', locality: 'Koramangala', rate: 400, rating: 4.7, jobs: 89, resp: 16, cancel: 2, emerg: true },
    { name: 'Sunil Hegde', business: 'Arctic Breeze AC Works', cat: ['Air Conditioner'], tier: 'Document Verified', locality: 'Koramangala', rate: 500, rating: 4.6, jobs: 62, resp: 25, cancel: 5, emerg: true },
    { name: 'Shiva Kumar', business: 'Shiva Spark Cleaners', cat: ['Home Cleaning'], tier: 'Community Verified', locality: 'Koramangala', rate: 600, rating: 4.8, jobs: 115, resp: 20, cancel: 2, emerg: false },
    // HSR Layout
    { name: 'Deepak Sharma', business: 'Apex Home Electricals', cat: ['Electrician'], tier: 'Community Verified', locality: 'HSR Layout', rate: 350, rating: 4.6, jobs: 84, resp: 15, cancel: 3, emerg: true },
    { name: 'Praveen Nair', business: 'Nair Pipe & Geyser Tech', cat: ['Plumber', 'Appliance Technician'], tier: 'Locally Endorsed', locality: 'HSR Layout', rate: 480, rating: 4.9, jobs: 195, resp: 10, cancel: 1, emerg: true },
    { name: 'Ganesh Kulkarni', business: 'Urban Woodworks', cat: ['Carpenter'], tier: 'Document Verified', locality: 'HSR Layout', rate: 390, rating: 4.5, jobs: 48, resp: 30, cancel: 4, emerg: false },
    { name: 'Santosh Mishra', business: 'Shield Pro Pest Eradication', cat: ['Pest Control'], tier: 'Document Verified', locality: 'HSR Layout', rate: 750, rating: 4.7, jobs: 70, resp: 35, cancel: 3, emerg: false },
    // Whitefield
    { name: 'Manoj Patel', business: 'Whitefield Circuit Pros', cat: ['Electrician'], tier: 'Community Verified', locality: 'Whitefield', rate: 420, rating: 4.8, jobs: 110, resp: 12, cancel: 2, emerg: true },
    { name: 'Vijay Deshmukh', business: 'WaterSeal & Plumb Tech', cat: ['Plumber', 'Waterproofing Expert'], tier: 'Document Verified', locality: 'Whitefield', rate: 460, rating: 4.5, jobs: 55, resp: 25, cancel: 4, emerg: true },
    { name: 'Arun Menon', business: 'CoolTech Climate Care', cat: ['Air Conditioner'], tier: 'Locally Endorsed', locality: 'Whitefield', rate: 520, rating: 4.9, jobs: 178, resp: 12, cancel: 1, emerg: true },
    { name: 'Rajesh Sen', business: 'Rainbow Wall Art & Painting', cat: ['Painter'], tier: 'Document Verified', locality: 'Whitefield', rate: 650, rating: 4.6, jobs: 40, resp: 45, cancel: 2, emerg: false },
    // Jayanagar
    { name: 'Raghavan Shetty', business: 'South Bangalore Electricals', cat: ['Electrician'], tier: 'Locally Endorsed', locality: 'Jayanagar', rate: 380, rating: 4.9, jobs: 230, resp: 9, cancel: 0, emerg: true },
    { name: 'Nagaraj Pillai', business: 'Cauvery Sanitary & Plumbing', cat: ['Plumber'], tier: 'Community Verified', locality: 'Jayanagar', rate: 370, rating: 4.7, jobs: 124, resp: 14, cancel: 2, emerg: true },
    { name: 'Chetan Joshi', business: 'Smart Appliance Care', cat: ['Appliance Technician', 'Chimney & Hob Service'], tier: 'Community Verified', locality: 'Jayanagar', rate: 440, rating: 4.8, jobs: 92, resp: 15, cancel: 3, emerg: false },
    // Malleshwaram
    { name: 'Harish Gowda', business: 'Heritage Wood & Locksmiths', cat: ['Carpenter', 'Locksmith'], tier: 'Locally Endorsed', locality: 'Malleshwaram', rate: 360, rating: 4.8, jobs: 140, resp: 14, cancel: 1, emerg: true },
    { name: 'Balaji Rao', business: 'Balaji AC Gas & Spares', cat: ['Air Conditioner'], tier: 'Document Verified', locality: 'Malleshwaram', rate: 480, rating: 4.6, jobs: 68, resp: 22, cancel: 4, emerg: true },
    { name: 'Vinay Kumar', business: 'CleanNest Pro Sanitization', cat: ['Home Cleaning', 'Pest Control'], tier: 'Community Verified', locality: 'Malleshwaram', rate: 650, rating: 4.7, jobs: 82, resp: 25, cancel: 3, emerg: false },
    // BTM Layout & Bellandur
    { name: 'Dinesh Gupta', business: 'BTM Flash Electricians', cat: ['Electrician'], tier: 'Document Verified', locality: 'BTM Layout', rate: 330, rating: 4.4, jobs: 45, resp: 20, cancel: 6, emerg: true },
    { name: 'Satish Pandey', business: 'Bellandur Quick Plumbing', cat: ['Plumber'], tier: 'Document Verified', locality: 'Bellandur', rate: 390, rating: 4.5, jobs: 52, resp: 18, cancel: 3, emerg: true },
    { name: 'Gopal Krishna', business: 'GreenLeaf Lawn & Gardening', cat: ['Gardener'], tier: 'Unverified', locality: 'Indiranagar', rate: 300, rating: 4.2, jobs: 15, resp: 40, cancel: 8, emerg: false },
    { name: 'Bhaskar Das', business: 'Solid Foundation Masonry & Tiles', cat: ['Masonry & Tiling'], tier: 'Unverified', locality: 'Koramangala', rate: 400, rating: 4.3, jobs: 18, resp: 50, cancel: 5, emerg: false },
    { name: 'Naveen Agarwal', business: 'SecureVision CCTV Networks', cat: ['CCTV & Security'], tier: 'Community Verified', locality: 'HSR Layout', rate: 550, rating: 4.8, jobs: 76, resp: 15, cancel: 2, emerg: false },
    { name: 'Lokesh Mukherjee', business: 'SunPower Solar Maintenance', cat: ['Solar Panel Maintenance', 'Electrician'], tier: 'Document Verified', locality: 'Whitefield', rate: 600, rating: 4.7, jobs: 34, resp: 30, cancel: 3, emerg: false },
    { name: 'Ravi Chatterjee', business: 'PureFlow RO & Geyser Services', cat: ['Appliance Technician'], tier: 'Locally Endorsed', locality: 'Indiranagar', rate: 430, rating: 4.9, jobs: 160, resp: 11, cancel: 1, emerg: true },
    { name: 'Mohan Lal', business: 'FreshCoat Express Painters', cat: ['Painter'], tier: 'Community Verified', locality: 'Jayanagar', rate: 580, rating: 4.7, jobs: 65, resp: 30, cancel: 3, emerg: false },
    { name: 'Kishore Hegde', business: 'DoorGuard 24/7 Locksmith', cat: ['Locksmith', 'Carpenter'], tier: 'Locally Endorsed', locality: 'Indiranagar', rate: 450, rating: 4.9, jobs: 118, resp: 9, cancel: 0, emerg: true }
  ];

  const seededProviders = [];

  for (let i = 0; i < providerConfigs.length; i++) {
    const pConf = providerConfigs[i];
    const locInfo = BANGALORE_LOCALITIES.find(l => l.name === pConf.locality) || BANGALORE_LOCALITIES[0];
    const coords = [
      locInfo.coordinates[0] + (Math.random() - 0.5) * 0.015,
      locInfo.coordinates[1] + (Math.random() - 0.5) * 0.015
    ];

    const pUser = await User.create({
      name: pConf.name,
      email: `provider${i + 1}@skillbridge.in`,
      passwordHash: defaultPasswordHash,
      role: 'provider',
      phone: `+91 97400 ${20000 + i * 311}`,
      preferredLanguage: 'en',
      addresses: [{
        label: 'Workshop',
        addressLine: `#${101 + i}, Main Street, ${locInfo.name}`,
        locality: locInfo.name,
        city: 'Bangalore',
        pincode: locInfo.pincode,
        location: { type: 'Point', coordinates: coords }
      }]
    });

    const providerDoc = await Provider.create({
      userId: pUser._id,
      businessName: pConf.business,
      bio: `Professional specialist with ${4 + (i % 8)} years experience in ${pConf.cat.join(', ')}. Guaranteed transparent rates & zero hidden fees.`,
      categories: pConf.cat,
      skills: ['Fault Diagnostics', 'Rapid Resolution', 'Safety Auditing', 'Genuine Replacement Parts'],
      experienceYears: 4 + (i % 8),
      hourlyRate: pConf.rate,
      location: { type: 'Point', coordinates: coords },
      address: {
        street: '100ft Road',
        locality: locInfo.name,
        city: 'Bangalore',
        pincode: locInfo.pincode
      },
      serviceRadiusKm: 18,
      verificationTier: pConf.tier,
      baseRating: pConf.rating,
      totalReviews: Math.round(pConf.jobs * 0.7),
      completedJobsCount: pConf.jobs,
      cancellationRate: pConf.cancel,
      responseTimeMinutes: pConf.resp,
      repeatCustomerCount: Math.round(pConf.jobs * 0.28),
      isEmergencyAvailable: pConf.emerg,
      emergencySurchargePercent: 20,
      emergencyBaseFee: 150,
      availability: {
        weeklySchedule: [
          { day: 'Monday', isAvailable: true, startTime: '08:00', endTime: '20:00' },
          { day: 'Tuesday', isAvailable: true, startTime: '08:00', endTime: '20:00' },
          { day: 'Wednesday', isAvailable: true, startTime: '08:00', endTime: '20:00' },
          { day: 'Thursday', isAvailable: true, startTime: '08:00', endTime: '20:00' },
          { day: 'Friday', isAvailable: true, startTime: '08:00', endTime: '20:00' },
          { day: 'Saturday', isAvailable: true, startTime: '08:00', endTime: '20:00' },
          { day: 'Sunday', isAvailable: pConf.emerg, startTime: '09:00', endTime: '18:00' }
        ],
        isAvailableNow: true
      },
      endorsementCount: pConf.tier === 'Locally Endorsed' ? 4 : (pConf.tier === 'Community Verified' ? 1 : 0),
      neighborhoodFavoriteCount: pConf.tier === 'Locally Endorsed' ? 18 : 6
    });

    // Compute & snapshot TrustScore
    const trustData = await calculateTrustScore(providerDoc._id);
    providerDoc.trustScoreCache = {
      score: trustData.score,
      level: trustData.level,
      lastCalculatedAt: new Date(),
      factors: trustData.factors
    };
    await providerDoc.save();

    // Create 4 historical TrustScore snapshots spanning past 60 days
    const daysAgo = [60, 45, 30, 15, 0];
    for (let d = 0; d < daysAgo.length; d++) {
      const snapDate = new Date();
      snapDate.setDate(snapDate.getDate() - daysAgo[d]);

      const historicalScore = Math.max(40, Math.min(99, trustData.score - Math.round((daysAgo[d] / 60) * 8) + (d * 2)));
      await TrustScoreHistory.create({
        providerId: providerDoc._id,
        date: snapDate,
        score: historicalScore,
        level: historicalScore >= 90 ? 'Elite Champion' : (historicalScore >= 80 ? 'Highly Trusted' : 'Trusted'),
        factorsSnapshot: {
          ...trustData.factors,
          completedJobs: Math.max(5, trustData.factors.completedJobs - Math.round(daysAgo[d] * 1.5))
        },
        delta: d > 0 ? 2 : 0,
        note: `Periodic score audit ${daysAgo[d]} days ago`
      });
    }

    seededProviders.push(providerDoc);
  }
  console.log(`✅ Seeded ${seededProviders.length} Providers with TrustScore history snapshots`);

  // 6. Create Trust Circle Cluster Endorsements (Indiranagar providers endorsing each other)
  const indiranagarProviders = seededProviders.filter(p => p.address.locality === 'Indiranagar');
  if (indiranagarProviders.length >= 4) {
    const p1 = indiranagarProviders[0]; // Suresh (Electrician)
    const p2 = indiranagarProviders[1]; // Ramesh (Plumber)
    const p3 = indiranagarProviders[2]; // Manjunath (AC)
    const p4 = indiranagarProviders[5] || indiranagarProviders[3]; // Ravi (Appliance)

    const endorsementsToCreate = [
      { from: p1._id, to: p2._id, note: 'Co-worked on multiple apartment renovations in Indiranagar. Reliable pipeline work and zero leaks.', rel: 'co_worked' },
      { from: p2._id, to: p1._id, note: 'Suresh is my primary referral for heavy electrical wiring and MCB tripping jobs in East Bangalore.', rel: 'referred' },
      { from: p3._id, to: p1._id, note: 'Top notch electrician. Always routes dedicated 16A lines for AC compressor installations safely.', rel: 'co_worked' },
      { from: p1._id, to: p3._id, note: 'Certified HVAC pro. Flawless vacuuming and gas pressure diagnostics every single time.', rel: 'local_peer' },
      { from: p2._id, to: p4._id, note: 'Excellent washing machine and RO technician. Clean work ethics.', rel: 'referred' },
      { from: p4._id, to: p2._id, note: 'Master plumber with 10+ years experience in bathroom sanitary lines.', rel: 'co_worked' }
    ];

    for (const end of endorsementsToCreate) {
      await Endorsement.create({
        fromProviderId: end.from,
        toProviderId: end.to,
        relationship: end.rel,
        note: end.note,
        skillsVouched: ['Professionalism', 'Punctuality', 'Safety Compliance'],
        locality: 'Indiranagar'
      });
    }
  }

  // 7. Create 100+ Bookings, Quotations, and Reviews
  const bookingStatuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'CONFIRMED', 'QUOTATIONS_RECEIVED', 'DISPUTED', 'CANCELLED'];
  const sampleCustomerComments = [
    'Prompt arrival and excellent troubleshooting! Fixed the sparking switchboard within 25 minutes. Very transparent pricing.',
    'Very professional service. Explained the reason for the pipe leakage clearly and provided a 30-day warranty card.',
    'Punctual and well-equipped with all necessary tools. Cleaned up the workspace after AC deep servicing.',
    'Knowledgeable technician. Tested the washing machine spin cycle twice before closing the job. Highly recommended!',
    'Arrived on time for the emergency night call. Resolved the MCB tripping problem safely with zero fuss.',
    'Courteous behavior and honest advice. Advised me on preventive maintenance for the water purifier.',
    'Great workmanship on the door lock and hinges. Smooth latch operation now.',
    'Quick response and fair pricing. No hidden fees or unnecessary part replacements.'
  ];

  let completedReviewsCount = 0;

  for (let i = 0; i < 110; i++) {
    const customer = seededCustomers[i % seededCustomers.length];
    const category = CATEGORIES_DATA[i % 8].name;
    const matchingProviders = seededProviders.filter(p => p.categories.includes(category));
    const provider = matchingProviders.length > 0 ? matchingProviders[i % matchingProviders.length] : seededProviders[0];

    const status = bookingStatuses[i % bookingStatuses.length];
    const isEmergency = i % 5 === 0;
    const agreedPrice = provider.hourlyRate + ((i % 4) * 150);

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() - (i % 60));

    const booking = await Booking.create({
      customerId: customer._id,
      providerId: status !== 'REQUESTED' ? provider._id : null,
      category,
      serviceName: `${category} Repair & Diagnostic`,
      description: `Comprehensive checkup and service for ${category} at ${customer.addresses[0]?.locality}.`,
      location: customer.addresses[0]?.location || { type: 'Point', coordinates: [77.6408, 12.9784] },
      addressText: customer.addresses[0]?.addressLine || 'Indiranagar, Bangalore',
      locality: customer.addresses[0]?.locality || 'Indiranagar',
      city: 'Bangalore',
      isEmergency,
      emergencyDetails: isEmergency ? {
        surchargePercent: 20,
        flatFee: 150,
        baseEstimatedCost: agreedPrice,
        totalEstimatedCost: agreedPrice + 150 + Math.round(agreedPrice * 0.2),
        radiusLevel: 1,
        etaMinutes: 20
      } : {},
      status,
      statusHistory: [
        { status: 'REQUESTED', timestamp: bookingDate, actor: 'customer', note: 'Booking requested.' },
        ...(status !== 'REQUESTED' ? [{ status: 'QUOTATIONS_RECEIVED', timestamp: bookingDate, actor: 'system', note: 'Quotations received from providers.' }] : []),
        ...(status !== 'REQUESTED' && status !== 'QUOTATIONS_RECEIVED' ? [{ status: 'CONFIRMED', timestamp: bookingDate, actor: 'customer', note: `Quotation accepted. ₹${agreedPrice} escrow held.` }] : []),
        ...(status === 'IN_PROGRESS' || status === 'COMPLETED' || status === 'DISPUTED' ? [{ status: 'IN_PROGRESS', timestamp: bookingDate, actor: 'provider', note: 'Provider arrived on site and started work.' }] : []),
        ...(status === 'COMPLETED' ? [{ status: 'COMPLETED', timestamp: bookingDate, actor: 'customer', note: `Service verified. Escrow ₹${agreedPrice} released.` }] : []),
        ...(status === 'DISPUTED' ? [{ status: 'DISPUTED', timestamp: bookingDate, actor: 'customer', note: 'Customer raised dispute regarding partial completion.' }] : [])
      ],
      escrow: {
        amount: agreedPrice,
        status: status === 'COMPLETED' ? 'released' : (status === 'DISPUTED' ? 'disputed' : (status === 'CANCELLED' ? 'refunded' : 'held')),
        heldAt: bookingDate,
        releasedAt: status === 'COMPLETED' ? bookingDate : null,
        disputeReason: status === 'DISPUTED' ? 'Unresolved noise issue after motor replacement' : '',
        disputeOpenedBy: status === 'DISPUTED' ? 'customer' : ''
      },
      finalAmount: agreedPrice,
      ratingGiven: status === 'COMPLETED' && i % 4 !== 0
    });

    // Create quotation for booking
    const quoteValid = new Date(bookingDate);
    quoteValid.setHours(quoteValid.getHours() + 48);

    const quotation = await Quotation.create({
      bookingId: booking._id,
      providerId: provider._id,
      priceRange: { min: agreedPrice - 50, max: agreedPrice + 100, exact: agreedPrice },
      etaMinutes: 25 + (i % 20),
      validUntil: quoteValid,
      warrantyDays: (i % 3 === 0) ? 60 : 30,
      notes: `Includes genuine parts and ${ (i % 3 === 0) ? 60 : 30 }-day comprehensive warranty.`,
      status: status !== 'REQUESTED' && status !== 'QUOTATIONS_RECEIVED' ? 'accepted' : 'pending'
    });

    booking.acceptedQuotationId = quotation._id;
    await booking.save();

    // Create review if completed and ratingGiven
    if (booking.ratingGiven && status === 'COMPLETED') {
      const rating = 4 + (i % 2 === 0 ? 1 : 0.8);
      await Review.create({
        bookingId: booking._id,
        customerId: customer._id,
        providerId: provider._id,
        rating,
        subRatings: {
          timeliness: 5,
          workmanship: rating,
          behavior: 5,
          pricingTransparency: 5
        },
        comment: sampleCustomerComments[i % sampleCustomerComments.length],
        isVerifiedJob: true,
        providerResponse: i % 3 === 0 ? 'Thank you for your valuable feedback! Glad to be of service.' : ''
      });
      completedReviewsCount++;
    }
  }

  console.log(`✅ Seeded 110 Bookings & ${completedReviewsCount} Verified Reviews`);

  // 8. Create Service History entries for Customers (triggers Predictive Care suggestions)
  const targetCustomer1 = seededCustomers[0]; // Customer 1
  const pastDates = [330, 240, 120, 45]; // Days ago

  await ServiceHistory.create([
    {
      customerId: targetCustomer1._id,
      providerId: seededProviders[2]._id, // AC tech
      category: 'Air Conditioner',
      applianceName: 'Master Bedroom Split AC',
      brand: 'Daikin 1.5 Ton',
      date: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000), // 11 months ago -> AC annual maintenance due trigger
      cost: 650,
      repairType: 'routine_service',
      notes: 'Deep foam cleaning and gas topup performed.'
    },
    {
      customerId: targetCustomer1._id,
      providerId: seededProviders[3]._id,
      category: 'Appliance Technician',
      applianceName: 'Kitchen Front-Load Washing Machine',
      brand: 'Bosch 7kg',
      date: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000), // 7 months ago
      cost: 450,
      repairType: 'spot_fix',
      notes: 'Drain pump filter cleared.'
    },
    {
      customerId: targetCustomer1._id,
      providerId: seededProviders[3]._id,
      category: 'Appliance Technician',
      applianceName: 'Kitchen Front-Load Washing Machine',
      brand: 'Bosch 7kg',
      date: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000), // 3.5 months ago
      cost: 600,
      repairType: 'spot_fix',
      notes: 'Belt adjustment.'
    },
    {
      customerId: targetCustomer1._id,
      providerId: seededProviders[3]._id,
      category: 'Appliance Technician',
      applianceName: 'Kitchen Front-Load Washing Machine',
      brand: 'Bosch 7kg',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago -> 3 repairs in 7 months trigger!
      cost: 550,
      repairType: 'spot_fix',
      notes: 'Door lock sensor error.'
    }
  ]);
  console.log(`✅ Seeded Appliance Service History for Predictive Care`);

  // 9. Create Sample Reports (Mutual customer-provider reporting)
  await Report.create([
    {
      reportedBy: { userId: seededCustomers[5]._id, role: 'customer', name: seededCustomers[5].name },
      reportedAgainst: { userId: seededProviders[23].userId, providerId: seededProviders[23]._id, role: 'provider', name: seededProviders[23].businessName },
      reportType: 'no_show',
      reason: 'Provider confirmed booking but did not show up or respond to phone calls.',
      status: 'upheld',
      penaltyApplied: true,
      penaltyScore: 15,
      resolvedBy: adminUser._id,
      resolvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      adminNotes: 'Confirmed with GPS logs that provider was not in transit.'
    },
    {
      reportedBy: { userId: seededProviders[0].userId, role: 'provider', name: seededProviders[0].businessName },
      reportedAgainst: { userId: seededCustomers[12]._id, role: 'customer', name: seededCustomers[12].name },
      reportType: 'fake_booking',
      reason: 'Customer placed rapid emergency booking but address was inaccessible gated construction site with no contact.',
      status: 'pending'
    }
  ]);
  console.log(`✅ Seeded Mutual Reports`);

  console.log('🎉 Database Seeding Completed Successfully!');
};

export const seedDatabaseIfEmpty = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📊 Empty database detected. Running automated initial seed...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn('⚠️ Seeding check skipped:', err.message);
  }
};
