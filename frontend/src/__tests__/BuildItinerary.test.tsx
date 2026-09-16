import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BuildItinerary from '../pages/BuildItinerary';

const mockTrip = {
  id: 'trip-101',
  name: 'Japan Adventure',
  destination: 'Tokyo, Japan',
  startDate: '2026-04-01',
  endDate: '2026-04-10'
};

vi.mock('../store', () => ({
  useStore: () => ({
    trips: [mockTrip],
    addTripStop: vi.fn(),
    searchCities: vi.fn().mockResolvedValue([{ id: 'city-1', name: 'Tokyo' }])
  })
}));

describe('BuildItinerary Component Tests', () => {
  it('renders itinerary builder sections with destination details', () => {
    render(
      <BrowserRouter>
        <BuildItinerary />
      </BrowserRouter>
    );

    expect(screen.getByText(/build itinerary sections/i)).toBeInTheDocument();
    expect(screen.getByText(/section 1:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ add another section/i })).toBeInTheDocument();
  });

  it('allows adding a new section', () => {
    render(
      <BrowserRouter>
        <BuildItinerary />
      </BrowserRouter>
    );

    const addSectionBtn = screen.getByRole('button', { name: /\+ add another section/i });
    fireEvent.click(addSectionBtn);

    expect(screen.getByText(/section 2:/i)).toBeInTheDocument();
  });
});
