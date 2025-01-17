// Image dimensions mapping for consistent sizing
export const imageDimensions = {
    hero: { width: 800, height: 600 },
    categoryIcon: { width: 56, height: 56 },
    suggestionThumbnail: { width: 32, height: 32 }
  };
  
  // Image formats and quality settings
  export const imageConfig = {
    formats: ['webp', 'jpeg'],
    quality: {
      webp: 85,
      jpeg: 80
    },
    sizes: {
      mobile: 640,
      tablet: 1024,
      desktop: 1920
    }
  };
  
  // Generate srcSet for responsive images
  export const generateSrcSet = (imagePath, format = 'webp') => {
    const { sizes } = imageConfig;
    return Object.values(sizes)
      .map(size => `${imagePath}?format=${format}&w=${size} ${size}w`)
      .join(', ');
  };