import { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pizzas from '../data/pizzas';
import PizzaCard from '../components/PizzaCard';
import CategoryCarousel from '../components/CategoryCarousel';
import PizzaCarousel from '../components/PizzaCarousel';
import { categories } from '../data/categories';
import { useNavigate } from 'react-router-dom';

export default function Menu(){
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("none");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    // Main menu page shows all pizzas, optionally filtered only by category
    return pizzas.filter(p => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory]);

  const handleCategoryClick = (name) => {
    setSelectedCategory(name);
    const match = categories.find(c => c.name === name);
    if (match && match.slug && match.slug !== 'all') {
      navigate(`/category/${match.slug}`);
    }
  };

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
    if (sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
    if (sort === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  }, [filtered, sort]);

  return (
    <section className="page">
      

      <div className="menu-banner">
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop" alt="Menu banner" />
        <div className="overlay"></div>
        <div className="text">Crafted Fresh. Delivered Fast.</div>
      </div>
      <div className="menu-hero">
        <h2 className="menu-title" style={{textAlign:"center",color:"black",fontFamily:"sans-serif",padding:"10px"}}>Our Menu</h2>
        <p className="menu-sub">Signature pizzas crafted with premium ingredients. Browse and order instantly.</p>
        <div className="menu-search">
          <input
            placeholder="Search pizzas or categories (like Domino's)"
            value={query}
            readOnly
            onFocus={() => navigate('/search')}
            onClick={() => navigate('/search')}
          />

          <div className="search-actions">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="none">Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>

            <button
              type="button"
              onClick={() => {
                // Reset local filters; main grid always shows full menu
                setSort("none");
                setSelectedCategory("All");
              }}
            >
              Clear
            </button>
          </div>
        </div>

      </div>

      <CategoryCarousel
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryClick}
      />

      {/* Domino-style carousel strip */}
      <div style={{ marginTop: '1.5rem' }}>
        <PizzaCarousel />
      </div>

      <div ref={listRef} style={{ marginTop: '1.5rem' }}>
        <h3 className="section-title" style={{textAlign:"center",color:"black",fontFamily:"sans-serif",padding:"10px"}}>
          {selectedCategory === "All" ? "All categories" : selectedCategory}
        </h3>
        <motion.div
          className="grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once:true }}
          variants={{ hidden:{opacity:0, y:8}, show:{opacity:1, y:0, transition:{ staggerChildren:.05 }}}}
        >
          {sorted.length === 0 && (
            <p style={{ textAlign: 'center', width: '100%' }}>
              No items match this category yet.
            </p>
          )}
          {sorted.map(p => (
            <motion.div
              key={p.id}
              variants={{ hidden:{opacity:0, y:8}, show:{opacity:1, y:0} }}
            >
              <PizzaCard pizza={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}