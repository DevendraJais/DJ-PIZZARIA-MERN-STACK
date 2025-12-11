import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PizzaCarousel from '../components/PizzaCarousel';

export default function Home() {
  return (
    <>
      <section className="hero">
<div className="container hero-inner">
<motion.div initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.35 }}>
<span className="eyebrow">DJ‑Pizzaria • Since 2010</span>
<h1><span className="gradient-text">Fresh. Hot.</span> Delivered.</h1>
<p>Craft pizzas baked to perfection, delivered fast. Real‑time order tracking included.</p>
<ul className="hero-points">
<li>Hand‑tossed dough daily</li>
<li>100% mozzarella + San Marzano tomatoes</li>
<li>Delivery under 30 minutes</li>
</ul>
<div>
<Link to="/menu" className="cta">Order now</Link>
<Link to="/about" className="cta alt">Learn more</Link>
</div>
</motion.div>
<motion.div className="hero-visual" initial={{ opacity:0, scale:.98 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:.4 }}>
<div className="frame" style={{ height: '100%' }}>
<img 
  src="https://images.unsplash.com/photo-1513104890138-7c749659a591" 
  alt="Signature pizza" 
  style={{ 
    width: '100%', 
    height: '100%',
    display: 'block', 
    borderRadius: '12px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
    objectFit: 'cover' 
  }}
  key="menu-pizza-image"
/>
</div>
<div className="glow"></div>
<div className="floating-badge"><span className="star">★</span> 4.9/5 by 10k+ foodies</div>
</motion.div>
</div>
</section>

      {/* Non-Veg Pizza Gallery */}
      <section className="gallery-section" style={{ padding: '60px 0', backgroundColor: '#f9f9f9' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.2rem', color: '#1f2937' }}>Our Non-Veg Specialties</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px',
            padding: '0 15px'
          }}>
            {[
              'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop'
            ].map((img, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  aspectRatio: '1/1'
                }}
                whileHover={{ 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                }}
              >
                <img 
                  src={img} 
                  alt={`Non-veg pizza ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/menu" className="cta">View Full Menu</Link>
          </div>
        </div>
      </section>

      <PizzaCarousel />
    </>
  );
}