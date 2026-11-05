import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
import { Category } from '../models/Category.js';
import { mockStore } from '../data/mockStore.js';

export const getServices = async (req, res) => {
  try {
    const { category, search, emergency, page = 1, limit = 50 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category) filter.category = { $regex: new RegExp(category, 'i') };
      if (emergency === 'true') filter.isEmergencyEligible = true;
      if (search) {
        filter.$or = [
          { name: { $regex: new RegExp(search, 'i') } },
          { description: { $regex: new RegExp(search, 'i') } },
          { category: { $regex: new RegExp(search, 'i') } }
        ];
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Service.countDocuments(filter);
      const services = await Service.find(filter).skip(skip).limit(parseInt(limit));
      return res.status(200).json({ success: true, total, services });
    }

    // In-Memory Mode
    let list = [...mockStore.services];
    if (category) {
      list = list.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (emergency === 'true') {
      list = list.filter(s => s.isEmergencyEligible);
    }
    if (search) {
      list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()));
    }

    return res.status(200).json({
      success: true,
      total: list.length,
      services: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch services', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find().sort({ isPopular: -1, name: 1 });
      const counts = await Service.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
      const countMap = {};
      counts.forEach(c => { countMap[c._id] = c.count; });
      const enriched = categories.map(cat => ({ ...cat.toObject(), serviceCount: countMap[cat.name] || 0 }));
      return res.status(200).json({ success: true, categories: enriched });
    }

    return res.status(200).json({
      success: true,
      categories: mockStore.categories
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const service = await Service.findById(req.params.id);
      if (service) return res.status(200).json({ success: true, service });
    }

    const s = mockStore.services.find(srv => srv._id === req.params.id) || mockStore.services[0];
    return res.status(200).json({ success: true, service: s });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch service', error: error.message });
  }
};
