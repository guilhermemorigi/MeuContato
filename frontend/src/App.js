import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

import Form from "./components/Form.js";
import GlobalStyle from "./styles/global";
import Grid from "./components/Grid";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [filtro, setFiltro] = useState(""); // filtro de busca

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
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
              placeholder="Filtrar por descrição"
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
      <GlobalStyle />
    </>
  );
}

export default App;
