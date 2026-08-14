import React from 'react';
import { isVideoUrl } from '../utils/isVideoUrl';
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl';

const MediaRenderer = ({ src, alt = '', className = '', ...props }) => {
  if (!src) return null;

  const optimizedSrc = optimizeCloudinaryUrl(src);

  if (isVideoUrl(src)) {
    return (
      <video
        src={optimizedSrc}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        {...props}
      />
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default MediaRenderer;
