import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavBar({ scrollToSection }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { label: 'About', id: '#about', number: '01' },
    { label: 'Work', id: '#work', number: '02' },
    { label: 'Experience', id: '#experience', number: '03' },
    { label: 'Skills', id: '#skills', number: '04' },
    { label: 'Gallery', id: '#gallery', number: '05' },
    { label: 'Contact', id: '#contact', number: '06' },
  ];

  const handleNavClick = (id) => {
    // First close the menu
    setIsOpen(false);
    // Then scroll after a short delay to ensure menu closes smoothly
    setTimeout(() => {
      scrollToSection(id);
    }, 100);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 || isOpen
          ? 'bg-black/98 backdrop-blur-md border-b border-zinc-900'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-12 md:px-3 py-4 relative">
        {/* Top decorative line */}
        <motion.div
          className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollY > 50 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%' }}
        />

        <div className="flex justify-between items-center">
          {/* Logo with animations */}
          <motion.button
            onClick={() => scrollToSection('#hero')}
            className="relative group"
            whileTap={{ scale: 0.95 }}
          >
            {/* Logo with rotation on scroll */}
            <motion.img
              src="/logo.png"
              alt="Mahyar Logo"
              className="h-10 md:h-16 w-auto object-contain relative z-10"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{
                opacity: 1,
                rotate: scrollY > 50 ? 90 : 0
              }}
              whileHover={{
                scale: 1.1,
              }}
              transition={{
                opacity: { duration: 0.6 },
                rotate: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
              }}
              style={{
                filter: 'drop-shadow(0px 0px 0px rgba(255,255,255,0))',
                transition: 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0px 0px 20px rgba(255,255,255,0.9))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0px 0px 0px rgba(255,255,255,0))';
              }}
            />
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="relative"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className="relative px-6 py-3 text-zinc-300 hover:text-white transition-colors group overflow-hidden"
                >
                  {/* Number indicator */}
                  <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors mr-2 font-bold">
                    {item.number}
                  </span>

                  {/* Label */}
                  <span className="tracking-[0.15em] uppercase text-sm font-bold">
                    {item.label}
                  </span>

                  {/* Underline animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredItem === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />

                  {/* Side border on hover */}
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-white"
                    animate={{ height: hoveredItem === index ? '60%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 border-2 border-white bg-black flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-zinc-800 mt-4"
            >
              <div className="flex flex-col pt-4 pb-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavClick(item.id);
                    }}
                    className="text-left border-b border-zinc-800 py-4 px-2 active:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-zinc-500">
                        {item.number}
                      </span>
                      <span className="text-base text-white font-bold tracking-wider uppercase">
                        {item.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-white"
        style={{
          scaleX: Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1),
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
      />
    </motion.nav>
  );
}
