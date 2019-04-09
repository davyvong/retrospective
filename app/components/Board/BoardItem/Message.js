import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const Component = styled(TextareaAutosize)`
  line-height: 1.5;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

export default Component;
