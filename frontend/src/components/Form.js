import React, { useEffect, useRef } from "react";

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
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit, onBack }) => {
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
      "endereco",
      "cep",
      "municipio",
      "rua",
      "numero",
      "bairro",
    ];

    for (let field of requiredFields) {
      if (!user[field].value) {
        return toast.warn("Preencha todos os campos!");
      }
    }

    const formData = {};
    requiredFields.forEach((field) => {
      formData[field] = user[field].value;
    });

    try {
      if (!onEdit) {
        const { data } = await axios.put(
          `http://localhost:8800/${onEdit.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(data);
      } else {
        const { data } = await axios.post("http://localhost:8800", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success(data);
      }

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
        <Label>Descrição do Endereço</Label>
        <Input name="endereco" />
      </InputArea>
      <InputArea>
        <Label>CEP</Label>
        <Input name="cep" />
      </InputArea>
      <InputArea>
        <Label>Município/UF</Label>
        <Input name="municipio" />
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

      <ButtonArea>
        <Button type="submit">SALVAR</Button>
        <Button
          type="button"
          style={{ marginLeft: 10, backgroundColor: "#888" }}
          onClick={onBack}
        >
          VOLTAR
        </Button>
      </ButtonArea>
    </FormContainer>
  );
};

export default Form;
