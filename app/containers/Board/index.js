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
  sortItems = (items, key, direction = false) =>
    Object.keys(items).sort((a, b) => {
      if (direction) {
        return items[a][key] - items[b][key];
      }
      return items[b][key] - items[a][key];
    });

  renderItems = items =>
    items.map(id => {
      const item = this.props.items[id] || {};
      return (
        <pre key={id} style={{ backgroundColor: item.color }}>
          {JSON.stringify(item, null, 2)}
        </pre>
      );
    });

  render() {
    const sortedItems = this.sortItems(this.props.items, 'upvotes');
    return (
      <Section>
        <Container>
          <h1>
            <FormattedMessage {...messages.header} />
          </h1>
          {this.renderItems(sortedItems)}
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
