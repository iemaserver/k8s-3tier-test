// All requests go to /api; nginx (Docker) or the Vite proxy (dev) forwards them to the backend.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const getBikes = (search = '') =>
  request(`/bikes${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const getBike = (id) => request(`/bikes/${id}`);

export const createBike = (bike) =>
  request('/bikes', { method: 'POST', body: JSON.stringify(bike) });

export const updateBike = (id, bike) =>
  request(`/bikes/${id}`, { method: 'PUT', body: JSON.stringify(bike) });

export const deleteBike = (id) => request(`/bikes/${id}`, { method: 'DELETE' });

// "classic.svg" -> "/images/classic.svg"; full URLs are used as-is
export function imageSrc(image) {
  if (!image) return '/images/placeholder.svg';
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/') || image.startsWith('data:')) return image;
  return `/images/${image}`;
}

export const SPEC_FIELDS = [
  ['engine', 'Engine'],
  ['power', 'Power'],
  ['torque', 'Torque'],
  ['weight', 'Weight'],
  ['topSpeed', 'Top speed'],
  ['mileage', 'Mileage'],
  ['transmission', 'Transmission']
];

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    price || 0
  );
