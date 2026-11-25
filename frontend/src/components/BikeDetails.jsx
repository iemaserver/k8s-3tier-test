import Modal from './Modal.jsx';
import { imageSrc, formatPrice, SPEC_FIELDS } from '../api.js';

export default function BikeDetails({ bike, onClose, onEdit, onDelete }) {
  const specs = bike.specs || {};
  const filledSpecs = SPEC_FIELDS.filter(([key]) => specs[key]);

  return (
    <Modal title={`${bike.brand} ${bike.name}`} onClose={onClose} wide>
      <div className="details">
        <img
          className="details-image"
          src={imageSrc(bike.image)}
          alt={bike.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/placeholder.svg';
          }}
        />
        <div className="details-info">
          <div className="row spread">
            {bike.category && <span className="badge static">{bike.category}</span>}
            <span className="price big">{formatPrice(bike.price)}</span>
          </div>
          <p className="details-desc">{bike.description || <em className="muted">No description yet.</em>}</p>

          <h3>Specifications</h3>
          {filledSpecs.length ? (
            <table className="specs">
              <tbody>
                {filledSpecs.map(([key, label]) => (
                  <tr key={key}>
                    <th>{label}</th>
                    <td>{specs[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">No specs added.</p>
          )}
          <p className="muted small">Image: {bike.image || '—'}</p>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn danger" onClick={onDelete}>Delete</button>
        <div className="row">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn primary" onClick={onEdit}>Edit bike</button>
        </div>
      </div>
    </Modal>
  );
}
