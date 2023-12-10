export function formatCPFToShow(cpf: string) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCPFToSave(cpf: string) {
  return cpf.replace(/\D/g, '');
}
