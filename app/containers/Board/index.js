import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';

import Column from 'components/Board/Column';
import Columns from 'components/Board/Columns';
import Context from 'components/Board/Context';
import Item from 'components/Board/Item';
import Title from 'components/Board/Title';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';

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
    items.map(id => <Item id={id} item={this.props.items[id]} key={id} />);

  render() {
    const { intl, items } = this.props;
    const sortedItems = this.sortItems(items, 'upvotes');
    return (
      <Section>
        <Container>
          <Title placeholder={intl.formatMessage(messages.title)} />
          <Context placeholder={intl.formatMessage(messages.context)} />
          <Columns>
            <Column>{this.renderItems(sortedItems)}</Column>
            <Column>{this.renderItems(sortedItems)}</Column>
          </Columns>
        </Container>
      </Section>
    );
  }
}

Component.propTypes = {
  intl: intlShape.isRequired,
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
  injectIntl,
)(Component);
