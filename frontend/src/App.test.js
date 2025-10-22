import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EduWiz AI title and Ask button', () => {
  render(<App />);
  expect(screen.getByText(/EduWiz AI/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ask/i })).toBeInTheDocument();
});