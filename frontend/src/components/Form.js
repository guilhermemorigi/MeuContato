import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  background: #f8faff;
  padding: 36px 28px 28px 28px;
  box-shadow: 0 2px 16px rgba(44, 62, 80, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 18px auto;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0 12px;
  border: 1.5px solid #dcdde1;
  border-radius: 8px;
  height: 42px;
  box-sizing: border-box;
  background: #fff;
  font-size: 1rem;
  color: #353b48;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #0097e6;
    outline: none;
    box-shadow: 0 0 6px rgba(0, 151, 230, 0.18);
  }
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #0097e6;
`;

const ButtonArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  grid-column: 1 / -1;
  margin-top: 18px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #0097e6 60%, #00b894 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  height: 44px;
  box-shadow: 0 1px 4px rgba(44, 62, 80, 0.07);
  transition: background 0.3s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #40739e 60%, #00b894 100%);
    transform: translateY(-1px) scale(1.04);
  }
`;

const Form = ({ getUsers, onEdit, setOnEdit, onBack }) => {
  const [formData, setFormData] = useState({});
  const [cpfCnpjLabel, setCpfCnpjLabel] = useState("CPF/CNPJ");
  // Atualiza label e limpa campo ao trocar tipo de pessoa
  useEffect(() => {
    if (formData.tipo_pessoa === "Física") {
      setCpfCnpjLabel("CPF");
      setFormData((prev) => ({
        ...prev,
        cpf: prev.cpf ? prev.cpf.replace(/\D/g, "").slice(0, 11) : "",
      }));
    } else if (formData.tipo_pessoa === "Jurídica") {
      setCpfCnpjLabel("CNPJ");
      setFormData((prev) => ({
        ...prev,
        cpf: prev.cpf ? prev.cpf.replace(/\D/g, "").slice(0, 14) : "",
      }));
    } else {
      setCpfCnpjLabel("CPF/CNPJ");
    }
  }, [formData.tipo_pessoa]);

  useEffect(() => {
    if (onEdit) {
      const editData = { ...onEdit };
      if (editData.data_nascimento) {
        // Se vier no formato dd/MM/yyyy, converte para yyyy-MM-dd
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(editData.data_nascimento)) {
          const [dia, mes, ano] = editData.data_nascimento.split("/");
          editData.data_nascimento = `${ano}-${mes}-${dia}`;
        } else {
          // Se já for ISO ou Date, mantém o tratamento anterior
          const date = new Date(editData.data_nascimento);
          if (!isNaN(date)) {
            editData.data_nascimento = date.toISOString().slice(0, 10);
          }
        }
      }
      setFormData(editData);
    }
  }, [onEdit]);

  // Função para formatar telefone brasileiro (com DDD)
  const formatPhone = (value) => {
    // Remove tudo que não for dígito
    value = value.replace(/\D/g, "");
    // Formato (99) 99999-9999 ou (99) 9999-9999
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      value = value.replace(/(\d{0,2})/, "($1");
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fone") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCpfCnpjChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (formData.tipo_pessoa === "Jurídica") {
      // Formata como CNPJ: 00.000.000/0000-00
      value = value.replace(/(\d{2})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1/$2");
      value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
      if (value.length > 18) value = value.slice(0, 18);
    } else {
      // Formata como CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      if (value.length > 14) value = value.slice(0, 14);
    }
    setFormData({ ...formData, cpf: value });
  };

  const handleCepChange = (e) => {
    let value = e.target.value;
    // Remove tudo que não for dígito
    value = value.replace(/\D/g, "");
    // Adiciona a formatação #####-###
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    // Limita o tamanho máximo
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    setFormData({ ...formData, cep: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "nome",
      "email",
      "fone",
      "data_nascimento",
      "cpf",
      "tipo_pessoa",
      "endereco",
      "cep",
      "municipio",
      "rua",
      "numero",
      "bairro",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        return toast.warn("Preencha todos os campos!");
      }
    }

    try {
      if (onEdit && onEdit.id) {
        const { data } = await axios.put(
          `https://meucontato.onrender.com/${onEdit.id}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success(data);
      } else {
        const { data } = await axios.post(
          "https://meucontato.onrender.com",
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success(data);
      }

      setFormData({}); // Limpa o formulário após o sucesso
      setOnEdit(null);
      getUsers();
    } catch (err) {
      toast.error(err.response?.data || "Erro ao salvar usuário");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input
          name="nome"
          maxLength="100"
          value={formData.nome || ""}
          onChange={handleChange}
        />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input
          name="email"
          type="email"
          maxLength="100"
          value={formData.email || ""}
          onChange={handleChange}
        />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <InputMask
          mask="(99) 99999-9999"
          value={formData.fone || ""}
          onChange={handleChange}
        >
          {(inputProps) => <Input {...inputProps} name="fone" />}
        </InputMask>
      </InputArea>
      <InputArea>
        <Label>{cpfCnpjLabel}</Label>
        <InputMask
          mask={
            cpfCnpjLabel === "CNPJ" ? "99.999.999/9999-99" : "999.999.999-99"
          }
          value={formData.cpf || ""}
          onChange={handleCpfCnpjChange}
        >
          {(inputProps) => (
            <Input
              {...inputProps}
              name="cpf"
              placeholder={
                cpfCnpjLabel === "CNPJ"
                  ? "00.000.000/0000-00"
                  : "000.000.000-00"
              }
              maxLength={cpfCnpjLabel === "CNPJ" ? 18 : 14}
            />
          )}
        </InputMask>
      </InputArea>
      <InputArea>
        <Label>Tipo de Pessoa</Label>
        <select
          name="tipo_pessoa"
          value={formData.tipo_pessoa || ""}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "0 10px",
            border: "1px solid #bbb",
            borderRadius: "5px",
            height: "40px",
            boxSizing: "border-box",
          }}
        >
          <option value="">Selecione...</option>
          <option value="Física">Física</option>
          <option value="Jurídica">Jurídica</option>
        </select>
      </InputArea>
      <InputArea>
        <Label>Descrição do Endereço</Label>
        <Input
          name="endereco"
          maxLength="100"
          value={formData.endereco || ""}
          onChange={handleChange}
        />
      </InputArea>
      <InputArea>
        <Label>CEP</Label>
        {/* ALTERAÇÃO 4: Usar o onChange e value específicos para CEP */}
        <Input
          name="cep"
          value={formData.cep || ""}
          onChange={handleCepChange}
        />
      </InputArea>
      <InputArea>
        <Label>Município/UF</Label>
        <Input
          name="municipio"
          maxLength="100"
          value={formData.municipio || ""}
          onChange={handleChange}
        />
      </InputArea>
      <InputArea>
        <Label>Rua</Label>
        <Input
          name="rua"
          maxLength="100"
          value={formData.rua || ""}
          onChange={handleChange}
        />
      </InputArea>
      <InputArea>
        <Label>Número</Label>
        <Input
          name="numero"
          maxLength="10"
          value={formData.numero || ""}
          onChange={handleChange}
        />
      </InputArea>
      <InputArea>
        <Label>Bairro</Label>
        <Input
          name="bairro"
          maxLength="100"
          value={formData.bairro || ""}
          onChange={handleChange}
        />
      </InputArea>

      <ButtonArea>
        <InputArea>
          <Button type="submit">SALVAR</Button>
        </InputArea>
        <InputArea>
          <Button
            type="button"
            style={{ backgroundColor: "#888" }}
            onClick={onBack}
          >
            VOLTAR
          </Button>
        </InputArea>
      </ButtonArea>
    </FormContainer>
  );
};

export default Form;
