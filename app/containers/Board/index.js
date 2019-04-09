import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
import uuidv4 from 'uuid/v4';

import { Draggable } from 'react-beautiful-dnd';

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
    this.timeouts = {};
  }

  componentWillReceiveProps(newProps) {
    const { info } = newProps;
    this.setState({
      context: info.context,
      title: info.title,
    });
  }

  onReorder = items => {
    const { items: result } = this.props;
    items.forEach((item, index) => {
      if (result[item]) {
        result[item].order = index;
      }
    });
    console.log('onReorder', result);
  };

  renderItem = (id, index) => (
    <Draggable draggableId={id} key={id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Item id={id} item={this.props.items[id]} />
        </div>
      )}
    </Draggable>
  );

  sortItems = (items, key, direction = false) =>
    Object.keys(items).sort((a, b) => {
      if (direction) {
        return items[a][key] - items[b][key];
      }
      return items[b][key] - items[a][key];
    });

  updateField = (event, key) => {
    if (this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
    }
    this.setState({ [key]: event.target.value }, () => {
      this.timeouts[key] = setTimeout(() => {
        console.log(key, this.state[key]);
      }, 3000);
    });
  };

  updateContext = event => this.updateField(event, 'context');

  updateTitle = event => this.updateField(event, 'title');

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
            <Group
              id={uuidv4()}
              items={sortedItems}
              onReorder={this.onReorder}
              renderItem={this.renderItem}
            />
            <Group
              id={uuidv4()}
              items={sortedItems}
              onReorder={this.onReorder}
              renderItem={this.renderItem}
            />
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
