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
  width: 95%;
  height: 10%;
  align-items: center;
  justify-content: end;
  padding: 12px;
`;
