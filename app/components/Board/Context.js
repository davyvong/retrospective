import styled from 'styled-components';

const Component = styled.input`
  display: block;
  font-size: 1.4em;
  margin-bottom: 1.33em;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #4a4a4a;
  }
`;

export default Component;
