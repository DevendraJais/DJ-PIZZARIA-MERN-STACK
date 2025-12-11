import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PizzaCarousel.css';

export default function PizzaCarousel() {
  const [offset, setOffset] = useState(0);

  const pizzas = [
    { id: 1, name: 'Margherita', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/7ed9c325-2b42-4824-a25a-367bb48332be_double_margherita_side.webp?ver=V0.0.1' },
    { id: 2, name: 'Pepperoni', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/a542d031-5fc8-4902-bbb3-25eebd3ace7e_veggie_paradise_side.webp?ver=V0.0.1' },
    { id: 3, name: 'Veggie Supreme', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/d7530589-1336-442b-aa6e-598680086abb_extravaganza_side_full.webp?ver=V0.0.1' },
    { id: 4, name: 'BBQ Chicken', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500&auto=format&fit=crop' },
    { id: 5, name: 'Spicy Indian', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/8abd61ff-024b-45fe-a221-6b72d601cb49_indi_paneer_side_full.webp?ver=V0.0.1' },
    { id: 6, name: 'Four Cheese', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/dbebea5e-4c08-4de4-9f80-5aaa4f75cae4_FullSizeCheeseVolcanoBBQChicken.jpg?ver=V0.0.1' },
    { id: 7, name: 'Mexican Green Wave', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/181bf2e3-2b1f-46e3-8c51-e3c7065f84a7_mexican_green_wave.webp?ver=V0.0.1' },
    { id: 8, name: 'Tandoori Paneer', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500&auto=format&fit=crop' },
    { id: 9, name: 'Deluxe Veggie', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/5daf15fb-7c1c-4f33-9c85-0e00c043e789_farmhouse_side.webp?ver=V0.0.1' },
    { id: 10, name: 'Chicken Tikka', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/2a91f81d-4a24-4387-95fe-0a173ae450e3_paneer_GB_side.webp?ver=V0.0.1' },
    { id: 11, name: 'Paneer Makhani', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/098c0f76-08b6-4462-8edd-ae7ed542e8fd_peppy_paneer_side.webp?ver=V0.0.1' },
    { id: 12, name: 'Butter Chicken', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500&auto=format&fit=crop' },
    { id: 13, name: 'Veggie Extravaganza', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/a542d031-5fc8-4902-bbb3-25eebd3ace7e_veggie_paradise_side.webp?ver=V0.0.1' },
    { id: 14, name: 'Keema & Corn', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/0d5e3dd4-1557-42d6-8dae-5298d3b1d6c9_PP_corn_side.webp?ver=V0.0.1' },
    { id: 15, name: 'Garlic Bread Pizza', image: 'https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/8414923f-7e8e-4552-aec4-697d54b63042_Classic_GB_side.webp?ver=V0.0.1' },
  ];

  // Continuous smooth scrolling animation
  useEffect(() => {
    let animationId;
    let currentOffset = offset;

    const animate = () => {
      currentOffset -= 0.5; // Adjust speed here (lower = faster, higher = slower)
      setOffset(currentOffset);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [offset]);

  // Double the pizzas array for seamless looping
  const extendedPizzas = [...pizzas, ...pizzas];

  return (
    <section className="pizza-carousel-section">
      <div className="carousel-container">
        <h2 className="carousel-title">What Are You Craving for?</h2>
 

        <div className="carousel-wrapper">
          <motion.div 
            className="carousel-track-continuous"
            style={{ transform: `translateX(${offset}px)` }}
          >
            {extendedPizzas.map((pizza, idx) => (
              <motion.div
                key={`${pizza.id}-${idx}`}
                className="carousel-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="pizza-card-carousel">
                  <div className="pizza-image-wrapper">
                    <img 
                      src={pizza.image} 
                      alt={pizza.name}
                      className="pizza-image"
                    />
                    <div className="pizza-overlay"></div>
                  </div>
                  <h3 className="pizza-name">{pizza.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
