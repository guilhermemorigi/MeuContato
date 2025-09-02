import React, { useEffect, useRef } from "react";

import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 150px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      Object.keys(onEdit).forEach((key) => {
        if (user[key]) user[key].value = onEdit[key];
      });
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = ref.current;

    const requiredFields = [
      "nome",
      "email",
      "fone",
      "data_nascimento",
      "cpf",
      "tipo_pessoa",
      "descricao_endereco",
      "cep",
      "municipio_uf",
      "rua",
      "numero",
      "bairro",
    ];

    for (let field of requiredFields) {
      if (!user[field].value) {
        return toast.warn("Preencha todos os campos!");
      }
    }

    const userData = {};
    requiredFields.forEach((field) => {
      userData[field] = user[field].value;
    });

    try {
      if (onEdit) {
        const { data } = await axios.put(
          `http://localhost:8800/${onEdit.id}`,
          userData
        );
        toast.success(data);
      } else {
        const { data } = await axios.post("http://localhost:8800", userData);
        toast.success(data);
      }
      // Limpar campos
      requiredFields.forEach((field) => (user[field].value = ""));
      setOnEdit(null);
      getUsers();
    } catch (err) {
      toast.error(err.response?.data || "Erro ao salvar usuário");
    }
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" />
      </InputArea>
      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input name="data_nascimento" type="date" />
      </InputArea>
      <InputArea>
        <Label>CPF</Label>
        <Input name="cpf" />
      </InputArea>
      <InputArea>
        <Label>Tipo de Pessoa</Label>
        <Input name="tipo_pessoa" />
      </InputArea>
      <InputArea>
        <Label>Endereço</Label>
        <Input name="descricao_endereco" />
      </InputArea>
      <InputArea>
        <Label>CEP</Label>
        <Input name="cep" />
      </InputArea>
      <InputArea>
        <Label>Município/UF</Label>
        <Input name="municipio_uf" />
      </InputArea>
      <InputArea>
        <Label>Rua</Label>
        <Input name="rua" />
      </InputArea>
      <InputArea>
        <Label>Número</Label>
        <Input name="numero" />
      </InputArea>
      <InputArea>
        <Label>Bairro</Label>
        <Input name="bairro" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;
