import React from 'react';
import { isVideoUrl } from '../utils/isVideoUrl';

const MediaRenderer = ({ src, alt = '', className = '', ...props }) => {
  if (!src) return null;

  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
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
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default MediaRenderer;
