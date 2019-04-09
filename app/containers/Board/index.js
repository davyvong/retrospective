import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';

import Columns from 'components/Board/Columns';
import Context from 'components/Board/Context';
import Group from 'components/Board/Group';
import Item from 'components/Board/Item';
import Title from 'components/Board/Title';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import { selectBoardInfo, selectBoardItems } from './selectors';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      context: '',
      title: '',
    };
  }

  componentWillReceiveProps(newProps) {
    const { info } = newProps;
    this.setState({
      context: info.context,
      title: info.title,
    });
  }

  sortItems = (items, key, direction = false) =>
    Object.keys(items).sort((a, b) => {
      if (direction) {
        return items[a][key] - items[b][key];
      }
      return items[b][key] - items[a][key];
    });

  renderItem = id => <Item id={id} item={this.props.items[id]} key={id} />;

  updateContext = event => this.setState({ context: event.target.value });

  updateTitle = event => this.setState({ title: event.target.value });

  render() {
    const { intl, items } = this.props;
    const { context, title } = this.state;
    const sortedItems = this.sortItems(items, 'upvotes');
    return (
      <Section>
        <Container>
          <Title
            onChange={this.updateTitle}
            placeholder={intl.formatMessage(messages.title)}
            value={title}
          />
          <Context
            onChange={this.updateContext}
            placeholder={intl.formatMessage(messages.context)}
            value={context}
          />
          <Columns>
            <Group items={sortedItems} renderItem={this.renderItem} />
            <Group items={sortedItems} renderItem={this.renderItem} />
          </Columns>
        </Container>
      </Section>
    );
  }
}

Component.defaultProps = {
  info: {},
  items: {},
};

Component.propTypes = {
  info: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  intl: intlShape.isRequired,
  items: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  info: selectBoardInfo(),
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
