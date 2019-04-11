import React from 'react';
import PropTypes from 'prop-types';
import { PoseGroup } from 'react-pose';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';

import Backdrop from './Backdrop';
import Inner from './Inner';
import Hidden from './Hidden';
import Modal from './Modal';

class Component extends React.PureComponent {
  render() {
    return (
      <Hidden>
        <PoseGroup>
          {this.props.visible && [
            <Backdrop key={uuidv4()} onClick={this.props.close} />,
            <Modal key={uuidv4()}>
              <Inner color={`${this.props.color}80`}>
                {this.props.children}
              </Inner>
            </Modal>,
          ]}
        </PoseGroup>
      </Hidden>
    );
  }
}

Component.defaultProps = {
  color: BOARD_ITEM_COLORS.GREY,
  visible: false,
};

Component.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  close: PropTypes.func,
  color: PropTypes.string,
  visible: PropTypes.bool,
};

export default Component;
