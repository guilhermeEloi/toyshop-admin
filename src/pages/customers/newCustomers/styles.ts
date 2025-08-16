import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#DDE5ED" : "#212121"};
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  margin: 20px;
  cursor: default;
  color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#0f0f0f" : "#E7E7E7"};
`;

export const ContainerBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12px;

  @media (max-width: 1024px) {
    justify-content: center;
    gap: 16px;
  }

  @media (max-width: 425px) {
    justify-content: center;
    gap: 16px;
  }
`;

export const ContainerForm = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  border-radius: 12px;
  background-color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#ffffff" : "#2A3244"};
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 1024px) {
    width: 80%;
  }

  @media (max-width: 425px) {
    width: 90%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  justify-content: space-between;
`;
