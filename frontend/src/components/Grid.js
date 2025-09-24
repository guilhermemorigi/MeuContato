import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

// Função utilitária para formatar telefone brasileiro
function formatPhone(value) {
  if (!value) return "";
  const onlyNums = value.replace(/\D/g, "");
  if (onlyNums.length === 11) {
    // (99) 99999-9999
    return onlyNums.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (onlyNums.length === 10) {
    // (99) 9999-9999
    return onlyNums.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return value;
}

// Função utilitária para formatar CPF e CNPJ
function formatCpfCnpj(value) {
  if (!value) return "";
  const onlyNums = value.replace(/\D/g, "");
  if (onlyNums.length === 11) {
    return onlyNums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (onlyNums.length === 14) {
    return onlyNums.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return value;
}

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
  background: #f8faff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(44, 62, 80, 0.1);
  padding: 18px 8px 8px 8px;
`;

const Table = styled.table`
  min-width: 1200px;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 7px 10px; /* altura reduzida */
  background: #0097e6; /* azul sólido, sem gradiente esverdeado */
  color: #fff;
  font-size: 0.95rem; /* levemente menor */
  font-weight: 600;
  border-right: 1px solid #e0eafc;
  white-space: nowrap; /* força uma linha só */
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  &:last-child {
    border-right: none;
  }
`;

const Td = styled.td`
  padding: 12px 10px;
  border-bottom: 1px solid #f1f2f6;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.98rem;
`;

const Button = styled.button`
  padding: 7px 16px;
  margin-right: 6px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.97rem;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(44, 62, 80, 0.07);
  transition: background 0.2s, transform 0.15s;
  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px) scale(1.04);
  }
`;

const Grid = ({ users, setOnEdit, setUsers }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este registro?")) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "/";
        await axios.delete(`${apiUrl}${id}`);
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
            <Th>CPF/CNPJ</Th>
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
              <Td>{formatPhone(user.fone)}</Td>
              <Td>{user.data_nascimento}</Td>
              <Td>{formatCpfCnpj(user.cpf)}</Td>
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
                  href={`https://wa.me/55${
                    user.fone ? user.fone.replace(/\D/g, "") : ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: 5,
                    fontSize: 20,
                    textDecoration: "none",
                  }}
                  title="Chamar no WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 0 1-4.988-1.357l-.358-.213-3.717.982.993-3.627-.233-.373A9.86 9.86 0 0 1 0 11.974C0 5.364 5.373 0 12 0c3.192 0 6.188 1.244 8.438 3.504A11.822 11.822 0 0 1 24 11.974c0 6.627-5.373 12.025-12 12.025zm10.477-12.025c-.013-2.243-.729-4.366-2.077-6.155C15.925 1.527 12.13.272 8.608 2.021 5.085 3.77 2.929 7.3 3.001 11.025c.072 3.725 2.34 7.13 5.863 8.879.813.406 1.626.688 2.505.825.84.13 1.66.112 2.465-.054.797-.165 1.56-.463 2.292-.888l.363-.217 2.188.583-.586-2.127.235-.374c.522-.832.922-1.73 1.183-2.67.26-.94.386-1.917.37-2.91z"
                        fill="#25D366"
                      ></path>
                      <path
                        d="M20.52 3.823C18.27 1.563 15.274.319 12.082.319 5.455.319.082 5.684.082 12.293c0 2.162.57 4.263 1.652 6.1l-1.09 3.98a.5.5 0 0 0 .61.61l4.09-1.08a11.87 11.87 0 0 0 5.738 1.563c6.627 0 12-5.365 12-11.974 0-2.162-.57-4.263-1.652-6.1zm-8.438 17.176a9.87 9.87 0 0 1-4.988-1.357l-.358-.213-3.717.982.993-3.627-.233-.373A9.86 9.86 0 0 1 0 11.974C0 5.364 5.373 0 12 0c3.192 0 6.188 1.244 8.438 3.504A11.822 11.822 0 0 1 24 11.974c0 6.627-5.373 12.025-12 12.025zm10.477-12.025c-.013-2.243-.729-4.366-2.077-6.155C15.925 1.527 12.13.272 8.608 2.021 5.085 3.77 2.929 7.3 3.001 11.025c.072 3.725 2.34 7.13 5.863 8.879.813.406 1.626.688 2.505.825.84.13 1.66.112 2.465-.054.797-.165 1.56-.463 2.292-.888l.363-.217 2.188.583-.586-2.127.235-.374c.522-.832.922-1.73 1.183-2.67.26-.94.386-1.917.37-2.91z"
                        fill="#25D366"
                        fill-opacity=".2"
                      ></path>
                    </g>
                  </svg>
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
