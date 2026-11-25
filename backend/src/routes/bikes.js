const express = require('express');
const mongoose = require('mongoose');
const Bike = require('../models/Bike');

const router = express.Router();

const ALLOWED_FIELDS = ['name', 'brand', 'category', 'price', 'description', 'image', 'specs'];

// Only accept known fields from the client
function pickFields(body) {
  const data = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid bike id' });
  }
  next();
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/bikes?search=...   list bikes (optional search by name/brand/category)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) {
      const rx = new RegExp(escapeRegex(String(req.query.search)), 'i');
      filter.$or = [{ name: rx }, { brand: rx }, { category: rx }];
    }
    const bikes = await Bike.find(filter).sort({ createdAt: -1 });
    res.json(bikes);
  } catch (err) {
    next(err);
  }
});

// GET /api/bikes/:id   single bike
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    next(err);
  }
});

// POST /api/bikes   add a bike
router.post('/', async (req, res, next) => {
  try {
    const bike = await Bike.create(pickFields(req.body));
    res.status(201).json(bike);
  } catch (err) {
    next(err);
  }
});

// PUT /api/bikes/:id   edit a bike
router.put('/:id', validateId, async (req, res, next) => {
  try {
    const bike = await Bike.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true
    });
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bikes/:id   remove a bike
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json({ message: 'Bike deleted', id: bike._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
