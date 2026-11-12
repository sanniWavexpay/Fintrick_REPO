export const getImageUrl = (path) => {
  if (!path) return "";

  // already absolute url ho to direct return
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;

  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};