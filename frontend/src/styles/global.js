import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
    font-family: 'Poppins', sans-serif; 
  }

  body {
    width: 100vw;
    height: 100vh;
    display: flex; 
    justify-content: center;
    align-items: flex-start; 
    background-color: #f2f2f2; 
    color: #2f3640;
  }

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
