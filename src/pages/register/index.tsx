/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Input from "@/components/Input";
import CustomButton from "@/components/Button";

import { CircularProgress } from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";

import {
  Container,
  BodyContainer,
  FormContainer,
  Title,
  FieldsContainer,
  LoginButtonContainer,
  RegisterUserContainer,
  RegisterUser,
} from "./styles";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      setLoading(false);
      toast.error("Por favor, preencha os campos de usuário e senha!");
      return;
    }

    try {
      await register(username, password);
      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error(err.message);
      toast.error(err.message || "Erro ao realizar cadastro! Tente novamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BodyContainer>
        <FormContainer>
          <Title>Crie sua conta na Toy Shop Admin!</Title>
          <FieldsContainer>
            <Input
              label="Login"
              name="username"
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              label="Senha"
              name="password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <RegisterUserContainer>
              <RegisterUser onClick={() => navigate("/login")}>
                Já possui uma conta? Faça login
              </RegisterUser>
            </RegisterUserContainer>
          </FieldsContainer>
          <LoginButtonContainer>
            <CustomButton
              label={
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "CADASTRAR"
                )
              }
              type="button"
              variant="contained"
              style={{ minWidth: "120px" }}
              onClick={handleRegister}
              disabled={loading}
            />
          </LoginButtonContainer>
        </FormContainer>
      </BodyContainer>
    </Container>
  );
}
