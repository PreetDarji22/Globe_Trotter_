import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../store', () => ({
  useStore: () => ({
    login: mockLogin,
    register: mockRegister,
    user: null
  })
}));

describe('Login Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = (isRegister = false) => {
    return render(
      <BrowserRouter>
        <Login isRegister={isRegister} />
      </BrowserRouter>
    );
  };

  it('renders login view with email and password inputs and instant demo button', () => {
    renderLogin(false);

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByText(/instant demo login/i)).toBeInTheDocument();
  });

  it('switches between Login and Create Account mode', () => {
    renderLogin(false);

    const switchBtn = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(switchBtn);

    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
  });

  it('calls login function on submit in login mode', async () => {
    mockLogin.mockResolvedValue(true);
    renderLogin(false);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const submitBtn = screen.getByRole('button', { name: /sign in to globaltrotter/i });

    fireEvent.change(emailInput, { target: { value: 'traveler@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securePass123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('traveler@example.com', 'securePass123');
    });
  });

  it('displays error message when login fails', async () => {
    mockLogin.mockResolvedValue(false);
    renderLogin(false);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const submitBtn = screen.getByRole('button', { name: /sign in to globaltrotter/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});

