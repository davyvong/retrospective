import styled from 'styled-components';

const Component = styled.div`
  position: relative;
  transition: visibility 0s, opacity 0.3s linear;

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
