import { useState } from 'react';

const tiles = [
  { key: 'delivery', title: 'Delivery', sub: 'Select Location', hidden: false },
  { key: 'takeaway', title: 'Takeaway', sub: 'Select Store', hidden: false },
  { key: 'dine-in', title: 'Dine-in', sub: '30 + KM', hidden: false },
];

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

export default function ServiceMode() {
  const [mode, setMode] = useState('delivery');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const filtered = location
    ? outlets.filter(o => (o.address + o.name).toLowerCase().includes(location.toLowerCase()))
    : outlets;

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

  return (
    <section className="service-strip">
      <div className="order-type-wrap">
        {tiles.map(tile => (
          <button
            key={tile.key}
            className={`order-type-btn ${mode === tile.key ? 'active' : ''} ${tile.hidden ? 'hide' : ''}`}
            onClick={() => setMode(tile.key)}
          >
            <div className="fs-12 lh16">{tile.title}</div>
            <div className="fs-11 lh14 normal color-grey">{tile.sub}</div>
          </button>
        ))}
      </div>

      <div className="service-panel">
        {mode === 'delivery' && (
          <div className="service-body">
            <div className="service-actions stack">
              <input
                placeholder="Enter delivery address or PIN code"
                value={location}
                onChange={(e)=>setLocation(e.target.value)}
              />
              <button className="primary" onClick={handleLocate}>Detect location</button>
              {status && <p className="service-status">{status}</p>}
            </div>
            <div className="map-box">
              <iframe
                title="India map"
                src="https://www.google.com/maps?q=India&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        )}

        {mode !== 'delivery' && (
          <div className="service-body">
            <div className="outlet-list">
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
            <div className="map-box">
              <iframe
                title="Nearby Domino's"
                src="https://www.google.com/maps?q=Domino%27s+Pizza+India&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

