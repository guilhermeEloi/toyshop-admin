/* eslint-disable @typescript-eslint/no-explicit-any */
export type Client = {
  id: number;
  fullName: string;
  email: string;
  birthDate: string;
  sales: { date: string; value: number }[];
  missingLetter: string;
};

export function listClients(apiData: any): Client[] {
  return (
    apiData?.data?.clientes?.map((c: any) => {
      const id = c.info?.id;
      const fullName = c.info?.nomeCompleto || c.duplicado?.nomeCompleto || "";
      const email = c.info?.detalhes?.email || "";
      const birthDate = c.info?.detalhes?.nascimento || "";
      const sales =
        c.estatisticas?.vendas?.map((v: any) => ({
          date: v.data,
          value: Number(v.valor),
        })) || [];

      return {
        id,
        fullName,
        email,
        birthDate,
        sales,
        missingLetter: firstMissingLetter(fullName),
      };
    }) || []
  );
}

function firstMissingLetter(name: string): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const lettersInName = name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("");
  const missing = alphabet.find((l) => !lettersInName.includes(l));
  return missing || "-";
}
export const formatToDisplay = (value: string): string => {
  if (!value) return "";

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})\d+?$/, "$1");
};

export const formatISODate = (value: string): string => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  return value;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
