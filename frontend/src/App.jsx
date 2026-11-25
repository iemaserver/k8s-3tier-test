import { useEffect, useState, useCallback } from 'react';
import { getBikes, createBike, updateBike, deleteBike } from './api.js';
import BikeCard from './components/BikeCard.jsx';
import BikeDetails from './components/BikeDetails.jsx';
import BikeForm from './components/BikeForm.jsx';

const buildSha = import.meta.env.VITE_BUILD_SHA || 'local';

export default function App() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // bike shown in details view
  const [editing, setEditing] = useState(null);   // null = closed, {} = new, bike = edit
  const [toast, setToast] = useState('');

  const loadBikes = useCallback(async (query = '') => {
    setLoading(true);
    setError('');
    try {
      setBikes(await getBikes(query));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadBikes(search.trim()), 300); // debounce search
    return () => clearTimeout(t);
  }, [search, loadBikes]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  async function handleSave(data) {
    if (editing && editing._id) {
      const updated = await updateBike(editing._id, data);
      setBikes((list) => list.map((b) => (b._id === updated._id ? updated : b)));
      if (selected && selected._id === updated._id) setSelected(updated);
      notify('Bike updated');
    } else {
      const created = await createBike(data);
      setBikes((list) => [created, ...list]);
      notify('Bike added');
    }
    setEditing(null);
  }

  async function handleDelete(bike) {
    if (!window.confirm(`Delete "${bike.brand} ${bike.name}"?`)) return;
    try {
      await deleteBike(bike._id);
      setBikes((list) => list.filter((b) => b._id !== bike._id));
      setSelected(null);
      notify('Bike deleted');
    } catch (err) {
      notify(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo">🏍️</span>
          <h1>Bike Garage</h1>
          <span
            className={`build-stamp${buildSha === 'local' ? ' local' : ''}`}
            title={buildSha === 'local' ? 'Local development build' : `Commit ${buildSha}`}
          >
            <span className="build-dot" aria-hidden="true" />
            {buildSha === 'local' ? 'LOCAL' : `BUILD ${buildSha.slice(0, 7)}`}
          </span>
        </div>
        <div className="header-actions">
          <input
            className="search"
            type="search"
            placeholder="Search by name, brand or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn primary" onClick={() => setEditing({})}>
            + Add bike
          </button>
        </div>
      </header>

      <main className="content">
        {error && (
          <div className="alert">
            Could not load bikes: {error}{' '}
            <button className="btn small" onClick={() => loadBikes(search.trim())}>
              Retry
            </button>
          </div>
        )}

        {loading && bikes.length === 0 ? (
          <p className="muted center">Loading bikes…</p>
        ) : !error && bikes.length === 0 ? (
          <div className="empty">
            <p>No bikes found.</p>
            <button className="btn primary" onClick={() => setEditing({})}>
              Add your first bike
            </button>
          </div>
        ) : (
          <div className="grid">
            {bikes.map((bike) => (
              <BikeCard
                key={bike._id}
                bike={bike}
                onView={() => setSelected(bike)}
                onEdit={() => setEditing(bike)}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <BikeDetails
          bike={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setSelected(null);
          }}
          onDelete={() => handleDelete(selected)}
        />
      )}

      {editing && <BikeForm bike={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
