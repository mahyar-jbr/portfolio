import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Github, Linkedin, ArrowUpRight, Send } from 'lucide-react';
import { useState, useRef } from 'react';

export default function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/xvgveyqw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socials = [
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:jaberi.mahyar@gmail.com',
      display: 'jaberi.mahyar@gmail.com',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/mahyar-jbr',
      display: 'github.com/mahyar-jbr',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/mahyar-jaberi-482649226/',
      display: 'linkedin.com/in/mahyar-jaberi',
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, white 1px, transparent 0)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Rotating gradient orb */}
      <motion.div
        style={{ rotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5"
      >
        <div className="w-full h-full bg-gradient-to-br from-white via-transparent to-transparent rounded-full blur-[100px]" />
      </motion.div>

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="flex items-center gap-6 mb-8">
            <motion.div
              className="text-8xl font-black text-white/30"
              initial={{ x: -100, opacity: 0 }}
              animate={inView ? {
                x: 0,
                opacity: 1,
                textShadow: "0px 0px 30px rgba(255,255,255,0.3)"
              } : {}}
              transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
            >
              05
            </motion.div>
            <div>
              <h2 className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-2 font-bold">Get In Touch</h2>
              <motion.div
                className="h-[2px] bg-gradient-to-r from-white to-transparent"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.3, duration: 1 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>

          <motion.p
            className="text-2xl text-zinc-400 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Open to internship opportunities and interesting projects. Drop me a message and let's build something great together.
          </motion.p>
        </motion.div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact form - Left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative group"
          >
            {/* Form container glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-sm"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div className="mb-8">
              <motion.h3
                className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-3 font-bold relative"
                whileHover={{
                  color: '#fff',
                  textShadow: '0 0 15px rgba(255,255,255,0.2)'
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                Send a Message
              </motion.h3>
              <motion.div
                className="h-[2px] bg-gradient-to-r from-white to-transparent"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{ transformOrigin: 'left', width: '200px' }}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div className="relative group/field">
                {/* Corner accents */}
                <motion.div
                  className="absolute top-8 left-0 w-3 h-3 border-l-2 border-t-2 border-transparent pointer-events-none"
                  animate={{
                    borderColor: focusedField === 'name' ? 'rgba(255,255,255,0.3)' : 'transparent',
                    x: focusedField === 'name' ? -4 : 0,
                    y: focusedField === 'name' ? -4 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-transparent pointer-events-none"
                  animate={{
                    borderColor: focusedField === 'name' ? 'rgba(255,255,255,0.3)' : 'transparent',
                    x: focusedField === 'name' ? 4 : 0,
                    y: focusedField === 'name' ? 4 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                <motion.label
                  htmlFor="name"
                  className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-3 font-bold"
                  animate={{
                    color: focusedField === 'name' ? '#fff' : '#52525b'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Name
                </motion.label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3 bg-transparent border-2 text-white text-base focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Your name"
                  animate={{
                    borderColor: focusedField === 'name' ? '#fff' : 'rgb(39, 39, 42)',
                    boxShadow: focusedField === 'name' ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0px rgba(255,255,255,0)',
                    y: focusedField === 'name' ? -2 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Email field */}
              <div className="relative group/field">
                {/* Corner accents */}
                <motion.div
                  className="absolute top-8 left-0 w-3 h-3 border-l-2 border-t-2 border-transparent pointer-events-none"
                  animate={{
                    borderColor: focusedField === 'email' ? 'rgba(255,255,255,0.3)' : 'transparent',
                    x: focusedField === 'email' ? -4 : 0,
                    y: focusedField === 'email' ? -4 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-transparent pointer-events-none"
                  animate={{
                    borderColor: focusedField === 'email' ? 'rgba(255,255,255,0.3)' : 'transparent',
                    x: focusedField === 'email' ? 4 : 0,
                    y: focusedField === 'email' ? 4 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                <motion.label
                  htmlFor="email"
                  className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-3 font-bold"
                  animate={{
                    color: focusedField === 'email' ? '#fff' : '#52525b'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Email
                </motion.label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3 bg-transparent border-2 text-white text-base focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="your@email.com"
                  animate={{
                    borderColor: focusedField === 'email' ? '#fff' : 'rgb(39, 39, 42)',
                    boxShadow: focusedField === 'email' ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0px rgba(255,255,255,0)',
                    y: focusedField === 'email' ? -2 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Message field */}
              <div className="relative group/field">
                {/* Corner accents */}
                <motion.div
                  className="absolute top-8 left-0 w-3 h-3 border-l-2 border-t-2 border-transparent pointer-events-none"
                  animate={{
                    borderColor: focusedField === 'message' ? 'rgba(255,255,255,0.3)' : 'transparent',
                    x: focusedField === 'message' ? -4 : 0,
                    y: focusedField === 'message' ? -4 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-transparent pointer-events-none"
                  animate={{
                    borderColor: focusedField === 'message' ? 'rgba(255,255,255,0.3)' : 'transparent',
                    x: focusedField === 'message' ? 4 : 0,
                    y: focusedField === 'message' ? 4 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                <motion.label
                  htmlFor="message"
                  className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-3 font-bold"
                  animate={{
                    color: focusedField === 'message' ? '#fff' : '#52525b'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Message
                </motion.label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-transparent border-2 text-white text-base focus:outline-none resize-none transition-all placeholder:text-zinc-700"
                  placeholder="Tell me about your project..."
                  animate={{
                    borderColor: focusedField === 'message' ? '#fff' : 'rgb(39, 39, 42)',
                    boxShadow: focusedField === 'message' ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0px rgba(255,255,255,0)',
                    y: focusedField === 'message' ? -2 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="group relative w-full px-6 py-3 sm:px-10 sm:py-5 border-2 border-white bg-black overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
                whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              >
                <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3">
                  {submitStatus === 'submitting' ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </span>
              </motion.button>

              {/* Status messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-sm text-center mt-4 p-3 border-2 border-white"
                >
                  ✓ Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center mt-4 p-3 border-2 border-red-400"
                >
                  ✗ Failed to send message. Please try again or email me directly.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Social links - Right side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="mb-8">
                <motion.h3
                  className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-3 font-bold"
                  whileHover={{
                    color: '#fff',
                    textShadow: '0 0 15px rgba(255,255,255,0.2)'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Connect Directly
                </motion.h3>
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-white to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  style={{ transformOrigin: 'left', width: '200px' }}
                />
              </div>

              <div className="space-y-4">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target={social.name !== 'Email' ? '_blank' : undefined}
                      rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                      className="group relative block"
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                      whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                      onMouseEnter={() => setHoveredSocial(index)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <div className="flex items-center gap-6 p-6 border-2 border-white bg-black relative overflow-hidden">
                        {/* Slide effect on hover */}
                        <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 border-2 border-white group-hover:border-black flex items-center justify-center bg-black group-hover:bg-white transition-colors duration-500">
                          <Icon className="w-5 h-5 text-white group-hover:text-black transition-colors duration-500" />
                        </div>

                        {/* Text content */}
                        <div className="relative z-10 flex-1">
                          <div className="font-bold text-base tracking-wide mb-1 text-white group-hover:text-black transition-colors duration-500">
                            {social.name}
                          </div>
                          <div className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors duration-500">
                            {social.display}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="relative z-10 text-white group-hover:text-black transition-colors duration-500">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability status */}
            <motion.div
              className="border-t-2 pt-8 pl-6 relative overflow-hidden group/availability cursor-default"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.3, duration: 0.6 }}
              whileHover={{
                borderColor: 'rgba(255,255,255,0.2)'
              }}
            >
              {/* Subtle glow on hover */}
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.02 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              <div className="flex items-center gap-4 relative z-10">
                <motion.div
                  className="w-3 h-3 rounded-full bg-white"
                  animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 15px rgba(255,255,255,0.5)',
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
                  <motion.div
                    className="text-white font-bold tracking-wide"
                    whileHover={{
                      textShadow: '0 0 15px rgba(255,255,255,0.3)'
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    Available for Opportunities
                  </motion.div>
                  <div className="text-sm text-zinc-500">Usually respond within 24 hours</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
