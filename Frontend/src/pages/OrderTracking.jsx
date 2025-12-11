import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus } from '../store/orderSlice';

export default function OrderTracking(){
const dispatch = useDispatch();
const status = useSelector(s => s.order.status);
const order = useSelector(s => s.order.lastOrder);
const mapRef = useRef(null);
const mapInstance = useRef(null);
const markerRef = useRef(null);
const routeIndex = useRef(0);
const polylineRef = useRef(null);

useEffect(() => {
if (!order || !window.L) return;
const L = window.L;
if (!mapInstance.current) {
mapInstance.current = L.map(mapRef.current).setView([order.route?.[0]?.lat || 19.076, order.route?.[0]?.lng || 72.8777], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapInstance.current);
}

if (order.route && order.route.length) {
const coords = order.route.map(p => [p.lat, p.lng]);
if (!polylineRef.current) {
polylineRef.current = window.L.polyline(coords, { color: '#ff4d4f' }).addTo(mapInstance.current);
mapInstance.current.fitBounds(polylineRef.current.getBounds(), { padding: [20, 20] });
}
if (!markerRef.current) {
markerRef.current = window.L.marker(coords[0]).addTo(mapInstance.current);
}

routeIndex.current = 0;
dispatch(setStatus('out-for-delivery'));
const id = setInterval(() => {
routeIndex.current++;
if (routeIndex.current >= coords.length) {
clearInterval(id);
dispatch(setStatus('delivered'));
return;
}
markerRef.current.setLatLng(coords[routeIndex.current]);
}, 1500);
return () => clearInterval(id);
}
}, [order, dispatch]);

return (
<section className="page">
<h2>Order Tracking</h2>
{order ? (
<div>
<p>Order #{order.id} — Status: <strong>{status}</strong></p>
<div id="map" ref={mapRef} style={{ height: 420, borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow:'0 10px 15px rgba(0,0,0,0.06)' }} />
</div>
) : (
<p>No recent order found. Place an order first.</p>
)}
</section>
);
}