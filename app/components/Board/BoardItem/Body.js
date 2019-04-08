import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const Component = styled(TextareaAutosize)`
  line-height: 1.5;
  margin-bottom: 0.5rem !important;
  padding: 0.5rem;
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
