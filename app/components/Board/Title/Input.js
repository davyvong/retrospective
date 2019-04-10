import styled from 'styled-components';

const Component = styled.input`
  font-size: 2em;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #4a4a4a;
  }
`;

export default Component;
