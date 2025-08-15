/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";

import NavBar from "@/components/NavBar";
import CustomButton from "@/components/Button";

import api from "@/services/index";
import { useAuth } from "@/contexts/AuthContext";

import { Container, ContainerBtn, PageTitle } from "./styles";
import { listClients, type Client } from "@/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    async function fetchCustomers() {
      if (!token) return;

      try {
        const { data } = await api.get("/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const clients: Client[] = listClients(data);

        setCustomers(clients);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [token]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const columns: GridColDef<Client>[] = [
    { field: "fullName", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    {
      field: "birthDate",
      headerName: "Nascimento",
      width: 150,
      valueGetter: (value) => formatDate(value),
    },
    {
      field: "totalSales",
      headerName: "Total de Vendas",
      width: 150,
      valueGetter: (_value: any, row: Client) =>
        row.sales?.reduce((sum, sale) => sum + Number(sale.value || 0), 0),
      valueFormatter: (value) => formatCurrency(value as number),
    },
    { field: "missingLetter", headerName: "Letra Faltante", width: 150 },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <NavBar />
      <PageTitle>Clientes</PageTitle>
      <ContainerBtn>
        <CustomButton
          label="NOVO CLIENTE"
          type="button"
          variant="contained"
          style={{ minWidth: "120px" }}
        />
      </ContainerBtn>
      <Box p={2}>
        <DataGrid
          rows={customers}
          columns={columns}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.email}
          autoHeight
        />
      </Box>
    </Container>
  );
}
