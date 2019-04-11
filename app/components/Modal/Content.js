import styled from 'styled-components';
import posed from 'react-pose';

const Component = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 },
});

const StyledComponent = styled(Component)`
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%) !important;
  z-index: 2;
`;

export default StyledComponent;
