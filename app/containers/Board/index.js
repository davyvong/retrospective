import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import Container from 'components/Container';
import Section from 'components/Section';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import { selectBoardItems } from './selectors';

class Component extends React.PureComponent {
  renderItems = items => {
    const keys = Object.keys(items);
    return keys.map(key => (
      <div>
        <pre key={key}>
          {`"${key}": `}
          {JSON.stringify(items[key], null, 2)}
        </pre>
      </div>
    ));
  };

  render() {
    return (
      <Section>
        <Container>
          <h1>
            <FormattedMessage {...messages.header} />
          </h1>
          {this.renderItems(this.props.items)}
        </Container>
      </Section>
    );
  }
}

Component.propTypes = {
  items: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  items: selectBoardItems(),
});

export const mapDispatchToProps = () => ({
  //
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
