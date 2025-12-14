import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ArrowUpRight, Code2, Database, Zap, Calendar } from 'lucide-react';
import { useState, useRef } from 'react';

export default function WorkSection({ projects, onProjectSelect }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const projectIcons = [Code2, Database, Calendar, Zap];

  return (
    <section id="work" ref={sectionRef} className="pt-16 pb-32 px-6 bg-black relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 100px),
            repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 100px)
          `,
        }} />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-40 right-10 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-40 left-10 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]"
      />

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
              02
            </motion.div>
            <div>
              <h2 className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-2 font-bold">Selected Work</h2>
              <motion.div
                className="h-[2px] bg-gradient-to-r from-white to-transparent"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.3, duration: 1 }}
                style={{ transformOrigin: 'left', width: '400px' }}
              />
            </div>
          </div>

          <motion.p
            className="text-2xl text-zinc-400 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            A collection of projects showcasing full-stack development, database architecture,
            and performance optimization.
          </motion.p>
        </motion.div>

        {/* Projects list */}
        <div className="space-y-32">
          {projects.map((project, index) => {
            const Icon = projectIcons[index % projectIcons.length];
            const isExpanded = expandedProject === index;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 100 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.2, duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute -inset-12 bg-white/5 rounded-3xl blur-2xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />

                <motion.div
                  className="border p-8 md:p-12 relative overflow-hidden bg-black/50 backdrop-blur-sm"
                  animate={{
                    borderColor: hoveredIndex === index ? 'rgba(255, 255, 255, 0.4)' : 'rgb(24, 24, 27)'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* Animated corner decorations */}
                  <motion.div
                    className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-white/10"
                    animate={{
                      opacity: hoveredIndex === index ? 0.6 : 0.1
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-white/10"
                    animate={{
                      opacity: hoveredIndex === index ? 0.6 : 0.1
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />

                  {/* Project number and icon */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                      {/* Massive project number */}
                      <motion.div
                        className="text-9xl font-black text-white/20 leading-none"
                        animate={{
                          textShadow: hoveredIndex === index
                            ? "0px 0px 40px rgba(255,255,255,0.3)"
                            : "0px 0px 0px rgba(255,255,255,0)",
                          color: hoveredIndex === index ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </motion.div>

                      {/* Project icon with glow */}
                      <motion.div
                        className="w-16 h-16 min-w-[4rem] min-h-[4rem] border-2 border-zinc-800 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                        whileHover={{ borderColor: '#fff', boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white opacity-0"
                          whileHover={{ opacity: 0.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <Icon className="w-8 h-8 min-w-[2rem] min-h-[2rem] text-zinc-600 relative z-10 flex-shrink-0" strokeWidth={1.5} />
                      </motion.div>
                    </div>

                    {/* Year badge */}
                    <motion.div
                      className="relative px-6 py-2 border-2 text-sm tracking-widest font-bold overflow-hidden"
                      animate={{
                        borderColor: hoveredIndex === index ? '#fff' : 'rgb(39, 39, 42)',
                        color: hoveredIndex === index ? '#fff' : 'rgb(113, 113, 122)',
                        boxShadow: hoveredIndex === index ? "0 0 25px rgba(255,255,255,0.3)" : "0 0 0px rgba(255,255,255,0)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white"
                        animate={{
                          opacity: hoveredIndex === index ? 0.05 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">{project.year}</span>
                    </motion.div>
                  </div>

                  {/* Title with split animation */}
                  <div className="mb-6">
                    <motion.h3
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 cursor-pointer"
                      onClick={() => setExpandedProject(isExpanded ? null : index)}
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {project.title}
                    </motion.h3>

                    {/* Animated underline */}
                    <motion.div
                      className="h-[3px] bg-gradient-to-r from-white via-zinc-600 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredIndex === index ? 1 : 0.3 }}
                      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>

                  {/* Tech stack with individual pills */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.tech.map((tech, techIndex) => (
                      <motion.div
                        key={techIndex}
                        className="group relative px-3 py-1.5 sm:px-5 sm:py-2.5 border-2 border-zinc-800 text-zinc-300 text-xs sm:text-sm font-bold tracking-wider uppercase overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.8 + index * 0.2 + techIndex * 0.05, duration: 0.4 }}
                        whileHover={{
                          borderColor: '#fff',
                          boxShadow: "0 0 15px rgba(255,255,255,0.15)"
                        }}
                      >
                        {/* Smooth light beam effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                          initial={{ x: '-100%' }}
                          whileHover={{
                            x: '100%',
                            opacity: [0, 0.1, 0]
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">{tech}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Description */}
                  <motion.p
                    className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-4xl"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0.6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Project Image Preview - Grid of thumbnails */}
                  {(project.images?.length > 0 || project.image) && (
                    <div className="mb-8">
                      <div className="flex justify-center">
                        <div className={`grid gap-6 w-full ${
                          project.id === 2 ? 'grid-cols-2 max-w-5xl' : 'grid-cols-3 max-w-6xl'
                        }`}>
                          {(project.images || [project.image]).map((img, imgIndex) => (
                            <motion.div
                              key={imgIndex}
                              className="relative bg-zinc-900 rounded overflow-hidden border-2 border-zinc-800 group/image cursor-pointer"
                              onClick={() => onProjectSelect(project)}
                              initial={{ opacity: 0, y: 20 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ delay: 0.9 + index * 0.2 + imgIndex * 0.1, duration: 0.6 }}
                              whileHover={{ borderColor: 'rgba(255, 255, 255, 0.4)', y: -4 }}
                            >
                              {/* Overlay gradient */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />

                              {/* Image */}
                              <motion.img
                                src={img}
                                alt={`${project.title} screenshot ${imgIndex + 1}`}
                                className="w-full h-auto object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />

                              {/* Image number indicator */}
                              <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded z-20">
                                {imgIndex + 1}
                              </div>

                              {/* Corner accents */}
                              <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-white/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20" />
                              <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expandable highlights section */}
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <div className="pt-6 border-t border-zinc-800 mb-8">
                      {/* Simple header */}
                      <motion.h4
                        className="text-xl font-black text-white tracking-wider mb-6"
                        initial={{ opacity: 0 }}
                        animate={isExpanded ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        KEY HIGHLIGHTS
                      </motion.h4>

                      {/* Highlights list */}
                      <ul className="space-y-4">
                        {project.highlights.map((highlight, hIndex) => (
                          <motion.li
                            key={hIndex}
                            className="flex gap-4 text-zinc-400"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: hIndex * 0.1, duration: 0.4 }}
                          >
                            <span className="text-white mt-1">→</span>
                            <span className="text-lg leading-relaxed">{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-6">
                    <motion.button
                      onClick={() => setExpandedProject(isExpanded ? null : index)}
                      className="group relative px-6 py-3 sm:px-10 sm:py-5 border-2 border-white bg-black overflow-hidden"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                    >
                      <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center gap-2">
                        {isExpanded ? 'Show Less' : 'View Details'}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.span>
                      </span>
                      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                    </motion.button>

                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-10 sm:py-5 border-2 border-white bg-black overflow-hidden"
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                      >
                        <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        <Github className="w-5 h-5 relative z-10 text-white group-hover:text-black transition-colors duration-500" />
                        <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-xs sm:text-sm">View Code</span>
                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
