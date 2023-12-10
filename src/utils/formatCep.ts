export function formatCepToShow(cep: string) {
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

export function formatCepToSave(cep: string) {
  return cep.replace(/\D/g, '');
}
