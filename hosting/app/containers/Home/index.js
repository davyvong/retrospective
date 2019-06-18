import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import Button from 'components/Bulma/Button';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';

import { createBoard as createBoardAction } from 'containers/Board/actions';
import reducer from 'containers/Board/reducer';
import saga from 'containers/Board/saga';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import messages from './messages';

class Component extends React.PureComponent {
  render() {
    return (
      <Section>
        <Container>
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
          <Button onClick={this.props.createBoard}>
            <FormattedMessage {...messages.create} />
          </Button>
        </Container>
      </Section>
    );
  }
}

Component.defaultProps = {
  createBoard: () => {},
};

Component.propTypes = {
  createBoard: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch => ({
  createBoard: params => dispatch(createBoardAction.request(params)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'board', reducer });
const withSaga = injectSaga({ key: 'board', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Component);
