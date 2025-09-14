import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const Table = styled.table`
  min-width: 1200px;
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const Th = styled.th`
  padding: 10px;
  background: #2c73d2;
  color: #fff;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const Grid = ({ users, setOnEdit, setUsers }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este registro?")) {
      try {
        await axios.delete(`http://localhost:8800/${id}`);
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success("Registro excluído com sucesso!");
      } catch (err) {
        toast.error("Erro ao excluir registro");
      }
    }
  };

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>E-mail</Th>
            <Th>Telefone</Th>
            <Th>Data de Nascimento</Th>
            <Th>CPF</Th>
            <Th>Tipo de Pessoa</Th>
            <Th>Descrição do Endereço</Th>
            <Th>CEP</Th>
            <Th>Município/UF</Th>
            <Th>Rua</Th>
            <Th>Número</Th>
            <Th>Bairro</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Td>{user.nome}</Td>
              <Td>{user.email}</Td>
              <Td>{user.fone}</Td>
              <Td>{user.data_nascimento}</Td>
              <Td>{user.cpf}</Td>
              <Td>{user.tipo_pessoa}</Td>
              <Td>{user.endereco}</Td>
              <Td>{user.cep}</Td>
              <Td>{user.municipio}</Td>
              <Td>{user.rua}</Td>
              <Td>{user.numero}</Td>
              <Td>{user.bairro}</Td>
              <Td>
                <Button
                  style={{ background: "#2c73d2", color: "#fff" }}
                  onClick={() => setOnEdit(user)}
                >
                  Editar
                </Button>
                <Button
                  style={{ background: "#d32c2c", color: "#fff" }}
                  onClick={() => handleDelete(user.id)}
                >
                  Excluir
                </Button>
                <a
                  href={`https://wa.me/${user.fone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: 5,
                    fontSize: 20,
                    textDecoration: "none",
                  }}
                  title="Chamar no WhatsApp"
                >
                  🟢
                </a>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default Grid;
