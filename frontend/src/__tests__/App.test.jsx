// src/__tests__/App.test.jsx
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    // Verifica se o título principal está presente
    const titleElement = screen.getByText(/Top 5 Músicas Mais Tocadas/i);
    expect(titleElement).toBeInTheDocument();

    // Verifica se o subtítulo está presente
    const subtitleElement = screen.getByText(/Tião Carreiro & Pardinho/i);
    expect(subtitleElement).toBeInTheDocument();

    // Verifica se o botão "Fazer Login" está presente
    const loginButton = screen.getByText(/Fazer Login/i);
    expect(loginButton).toBeInTheDocument();
  });
});