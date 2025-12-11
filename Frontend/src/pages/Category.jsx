import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import pizzas from '../data/pizzas';
import { categories, slugToCategory } from '../data/categories';
import PizzaCard from '../components/PizzaCard';
import CategoryCarousel from '../components/CategoryCarousel';

export default function Category() {
  const { slug } = useParams();
  const category = slugToCategory(slug);

  const items = useMemo(() => {
    if (!category || category.name === 'All') return pizzas;
    return pizzas.filter(p => p.category === category.name);
  }, [category]);

  if (!category) {
    return (
      <section className="page" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Category not found</h2>
        <Link to="/menu" className="cta">Back to menu</Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="menu-banner">
        <img src={category.img} alt={category.name} />
        <div className="overlay"></div>
        <div className="text">{category.name}</div>
      </div>

      <div className="menu-hero">
        <h2 className="menu-title" style={{textAlign:"center",color:"black",fontFamily:"sans-serif",padding:"10px"}}>
          {category.name}
        </h2>
        <p className="menu-sub">Showing Domino-style items for {category.name}.</p>
      </div>

      <CategoryCarousel
        selectedCategory={category.name}
        linkToCategory
      />

      <motion.div
        className="grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once:true }}
        variants={{ hidden:{opacity:0, y:8}, show:{opacity:1, y:0, transition:{ staggerChildren:.05 }}}}
        style={{ marginTop: '1.5rem' }}
      >
        {items.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%' }}>
            No items for this category yet.
          </p>
        )}
        {items.map(p => (
          <motion.div
            key={p.id}
            variants={{ hidden:{opacity:0, y:8}, show:{opacity:1, y:0} }}
          >
            <PizzaCard pizza={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

