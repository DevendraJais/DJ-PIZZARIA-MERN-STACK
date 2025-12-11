import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceMode from '../components/ServiceMode';

const outlets = [
  {
    name: "Domino’s Pizza - Connaught Place",
    address: "Block P, Connaught Place, New Delhi",
    distance: "1.2 km",
    map: "https://www.google.com/maps/search/Domino%27s+Pizza+Connaught+Place"
  },
  {
    name: "Domino’s Pizza - Indiranagar",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    distance: "2.4 km",
    map: "https://www.google.com/maps/search/Domino%27s+Pizza+Indiranagar"
  },
  {
    name: "Domino’s Pizza - Bandra",
    address: "Linking Road, Bandra West, Mumbai",
    distance: "3.1 km",
    map: "https://www.google.com/maps/search/Domino%27s+Pizza+Bandra"
  },
  {
    name: "Domino’s Pizza - Gachibowli",
    address: "Wipro Circle, Gachibowli, Hyderabad",
    distance: "4.0 km",
    map: "https://www.google.com/maps/search/Domino%27s+Pizza+Gachibowli"
  }
];

export default function OrderMode() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(() => {
    if (!location) return outlets;
    return outlets.filter(o => (o.address + o.name).toLowerCase().includes(location.toLowerCase()));
  }, [location]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported. Please enter your location.");
      return;
    }
    setStatus("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        setStatus("Location detected. You can refine it if needed.");
      },
      () => setStatus("Could not get location. Please type it manually.")
    );
  };

  const setMode = (next) => navigate(`/order/${next}`);

  return (
    <section className="page order-page">
      {/* Reuse the same strip for consistency */}
      <div style={{ marginBottom: 12 }}>
        <div className="order-type-wrap">
          {[
            { key: 'delivery', title: 'Delivery', sub: 'Select Location' },
            { key: 'takeaway', title: 'Takeaway', sub: 'Select Store' },
            { key: 'dine-in', title: 'Dine-in', sub: '30 + KM' },
          ].map(tile => (
            <button
              key={tile.key}
              className={`order-type-btn ${mode === tile.key ? 'active' : ''}`}
              onClick={() => setMode(tile.key)}
            >
              <div className="fs-12 lh16">{tile.title}</div>
              <div className="fs-11 lh14 normal color-grey">{tile.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="service-panel" style={{ marginTop: 10 }}>
        {mode === 'delivery' && (
          <div className="service-actions stack" style={{ gap: 12 }}>
            <input
              placeholder="Enter delivery address or PIN code"
              value={location}
              onChange={(e)=>setLocation(e.target.value)}
            />
            <button className="primary" onClick={handleLocate}>Detect location</button>
            {status && <p className="service-status">{status}</p>}
          </div>
        )}

        {mode !== 'delivery' && (
          <div className="outlet-list" style={{ marginTop: 8 }}>
            {filtered.map((o, idx) => (
              <div key={idx} className="outlet-card">
                <div>
                  <div className="outlet-name">{o.name}</div>
                  <div className="outlet-meta">{o.address}</div>
                  <div className="outlet-meta">~ {o.distance}</div>
                </div>
                <a href={o.map} target="_blank" rel="noreferrer" className="map-link">View on map</a>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="outlet-empty">No outlets found for this location yet.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

