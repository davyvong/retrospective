import React from 'react';
import { mount } from 'enzyme';
import { FormattedMessage, IntlProvider } from 'react-intl';

import NotFound from '../index';
import messages from '../messages';

describe('<NotFound />', () => {
  it('should render the page messages', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <NotFound />
      </IntlProvider>,
    );
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.title} />),
    ).toEqual(true);
    expect(
      renderedComponent.contains(
        <FormattedMessage {...messages.description} />,
      ),
    ).toEqual(true);
  });
});
