import styled from 'styled-components';

const Component = styled.div`
  margin: 0 auto;
  position: relative;

  @media screen and (min-width: 760px) {
    max-width: 430px;
    width: 430px;
  }

  @media screen and (min-width: 1088px) {
    max-width: 480px;
    width: 480px;
  }

  @media screen and (min-width: 1280px) {
    max-width: 576px;
    width: 576px;
  }

  @media screen and (min-width: 1472px) {
    max-width: 672px;
    width: 672px;
  }
`;

export default Component;
