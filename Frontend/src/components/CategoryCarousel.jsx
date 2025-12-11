import './CategoryCarousel.css';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

export default function CategoryCarousel({ selectedCategory, onCategorySelect, linkToCategory = false }) {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (linkToCategory) {
      navigate(`/category/${item.slug}`);
    } else {
      onCategorySelect?.(item.name);
    }
  };

  return (
    <section className="w-full py-6  bg-white">
      <div className="category-slider">
        {categories.map((item, index) => (
          <div 
            key={index} 
            className={`category-item ${selectedCategory === item.name ? 'active' : ''}`}
            onClick={() => handleClick(item)}
          >
            <img src={item.img} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
