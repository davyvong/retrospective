import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';

import HomePage from '../index';
import messages from '../messages';

describe('<HomePage />', () => {
  it('should render the page message', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <HomePage />
      </IntlProvider>,
    );
    expect(
      renderedComponent.contains(<h1>{messages.header.defaultMessage}</h1>),
    ).toEqual(true);
  });
});
