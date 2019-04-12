import styled from 'styled-components';

const Component = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;

  & > *:not(:first-child) {
    opacity: 0;
    visibility: hidden;
  }

  &:hover > *:not(:first-child) {
    opacity: 1;
    visibility: visible;
  }
`;

export default Component;
