import { createGlobalStyle } from 'styled-components';
import 'styles/tabs.css';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }
  #app {
    background-image: url(https://d30j33t1r58ioz.cloudfront.net/static/backgrounds/grid-white.png);
    background-repeat: repeat-x;
    background-position: top;
    background-color: #ffffff;
    min-height: 100%;
    min-width: 100%;
  }
`;

export default GlobalStyle;
