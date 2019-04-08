import styled from 'styled-components';

import { BOARD_ITEM_COLORS } from './constants';

const Component = styled.div`
  background-color: ${props => props.color};
  border-radius: 6px;
  padding: 1.25rem 1rem;

  & > *:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

Component.defaultProps = {
  color: `${BOARD_ITEM_COLORS.GREY}80`,
};

export default Component;
