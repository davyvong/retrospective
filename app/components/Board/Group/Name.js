import styled from 'styled-components';

const Component = styled.input`
  border-radius: 6px;
  font-size: 1em;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  width: 100%;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #00000010;
  }
`;

export default Component;
