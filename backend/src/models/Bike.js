const mongoose = require('mongoose');

const specsSchema = new mongoose.Schema(
  {
    engine: { type: String, default: '' },       // e.g. "649 cc, parallel twin"
    power: { type: String, default: '' },        // e.g. "47 hp @ 7250 rpm"
    torque: { type: String, default: '' },       // e.g. "52 Nm @ 5150 rpm"
    weight: { type: String, default: '' },       // e.g. "202 kg"
    topSpeed: { type: String, default: '' },     // e.g. "170 km/h"
    mileage: { type: String, default: '' },      // e.g. "25 km/l"
    transmission: { type: String, default: '' }  // e.g. "6-speed manual"
  },
  { _id: false }
);

const bikeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    category: { type: String, default: 'Other', trim: true },
    price: { type: Number, min: [0, 'Price cannot be negative'], default: 0 },
    description: { type: String, default: '' },
    image: { type: String, default: '' }, // image URL or file name
    specs: { type: specsSchema, default: () => ({}) }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bike', bikeSchema);
