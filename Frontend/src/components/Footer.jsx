import { FaPizzaSlice, FaFacebookF, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
  };

  const social = [
    { Icon: FaFacebookF, bg: '#1877f2', color: '#ffffff' },
    { Icon: FaTwitter, bg: '#1da1f2', color: '#ffffff' },
    { Icon: FaInstagram, bg: 'linear-gradient(45deg,#f58529,#feda77,#dd2a7b,#8134af,#515bd4)', color: '#ffffff' },
  ];

  const orderLinks = [
    { name: "Order Online", path: "/menu" },
    { name: "Deals & Offers", path: "/menu" },
    { name: "Track Order", path: "/track" },
    { name: "Cart", path: "/cart" },
  ];

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" },
    { name: "Sign Up", path: "/register" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/contact" },
    { name: "FAQs", path: "/contact" },
    { name: "Feedback", path: "/contact" },
    { name: "Privacy & Terms", path: "/" },
  ];

  return (
    <footer className="relative bg-white text-slate-800 pt-14 pb-8 border-t border-slate-200"  style={{background: "radial-gradient(1200px 600px at 85% -10%, rgba(255, 77, 79, 0.12), transparent 60%), radial-gradient(800px 500px at -10% 20%, rgba(250, 173, 20, 0.12), transparent 55%), linear-gradient(120deg, #ffffff 0%, #fff 55%, #fff8f8 100%)"}}>

      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0054a6] via-[#e31837] to-[#0054a6]"></div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 relative z-10">

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10 items-start"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          {/* Brand */}
          <motion.div variants={item} className="space-y-5 lg:col-span-2 max-w-xl">
            <div className=" space-y-2">
              <h2 className="text-3xl m-5 font-extrabold tracking-tight text-slate-900">
                DJ-Pizzaria
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fresh • Hot • Delivered</p>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Crafted with premium ingredients and baked to perfection. Order online and enjoy fast delivery every time.
            </p>
            {/* <div className="flex items-center gap-5 pt-1">
              {social.map(({ Icon, bg, color }, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-all"
                  whileHover={{ y: -3 }}
                  style={{
                    background: bg,
                    color,
                    border: bg.includes('linear-gradient') ? '1px solid rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Icon className="text-lg" />
                </motion.a>
              ))}
            </div> */}
            <div style={{display:"flex", alignItems:"center", justifyContent:"center",gap:"2rem"}}>
               <img style={{width:"5.5rem"}} 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="w-36 h-12 flex-shrink-0 object-contain cursor-pointer hover:scale-105 transition"
              /> 
              <img style={{width:"6rem"}} 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="w-30 h-12 flex-shrink-0 object-contain cursor-pointer hover:scale-105 transition"
              />
            </div>
          </motion.div>

          {/* Order Online */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Order Online</h3>
            <ul className="space-y-3">
              {orderLinks.map((link, idx) => (
                <motion.li key={idx} whileHover={{ x: 4 }}>
                  <Link to={link.path} className="text-slate-600 hover:text-[#e31837] transition-all text-sm">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, idx) => (
                <motion.li key={idx} whileHover={{ x: 4 }}>
                  <Link to={link.path} className="text-slate-600 hover:text-[#e31837] transition-all text-sm">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, idx) => (
                <motion.li key={idx} whileHover={{ x: 4 }}>
                  <Link to={link.path} className="text-slate-600 hover:text-[#e31837] transition-all text-sm">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Get in Touch</h3>
            <ul className="space-y-4">
              {[
                { icon: FaMapMarkerAlt, label: "756 Pizza Street, Indore City" },
                { icon: FaPhone, label: "+91 6266925739", link: "tel:+919876543210" },
                { icon: FaEnvelope, label: "devendra8jaiswal@gmail.com", link: "mailto:info@djpizzaria.com" }
              ].map((c, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full border border-slate-200">
                    <c.icon className="text-slate-700 text-base" />
                  </div>
                  <div className="flex-1 leading-relaxed text-sm text-slate-700">
                    {c.link ? (
                      <a href={c.link} className="hover:text-[#e31837]">
                        {c.label}
                      </a>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-slate-200 pt-5 text-center text-slate-600 text-sm" style={{background:"radial-gradient(1200px 600px at 85% -10%, rgba(255, 77, 79, 0.12), transparent 60%), radial-gradient(800px 500px at -10% 20%, rgba(250, 173, 20, 0.12), transparent 55%), linear-gradient(120deg, #ffffff 0%, #fff 55%, #fff8f8 100%)"}} 
        >
          © {currentYear}DJ-PIZZARIA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

