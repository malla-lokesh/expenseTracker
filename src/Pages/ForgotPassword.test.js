import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ForgotPassword from './ForgotPassword';

test('renders the div tag with the correct text', () => {
  render(<ForgotPassword />);
  
  const divElement = screen.getByText('Enter the email with which you have registered');
  
  expect(divElement).toBeInTheDocument();
});


// test('clicking the Send Link button triggers the passwordResetHandler', async () => {
//     render(<ForgotPassword/>);

//     const sendLinkButton = screen.getByRole('button');

//     fireEvent.click(sendLinkButton);

//     await waitFor(() => {
//         const messageElement = screen.getByText('Sent Password Reset Link to your mail!', { exact: false });
//         expect(messageElement).toBeInTheDocument();
//     });
// })