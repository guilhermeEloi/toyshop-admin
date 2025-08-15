import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Box, Card, CardContent, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";

import api from "@/services/index";
import { listClients, type Client } from "@/utils/index";
import { useAuth } from "@/contexts/AuthContext";

import { Container, PageTitle } from "./styles";

export default function Dashboard() {
  const [graphicData, setGraphicData] = useState<
    { date: string; total: number }[]
  >([]);
  const [highlights, setHighlights] = useState<{
    largestVolume?: string;
    largestAverage?: string;
    largestFrequency?: string;
  }>({});

  const { token } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;

      const { data } = await api.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clients: Client[] = listClients(data);

      const salesPerDay: Record<string, number> = {};

      clients.forEach((client) =>
        (client.sales ?? []).forEach((sale) => {
          salesPerDay[sale.date] = (salesPerDay[sale.date] || 0) + sale.value;
        })
      );

      const graph = Object.entries(salesPerDay)
        .sort(
          ([dateA], [dateB]) =>
            new Date(dateA).getTime() - new Date(dateB).getTime()
        )
        .map(([date, total]) => ({ date, total }));

      const largestVolume = [...clients].sort(
        (a, b) =>
          (b.sales ?? []).reduce((sum, v) => sum + v.value, 0) -
          (a.sales ?? []).reduce((sum, v) => sum + v.value, 0)
      )[0];

      const largestAverage = [...clients].sort(
        (a, b) =>
          (b.sales ?? []).reduce((sum, v) => sum + v.value, 0) /
            ((b.sales ?? []).length || 1) -
          (a.sales ?? []).reduce((sum, v) => sum + v.value, 0) /
            ((a.sales ?? []).length || 1)
      )[0];

      const largestFrequency = [...clients].sort(
        (a, b) => (b.sales ?? []).length - (a.sales ?? []).length
      )[0];

      setGraphicData(graph);
      setHighlights({
        largestVolume: largestVolume?.fullName,
        largestAverage: largestAverage?.fullName,
        largestFrequency: largestFrequency?.fullName,
      });
    }

    fetchStats();
  }, [token]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Container>
      <NavBar />
      <PageTitle>Dashboard</PageTitle>

      <Box display="flex" gap={2} mt={2} sx={{ marginBottom: 10 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Maior Volume</Typography>
            <Typography>{highlights.largestVolume || "-"}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Maior Média</Typography>
            <Typography>{highlights.largestAverage || "-"}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Maior Frequência</Typography>
            <Typography>{highlights.largestFrequency || "-"}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <ResponsiveContainer width="80%" height={300}>
          <BarChart
            data={graphicData}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Bar dataKey="total" fill="#1976d2" barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
}
