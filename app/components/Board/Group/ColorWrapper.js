import styled from 'styled-components';

const Component = styled.div`
  position: relative;

  & > div {
    display: none;
  }

  &:hover > div {
    display: block;
    position: absolute !important;
    right: -7px;
    top: calc(28px + 0.5rem);
    z-index: 1;
  }
`;

export default Component;
