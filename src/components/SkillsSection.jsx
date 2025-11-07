import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useRef } from 'react';

export default function SkillsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Categorized skills
  const skillCategories = [
    {
      name: 'Languages',
      number: '01',
      skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C']
    },
    {
      name: 'Frontend',
      number: '02',
      skills: ['React', 'React Native', 'HTML/CSS', 'Tailwind CSS']
    },
    {
      name: 'Backend',
      number: '03',
      skills: ['Node.js', 'Express', 'Spring Boot']
    },
    {
      name: 'Database',
      number: '04',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQL']
    },
    {
      name: 'Tools & Platforms',
      number: '05',
      skills: ['Git', 'Docker', 'Linux', 'Maven', 'Postman', 'Jupyter']
    }
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Animated background grid */}
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
              04
            </motion.div>
            <div>
              <h2 className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-2 font-bold">Tech Stack</h2>
              <motion.div
                className="h-[2px] bg-gradient-to-r from-white to-transparent"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.3, duration: 1 }}
                style={{ transformOrigin: 'left', width: '300px' }}
              />
            </div>
          </div>

          <motion.p
            className="text-2xl text-zinc-400 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            A diverse toolkit for building modern, performant applications.
          </motion.p>
        </motion.div>

        {/* Skills by category - Unique vertical timeline layout */}
        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-zinc-900 hidden lg:block" />

          <div className="space-y-24">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + categoryIndex * 0.2, duration: 0.8 }}
                className="relative"
                onMouseEnter={() => setHoveredCategory(categoryIndex)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-12 top-8 w-6 h-6 -ml-[11px] border-2 bg-black rounded-full hidden lg:block z-10"
                  animate={{
                    borderColor: hoveredCategory === categoryIndex ? '#fff' : 'rgb(39, 39, 42)',
                    backgroundColor: hoveredCategory === categoryIndex ? '#fff' : '#000',
                    scale: hoveredCategory === categoryIndex ? 1.4 : 1,
                    boxShadow: hoveredCategory === categoryIndex ? '0 0 30px rgba(255,255,255,0.4)' : '0 0 0px rgba(255,255,255,0)'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                <div className="lg:ml-32">
                  {/* Category header with unique design */}
                  <motion.div
                    className="mb-8 relative border-2 p-6 overflow-hidden"
                    animate={{
                      borderColor: hoveredCategory === categoryIndex ? '#fff' : 'rgb(39, 39, 42)',
                      boxShadow: hoveredCategory === categoryIndex ? '0 0 40px rgba(255,255,255,0.15)' : '0 0 0px rgba(255,255,255,0)'
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {/* Animated background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCategory === categoryIndex ? 0.03 : 0 }}
                      transition={{ duration: 0.5 }}
                    />

                    <div className="relative z-10 flex items-center gap-6">
                      <motion.div
                        className="text-6xl font-black text-white/10"
                        animate={{
                          textShadow: hoveredCategory === categoryIndex ? "0px 0px 25px rgba(255,255,255,0.3)" : "0px 0px 0px rgba(255,255,255,0)",
                          scale: hoveredCategory === categoryIndex ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {category.number}
                      </motion.div>
                      <div>
                        <h3 className="text-2xl tracking-[0.25em] text-white uppercase font-black mb-1">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-600 tracking-widest uppercase">
                          <span>{category.skills.length} Skills</span>
                          <span>•</span>
                          <span>Proficient</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Skills in a flowing layout */}
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, skillIndex) => {
                      const globalIndex = `${categoryIndex}-${skillIndex}`;
                      return (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{
                            delay: 0.9 + categoryIndex * 0.2 + skillIndex * 0.05,
                            duration: 0.4,
                            type: "spring",
                            stiffness: 200
                          }}
                          className="relative"
                        >
                          <div className="relative border-2 border-zinc-800 px-6 py-4 overflow-hidden">
                            {/* Diagonal accent line */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-zinc-700 opacity-20" />

                            {/* Skill name */}
                            <div className="relative font-bold text-sm tracking-wide text-white">
                              {skill}
                            </div>

                            {/* Skill index number */}
                            <div className="absolute bottom-1 left-2 text-[10px] font-black tracking-wider text-white/10">
                              {String(skillIndex + 1).padStart(2, '0')}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
