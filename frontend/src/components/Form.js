import React, { useEffect, useRef } from "react";

import { FiCamera } from "react-icons/fi";
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

const PhotoUpload = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const PhotoInput = styled.input`
  display: none;
`;

const PhotoLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100px;
  height: 100px;
  background-color: #eee;
  border-radius: 50%;
  font-size: 30px;
  color: #555;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ddd;
  }
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();
  const fileRef = useRef();

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

    const formData = new FormData();
    requiredFields.forEach((field) =>
      formData.append(field, user[field].value)
    );

    if (fileRef.current.files[0]) {
      formData.append("foto", fileRef.current.files[0]);
    }

    try {
      if (onEdit) {
        const { data } = await axios.put(
          `http://localhost:8800/${onEdit.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(data);
      } else {
        const { data } = await axios.post("http://localhost:8800", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(data);
      }

      requiredFields.forEach((field) => (user[field].value = ""));
      fileRef.current.value = null;

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
      <PhotoUpload>
        <PhotoInput
          type="file"
          id="foto"
          ref={fileRef}
          name="foto"
          accept="image/*"
        />
        <PhotoLabel htmlFor="foto">
          <FiCamera />
        </PhotoLabel>
        <span>Adicionar Foto</span>
      </PhotoUpload>

      <ButtonArea>
        <Button type="submit">SALVAR</Button>
      </ButtonArea>
    </FormContainer>
  );
};

export default Form;
