import styled from 'styled-components';

import { COLORS } from 'constants/colors';

import FooterButton from './FooterButton';

const Component = styled(FooterButton)`
  color: ${COLORS.RED};
  position: absolute;
  right: 0;
  top: 0;
`;

export default Component;
