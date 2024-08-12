import React from 'react';
import { act } from 'react'

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

describe('App Component', () => {
  it('renders the title correctly', () => {
    render(<App />);
    expect(screen.getByText('File Comparison Tool')).toBeInTheDocument();
  });
});
