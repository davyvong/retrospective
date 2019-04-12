import styled from 'styled-components';

const Component = styled.i.attrs({ className: 'material-icons' })`
  &:hover {
    color: ${props => props.hover};
  }
`;

export default Component;
