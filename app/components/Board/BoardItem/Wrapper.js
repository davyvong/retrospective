
import styled from 'styled-components';

import { BOARD_ITEM_COLORS } from './constants';

const Component = styled.div`
  background-color: ${props => props.color};
  border-radius: 6px;
  padding: 1.25rem 1.5rem;
`;

Component.defaultProps = {
  color: `${BOARD_ITEM_COLORS.GREY}80`,
};

export default Component;
