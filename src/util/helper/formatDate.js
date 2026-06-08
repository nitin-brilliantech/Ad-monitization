// formatDate.js or inside your component
export const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString(undefined, {
    day: '2-digit',
    month: 'long',    // "July"
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true      // 12-hour clock (AM/PM)
  });
};
