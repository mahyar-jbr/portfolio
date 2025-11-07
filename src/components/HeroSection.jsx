import { motion } from 'framer-motion';

export default function HeroSection({ scrollToSection }) {
  const letters = "MAHYAR".split("");

  return (
    <section id="hero" className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Main content */}
      <div className="max-w-7xl w-full relative z-10">
        {/* Glitch effect name */}
        <div className="relative mb-8">
          {/* Shadow layers for depth */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute text-5xl sm:text-8xl md:text-[12rem] lg:text-[16rem] font-black text-white leading-none"
            style={{
              textShadow: '4px 4px 0px rgba(255,255,255,0.1)',
              transform: 'translate(8px, 8px)',
            }}
          >
            {letters.map((letter, i) => (
              <motion.span
                key={`shadow-${i}`}
                className="inline-block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.1, x: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: [0.6, 0.01, 0.05, 0.95]
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* Main text with stagger animation */}
          <h1 className="relative text-5xl sm:text-8xl md:text-[12rem] lg:text-[16rem] font-black text-white leading-none">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block cursor-default relative"
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  filter: 'drop-shadow(0px 0px 0px rgba(255,255,255,0))'
                }}
                transition={{
                  opacity: { delay: i * 0.1, duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] },
                  y: { delay: i * 0.1, duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] },
                  rotateX: { delay: i * 0.1, duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] },
                  scale: { duration: 0.2, ease: "easeOut" },
                  filter: { duration: 0.2, ease: "easeOut" }
                }}
                style={{
                  display: 'inline-block',
                  transformStyle: 'preserve-3d',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Animated subtitle with typewriter effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="h-[2px] w-16 bg-gradient-to-r from-white to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ transformOrigin: 'left' }}
            />
            <h2 className="text-lg sm:text-xl md:text-3xl font-light text-zinc-200 tracking-wide">
              Computer Science Student
            </h2>
          </div>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl ml-0 sm:ml-20 leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            York University · Full-Stack Developer · Problem Solver
          </motion.p>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-wrap gap-5"
        >
          {/* Explore Work Button */}
          <motion.button
            onClick={() => scrollToSection('#work')}
            className="group relative px-10 py-5 border-2 border-white bg-black overflow-hidden"
            whileTap={{ scale: 0.98 }}
            whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
          >
            {/* Sliding white background */}
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-sm">
              Explore Work
            </span>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
          </motion.button>

          {/* Get In Touch Button */}
          <motion.button
            onClick={() => scrollToSection('#contact')}
            className="group relative px-10 py-5 border-2 border-white bg-black overflow-hidden"
            whileTap={{ scale: 0.98 }}
            whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
          >
            {/* Sliding white background */}
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-sm">
              Get In Touch
            </span>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
          </motion.button>

          {/* GitHub Button */}
          <motion.a
            href="https://github.com/mahyar-jbr"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 border-2 border-white bg-black overflow-hidden flex items-center gap-3"
            whileTap={{ scale: 0.98 }}
            whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
          >
            {/* Sliding white background */}
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <svg
              className="w-5 h-5 relative z-10 text-white group-hover:text-black transition-colors duration-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>

            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-sm">
              GitHub
            </span>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
