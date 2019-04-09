import styled from 'styled-components';

const Component = styled.button`
  background-color: #00000010;
  border-radius: 6px;
  font-size: 1em;
  margin-top: 0.75rem;
  padding: 0.5rem;
  text-align: center;
  width: 100%;

  &:hover {
    background-color: #00000020;
  }
`;

export default Component;
