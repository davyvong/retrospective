import styled from 'styled-components';

const Component = styled.i.attrs({ className: 'material-icons' })`
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  &:hover {
    color: ${props => props.hover};
  }
`;

export default Component;
