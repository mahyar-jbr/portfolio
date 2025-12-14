import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Code2, TrendingUp, Dog, Target } from 'lucide-react';

export default function ExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const experiences = [
    {
      company: 'Perfect Equation',
      position: 'Founder',
      period: 'Jan 2025 - Present',
      location: 'Toronto, ON · On-site',
      description: 'Launched a digital brand and creative agency, building client websites, managing branding strategies, and experimenting with technology for business growth.',
      icon: TrendingUp,
      achievements: [
        'Built and deployed websites using Wix and managed digital marketing campaigns',
        'Oversaw end-to-end operations from design to client engagement',
        'Leveraged technology to strengthen both business and technical skills'
      ]
    },
    {
      company: 'Nova Ventures',
      position: 'Software Developer',
      period: 'Sep 2024 - Present',
      location: 'Toronto, ON',
      description: 'Leading development of goalkeeper performance analytics platform using React/TypeScript frontend and Python/FastAPI backend, currently piloted with professional-level goalkeepers.',
      icon: Target,
      achievements: [
        'Built real-time analytics dashboard featuring interactive goal heatmaps, shot distribution across 9 goal zones, and save rate trend analysis',
        'Designed and implemented multi-factor 100-point scoring system analyzing reaction time, positioning, and diving patterns to generate personalized training recommendations',
        'Architecting computer vision pipeline using OpenCV and YOLOv8 to automate shot detection and goalkeeper movement tracking from match footage'
      ]
    },
    {
      company: 'Sepantech',
      position: 'Developer & Database Intern',
      period: 'Mar 2024 - Aug 2024',
      location: 'Sweden · Remote',
      description: 'Contributed as a Software Engineer Intern on a course management application for medical and physiotherapy professionals, now in use across Sweden.',
      icon: Code2,
      achievements: [
        'Designed 6+ MySQL database tables and optimized 12+ queries by adding composite indexes, reducing average query response time by 30%',
        'Developed 8+ backend API endpoints using Node.js for course management features including user authentication, enrollment processing, progress updates, and certificate generation',
        'Collaborated with a cross-functional team of 3+ developers in an Agile environment, participating in code reviews and sprint planning to deliver features on schedule'
      ]
    },
    {
      company: 'Pet Valu',
      position: 'Animal Care Expert & Assistant Manager',
      period: 'Aug 2023 - Present',
      location: 'Richmond Hill, ON · On-site',
      description: 'Promoted to Assistant Manager; lead shifts of 4–8 associates and train 10+ staff in service, operations, and pet-nutrition basics.',
      icon: Dog,
      achievements: [
        'Consistently ranked #1 in-store for sales per transaction, contributing to the location\'s top-tier regional performance',
        'Standardized opening/closing and weekly inventory cycle counts, reducing checkout/stocking errors and improving customer experience',
        'Ensured well-being of in-store pets and provided top-notch customer service with meticulous pet care and personalized guidance'
      ]
    }
  ];

  return (
    <section id="experience" ref={ref} className="relative min-h-screen py-32 px-8 overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
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
              03
            </motion.div>
            <div>
              <h2 className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-2 font-bold">
                Experience
              </h2>
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
      </div>

      {/* Experience timeline */}
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Timeline connector */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-800">
                <motion.div
                  className="w-full bg-white origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>

              {/* Timeline dot */}
              <motion.div
                className="absolute left-0 top-8 w-4 h-4 -ml-[7px] border-2 border-zinc-800 bg-black rounded-full"
                animate={{
                  borderColor: hoveredIndex === index ? '#fff' : 'rgb(39, 39, 42)',
                  backgroundColor: hoveredIndex === index ? '#fff' : '#000',
                  scale: hoveredIndex === index ? 1.3 : 1
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {/* Experience card */}
              <motion.div
                className="ml-12 border-2 p-8 relative overflow-hidden"
                animate={{
                  borderColor: hoveredIndex === index ? '#fff' : 'rgb(39, 39, 42)',
                  boxShadow: hoveredIndex === index ? "0 0 30px rgba(255,255,255,0.15)" : "0 0 0px rgba(255,255,255,0)"
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 0.02 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        className="w-10 h-10 border-2 border-zinc-800 flex items-center justify-center"
                        animate={{
                          borderColor: hoveredIndex === index ? '#fff' : 'rgb(39, 39, 42)',
                          boxShadow: hoveredIndex === index ? "0 0 20px rgba(255,255,255,0.2)" : "0 0 0px rgba(255,255,255,0)"
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <exp.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <motion.h3
                        className="text-2xl font-black text-white"
                        animate={{
                          textShadow: hoveredIndex === index ? "0 0 20px rgba(255,255,255,0.3)" : "0 0 0px rgba(255,255,255,0)"
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {exp.position}
                      </motion.h3>
                    </div>
                    <p className="text-lg text-zinc-400 font-bold tracking-wide">{exp.company}</p>
                    <p className="text-sm text-zinc-500 mt-1">{exp.location}</p>
                  </div>

                  <motion.div
                    className="px-6 py-2 border-2 text-sm tracking-widest font-bold"
                    animate={{
                      borderColor: hoveredIndex === index ? '#fff' : 'rgb(39, 39, 42)',
                      color: hoveredIndex === index ? '#fff' : 'rgb(113, 113, 122)',
                      boxShadow: hoveredIndex === index ? "0 0 25px rgba(255,255,255,0.3)" : "0 0 0px rgba(255,255,255,0)"
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {exp.period}
                  </motion.div>
                </div>

                {/* Description */}
                <p className="text-lg text-zinc-400 mb-6 leading-relaxed">{exp.description}</p>

                {/* Achievements */}
                <div className="space-y-3">
                  {exp.achievements.map((achievement, achIndex) => (
                    <motion.div
                      key={achIndex}
                      className="flex gap-3 text-zinc-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.2 + achIndex * 0.1 }}
                    >
                      <span className="text-white mt-1">→</span>
                      <span className="leading-relaxed">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
