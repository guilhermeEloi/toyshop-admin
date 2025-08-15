import styled from "styled-components";
import bg from "@/assets/backgroundLogin.jpg";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow-x: hidden;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
`;

export const BodyContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.label`
  font-size: 18px;
  margin-bottom: 6px;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  height: 45%;
  align-items: center;
  justify-content: space-evenly;
  background-color: #dde5ed;
  border-radius: 10px;
  padding: 10px;

  @media (max-width: 768px) {
    width: 70%;
  }

  @media (max-width: 425px) {
    width: 90%;
  }
`;

export const FieldsContainer = styled.div`
  width: 45%;
  margin-bottom: 16px;

  @media (max-width: 1440px) {
    width: 70%;
  }

  @media (max-width: 768px) {
    width: 70%;
  }

  @media (max-width: 425px) {
    width: 90%;
  }
`;

export const RegisterUserContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
`;

export const RegisterUser = styled.label`
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

export const LoginButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;
