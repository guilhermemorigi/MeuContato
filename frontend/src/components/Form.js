import React, { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  background-color: #fff;
  padding: 40px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;

  width: 100%;
  max-width: 2000px;
  margin: 20px auto;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
  box-sizing: border-box;
`;

const Label = styled.label``;

const ButtonArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  grid-column: 1 / -1;
  margin-top: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit, onBack }) => {
  const [formData, setFormData] = useState({});
  const [cpfCnpjLabel, setCpfCnpjLabel] = useState("CPF/CNPJ");
  // Atualiza label e limpa campo ao trocar tipo de pessoa
  useEffect(() => {
    if (formData.tipo_pessoa === "Física") {
      setCpfCnpjLabel("CPF");
      setFormData((prev) => ({ ...prev, cpf: prev.cpf ? prev.cpf.replace(/\D/g, '').slice(0, 11) : "" }));
    } else if (formData.tipo_pessoa === "Jurídica") {
      setCpfCnpjLabel("CNPJ");
      setFormData((prev) => ({ ...prev, cpf: prev.cpf ? prev.cpf.replace(/\D/g, '').slice(0, 14) : "" }));
    } else {
      setCpfCnpjLabel("CPF/CNPJ");
    }
  }, [formData.tipo_pessoa]);

  useEffect(() => {
    if (onEdit) {
      const editData = { ...onEdit };
      if (editData.data_nascimento) {
        const date = new Date(editData.data_nascimento);
        if (!isNaN(date)) {
          editData.data_nascimento = date.toISOString().slice(0, 10);
        }
      }
      setFormData(editData);
    }
  }, [onEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          `http://localhost:8800/${onEdit.id}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success(data);
      } else {
        const { data } = await axios.post("http://localhost:8800", formData, {
          headers: { "Content-Type": "application/json" },
        });
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
        <Input name="nome" maxLength="100" value={formData.nome || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" maxLength="100" value={formData.email || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" maxLength="15" value={formData.fone || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input name="data_nascimento" type="date" value={formData.data_nascimento || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>{cpfCnpjLabel}</Label>
        <Input
          name="cpf"
          value={formData.cpf || ""}
          onChange={handleCpfCnpjChange}
          placeholder={cpfCnpjLabel === "CNPJ" ? "00.000.000/0000-00" : "000.000.000-00"}
          maxLength={cpfCnpjLabel === "CNPJ" ? 18 : 14}
        />
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
        <Input name="endereco" maxLength="100" value={formData.endereco || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>CEP</Label>
        {/* ALTERAÇÃO 4: Usar o onChange e value específicos para CEP */}
        <Input name="cep" value={formData.cep || ""} onChange={handleCepChange} />
      </InputArea>
      <InputArea>
        <Label>Município/UF</Label>
        <Input name="municipio" maxLength="100" value={formData.municipio || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>Rua</Label>
        <Input name="rua" maxLength="100" value={formData.rua || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>Número</Label>
        <Input name="numero" maxLength="10" value={formData.numero || ""} onChange={handleChange} />
      </InputArea>
      <InputArea>
        <Label>Bairro</Label>
        <Input name="bairro" maxLength="100" value={formData.bairro || ""} onChange={handleChange} />
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