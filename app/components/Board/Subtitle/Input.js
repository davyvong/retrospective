import styled from 'styled-components';

const Component = styled.input`
  display: block;
  font-size: 1.4em;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #4a4a4a;
  }
`;

export default Component;
