import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: 0.8em;
  padding: ${props => props.padding};
  width: 100%;
`;

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { dots: '' };
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.updateDots, 1000);
  }

  componentWillUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  updateDots = () => {
    const { dots } = this.state;
    this.setState({ dots: dots === '...' ? '' : `${dots}.` });
  };

  render() {
    return (
      <Wrapper padding={this.props.padding}>
        {this.props.message}
        {this.state.dots}
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  message: 'A user is editting this item',
  padding: '0',
};

Component.propTypes = {
  message: PropTypes.string,
  padding: PropTypes.string,
};

export default Component;
