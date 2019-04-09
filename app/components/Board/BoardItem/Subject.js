import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const Component = styled(TextareaAutosize)`
  display: flex;
  font-family: monospace;
  font-size: 0.8em;
  text-transform: uppercase;
  width: 100%;

  &:hover {
    background-color: #00000014;
    border-radius: 6px;
  }

  &:focus {
    outline: none;
  }
`;

export default Component;
