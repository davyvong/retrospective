import React from 'react';
import { FormattedMessage } from 'react-intl';

import Container from 'components/Container';
import Section from 'components/Section';

import messages from './messages';

const Component = () => (
  <Section>
    <Container>
      <h1>
        <FormattedMessage {...messages.title} />
      </h1>
      <p>
        <FormattedMessage {...messages.description} />
      </p>
    </Container>
  </Section>
);

export default Component;
