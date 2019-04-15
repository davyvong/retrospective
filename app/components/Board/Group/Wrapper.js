import styled from 'styled-components';

import { ITEM_COLORS } from 'constants/colors';

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

  & > div:first-child > *:not(:first-child) {
    opacity: 0;
    visibility: hidden;
  }

  &:hover > div:first-child > *:not(:first-child) {
    opacity: 1;
    visibility: visible;
  }
`;

Component.defaultProps = {
  color: ITEM_COLORS.GREY,
};

export default Component;
