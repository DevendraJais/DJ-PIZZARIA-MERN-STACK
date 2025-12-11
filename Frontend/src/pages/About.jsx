import { motion } from 'framer-motion';
export default function About(){
return (
<section className="page">
<div className="section alt">
<h2 style={{ marginTop:0 }}>About DJ-Pizzaria</h2>
<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration:.35 }}>
<p>We started with a simple goal: craft unforgettable pizzas and deliver delight, fast.</p>
<ul className="timeline">
<li>2015 — Founded</li>
<li>2018 — Expanded to 3 locations</li>
<li>2022 — Launched online ordering</li>
</ul>
<div className="stats">
<div className="stat-card"><div className="stat-value">10k+</div><div className="stat-label">Happy customers</div></div>
<div className="stat-card"><div className="stat-value">30 min</div><div className="stat-label">Avg delivery</div></div>
<div className="stat-card"><div className="stat-value">50+</div><div className="stat-label">Unique toppings</div></div>
</div>
</motion.div>
</div>

<div className="section" style={{ marginTop:16 }}>
<h3 style={{ marginTop:0 }}>Our Story</h3>
<motion.p initial={{ opacity:0, y:6 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.3 }}>From a tiny brick oven to a citywide favorite — our journey is fueled by fresh ingredients, bold flavors, and the people who keep coming back for more.</motion.p>
<div className="values" style={{ marginTop:12 }}>
<motion.div className="value-card" initial={{ opacity:0, y:6 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25 }}><div className="value-icon">🍕</div><strong>Quality</strong><p className="muted">Hand‑picked produce, premium cheeses, and authentic sauces.</p></motion.div>
<motion.div className="value-card" initial={{ opacity:0, y:6 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25, delay:.05 }}><div className="value-icon">⚡</div><strong>Speed</strong><p className="muted">Optimized kitchens and routes to deliver under 30 minutes.</p></motion.div>
<motion.div className="value-card" initial={{ opacity:0, y:6 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25, delay:.1 }}><div className="value-icon">💛</div><strong>Care</strong><p className="muted">Smiles in every box and support for our community.</p></motion.div>
</div>
</div>

<div className="section alt" style={{ marginTop:16 }}>
<h3 style={{ marginTop:0 }}>Meet the Team</h3>
<div className="team">
  <motion.div className="team-card" initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25 }}>
    <img 
      className="avatar" 
      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80" 
      alt="Marco Rossi - Head Chef" 
      loading="lazy"
    />
    <strong>Marco Rossi</strong>
    <p className="muted">Head Chef</p>
  </motion.div>
  
  <motion.div className="team-card" initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25, delay:.05 }}>
    <img 
      className="avatar" 
      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80" 
      alt="Priya Patel - Operations Lead"
      loading="lazy"
    />
    <strong>Priya Patel</strong>
    <p className="muted">Operations Lead</p>
  </motion.div>
  
  <motion.div className="team-card" initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25, delay:.1 }}>
    <img 
      className="avatar" 
      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
      alt="Sam Lee - Customer Care"
      loading="lazy"
    />
    <strong>Sam Lee</strong>
    <p className="muted">Customer Care</p>
  </motion.div>
</div>
</div>

<div className="section" style={{ marginTop:16 }}>
<h3 style={{ marginTop:0 }}>Gallery</h3>
<div className="gallery">
  <motion.img 
    src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&auto=format&fit=crop&q=80" 
    alt="Freshly baked pizza with basil" 
    loading="lazy"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  />
  <motion.img 
    src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=80" 
    alt="Gourmet pizza with fresh ingredients" 
    loading="lazy"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.1 }}
  />
  <motion.img 
    src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&auto=format&fit=crop&q=80" 
    alt="Wood-fired pizza preparation" 
    loading="lazy"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
  />
  <motion.img 
    src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&auto=format&fit=crop&q=80" 
    alt="Assorted pizza selection" 
    loading="lazy"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.3 }}
  />
</div>
</div>

<div className="section alt" style={{ marginTop:16 }}>
<h3 style={{ marginTop:0 }}>FAQ</h3>
<div className="faq">
<details>
<summary>Do you offer gluten‑free options?</summary>
<div className="answer">Yes, we have gluten‑free bases for most pizzas. Please note possible traces.</div>
</details>
<details>
<summary>What are the delivery hours?</summary>
<div className="answer">We deliver from 10:00 to 23:00, seven days a week.</div>
</details>
<details>
<summary>Can I customize my pizza?</summary>
<div className="answer">Absolutely. Choose your base, sauce, cheese, and any toppings you like.</div>
</details>
</div>
</div>
</section>
);
}