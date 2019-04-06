import React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { mount } from 'enzyme';

import HomePage from '../index';
import messages from '../messages';

describe('<HomePage />', () => {
  it('should render the page messages', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <HomePage />
      </IntlProvider>,
    );
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.header} />),
    ).toEqual(true);
  });
});
