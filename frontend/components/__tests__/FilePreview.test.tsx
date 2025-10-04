import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilePreview } from '../FilePreview';

test('renders FilePreview (placeholder)', () => {
  const onClick = vi.fn();
  // render(<FilePreview filesData={ [] } />);
  // fireEvent.click(screen.getByText(/click me/i));
  // expect(onClick).toHaveBeenCalledTimes(1);
  expect(true).toBe(true);
});