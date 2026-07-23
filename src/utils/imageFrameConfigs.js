export const imageFrameConfigs = {
  heroPhoto: {
    label: 'Hero Photo',
    aspectRatio: 3 / 4, // Although the UI preview might use 21/9 for wide, user requested 3/4 based on their prompt. I will keep what user provided.
    outputWidth: 900,
    outputHeight: 1200,
  },
  welcomeImage: {
    label: 'Welcome Image',
    aspectRatio: 800 / 900,
    outputWidth: 800,
    outputHeight: 900,
  },
  introImageTall: {
    label: 'Introduction — Tall Image',
    aspectRatio: 600 / 800,
    outputWidth: 600,
    outputHeight: 800,
  },
  introImageShort: {
    label: 'Introduction — Short Image',
    aspectRatio: 600 / 500,
    outputWidth: 600,
    outputHeight: 500,
  },
  aboutImage: {
    label: 'About Me Image',
    aspectRatio: 800 / 1000,
    outputWidth: 800,
    outputHeight: 1000,
  },
  educationBanner: {
    label: 'Education Banner',
    aspectRatio: 1200 / 500,
    outputWidth: 1200,
    outputHeight: 500,
  },
  experienceImage: {
    label: 'Work Experience Image',
    aspectRatio: 700 / 500,
    outputWidth: 700,
    outputHeight: 500,
  },
  projectCover: {
    label: 'Project Cover Image',
    aspectRatio: 900 / 1100,
    outputWidth: 900,
    outputHeight: 1100,
  },
  projectGallery: {
    label: 'Project Gallery Image',
    aspectRatio: 700 / 500,
    outputWidth: 700,
    outputHeight: 500,
  },
  latestProjectMain: {
    label: 'Latest Project — Main Image',
    aspectRatio: 700 / 900,
    outputWidth: 700,
    outputHeight: 900,
  },
  latestProjectSub: {
    label: 'Latest Project — Sub Image',
    aspectRatio: 500 / 500,
    outputWidth: 500,
    outputHeight: 500,
  },
  contactImage: {
    label: 'Contact Image',
    aspectRatio: 900 / 1100,
    outputWidth: 900,
    outputHeight: 1100,
  },
  thankYouImage: {
    label: 'Thank You Image',
    aspectRatio: 900 / 1100,
    outputWidth: 900,
    outputHeight: 1100,
  },
  slideshowImage: {
    label: 'Visual Gallery Slideshow',
    aspectRatio: 16 / 9,
    outputWidth: 1920,
    outputHeight: 1080,
  }
};
