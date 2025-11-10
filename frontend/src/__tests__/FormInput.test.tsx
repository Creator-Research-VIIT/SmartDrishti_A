import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '../components/FormInput';

describe('FormInput', () => {
  it('renders with label and value', () => {
    render(
      <FormInput
        label="Test Input"
        value="test value"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Test Input')).toBeTruthy();
    expect(screen.getByDisplayValue('test value')).toBeTruthy();
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <FormInput
        label="Test Input"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText(/Test Input/i);
    await user.type(input, 'new value');

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when provided', () => {
    render(
      <FormInput
        label="Test Input"
        value=""
        onChange={() => {}}
        error="This is an error"
      />
    );

    expect(screen.getByText('This is an error')).toBeTruthy();
  });

  it('shows required asterisk when required is true', () => {
    render(
      <FormInput
        label="Required Input"
        value=""
        onChange={() => {}}
        required
      />
    );

    const asterisks = screen.getAllByText('*');
    expect(asterisks[0].classList.contains('text-red-500')).toBe(true);
  });
});
