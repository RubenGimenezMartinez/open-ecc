import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanDisplay } from './PlanDisplay';

describe('PlanDisplay component', () => {
  it('should show empty state when no plan content', () => {
    render(<PlanDisplay planContent={null} status={'pending'} />);

    expect(screen.getByText(/No hay plan disponible/)).toBeInTheDocument();
  });

  it('should show plan content when available', () => {
    render(<PlanDisplay planContent={'# Plan de implementación'} status={'completed'} />);

    expect(screen.getByText('Plan generado')).toBeInTheDocument();
    expect(screen.getByText('# Plan de implementación')).toBeInTheDocument();
  });
});
