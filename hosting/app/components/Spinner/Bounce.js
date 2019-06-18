import styled from 'styled-components';

const Component = styled.div`
  animation: bounce 2s infinite ease-in-out;
  -webkit-animation: bounce 2s infinite ease-in-out;
  background-color: ${props => props.color};
  border-radius: 50%;
  height: 100%;
  left: 0;
  opacity: 0.6;
  position: absolute;
  top: 0;
  width: 100%;

  @-webkit-keyframes bounce {
    0%,
    100% {
      -webkit-transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
`;

export default Component;
