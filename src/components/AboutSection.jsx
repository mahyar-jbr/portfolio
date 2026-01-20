import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [hoveredStat, setHoveredStat] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [globalMousePos, setGlobalMousePos] = useState({ x: 0, y: 0 });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);


  const stats = [
    { value: "4+", label: "Major Projects", description: "Full-stack applications" },
    { value: "2+", label: "Years of Experience", description: "Professional development" },
    { value: "25+", label: "Technologies", description: "Languages & frameworks" },
  ];

  const values = [
    { title: "Performance", description: "Optimizing for speed and efficiency" },
    { title: "Clean Code", description: "Maintainable and scalable architecture" },
    { title: "User-First", description: "Building intuitive experiences" },
  ];

  const handleSectionMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setGlobalMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen bg-black pt-32 pb-16 px-6 relative overflow-hidden"
      onMouseMove={handleSectionMouseMove}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Floating gradient orbs with parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-white/5 blur-[120px]"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-white/3 blur-[100px]"
      />

      {/* Cursor glow effect */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          left: globalMousePos.x,
          top: globalMousePos.y,
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />


      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        {/* Section header with animated line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24"
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
              01
            </motion.div>
            <div>
              <h2 className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-2 font-bold">About</h2>
              <motion.div
                className="h-[2px] bg-gradient-to-r from-white to-transparent"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.3, duration: 1 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          {/* Left column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-12 leading-[1.1]">
              {["Designing", "systems", "that"].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                >
                  {word}
                </motion.span>
              ))}{" "}
              <span className="relative inline-block">
                <motion.span
                  className="relative z-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  solve
                </motion.span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-white/10"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 1, duration: 0.6 }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>{" "}
              {["real", "problems"].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                >
                  {word}
                </motion.span>
              ))}
            </h3>

            <div className="space-y-6 mb-12">
              <motion.p
                className="text-xl text-zinc-400 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                I'm a Computer Science student at York University focused on full-stack development,
                database design, and performance. I enjoy turning abstract ideas into clear,
                maintainable systems with a strong UX.
              </motion.p>

              <motion.p
                className="text-xl text-zinc-400 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Open to internship opportunities where I can contribute to meaningful
                projects and grow alongside a strong team.
              </motion.p>

              {/* Resume Download Button */}
              <motion.a
                href="/resume.pdf"
                download
                className="group inline-flex items-center gap-3 mt-6 px-6 py-4 border-2 border-white bg-black relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              >
                <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <Download className="w-5 h-5 text-white relative z-10 group-hover:text-black transition-colors duration-500" />
                <span className="text-sm font-bold tracking-wider uppercase text-white relative z-10 group-hover:text-black transition-colors duration-500">
                  Download Resume
                </span>
              </motion.a>
            </div>

            {/* Education */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="mb-8">
                <motion.h4
                  className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-3 font-bold"
                  whileHover={{
                    color: '#fff',
                    textShadow: '0 0 15px rgba(255,255,255,0.2)'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Education
                </motion.h4>
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-white to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  style={{ transformOrigin: 'left', width: '120px' }}
                />
              </div>

              <motion.div
                className="group relative cursor-default"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ x: 8 }}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute -inset-4 bg-white/5 rounded-lg -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated left border system */}
                <div className="relative pl-6 py-4">
                  {/* Base border */}
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-zinc-800" />

                  {/* Animated white border that grows */}
                  <motion.div
                    className="absolute left-0 top-0 w-[2px] bg-white"
                    initial={{ height: 0 }}
                    whileHover={{ height: '100%' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ transformOrigin: 'top' }}
                  />

                  {/* Corner accent - top */}
                  <motion.div
                    className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-transparent"
                    animate={{
                      borderColor: 'rgba(255,255,255,0.0)'
                    }}
                    whileHover={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      x: -4,
                      y: -4
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Corner accent - bottom */}
                  <motion.div
                    className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-transparent"
                    animate={{
                      borderColor: 'rgba(255,255,255,0.0)'
                    }}
                    whileHover={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      x: -4,
                      y: 4
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative">
                    <motion.div
                      className="text-xl font-bold text-white mb-2 flex items-center gap-3"
                      whileHover={{
                        textShadow: '0 0 10px rgba(255,255,255,0.2)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      Honours BSc, Computer Science
                      <motion.div
                        className="w-0 h-[2px] bg-gradient-to-r from-white to-transparent group-hover:w-12 transition-all duration-300"
                      />
                    </motion.div>
                    <div className="text-base text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 mb-1">
                      York University
                    </div>
                    <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                      Sept 2023 – Apr 2027 (Expected)
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Certification */}
              <motion.div
                className="group relative cursor-default mt-6"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute -inset-4 bg-white/5 rounded-lg -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated left border system */}
                <div className="relative pl-6 py-4">
                  {/* Base border */}
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-zinc-800" />

                  {/* Animated white border that grows */}
                  <motion.div
                    className="absolute left-0 top-0 w-[2px] bg-white"
                    initial={{ height: 0 }}
                    whileHover={{ height: '100%' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ transformOrigin: 'top' }}
                  />

                  {/* Corner accent - top */}
                  <motion.div
                    className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-transparent"
                    animate={{
                      borderColor: 'rgba(255,255,255,0.0)'
                    }}
                    whileHover={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      x: -4,
                      y: -4
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Corner accent - bottom */}
                  <motion.div
                    className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-transparent"
                    animate={{
                      borderColor: 'rgba(255,255,255,0.0)'
                    }}
                    whileHover={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      x: -4,
                      y: 4
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold tracking-wider uppercase text-zinc-500 px-2 py-0.5 border border-zinc-700 rounded">
                        Certificate
                      </span>
                    </div>
                    <motion.div
                      className="text-xl font-bold text-white mb-2 flex items-center gap-3"
                      whileHover={{
                        textShadow: '0 0 10px rgba(255,255,255,0.2)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      Python for Data Science and AI
                      <motion.div
                        className="w-0 h-[2px] bg-gradient-to-r from-white to-transparent group-hover:w-12 transition-all duration-300"
                      />
                    </motion.div>
                    <div className="text-base text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 mb-1">
                      IBM
                    </div>
                    <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 mb-2">
                      Issued Jan 2026
                    </div>
                    <a
                      href="https://www.credly.com/badges/cd2a000b-2b9c-4616-ba7c-bb7493dc71c5/linked_in_profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors duration-300"
                    >
                      View credential
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Core values with hover effects */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {/* Enhanced header */}
              <div className="mb-8">
                <motion.h4
                  className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-3 font-bold"
                  whileHover={{
                    color: '#fff',
                    textShadow: '0 0 15px rgba(255,255,255,0.2)'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Core Values
                </motion.h4>
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-white to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 1, duration: 0.8 }}
                  style={{ transformOrigin: 'left', width: '150px' }}
                />
              </div>

              {/* Modern value cards */}
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  className="group relative cursor-default"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
                  whileHover={{ x: 8 }}
                >
                  {/* Background glow on hover */}
                  <motion.div
                    className="absolute -inset-4 bg-white/5 rounded-lg -z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Animated left border system */}
                  <div className="relative pl-6 py-4">
                    {/* Base border */}
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-zinc-800" />

                    {/* Animated white border that grows */}
                    <motion.div
                      className="absolute left-0 top-0 w-[2px] bg-white"
                      initial={{ height: 0 }}
                      whileHover={{ height: '100%' }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ transformOrigin: 'top' }}
                    />

                    {/* Corner accent - top */}
                    <motion.div
                      className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-transparent"
                      animate={{
                        borderColor: 'rgba(255,255,255,0.0)'
                      }}
                      whileHover={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        x: -4,
                        y: -4
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Corner accent - bottom */}
                    <motion.div
                      className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-transparent"
                      animate={{
                        borderColor: 'rgba(255,255,255,0.0)'
                      }}
                      whileHover={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        x: -4,
                        y: 4
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Content */}
                    <div className="relative">
                      <motion.div
                        className="text-xl font-bold text-white mb-2 flex items-center gap-3"
                        whileHover={{
                          textShadow: '0 0 10px rgba(255,255,255,0.2)'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {value.title}
                        <motion.div
                          className="w-0 h-[2px] bg-gradient-to-r from-white to-transparent group-hover:w-12 transition-all duration-300"
                        />
                      </motion.div>
                      <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                        {value.description}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Stats with creative interactions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col justify-center space-y-16"
          >
            {stats.map((stat, i) => {
              const statRef = useRef(null);

              const handleMouseMove = (e) => {
                if (!statRef.current) return;
                const rect = statRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                setMousePosition({ x: x * 0.15, y: y * 0.15 });
              };

              const handleMouseLeave = () => {
                setMousePosition({ x: 0, y: 0 });
                setHoveredStat(null);
              };

              return (
              <motion.div
                key={i}
                ref={statRef}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: hoveredStat === i ? `translate(${mousePosition.x}px, ${mousePosition.y}px)` : 'translate(0px, 0px)',
                  transition: 'transform 0.2s ease-out'
                }}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute -inset-6 bg-white/5 rounded-2xl -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hoveredStat === i ? 1 : 0,
                    scale: hoveredStat === i ? 1 : 0.8
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Light beams on hover */}
                <motion.div
                  className="absolute -inset-20 -z-20 opacity-0"
                  animate={{
                    opacity: hoveredStat === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Horizontal beams */}
                  <motion.div
                    className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={hoveredStat === i ? {
                      scaleX: [0, 1.5, 0],
                      opacity: [0, 1, 0]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Vertical beams */}
                  <motion.div
                    className="absolute left-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
                    animate={hoveredStat === i ? {
                      scaleY: [0, 1.5, 0],
                      opacity: [0, 1, 0]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />

                  {/* Diagonal beam top-left to bottom-right */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/15 to-transparent origin-top-left"
                    style={{ transform: 'rotate(45deg)', transformOrigin: 'top left' }}
                    animate={hoveredStat === i ? {
                      scaleX: [0, 2, 0],
                      opacity: [0, 0.8, 0]
                    } : {}}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />

                  {/* Diagonal beam top-right to bottom-left */}
                  <motion.div
                    className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent via-white/15 to-transparent origin-top-right"
                    style={{ transform: 'rotate(-45deg)', transformOrigin: 'top right' }}
                    animate={hoveredStat === i ? {
                      scaleX: [0, 2, 0],
                      opacity: [0, 0.8, 0]
                    } : {}}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                  />

                  {/* Radial glow */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl"
                    animate={hoveredStat === i ? {
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.3, 0.6, 0.3]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                <div className="relative overflow-hidden">
                  {/* Animated number */}
                  <div className="text-8xl md:text-9xl font-black text-white mb-4 leading-none cursor-default">
                    {stat.value}
                  </div>

                  {/* Label and description */}
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-zinc-400 group-hover:text-white transition-colors">
                      {stat.label}
                    </div>
                    <motion.div
                      className="text-sm text-zinc-600 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: hoveredStat === i ? "auto" : 0,
                        opacity: hoveredStat === i ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.description}
                    </motion.div>
                  </div>

                  {/* Animated underline */}
                  <motion.div
                    className="h-[2px] bg-gradient-to-r from-white to-transparent mt-4"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === i ? 1 : 0.3 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </motion.div>
            );
            })}
          </motion.div>
        </div>

        {/* Decorative separator */}
        <motion.div
          className="relative h-px"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 1.5, duration: 1.5 }}
            style={{ width: '100%' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
