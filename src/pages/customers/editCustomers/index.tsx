/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import NavBar from "@/components/NavBar";
import CustomButton from "@/components/Button";
import Input from "@/components/Input";

import api from "@/services/index";
import { formatISODate, formatToDisplay } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";

import {
  Container,
  ContainerBtn,
  ContainerForm,
  Form,
  PageTitle,
} from "./styles";

export default function EditCustomerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
  });
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          birthdate: formatToDisplay(response.data.birthdate),
        });
      } catch (error: any) {
        console.error(error);
        toast.error("Erro ao carregar cliente!");
        navigate("/customers");
      }
    };

    if (id) fetchCustomer();
  }, [id, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "birthdate") {
      setFormData((prev) => ({
        ...prev,
        birthdate: formatToDisplay(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.birthdate) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);
      await api.patch(
        `/customers/${id}`,
        {
          name: formData.name,
          email: formData.email,
          birthdate: formatISODate(formData.birthdate),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Cliente atualizado com sucesso!");
      navigate("/customers");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao atualizar cliente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <NavBar />
      <PageTitle>Editar Cliente</PageTitle>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ContainerForm>
          <Form onSubmit={handleSubmit}>
            <Input
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <Input
              label="E-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              type="email"
              required
            />
            <Input
              label="Data de Nascimento"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              variant="outlined"
              required
            />

            <ContainerBtn>
              <CustomButton
                label="CANCELAR"
                type="button"
                variant="contained"
                style={{ minWidth: "120px", backgroundColor: "#f44336" }}
                onClick={() => navigate("/customers")}
              />
              <CustomButton
                type="submit"
                variant="contained"
                label={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "SALVAR"
                  )
                }
                disabled={loading}
                style={{ minWidth: "180px" }}
              />
            </ContainerBtn>
          </Form>
        </ContainerForm>
      </div>
    </Container>
  );
}
