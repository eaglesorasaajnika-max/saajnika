import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

describe('Common UI Components', () => {
  describe('Button', () => {
    it('renders label and handles click', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Book Appointment</Button>);
      const btn = screen.getByText('Book Appointment');
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when loading or disabled prop is true', () => {
      render(<Button disabled>Disabled Action</Button>);
      const btn = screen.getByText('Disabled Action');
      expect(btn).toBeDisabled();
    });
  });

  describe('Badge', () => {
    it('renders badge content with gold variant default', () => {
      render(<Badge>Pure Silk</Badge>);
      expect(screen.getByText('Pure Silk')).toBeInTheDocument();
    });

    it('renders in-stock variant', () => {
      render(<Badge variant="in-stock">Available in Atelier</Badge>);
      expect(screen.getByText('Available in Atelier')).toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    it('renders title, message, and action button', () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="No Items Found"
          message="Your personal salon curation has no garments."
          actionLabel="Explore Catalog"
          onAction={handleAction}
        />
      );
      expect(screen.getByText('No Items Found')).toBeInTheDocument();
      expect(screen.getByText('Your personal salon curation has no garments.')).toBeInTheDocument();
      const actionBtn = screen.getByText('Explore Catalog');
      fireEvent.click(actionBtn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorState', () => {
    it('renders error message and retry button', () => {
      const handleRetry = vi.fn();
      render(<ErrorState message="Logistics proxy unreachable." onRetry={handleRetry} />);
      expect(screen.getByText('Logistics proxy unreachable.')).toBeInTheDocument();
      const retryBtn = screen.getByText(/Retry Request/i);
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
