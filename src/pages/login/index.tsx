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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      setLoading(false);
      toast.error("Por favor, preencha os campos de usuário e/ou senha!");
      return;
    }

    try {
      await login(username, password);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (err: any) {
      console.error(err.message);
      toast.error(err.message || "Erro ao realizar login! Tente novamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BodyContainer>
        <FormContainer>
          <Title>Olá! Bem-vindo a Toy Shop Admin!</Title>
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
              <RegisterUser onClick={() => navigate("/register")}>
                Ainda não tem um cadastro? Registre-se agora
              </RegisterUser>
            </RegisterUserContainer>
          </FieldsContainer>
          <LoginButtonContainer>
            <CustomButton
              label={
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "ENTRAR"
                )
              }
              type="button"
              variant="contained"
              style={{ minWidth: "120px" }}
              onClick={handleLogin}
              disabled={loading}
            />
          </LoginButtonContainer>
        </FormContainer>
      </BodyContainer>
    </Container>
  );
}
