export function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('data:video/') ||
    lower.includes('/video/upload/') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.m4v') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?')
  );
}
