import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

import Form from "./components/Form.js";
import "./styles/global";
import Grid from "./components/Grid";
import axios from "axios";
import styled from "styled-components";

const Header = styled.header`
  width: 100vw;
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #0097e6;
  margin-left: 32px;
  letter-spacing: 1px;
  font-family: 'Poppins', sans-serif;
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 100px auto 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.10);
  padding: 32px 24px 40px 24px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #353b48;
  margin-bottom: 12px;
`;

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [filtro, setFiltro] = useState(""); // filtro de busca

  const getUsers = async () => {
    try {
  const res = await axios.get("https://meucontato.onrender.com");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header>
        <Logo>MeuContato</Logo>
      </Header>
      <Container>
        <Title>Cadastro de pessoas</Title>
        {/* Se estiver editando ou criando, mostra o Form, senão mostra a Grid */}
        {onEdit !== null ? (
          <Form
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            getUsers={getUsers}
            onBack={() => setOnEdit(null)} // botão voltar
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Filtrar por nome"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              style={{ width: "100%", maxWidth: 400, marginBottom: 10 }}
            />
            <Grid
              users={users.filter(user =>
                user.nome?.toLowerCase().includes(filtro.toLowerCase())
              )}
              setUsers={setUsers}
              setOnEdit={setOnEdit}
            />
            <button onClick={() => setOnEdit({})}>Novo Usuário</button>
          </>
        )}
      </Container>
      <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
  {/* Estilos globais já aplicados via importação direta */}
    </>
  );
}

export default App;