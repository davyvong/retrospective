import styled from 'styled-components';

import { BOARD_ITEM_COLORS } from 'constants/colors';

const Component = styled.div`
  border-radius: 6px;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  margin-top: 0.75rem;
  padding: 0.75rem;
  position: relative;

  &:hover {
    background-color: ${props => props.color}40;
  }
`;

Component.defaultProps = {
  color: BOARD_ITEM_COLORS.GREY,
};

export default Component;
