import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/Bulma/Button';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';

import messages from './messages';

const Component = () => (
  <Section>
    <Container>
      <h1>
        <FormattedMessage {...messages.title} />
      </h1>
      <Button>
        <FormattedMessage {...messages.create} />
      </Button>
    </Container>
  </Section>
);

export default Component;
