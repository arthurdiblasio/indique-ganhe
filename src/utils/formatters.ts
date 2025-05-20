export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function formatMoney(value: string): string {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
