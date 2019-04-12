import styled from 'styled-components';

const Component = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;

  & > *:last-child {
    opacity: 0;
    visibility: hidden;
  }

  &:hover > *:last-child {
    opacity: 1;
    visibility: visible;
  }
`;

export default Component;
