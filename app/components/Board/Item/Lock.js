import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: 0.8em;
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
      <Wrapper>
        A user is editting this item
        {this.state.dots}
      </Wrapper>
    );
  }
}

export default Component;
