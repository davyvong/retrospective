import { createGlobalStyle } from 'styled-components';
import 'styles/tabs.css';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }
  #app {
    background-color: #ffffff;
    background-image: url(https://d30j33t1r58ioz.cloudfront.net/static/backgrounds/grid-white.png);
    background-position: top;
    background-repeat: repeat-x;
    min-height: 100%;
    min-width: 100%;
  }
`;

export default GlobalStyle;
