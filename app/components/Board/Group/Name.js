import styled from 'styled-components';

const Component = styled.input`
  border-radius: 6px;
  flex: 1;
  font-size: 1.2em;
  padding: 0.4rem 0.65rem;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #00000010;
  }
`;

export default Component;
