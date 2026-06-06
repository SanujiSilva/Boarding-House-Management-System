export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const monthLabel = (month) => {
  const value = Number(month);
  if (!value || value < 1 || value > 12) return "-";
  return `${value} - ${monthNames[value - 1]}`;
};

export const monthOptions = monthNames.map((name, index) => ({
  value: index + 1,
  label: `${index + 1} - ${name}`
}));

