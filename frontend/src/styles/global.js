import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', Arial, Helvetica, sans-serif;
  }

  body {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
    color: #2f3640;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  button {
    background: linear-gradient(90deg, #0097e6 60%, #00b894 100%);
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
    transition: background 0.3s, transform 0.2s;

    &:hover {
      background: linear-gradient(90deg, #40739e 60%, #00b894 100%);
      transform: translateY(-2px) scale(1.03);
    }
  }

  input {
    padding: 12px 14px;
    border: 1.5px solid #dcdde1;
    border-radius: 8px;
    font-size: 1rem;
    background: #f8faff;
    color: #353b48;
    margin-bottom: 8px;
    transition: border 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #0097e6;
      outline: none;
      box-shadow: 0 0 6px rgba(0, 151, 230, 0.18);
    }
  }

  ::selection {
    background: #0097e6;
    color: #fff;
  }

  /* Scrollbar estilizada */
  ::-webkit-scrollbar {
    width: 8px;
    background: #e0eafc;
  }
  ::-webkit-scrollbar-thumb {
    background: #b2bec3;
    border-radius: 8px;
  }
`;

export default Global;
