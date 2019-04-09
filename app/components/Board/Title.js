import styled from 'styled-components';

const Component = styled.input`
  display: block;
  font-size: 2em;
  margin: 0.67em 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #4a4a4a;
  }
`;

export default Component;
