export function getDateString(date: Date) {
  const year = date.getFullYear().toString().padStart(4);
  const month = (date.getMonth() + 1).toString().padStart(2);
  const day = date.getDate().toString().padStart(2);
  return `${year}-${month}-${day}`;
}
