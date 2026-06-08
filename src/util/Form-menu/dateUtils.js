
export const formatScheduleDate = (startDate, endDate) => {
  const start = startDate ? formatDate(startDate) : '';
  const end = endDate ? formatDate(endDate) : '';
  return start && end ? `${start} - ${end}` : '';
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
