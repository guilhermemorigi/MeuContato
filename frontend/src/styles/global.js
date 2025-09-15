import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  /* ✅ Pode ajustar/resetar do jeito que quiser */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* recomendo manter */
    font-family: 'Poppins', sans-serif; /* pode trocar a fonte */
  }

  /* ⚠️ PODE mexer em cores, layout geral do body */
  body {
    width: 100vw;
    height: 100vh;
    display: flex; /* deixa a página centralizada */
    justify-content: center;
    align-items: flex-start; /* se quiser centralizar tudo, use center */
    background-color: #f2f2f2; /* cor de fundo global */
    color: #2f3640; /* cor padrão do texto */
  }

  /* ✅ exemplo extra — estilizar botões globais */
  button {
    background-color: #0097e6;
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background 0.3s;

    &:hover {
      background-color: #40739e;
    }
  }

  /* ✅ exemplo extra — estilizar inputs globais */
  input {
    padding: 10px;
    border: 1px solid #dcdde1;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;

    &:focus {
      border-color: #0097e6;
      outline: none;
      box-shadow: 0 0 4px rgba(0, 151, 230, 0.4);
    }
  }
`;

export default Global;
