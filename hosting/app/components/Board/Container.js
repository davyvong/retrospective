import styled from 'styled-components';

const Component = styled.div`
  margin: 0 auto;
  position: relative;

  @media screen and (min-width: 1088px) {
    min-width: 960px;
  }

  @media screen and (min-width: 1280px) {
    min-width: 1152px;
  }

  @media screen and (min-width: 1472px) {
    min-width: 1344px;
  }
`;

export default Component;
