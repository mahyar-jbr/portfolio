import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);

  const socialLinks = [
    { icon: Github, href: 'https://github.com/mahyar-jbr', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/mahyar-jaberi', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:jaberi.mahyar@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'About', id: '#about', number: '01' },
    { label: 'Work', id: '#work', number: '02' },
    { label: 'Experience', id: '#experience', number: '03' },
    { label: 'Skills', id: '#skills', number: '04' },
    { label: 'Gallery', id: '#gallery', number: '05' },
    { label: 'Contact', id: '#contact', number: '06' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative bg-black border-t border-zinc-900 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Subtle gradient orb */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-white/2 rounded-full blur-[150px]"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Main footer content - Horizontal layout */}
        <div className="grid lg:grid-cols-3 gap-16 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-4 mb-6 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Logo */}
              <div className="relative">
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl bg-white/20 -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Rotating border */}
                <motion.div
                  className="absolute inset-[-8px] border-2 border-white/10 rounded-sm -z-10"
                  initial={{ rotate: 0, opacity: 0 }}
                  whileHover={{ rotate: 180, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* Logo image */}
                <motion.img
                  src="/logo.png"
                  alt="Mahyar Logo"
                  className="h-20 w-auto object-contain relative z-10"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    filter: [
                      'drop-shadow(0px 0px 0px rgba(255,255,255,0))',
                      'drop-shadow(0px 0px 20px rgba(255,255,255,0.8))',
                      'drop-shadow(0px 0px 0px rgba(255,255,255,0))'
                    ]
                  }}
                  transition={{
                    opacity: { duration: 0.6 },
                    filter: { duration: 1.5, repeat: Infinity }
                  }}
                />

                {/* Corner accents */}
                <motion.div
                  className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white/0 group-hover:border-white/50 transition-colors duration-300"
                  initial={{ x: -5, y: -5 }}
                  whileHover={{ x: -8, y: -8 }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/0 group-hover:border-white/50 transition-colors duration-300"
                  initial={{ x: 5, y: 5 }}
                  whileHover={{ x: 8, y: 8 }}
                />
              </div>

              {/* Text */}
              <div>
                <div className="text-white font-black text-4xl tracking-tighter leading-none mb-1 group-hover:text-shadow-glow transition-all duration-300">
                  MAHYAR
                </div>
                <div className="text-zinc-600 text-xs tracking-[0.3em] uppercase group-hover:text-zinc-500 transition-colors duration-300">
                  Computer Science · York University
                </div>
              </div>
            </motion.button>

            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Building modern web applications with clean code, thoughtful design, and attention to performance.
            </p>

            {/* Availability indicator */}
            <div className="flex items-center gap-3 p-4 border-l-2 border-zinc-800">
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{
                  opacity: [1, 0.3, 1],
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 12px rgba(255,255,255,0.4)',
                    '0 0 0px rgba(255,255,255,0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div>
                <div className="text-white text-sm font-bold">Available for Opportunities</div>
                <div className="text-zinc-600 text-xs">Open to internships & collaborations</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="text-xs tracking-[0.3em] text-zinc-600 uppercase mb-6 font-bold">
              Quick Links
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                >
                  <a
                    href={link.id}
                    className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                    onMouseEnter={() => setHoveredNavItem(index)}
                    onMouseLeave={() => setHoveredNavItem(null)}
                  >
                    <motion.span
                      className="text-[10px] text-zinc-700 group-hover:text-zinc-500 transition-colors font-bold"
                      animate={{
                        x: hoveredNavItem === index ? 4 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.number}
                    </motion.span>
                    <span className="font-medium">{link.label}</span>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: hoveredNavItem === index ? 1 : 0,
                        scale: hoveredNavItem === index ? 1 : 0.8
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </motion.div>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="text-xs tracking-[0.3em] text-zinc-600 uppercase mb-6 font-bold">
              Connect
            </div>
            <div className="space-y-4 mb-8">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.label !== 'Email' ? '_blank' : undefined}
                    rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                    onMouseEnter={() => setHoveredLink(index)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <motion.div
                      className="w-9 h-9 border border-zinc-800 flex items-center justify-center"
                      animate={{
                        borderColor: hoveredLink === index ? '#fff' : 'rgb(39, 39, 42)',
                        backgroundColor: hoveredLink === index ? 'rgba(255,255,255,0.05)' : 'transparent'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm font-medium">{social.label}</span>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredLink === index ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </motion.div>
                  </motion.a>
                );
              })}
            </div>

            {/* Location & Education mini info */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-600">
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>Toronto, Canada (EST)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>York University, Computer Science</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar with divider */}
        <motion.div
          className="pt-8 border-t border-zinc-900"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-4">
              <span>© {currentYear} Mahyar Jaberi</span>
              <span className="hidden md:inline">·</span>
              <span className="text-zinc-700">All rights reserved</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-zinc-700">Built with</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">React</span>
                <span>·</span>
                <span className="text-zinc-500 font-medium">Framer Motion</span>
                <span>·</span>
                <span className="text-zinc-500 font-medium">Tailwind</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
