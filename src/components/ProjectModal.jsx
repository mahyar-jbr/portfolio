import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function ProjectModal({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const images = project.images || (project.image ? [project.image] : []);
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="float-right text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-sm text-zinc-500 mb-2">{project.tech}</div>
          <h2 className="text-3xl font-bold">{project.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">About</h3>
            <p className="text-zinc-400 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="flex gap-3 text-zinc-400">
                    <span className="text-white mt-1">→</span>
                    <span className="leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project images gallery */}
          {images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Screenshots</h3>
              <div className="relative bg-zinc-900 rounded-lg mb-4 overflow-hidden border border-zinc-800 group">
                <img
                  src={images[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-auto object-contain"
                />

                {/* Navigation arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.tech && project.tech.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                View Project
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-medium hover:border-zinc-700 transition-colors"
              >
                <Github className="w-5 h-5" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
