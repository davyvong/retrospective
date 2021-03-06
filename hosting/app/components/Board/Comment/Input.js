import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const Component = styled(TextareaAutosize)`
  background-color: #00000010;
  border-radius: 6px;
  font-size: 0.9em;
  line-height: 1.5;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;

  &:focus {
    outline: none;
  }
`;

export default Component;
