import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, Play, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { artworks, storyProject } from '../data/artwork.js';

function ArtworkModal({ artwork, onClose }) {
  const [showTimelapse, setShowTimelapse] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef(null);

  // Check if this is a story project with multiple images
  const isStoryProject = artwork.isStoryProject && artwork.images;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleArrows = (e) => {
      if (isStoryProject) {
        if (e.key === 'ArrowLeft') {
          setCurrentImageIndex(prev => prev > 0 ? prev - 1 : artwork.images.length - 1);
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex(prev => prev < artwork.images.length - 1 ? prev + 1 : 0);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleArrows);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleArrows);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, isStoryProject, artwork.images?.length]);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const nextImage = () => {
    if (isStoryProject) {
      setCurrentImageIndex(prev => prev < artwork.images.length - 1 ? prev + 1 : 0);
    }
  };

  const prevImage = () => {
    if (isStoryProject) {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : artwork.images.length - 1);
    }
  };

  // Get current image for story project
  const currentImage = isStoryProject ? artwork.images[currentImageIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
        className="relative max-w-6xl w-full mx-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main content */}
        <motion.div
          className="relative border-2 border-zinc-800 bg-black/50 backdrop-blur-sm overflow-hidden"
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
          transition={{ duration: 0.5 }}
        >
          {/* Minimal close button - top right inside the modal */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X size={16} strokeWidth={1.5} />
          </motion.button>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-white/10 z-20" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-white/10 z-20" />

          {/* Image/Video container */}
          <div className="relative flex items-center justify-center p-8 min-h-[50vh]">
            <AnimatePresence mode="wait">
              {isStoryProject ? (
                // Story Project: Elegant single-image carousel
                <motion.div
                  key="story-carousel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full flex items-center justify-center"
                >
                  {/* Previous button */}
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-0 md:left-4 z-20 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft size={32} strokeWidth={1.5} />
                  </motion.button>

                  {/* Main image display */}
                  <div className="relative mx-16 md:mx-24">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative"
                      >
                        {/* Large image number */}
                        <motion.div
                          className="absolute -top-4 -left-4 w-14 h-14 border-2 border-white bg-black flex items-center justify-center z-10"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-lg font-black text-white">{String(currentImage?.id).padStart(2, '0')}</span>
                        </motion.div>

                        <img
                          src={currentImage?.src}
                          alt={`Story Project ${currentImage?.id}`}
                          className="max-h-[55vh] w-auto object-contain border-2 border-zinc-700"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Next button */}
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-0 md:right-4 z-20 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight size={32} strokeWidth={1.5} />
                  </motion.button>

                  {/* Thumbnail strip */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 p-3 bg-black/60 backdrop-blur-sm border border-zinc-800">
                    {artwork.images.map((img, idx) => (
                      <motion.button
                        key={img.id}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`relative w-12 h-12 overflow-hidden border-2 transition-all duration-300 ${
                          idx === currentImageIndex
                            ? 'border-white'
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={img.src}
                          alt={`Thumbnail ${img.id}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === currentImageIndex && (
                          <motion.div
                            layoutId="thumbnail-indicator"
                            className="absolute inset-0 border-2 border-white"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm border border-zinc-800">
                    <span className="text-2xl font-black text-white">{String(currentImageIndex + 1).padStart(2, '0')}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-lg text-zinc-500">{String(artwork.images.length).padStart(2, '0')}</span>
                  </div>
                </motion.div>
              ) : showTimelapse && artwork.hasTimelapse ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative cursor-pointer"
                  onClick={handleVideoToggle}
                >
                  <video
                    ref={videoRef}
                    src={artwork.timelapse}
                    className="max-h-[60vh] w-auto"
                    onEnded={() => setIsPlaying(false)}
                    playsInline
                  />
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="border-2 border-white bg-black p-6 group hover:bg-white transition-colors duration-300">
                          <Play size={32} className="text-white group-hover:text-black transition-colors duration-300 ml-1" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.img
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  src={artwork.image}
                  alt={artwork.title}
                  className="max-h-[60vh] w-auto object-contain"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Info bar */}
          <div className="border-t-2 border-zinc-800 p-8">
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2 flex-wrap">
                  <motion.span
                    className="text-4xl font-black text-white/20"
                    animate={{ textShadow: "0px 0px 20px rgba(255,255,255,0.2)" }}
                  >
                    {isStoryProject
                      ? `${String(artwork.images[0]?.id).padStart(2, '0')}-${String(artwork.images[artwork.images.length - 1]?.id).padStart(2, '0')}`
                      : String(artwork.id).padStart(2, '0')}
                  </motion.span>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                    {artwork.title}
                  </h3>
                  {isStoryProject && (
                    <span className="px-3 py-1 border-2 border-zinc-700 text-xs tracking-wider uppercase text-zinc-400 font-bold">
                      {artwork.images.length} Images
                    </span>
                  )}
                  {artwork.series && (
                    <span className="px-3 py-1 border-2 border-zinc-700 text-xs tracking-wider uppercase text-zinc-400 font-bold">
                      Series
                    </span>
                  )}
                  {artwork.exhibition && !isStoryProject && (
                    <span className="px-3 py-1 border-2 border-zinc-700 text-xs tracking-wider uppercase text-zinc-400 font-bold">
                      Exhibited
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-14 flex-wrap">
                  <span className="text-sm tracking-[0.2em] text-zinc-500 uppercase">{artwork.medium}</span>
                  {artwork.size && (
                    <>
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                      <span className="text-sm text-zinc-500">{artwork.size}</span>
                    </>
                  )}
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                  <span className="text-sm text-zinc-500">{artwork.year}</span>
                  {artwork.exhibition && (
                    <>
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                      <span className="text-sm text-zinc-500">{artwork.exhibition}</span>
                    </>
                  )}
                </div>
                {artwork.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-4 ml-14 text-zinc-400 italic max-w-2xl"
                  >
                    "{artwork.description}"
                  </motion.p>
                )}
              </div>

              {artwork.hasTimelapse && (
                <motion.button
                  onClick={() => {
                    setShowTimelapse(!showTimelapse);
                    setIsPlaying(false);
                  }}
                  className="group relative px-8 py-4 border-2 border-white bg-black overflow-hidden"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                >
                  <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-bold tracking-wider uppercase text-sm flex items-center gap-3">
                    {showTimelapse ? (
                      <>
                        <Eye size={16} />
                        View Artwork
                      </>
                    ) : (
                      <>
                        <Clock size={16} />
                        Watch Process
                      </>
                    )}
                  </span>
                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function StoryProjectCard({ artworks, onClick, index, isHovered, onHover, onLeave }) {
  const [ref, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imagesLoaded, setImagesLoaded] = useState(Array(artworks.length).fill(false));

  const handleImageLoad = (idx) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[idx] = true;
      return newState;
    });
  };

  // Get first and last IDs for display
  const firstId = artworks[0]?.id || 5;
  const lastId = artworks[artworks.length - 1]?.id || 9;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.4 + index * 0.1,
        duration: 0.8,
        ease: [0.6, 0.01, 0.05, 0.95]
      }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute -inset-6 bg-white/5 rounded-3xl blur-2xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="relative border-2 overflow-hidden bg-black/50 backdrop-blur-sm cursor-pointer"
        animate={{
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.5)' : 'rgb(39, 39, 42)'
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={onClick}
      >
        {/* Corner decorations */}
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-white/20 z-20"
          animate={{ opacity: isHovered ? 0.8 : 0.2 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-white/20 z-20"
          animate={{ opacity: isHovered ? 0.8 : 0.2 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dynamic Bento-style collage for story images */}
        <div className="relative bg-zinc-900 p-1">
          {/* Desktop: 3-column grid layout that adapts to any number of images */}
          <div className="hidden md:grid grid-cols-3 gap-1 auto-rows-[200px]">
            {artworks.map((artwork, idx) => {
              // First image is featured (larger)
              const isFeature = idx === 0;
              return (
                <div
                  key={artwork.id}
                  className={`relative overflow-hidden ${isFeature ? 'col-span-1 row-span-2' : ''}`}
                >
                  {!imagesLoaded[idx] && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
                  <motion.img
                    src={artwork.image}
                    alt={`Story ${artwork.id}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoad={() => handleImageLoad(idx)}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <motion.div
                    className={`absolute bottom-3 left-3 font-black text-white/25 ${isFeature ? 'text-5xl' : 'text-2xl'}`}
                    animate={{ textShadow: isHovered ? "0 0 20px rgba(255,255,255,0.3)" : "none" }}
                  >
                    {String(artwork.id).padStart(2, '0')}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Mobile: 2-column grid with featured first image */}
          <div className="md:hidden space-y-1">
            {/* Featured large image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {!imagesLoaded[0] && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
              <motion.img
                src={artworks[0]?.image}
                alt={`Story ${artworks[0]?.id}`}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={() => handleImageLoad(0)}
                animate={{ scale: isHovered ? 1.03 : 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-4xl font-black text-white/25">
                {String(artworks[0]?.id).padStart(2, '0')}
              </div>
            </div>

            {/* Grid for remaining images */}
            <div className="grid grid-cols-2 gap-1">
              {artworks.slice(1).map((art, idx) => (
                <div key={art.id} className="relative aspect-square overflow-hidden">
                  {!imagesLoaded[idx + 1] && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
                  <motion.img
                    src={art.image}
                    alt={`Story ${art.id}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoad={() => handleImageLoad(idx + 1)}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-1 left-2 text-xl font-black text-white/25">
                    {String(art.id).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scan line effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden z-10"
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={isHovered ? { top: ['0%', '100%'] } : { top: '0%' }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Content section */}
        <div className="p-6 relative">
          {/* ID range badge */}
          <motion.div
            className="absolute -top-4 left-6 px-4 py-1.5 border-2 border-zinc-700 bg-black text-sm z-10"
            animate={{
              borderColor: isHovered ? '#fff' : 'rgb(63, 63, 70)',
              boxShadow: isHovered ? "0 0 25px rgba(255,255,255,0.25)" : "0 0 0px rgba(255,255,255,0)"
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-black text-white/40">{String(firstId).padStart(2, '0')}</span>
            <span className="mx-2 text-zinc-600">—</span>
            <span className="font-black text-white/40">{String(lastId).padStart(2, '0')}</span>
          </motion.div>

          {/* Image count badge */}
          <motion.div
            className="absolute -top-4 right-6 px-3 py-1.5 border-2 border-zinc-700 bg-black text-xs z-10"
            animate={{
              borderColor: isHovered ? '#fff' : 'rgb(63, 63, 70)',
              boxShadow: isHovered ? "0 0 25px rgba(255,255,255,0.25)" : "0 0 0px rgba(255,255,255,0)"
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="tracking-wider uppercase text-white font-bold">{artworks.length} Images</span>
          </motion.div>

          <div className="mt-4">
            {/* Title */}
            <motion.h3
              className="text-2xl font-black text-white mb-3 tracking-wide"
              animate={{ x: isHovered ? 6 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {storyProject.title}
            </motion.h3>

            {/* Animated underline */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-white via-zinc-500 to-transparent mb-4"
              initial={{ scaleX: 0.15 }}
              animate={{ scaleX: isHovered ? 1 : 0.15 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{ transformOrigin: 'left' }}
            />

            {/* Meta info */}
            <div className="flex items-center gap-3">
              <span className="text-sm tracking-[0.15em] text-zinc-400 uppercase">{storyProject.medium}</span>
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
              <span className="text-sm text-zinc-500">{storyProject.year}</span>
            </div>

            {/* Description if available */}
            {storyProject.description && (
              <motion.p
                className="mt-4 text-zinc-400 italic text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{storyProject.description}"
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ArtworkCard({ artwork, onClick, index, isHovered, onHover, onLeave, fixedAspect }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  // Use fixed aspect ratio for uniform row heights
  // Portraits use 3:4, Landscapes use 16:9
  const aspectClass = fixedAspect === 'landscape' ? 'aspect-[16/9]' : 'aspect-[3/4]';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.4 + index * 0.1,
        duration: 0.8,
        ease: [0.6, 0.01, 0.05, 0.95]
      }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute -inset-4 bg-white/5 rounded-2xl blur-xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="relative border-2 overflow-hidden bg-black/50 backdrop-blur-sm cursor-pointer h-full"
        animate={{
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.5)' : 'rgb(39, 39, 42)'
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={onClick}
      >
        {/* Corner decorations */}
        <motion.div
          className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-white/20 z-20"
          animate={{ opacity: isHovered ? 0.8 : 0.2 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-white/20 z-20"
          animate={{ opacity: isHovered ? 0.8 : 0.2 }}
          transition={{ duration: 0.5 }}
        />

        {/* Image container with fixed aspect ratio for consistency */}
        <div className={`relative overflow-hidden ${aspectClass}`}>
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
          )}

          {/* Image */}
          <motion.img
            src={artwork.image}
            alt={artwork.title}
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
            animate={{ opacity: isHovered ? 0.9 : 0.5 }}
            transition={{ duration: 0.3 }}
          />

          {/* Timelapse badge */}
          {artwork.hasTimelapse && (
            <motion.div
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 border-2 border-zinc-700 bg-black/70 backdrop-blur-sm text-xs z-10"
              animate={{
                borderColor: isHovered ? '#fff' : 'rgb(63, 63, 70)',
                boxShadow: isHovered ? "0 0 20px rgba(255,255,255,0.2)" : "0 0 0px rgba(255,255,255,0)"
              }}
              transition={{ duration: 0.3 }}
            >
              <Play size={10} className="text-white" />
              <span className="tracking-wider uppercase text-white font-bold">Process</span>
            </motion.div>
          )}

          {/* Scan line effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={isHovered ? { top: ['0%', '100%'] } : { top: '0%' }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Project number - positioned inside image */}
          <motion.div
            className="absolute bottom-4 left-4 text-5xl font-black text-white/25 leading-none z-10"
            animate={{
              textShadow: isHovered
                ? "0px 0px 30px rgba(255,255,255,0.3)"
                : "0px 0px 0px rgba(255,255,255,0)",
              color: isHovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.25)"
            }}
            transition={{ duration: 0.4 }}
          >
            {String(artwork.id).padStart(2, '0')}
          </motion.div>
        </div>

        {/* Content section */}
        <div className="p-5 relative">
          {/* Title */}
          <motion.h3
            className="text-lg font-black text-white mb-2 tracking-wide"
            animate={{ x: isHovered ? 6 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {artwork.title}
          </motion.h3>

          {/* Animated underline */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-white via-zinc-500 to-transparent mb-3"
            initial={{ scaleX: 0.15 }}
            animate={{ scaleX: isHovered ? 1 : 0.15 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: 'left' }}
          />

          {/* Meta info */}
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-[0.15em] text-zinc-400 uppercase">{artwork.medium}</span>
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
            <span className="text-xs text-zinc-500">{artwork.year}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GallerySection() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  // Organize artworks for optimal layout
  // Regular artworks (not in a group)
  const regularArtworks = artworks.filter(a => !a.group);
  const portraits = regularArtworks.filter(a => a.aspectRatio <= 1);
  const landscapes = regularArtworks.filter(a => a.aspectRatio > 1);

  // Story project artworks (grouped together)
  const storyArtworks = artworks.filter(a => a.group === 'story');

  return (
    <section id="gallery" ref={sectionRef} className="pt-16 pb-32 px-6 bg-black relative overflow-hidden">
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
              05
            </motion.div>
            <div>
              <h2 className="text-sm tracking-[0.3em] text-zinc-300 uppercase mb-2 font-bold">Creative Work</h2>
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
            Beyond code — sketches and drawings that showcase attention to detail,
            patience, and a different kind of problem-solving.
          </motion.p>
        </motion.div>

        {/* Gallery Layout - Custom CSS Grid Masonry */}
        <div className="space-y-8">
          {/* Row 1: Three portraits side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portraits.slice(0, 3).map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                index={index}
                isHovered={hoveredIndex === artwork.id}
                onHover={() => setHoveredIndex(artwork.id)}
                onLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedArtwork(artwork)}
                fixedAspect="portrait"
              />
            ))}
          </div>

          {/* Row 2: Single landscape (art-4) full width */}
          {landscapes.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              <ArtworkCard
                key={landscapes[0].id}
                artwork={landscapes[0]}
                index={3}
                isHovered={hoveredIndex === landscapes[0].id}
                onHover={() => setHoveredIndex(landscapes[0].id)}
                onLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedArtwork(landscapes[0])}
                fixedAspect="landscape"
              />
            </div>
          )}

          {/* Row 3: Story Project - Combined card showing all story images */}
          {storyArtworks.length > 0 && (
            <StoryProjectCard
              artworks={storyArtworks}
              index={4}
              isHovered={hoveredIndex === 'story'}
              onHover={() => setHoveredIndex('story')}
              onLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedArtwork({
                id: 'story',
                title: storyProject.title,
                medium: storyProject.medium,
                year: storyProject.year,
                series: storyProject.series,
                exhibition: storyProject.exhibition,
                description: storyProject.description,
                images: storyArtworks.map(a => ({ src: a.image, id: a.id })),
                isStoryProject: true
              })}
            />
          )}

          {/* Row 4: Featured Latest Work - Horizontal spotlight layout */}
          <div ref={featuredRef}>
          {portraits.length > 3 && portraits.slice(3).map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 40 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05, duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="relative"
              onMouseEnter={() => setHoveredIndex(artwork.id)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background glow */}
              <motion.div
                className="absolute -inset-6 bg-white/5 rounded-3xl blur-2xl -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === artwork.id ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />

              <motion.div
                className="relative border-2 overflow-hidden bg-black/50 backdrop-blur-sm cursor-pointer"
                animate={{ borderColor: hoveredIndex === artwork.id ? 'rgba(255, 255, 255, 0.5)' : 'rgb(39, 39, 42)' }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedArtwork(artwork)}
              >
                {/* Corner decorations */}
                <motion.div
                  className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-white/20 z-20"
                  animate={{ opacity: hoveredIndex === artwork.id ? 0.8 : 0.2 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-white/20 z-20"
                  animate={{ opacity: hoveredIndex === artwork.id ? 0.8 : 0.2 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Horizontal layout: Image on left, content on right */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image side */}
                  <div className="relative aspect-[3/4] md:aspect-auto md:h-[450px] overflow-hidden">
                    <motion.img
                      src={artwork.image}
                      alt={artwork.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      animate={{ scale: hoveredIndex === artwork.id ? 1.05 : 1 }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:hidden" />

                    {/* Large number overlay */}
                    <motion.div
                      className="absolute bottom-6 left-6 text-8xl font-black text-white/25 leading-none"
                      animate={{
                        textShadow: hoveredIndex === artwork.id ? "0px 0px 30px rgba(255,255,255,0.3)" : "0px 0px 0px rgba(255,255,255,0)",
                        color: hoveredIndex === artwork.id ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.25)"
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {String(artwork.id).padStart(2, '0')}
                    </motion.div>

                    {/* Scan line effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none overflow-hidden"
                      animate={{ opacity: hoveredIndex === artwork.id ? 1 : 0 }}
                    >
                      <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={hoveredIndex === artwork.id ? { top: ['0%', '100%'] } : { top: '0%' }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>

                  {/* Content side */}
                  <div className="relative p-8 md:p-12 flex flex-col justify-center">
                    {/* "Latest" badge */}
                    <motion.div
                      className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-zinc-700 bg-black/70 text-xs mb-6 w-fit"
                      animate={{
                        borderColor: hoveredIndex === artwork.id ? '#fff' : 'rgb(63, 63, 70)',
                        boxShadow: hoveredIndex === artwork.id ? "0 0 20px rgba(255,255,255,0.2)" : "none"
                      }}
                    >
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="tracking-wider uppercase text-white font-bold">Latest Work</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      className="text-4xl md:text-5xl font-black text-white mb-4 tracking-wide"
                      animate={{ x: hoveredIndex === artwork.id ? 6 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {artwork.title}
                    </motion.h3>

                    {/* Animated underline */}
                    <motion.div
                      className="h-[2px] bg-gradient-to-r from-white via-zinc-500 to-transparent mb-6"
                      initial={{ scaleX: 0.15 }}
                      animate={{ scaleX: hoveredIndex === artwork.id ? 1 : 0.15 }}
                      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                      style={{ transformOrigin: 'left' }}
                    />

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-sm tracking-[0.15em] text-zinc-400 uppercase">{artwork.medium}</span>
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                      <span className="text-sm text-zinc-500">{artwork.year}</span>
                    </div>

                    {/* Description */}
                    {artwork.description && (
                      <motion.p
                        className="text-xl md:text-2xl text-zinc-400 italic leading-relaxed"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: hoveredIndex === artwork.id ? 1 : 0.7 }}
                      >
                        "{artwork.description}"
                      </motion.p>
                    )}

                    {/* View prompt */}
                    <motion.div
                      className="mt-8 flex items-center gap-3 text-zinc-500"
                      animate={{ opacity: hoveredIndex === artwork.id ? 1 : 0.5, x: hoveredIndex === artwork.id ? 4 : 0 }}
                    >
                      <span className="text-sm tracking-wider uppercase">Click to view</span>
                      <motion.span
                        animate={{ x: hoveredIndex === artwork.id ? [0, 6, 0] : 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-24"
        >
          {/* Decorative separator */}
          <motion.div
            className="relative h-px mb-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 1, duration: 1.5 }}
              style={{ width: '100%' }}
            />
          </motion.div>

          {/* Minimal inline stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              {
                value: regularArtworks.length + (storyArtworks.length > 0 ? 1 : 0),
                label: 'Projects'
              },
              {
                value: artworks.filter(a => a.hasTimelapse).length,
                label: 'Timelapses'
              },
              {
                value: artworks.length,
                label: 'Total Pieces'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
                className="flex items-baseline gap-3"
              >
                <motion.span
                  className="text-4xl md:text-5xl font-black"
                  initial={{ color: 'rgba(255,255,255,0.25)', textShadow: 'none' }}
                  animate={inView ? {
                    color: 'rgba(255,255,255,0.5)',
                    textShadow: '0 0 20px rgba(255,255,255,0.2)'
                  } : {}}
                  transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                >
                  {stat.value}
                </motion.span>
                <motion.span
                  className="text-sm tracking-[0.15em] uppercase"
                  initial={{ color: 'rgb(113, 113, 122)' }}
                  animate={inView ? { color: 'rgb(161, 161, 170)' } : {}}
                  transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                >
                  {stat.label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
