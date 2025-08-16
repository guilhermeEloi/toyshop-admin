/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import NavBar from "@/components/NavBar";
import CustomButton from "@/components/Button";
import Input from "@/components/Input";

import api from "@/services/index";
import { useAuth } from "@/contexts/AuthContext";
import { formatISODate, formatToDisplay, isValidEmail } from "@/utils";

import {
  Container,
  ContainerBtn,
  ContainerForm,
  Form,
  PageTitle,
} from "./styles";

export default function RegisterCustomerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
  });
  const [emailInputError, setEmailInputError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailInputError(false);

    if (name === "birthdate") {
      setFormData((prev) => ({ ...prev, [name]: formatToDisplay(value) }));
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

    if (formData.email && !isValidEmail(formData.email)) {
      setEmailInputError(true);
      toast.error("Email inválido");
      return;
    }

    try {
      setLoading(true);
      await api.post(
        "/customers",
        {
          name: formData.name,
          email: formData.email,
          birthdate: formatISODate(formData.birthdate),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Cliente cadastrado com sucesso!");
      navigate("/customers");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao cadastrar cliente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <NavBar />
      <PageTitle>Cadastrar Cliente</PageTitle>
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
              error={emailInputError}
              helperText={emailInputError ? "E-mail inválido" : null}
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
                style={{ minWidth: "120px" }}
              />
            </ContainerBtn>
          </Form>
        </ContainerForm>
      </div>
    </Container>
  );
}
