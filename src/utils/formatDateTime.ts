export function formatDate(date: string) {
  const chuncks = date.split('-');
  if (chuncks.length === 3) {
    const day = chuncks[2];
    const month = chuncks[1];
    const year = chuncks[0];
    return `${day}/${month}/${year}`;
  } else {
    return 'Data inválida';
  }
}

export function formatDateFromOriginal(originalDate: string) {
  const date = new Date(originalDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses são indexados de 0 a 11
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatHour(hour: string) {
  const parts = hour.split(':');
  if (parts.length === 3) {
    const hours = parts[0];
    const minutes = parts[1];
    return `${hours}h${minutes}`;
  } else {
    return hour;
  }
}
