import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import CentralStore from '../Store/CentralStore';

import Header from './Header';

test('renders h1 tag with the correct text', () => {
  render(
    <Provider store={CentralStore}>
      <Header />
    </Provider>
  );

  const headingElement = screen.getByRole('heading', { level: 1 });

  expect(headingElement).toHaveTextContent('Welcome to Expense Tracker!!!');
});
