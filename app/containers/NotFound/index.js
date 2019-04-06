import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const Container = () => (
  <section className="section">
    <div className="container">
      <h1>
        <FormattedMessage {...messages.title} />
      </h1>
      <p>
        <FormattedMessage {...messages.description} />
      </p>
    </div>
  </section>
);

export default Container;
