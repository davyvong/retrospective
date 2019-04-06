import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import messages from './messages';

class Container extends React.PureComponent {
  render() {
    const { intl } = this.props;
    return (
      <section className="section">
        <div className="container">
          <h1>{intl.formatMessage(messages.title)}</h1>
          <p>{intl.formatMessage(messages.description)}</p>
        </div>
      </section>
    );
  }
}

Container.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Container);
