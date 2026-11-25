// Runs ONCE, the first time the container starts with an empty /data/db volume.
// Creates the application user and seeds a few sample bikes.

const dbName = process.env.MONGO_APP_DB || 'bikesdb';
const appUser = process.env.MONGO_APP_USER || 'bikeapp';
const appPass = process.env.MONGO_APP_PASSWORD || 'bikeapp123';

const appDb = db.getSiblingDB(dbName);

appDb.createUser({
  user: appUser,
  pwd: appPass,
  roles: [{ role: 'readWrite', db: dbName }]
});

const now = new Date();

appDb.bikes.insertMany([
  {
    name: 'Interceptor 650',
    brand: 'Royal Enfield',
    category: 'Classic',
    price: 303000,
    description: 'A retro-styled parallel twin roadster with a smooth, torquey engine and relaxed ergonomics.',
    image: 'classic.svg',
    specs: {
      engine: '648 cc, parallel twin',
      power: '47 hp @ 7150 rpm',
      torque: '52 Nm @ 5250 rpm',
      weight: '218 kg',
      topSpeed: '165 km/h',
      mileage: '25 km/l',
      transmission: '6-speed manual'
    },
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Ninja ZX-6R',
    brand: 'Kawasaki',
    category: 'Sport',
    price: 1109000,
    description: 'A track-focused supersport with a high-revving inline-four and sharp handling.',
    image: 'sport.svg',
    specs: {
      engine: '636 cc, inline-four',
      power: '128 hp @ 13000 rpm',
      torque: '69 Nm @ 11000 rpm',
      weight: '198 kg',
      topSpeed: '260 km/h',
      mileage: '18 km/l',
      transmission: '6-speed manual'
    },
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Himalayan 450',
    brand: 'Royal Enfield',
    category: 'Adventure',
    price: 285000,
    description: 'A purpose-built adventure tourer for long rides on broken roads and mountain trails.',
    image: 'adventure.svg',
    specs: {
      engine: '452 cc, single cylinder',
      power: '40 hp @ 8000 rpm',
      torque: '40 Nm @ 5500 rpm',
      weight: '196 kg',
      topSpeed: '150 km/h',
      mileage: '30 km/l',
      transmission: '6-speed manual'
    },
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Street Triple 765 RS',
    brand: 'Triumph',
    category: 'Naked',
    price: 1181000,
    description: 'A razor-sharp naked roadster with a screaming triple, Öhlins suspension and Brembo Stylema brakes.',
    image: 'naked.svg',
    specs: {
      engine: '765 cc, inline triple',
      power: '128 hp @ 12000 rpm',
      torque: '80 Nm @ 9500 rpm',
      weight: '188 kg (wet)',
      topSpeed: '250 km/h',
      mileage: '17 km/l',
      transmission: '6-speed, up/down quickshifter'
    },
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Diavel V4',
    brand: 'Ducati',
    category: 'Cruiser',
    price: 2591000,
    description: 'A muscle cruiser powered by the Granturismo V4, mixing superbike performance with laid-back style.',
    image: 'cruiser.svg',
    specs: {
      engine: '1158 cc, V4 Granturismo',
      power: '168 hp @ 10750 rpm',
      torque: '126 Nm @ 7500 rpm',
      weight: '236 kg (wet)',
      topSpeed: '270 km/h',
      mileage: '14 km/l',
      transmission: '6-speed, Ducati Quick Shift'
    },
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'XSR700',
    brand: 'Yamaha',
    category: 'Classic',
    price: 700000,
    description: 'A neo-retro roadster built on the torquey CP2 twin, with classic looks and easy, fun handling.',
    image: 'classic.svg',
    specs: {
      engine: '689 cc, CP2 parallel twin',
      power: '73 hp @ 9000 rpm',
      torque: '68 Nm @ 6500 rpm',
      weight: '196 kg (wet)',
      topSpeed: '200 km/h',
      mileage: '20 km/l',
      transmission: '6-speed manual'
    },
    createdAt: now,
    updatedAt: now
  }
]);

print(`Initialised database "${dbName}" with user "${appUser}" and sample bikes.`);
