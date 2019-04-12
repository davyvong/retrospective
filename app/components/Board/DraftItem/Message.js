import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const Component = styled(TextareaAutosize)`
  border-radius: 6px;
  display: flex;
  flex: 1;
  line-height: 1.5;
  margin: -0.25rem -0.5rem 0 -0.5rem;
  margin-bottom: 0.5rem !important;
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
