import { createGlobalStyle } from 'styled-components';
import 'styles/tabs.css';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
  }

  *::-webkit-scrollbar {
    background-color: #ffffff;
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    background-color: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #ffffff;
  }

  *::-webkit-scrollbar-button {
    display: none;
  }
`;

export default GlobalStyle;
