import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import pizzas from '../data/pizzas';
import { categories } from '../data/categories';
import PizzaCard from '../components/PizzaCard';
import './Menu.css';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function SearchResults() {
  const queryParams = useQuery();
  const initialQ = (queryParams.get('q') || '').trim();
  const [term, setTerm] = useState(initialQ);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return pizzas.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [term]);

  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return { pizzas: [], categories: [] };

    const pizzaSuggestions = pizzas
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 5);

    const categorySuggestions = categories
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 5);

    return { pizzas: pizzaSuggestions, categories: categorySuggestions };
  }, [term]);

  // Keep URL in sync with current term (for refresh/back/forward)
  useEffect(() => {
    const q = term.trim();
    if (!q) {
      navigate('/search', { replace: true });
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
    }
  }, [term, navigate]);

  return (
    <section className="page">
      <div className="menu-hero" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 className="menu-title" style={{ color: 'black', fontFamily: 'sans-serif', padding: '10px' }}>
          Search pizzas & categories
        </h2>
        <p className="menu-sub">
          Start typing to see live suggestions, just like Domino's.
        </p>

        <div className="menu-search" style={{ marginTop: '1rem' }}>
          <input
            autoFocus
            placeholder="Search pizzas or categories..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setTerm('')}
            className="search-clear-btn"
          >
            Clear
          </button>
        </div>

        <div style={{ marginTop: '0.75rem', textAlign: 'left', maxWidth: 900, marginInline: 'auto' }}>
          {term.trim() && (
            <div className="search-suggestions">
              {suggestions.pizzas.length > 0 && (
                <div className="suggest-group">
                  <div className="suggest-title">Pizzas</div>
                  <div className="suggest-list">
                    {suggestions.pizzas.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className="suggest-item"
                        onClick={() => setTerm(p.name)}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.categories.length > 0 && (
                <div className="suggest-group">
                  <div className="suggest-title">Categories</div>
                  <div className="suggest-list">
                    {suggestions.categories.map(c => (
                      <button
                        key={c.slug}
                        type="button"
                        className="suggest-item"
                        onClick={() => {
                          // For categories, jump to the dedicated category page
                          navigate(`/category/${c.slug}`);
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          to="/menu"
          className="search-back-btn search-clear-btn inline-flex items-center justify-center mt-3"
        >
          Back to full menu
        </Link>
      </div>

      <motion.div
        className="grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, y: 8 },
          show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        {(!term.trim() || results.length === 0) && (
          <p style={{ textAlign: 'center', width: '100%' }}>
            {term.trim()
              ? 'No items match your search. Try a different keyword.'
              : 'Type a search from the main menu page to see results here.'}
          </p>
        )}

        {results.map((p) => (
          <motion.div
            key={p.id}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            <PizzaCard pizza={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
