import { useState } from 'react';
import Modal from './Modal.jsx';
import { imageSrc, SPEC_FIELDS } from '../api.js';

const CATEGORIES = ['Classic', 'Sport', 'Cruiser', 'Adventure', 'Naked', 'Touring', 'Scooter', 'Electric', 'Other'];
const BUNDLED_IMAGES = ['classic.svg', 'sport.svg', 'adventure.svg', 'naked.svg', 'cruiser.svg'];

function toFormState(bike) {
  const specs = bike.specs || {};
  return {
    name: bike.name || '',
    brand: bike.brand || '',
    category: bike.category || 'Other',
    price: bike.price ?? '',
    description: bike.description || '',
    image: bike.image || '',
    specs: Object.fromEntries(SPEC_FIELDS.map(([key]) => [key, specs[key] || '']))
  };
}

export default function BikeForm({ bike, onSave, onCancel }) {
  const isEdit = Boolean(bike._id);
  const [form, setForm] = useState(() => toFormState(bike));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSpec = (key) => (e) =>
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: e.target.value } }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim()) {
      setError('Name and brand are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        brand: form.brand.trim(),
        image: form.image.trim(),
        price: form.price === '' ? 0 : Number(form.price)
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? `Edit ${bike.name}` : 'Add a new bike'} onClose={onCancel} wide>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name *
            <input value={form.name} onChange={setField('name')} placeholder="e.g. Interceptor 650" autoFocus />
          </label>
          <label>
            Brand *
            <input value={form.brand} onChange={setField('brand')} placeholder="e.g. Royal Enfield" />
          </label>
          <label>
            Category
            <select value={form.category} onChange={setField('category')}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Price (₹)
            <input type="number" min="0" step="1" value={form.price} onChange={setField('price')} />
          </label>
        </div>

        <label>
          Description
          <textarea rows="3" value={form.description} onChange={setField('description')} placeholder="What makes this bike special?" />
        </label>

        <div className="image-field">
          <label>
            Image name or URL
            <input
              value={form.image}
              onChange={setField('image')}
              placeholder="classic.svg or https://…/bike.jpg"
              list="bundled-images"
            />
            <datalist id="bundled-images">
              {BUNDLED_IMAGES.map((img) => (
                <option key={img} value={img} />
              ))}
            </datalist>
            <span className="hint">
              A bare file name loads from <code>/images/</code>. Bundled: {BUNDLED_IMAGES.join(', ')}
            </span>
          </label>
          <img
            className="image-preview"
            key={form.image}
            src={imageSrc(form.image)}
            alt="Preview"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder.svg';
            }}
          />
        </div>

        <fieldset>
          <legend>Specifications</legend>
          <div className="form-grid">
            {SPEC_FIELDS.map(([key, label]) => (
              <label key={key}>
                {label}
                <input value={form.specs[key]} onChange={setSpec(key)} />
              </label>
            ))}
          </div>
        </fieldset>

        {error && <div className="alert">{error}</div>}

        <div className="modal-footer">
          <span />
          <div className="row">
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add bike'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
