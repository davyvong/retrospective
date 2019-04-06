import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import NotFound from '../index';
import messages from '../messages';

describe('<NotFound />', () => {
  it('should render the page message', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <NotFound />
      </IntlProvider>,
    );
    expect(
      renderedComponent.contains(<h1>{messages.title.defaultMessage}</h1>),
    ).toEqual(true);
    expect(
      renderedComponent.contains(<p>{messages.description.defaultMessage}</p>),
    ).toEqual(true);
  });
});
