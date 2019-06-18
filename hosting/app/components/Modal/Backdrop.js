import styled from 'styled-components';
import posed from 'react-pose';

const Component = posed.div({
  enter: { opacity: 0.75 },
  exit: { opacity: 0 },
});

const StyledComponent = styled(Component)`
  background-color: #ffffff;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;

export default StyledComponent;
