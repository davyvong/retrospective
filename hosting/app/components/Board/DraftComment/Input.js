import styled from 'styled-components';

const Component = styled.input`
  border-radius: 6px;
  font-size: 0.9em;
  line-height: 1.5;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;

  &:focus {
    background-color: #00000010;
    outline: none;
  }

  &:hover {
    background-color: #00000010;
  }
`;

export default Component;
