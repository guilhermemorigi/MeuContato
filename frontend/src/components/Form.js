import React, { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

// --- Definições de Cores (Padrão Gemini/Material Design) ---
const COLORS = {
    primary: "#1A73E8", // Azul principal do Google/Gemini
    primaryDark: "#185abc",
    text: "#3c4043", // Cinza escuro para texto
    label: "#5f6368", // Cinza para labels
    border: "#dadce0", // Borda sutil
    background: "#ffffff",
    hoverLight: "#f1f3f4", // Cinza claro para hover secundário
};

// --- Styled Components (Com Visual Gemini/Google) ---

const FormWrapper = styled.div`
    width: 100%;
    /* Mantenho uma largura razoável para formulários de duas colunas */
    max-width: 750px; 
    margin: 0 auto;
    padding: 20px;
`;

const FormContainer = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 25px;
    
    /* MUDANÇA: Fundo branco e box-shadow mais sutil e elevado */
    background: ${COLORS.background}; 
    padding: 36px 28px 28px 28px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
    border-radius: 12px;
    width: 100%;
    margin-bottom: 18px;

    @media (max-width: 650px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column; 
    width: 100%;
`;

const Input = styled.input`
    width: 100%;
    /* Ajuste de padding para controlar a altura do campo */
    padding: 10px 12px; 
    
    /* MUDANÇA: Borda mais clara e sutil */
    border: 1px solid ${COLORS.border}; 
    border-radius: 6px;
    box-sizing: border-box;
    background: #fff;
    font-size: 1rem;
    color: ${COLORS.text};
    transition: border-color 0.2s;
    
    &:focus {
        /* MUDANÇA: Foco com a cor primária do Google */
        border-color: ${COLORS.primary}; 
        outline: none;
        /* box-shadow: 0 0 0 1px ${COLORS.primary}; // Anel de foco opcional */
    }
    
    /* Estilo para campos desabilitados */
    &:disabled {
        background: ${COLORS.hoverLight};
        cursor: not-allowed;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 10px 12px;
    
    /* MUDANÇA: Borda mais clara e sutil */
    border: 1px solid ${COLORS.border}; 
    border-radius: 6px;
    box-sizing: border-box;
    background: #fff;
    font-size: 1rem;
    color: ${COLORS.text};
    appearance: none;
    cursor: pointer;
    transition: border 0.2s;
    
    &:focus {
        border-color: ${COLORS.primary};
        outline: none;
    }
`;

const Label = styled.label`
    /* MUDANÇA: Tamanho levemente menor e cor de label neutra */
    font-size: 0.9rem; 
    font-weight: 500;
    color: ${COLORS.label};
    text-align: left; 
    margin-bottom: 5px;
`;

const ButtonArea = styled.div`
    grid-column: 1 / -1; 
    display: flex; 
    justify-content: center; 
    gap: 30px; 
    margin-top: 30px;
`;

const Button = styled.button`
    flex: 0;
    min-width: 120px; 
    max-width: 180px; 
    padding: 10px 20px;
    cursor: pointer;
    
    /* MUDANÇA: Bordas arredondadas (padrão Google) */
    border-radius: 20px; 
    height: 40px;
    font-size: 0.95rem; 
    font-weight: 500;
    box-shadow: none;
    transition: background 0.2s, box-shadow 0.2s, transform 0s;
    
    ${({ primary }) => 
        primary 
        ? `
            /* Botão Primário: Sólido, azul Google */
            border: none;
            background: ${COLORS.primary}; 
            color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
            &:hover {
                background: ${COLORS.primaryDark}; 
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transform: translateY(-1px);
            }
        ` 
        : `
            /* Botão Secundário: Estilo de contorno/neutro */
            border: 1px solid ${COLORS.border}; 
            background: ${COLORS.background};
            color: ${COLORS.text};
            &:hover {
                background: ${COLORS.hoverLight}; 
                border-color: ${COLORS.border};
                transform: translateY(0);
            }
        `
    }
`;

// --- Lógica do Componente ---

const Form = ({ getUsers, onEdit, setOnEdit, onBack }) => {
    const [formData, setFormData] = useState({});
    const [cpfCnpjLabel, setCpfCnpjLabel] = useState("CPF/CNPJ");

    // Lógica para formatar CPF/CNPJ
    useEffect(() => {
        if (formData.tipo_pessoa === "Física") {
            setCpfCnpjLabel("CPF");
        } else if (formData.tipo_pessoa === "Jurídica") {
            setCpfCnpjLabel("CNPJ");
        } else {
            setCpfCnpjLabel("CPF/CNPJ");
        }
    }, [formData.tipo_pessoa]);

    // Lógica para carregar dados de edição e formatar a data
    useEffect(() => {
        if (onEdit) {
            const editData = { ...onEdit };
            if (editData.data_nascimento) {
                // Conversão de data para formato yyyy-MM-dd
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(editData.data_nascimento)) {
                    const [dia, mes, ano] = editData.data_nascimento.split("/");
                    editData.data_nascimento = `${ano}-${mes}-${dia}`;
                } else {
                    const date = new Date(editData.data_nascimento);
                    if (!isNaN(date)) {
                        editData.data_nascimento = date.toISOString().slice(0, 10);
                    }
                }
            }
            setFormData(editData);
        } else {
            // Limpar o formulário se onEdit for null
            setFormData({});
        }
    }, [onEdit]);

    // Formatadores (Mantidos do código original)
    const formatPhone = (value) => {
        value = value.replace(/\D/g, "").slice(0, 11);
        if (value.length > 10) return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        if (value.length > 6) return value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
        if (value.length > 2) return value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
        return value.replace(/(\d{0,2})/, "($1");
    };

    const formatCpfCnpj = (value, type) => {
        value = value.replace(/\D/g, "");
        if (type === "Jurídica") {
            value = value.slice(0, 14);
            value = value.replace(/(\d{2})(\d)/, "$1.$2");
            value = value.replace(/(\d{5})(\d)/, "$1.$2");
            value = value.replace(/(\d{8})(\d)/, "$1/$2");
            value = value.replace(/(\d{12})(\d{1,2})$/, "$1-$2");
            return value;
        } else {
            value = value.slice(0, 11);
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{6})(\d)/, "$1.$2");
            value = value.replace(/(\d{9})(\d{1,2})$/, "$1-$2");
            return value;
        }
    };

    const formatCep = (value) => {
        value = value.replace(/\D/g, "").slice(0, 8);
        return value.replace(/^(\d{5})(\d)/, "$1-$2");
    };

    // Handlers para input
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Aplica formatação se o campo for CPF/CNPJ, Telefone ou CEP
        if (name === "fone") {
            newValue = formatPhone(value);
        } else if (name === "cep") {
            newValue = formatCep(value);
        } else if (name === "cpf") {
            newValue = formatCpfCnpj(value, formData.tipo_pessoa);
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleTipoPessoaChange = (e) => {
        const { value } = e.target;
        // Limpa o CPF/CNPJ ao trocar o tipo de pessoa
        setFormData((prev) => ({ ...prev, tipo_pessoa: value, cpf: "" }));
    };

    // Handler de Submissão
    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "nome", "email", "fone", "data_nascimento", "cpf", "tipo_pessoa", 
            "endereco", "cep", "municipio", "rua", "numero", "bairro",
        ];

        for (let field of requiredFields) {
            // Verifica se o campo está vazio ou só contém espaços
            if (!formData[field] || String(formData[field]).trim() === "") {
                return toast.warn("Preencha todos os campos!");
            }
        }

        try {
            const url = onEdit && onEdit.id 
                ? `https://meucontato.onrender.com/${onEdit.id}` 
                : "https://meucontato.onrender.com";
            
            const method = onEdit && onEdit.id ? axios.put : axios.post;
            
            const { data } = await method(url, formData, {
                headers: { "Content-Type": "application/json" },
            });

            toast.success(data);
            setFormData({});
            setOnEdit(null);
            getUsers();
        } catch (err) {
            toast.error(err.response?.data || "Erro ao salvar usuário");
        }
    };

    return (
        <FormWrapper>
            <h1 style={{ textAlign: 'center', color: COLORS.text, marginBottom: '20px', fontSize: '1.8rem', fontWeight: '400' }}>
                Cadastro de Pessoas
            </h1>
            <FormContainer onSubmit={handleSubmit}>
                
                {/* LINHA 1: Nome e E-mail */}
                <FormGroup>
                    <Label htmlFor="nome">Nome</Label>
                    <Input name="nome" id="nome" maxLength="100" value={formData.nome || ""} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">E-mail</Label>
                    <Input name="email" id="email" type="email" maxLength="100" value={formData.email || ""} onChange={handleChange} />
                </FormGroup>

                {/* LINHA 2: Telefone e Data de Nascimento */}
                <FormGroup>
                    <Label htmlFor="fone">Telefone</Label>
                    <Input name="fone" id="fone" maxLength="15" value={formData.fone || ""} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    {/* Alterado para type="date" para melhor UX em mobile e desktop */}
                    <Input name="data_nascimento" id="data_nascimento" type="date" value={formData.data_nascimento || ""} onChange={handleChange} />
                </FormGroup>

                {/* LINHA 3: Tipo de Pessoa e CPF/CNPJ */}
                <FormGroup>
                    <Label htmlFor="tipo_pessoa">Tipo de Pessoa</Label>
                    <Select name="tipo_pessoa" id="tipo_pessoa" value={formData.tipo_pessoa || ""} onChange={handleTipoPessoaChange}>
                        <option value="">Selecione...</option>
                        <option value="Física">Física</option>
                        <option value="Jurídica">Jurídica</option>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="cpf">{cpfCnpjLabel}</Label>
                    <Input
                        name="cpf"
                        id="cpf"
                        value={formData.cpf || ""}
                        onChange={handleChange}
                        placeholder={cpfCnpjLabel === "CNPJ" ? "00.000.000/0000-00" : "000.000.000-00"}
                        maxLength={cpfCnpjLabel === "CNPJ" ? 18 : 14}
                        disabled={!formData.tipo_pessoa}
                    />
                </FormGroup>
                
                {/* LINHA 4: Descrição do Endereço e CEP */}
                <FormGroup>
                    <Label htmlFor="endereco">Descrição do Endereço</Label>
                    {/* O nome do campo foi ajustado de 'endereco' para 'endereco' no JSX e lógica */}
                    <Input name="endereco" id="endereco" maxLength="100" value={formData.endereco || ""} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="cep">CEP</Label>
                    <Input name="cep" id="cep" maxLength="10" value={formData.cep || ""} onChange={handleChange} />
                </FormGroup>

                {/* LINHA 5: Município/UF e Rua */}
                <FormGroup>
                    <Label htmlFor="municipio">Município/UF</Label>
                    <Input name="municipio" id="municipio" maxLength="100" value={formData.municipio || ""} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="rua">Rua</Label>
                    <Input name="rua" id="rua" maxLength="100" value={formData.rua || ""} onChange={handleChange} />
                </FormGroup>

                {/* LINHA 6: Número e Bairro */}
                <FormGroup>
                    <Label htmlFor="numero">Número</Label>
                    <Input name="numero" id="numero" maxLength="10" value={formData.numero || ""} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input name="bairro" id="bairro" maxLength="100" value={formData.bairro || ""} onChange={handleChange} />
                </FormGroup>

                {/* Área de Botões (Ocupa as 2 colunas e é centralizada) */}
                <ButtonArea>
                    <Button type="submit" primary>SALVAR</Button>
                    <Button type="button" onClick={onBack}>VOLTAR</Button>
                </ButtonArea>
            </FormContainer>
        </FormWrapper>
    );
};

export default Form;