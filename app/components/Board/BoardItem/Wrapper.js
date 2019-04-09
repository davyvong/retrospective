import styled from 'styled-components';

import { BOARD_ITEM_COLORS } from './constants';

const Component = styled.div`
  background-color: ${props => props.color};
  border-radius: 6px;
  padding: 1.25rem 1.5rem;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }

  &:not(:last-child) {
    margin-bottom: 1.25rem;
  }

  & > *:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

Component.defaultProps = {
  color: `${BOARD_ITEM_COLORS.GREY}80`,
};

export default Component;
