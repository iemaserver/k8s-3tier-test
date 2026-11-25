import { imageSrc, formatPrice } from '../api.js';

export default function BikeCard({ bike, onView, onEdit }) {
  const specs = bike.specs || {};
  return (
    <article className="card">
      <button className="card-image" onClick={onView} aria-label={`View ${bike.name}`}>
        <img
          src={imageSrc(bike.image)}
          alt={bike.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/placeholder.svg';
          }}
        />
        {bike.category && <span className="badge">{bike.category}</span>}
      </button>
      <div className="card-body">
        <p className="card-brand">{bike.brand}</p>
        <h2 className="card-title">{bike.name}</h2>
        <p className="card-desc">{bike.description || <em className="muted">No description</em>}</p>
        <ul className="chips">
          {specs.engine && <li>{specs.engine}</li>}
          {specs.power && <li>{specs.power}</li>}
        </ul>
      </div>
      <div className="card-footer">
        <span className="price">{formatPrice(bike.price)}</span>
        <div className="row">
          <button className="btn small" onClick={onView}>View</button>
          <button className="btn small primary" onClick={onEdit}>Edit</button>
        </div>
      </div>
    </article>
  );
}
