/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import {
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import NavBar from "@/components/NavBar";
import CustomButton from "@/components/Button";

import api from "@/services/index";
import { useAuth } from "@/contexts/AuthContext";

import { Container, ContainerBtn, PageTitle } from "./styles";
import {
  formatCurrency,
  formatToDisplay,
  listClients,
  type Client,
} from "@/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { token } = useAuth();
  const navigate = useNavigate();

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

  const handleEdit = (client: Client) => {
    navigate(`/customers/edit/${client.id}`);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;

    try {
      await api.delete(`/customers/${selectedClient.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers((prev) => prev.filter((c) => c.id !== selectedClient.id));
      toast.success("Cliente excluído com sucesso!");
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteOpen(false);
      setSelectedClient(null);
    }
  };

  const columns: GridColDef<Client>[] = [
    { field: "fullName", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    {
      field: "birthDate",
      headerName: "Nascimento",
      width: 150,
      valueGetter: (value) => formatToDisplay(value),
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
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Client>) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
            size="small"
          >
            <Delete fontSize="inherit" />
          </IconButton>
        </Box>
      ),
    },
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
          onClick={() => navigate("/customers/new")}
        />
      </ContainerBtn>
      <Box p={2}>
        <DataGrid
          rows={customers}
          columns={columns}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.id}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o cliente{" "}
            <b>{selectedClient?.fullName}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteOpen(false)}
            color="inherit"
            variant="contained"
          >
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
