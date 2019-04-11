import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { PoseGroup } from 'react-pose';
import uuidv4 from 'uuid/v4';

import Backdrop from 'components/Modal/Backdrop';
import Content from 'components/Modal/Content';
import Hidden from 'components/Modal/Hidden';

import injectReducer from 'utils/injectReducer';
import { isType } from 'utils/validate';

import { closeModal as closeModalAction } from './actions';
import reducer from './reducer';
import {
  selectContent,
  selectOnClose,
  selectCloseOnBackdrop,
  selectVisible,
} from './selectors';

class Component extends React.PureComponent {
  onBackdropClick = () => {
    if (this.props.closeOnBackdrop) {
      if (isType(this.props.onClose, 'Function')) {
        this.props.onClose();
      }
      this.props.closeModal();
    }
  };

  render() {
    const { content, visible } = this.props;
    return (
      <Hidden>
        <PoseGroup>
          {visible && [
            <Backdrop key={uuidv4()} onClick={this.onBackdropClick} />,
            <Content key={uuidv4()}>{content}</Content>,
          ]}
        </PoseGroup>
      </Hidden>
    );
  }
}

Component.defaultProps = {
  closeOnBackdrop: true,
  content: null,
  visible: false,
};

Component.propTypes = {
  closeModal: PropTypes.func,
  closeOnBackdrop: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  closeOnBackdrop: selectCloseOnBackdrop(),
  content: selectContent(),
  onClose: selectOnClose(),
  visible: selectVisible(),
});

export const mapDispatchToProps = dispatch => ({
  closeModal: params => dispatch(closeModalAction(params)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'modal', reducer });

export default compose(
  withReducer,
  withConnect,
)(Component);
