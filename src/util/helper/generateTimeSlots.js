export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    const startHour = hour % 12 === 0 ? 12 : hour % 12;
    const endHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;

    const suffixStart = hour < 12 ? 'am' : 'pm';
    const suffixEnd = (hour + 1) < 12 ? 'am' : 'pm';

    const label = `${startHour}${suffixStart}-${endHour}${suffixEnd}`;
    slots.push({ label, value: label });
  }
  return slots;
};
