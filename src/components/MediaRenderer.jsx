import React, { forwardRef } from 'react';
import { isVideoUrl } from '../utils/isVideoUrl';
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl';

const MediaRenderer = forwardRef(({ src, alt = '', className = '', style = {}, ...props }, ref) => {
  if (!src) return null;

  const optimizedSrc = optimizeCloudinaryUrl(src);
  const isVideo = isVideoUrl(src);

  // Auto-fit helper: default object-fit to cover if not explicitly provided
  const hasFit = className.includes('object-');
  const fitClass = hasFit ? className : `object-cover ${className}`.trim();

  if (isVideo) {
    return (
      <video
        ref={ref}
        src={optimizedSrc}
        autoPlay
        loop
        muted
        playsInline
        className={fitClass}
        style={{ objectFit: style.objectFit || 'cover', ...style }}
        {...props}
      />
    );
  }

  return (
    <img
      ref={ref}
      src={optimizedSrc}
      alt={alt}
      className={fitClass}
      style={{ objectFit: style.objectFit || 'cover', ...style }}
      {...props}
    />
  );
});

MediaRenderer.displayName = 'MediaRenderer';

export default MediaRenderer;
