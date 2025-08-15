/* eslint-disable @typescript-eslint/no-explicit-any */
export type Client = {
  fullName: string;
  email: string;
  birthDate: string;
  sales: { date: string; value: number }[];
  missingLetter: string;
};

export function listClients(apiData: any): Client[] {
  return (
    apiData?.data?.clientes?.map((c: any) => {
      const fullName = c.info?.nomeCompleto || c.duplicado?.nomeCompleto || "";
      const email = c.info?.detalhes?.email || "";
      const birthDate = c.info?.detalhes?.nascimento || "";
      const sales =
        c.estatisticas?.vendas?.map((v: any) => ({
          date: v.data,
          value: Number(v.valor),
        })) || [];

      return {
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
