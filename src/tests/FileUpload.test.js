import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react'; 
import FileUpload from '../components/FileUpload';

describe('FileUpload Component', () => {
  it('renders the component with file inputs and a submit button', () => {
    render(<FileUpload onSubmit={jest.fn()} />);

    // Check that the labels and inputs are rendered
    expect(screen.getByLabelText(/File 1:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/File 2:/i)).toBeInTheDocument();
    expect(screen.getByText(/Compare Files/i)).toBeInTheDocument();
  });

  it('calls onSubmit with the selected files when the form is submitted', async () => {
    const mockOnSubmit = jest.fn();

    await act(async () => {
      render(<FileUpload onSubmit={mockOnSubmit} />);
    });

    // Create mock files
    const file1 = new File(['file1 content'], 'file1.txt', { type: 'text/plain' });
    const file2 = new File(['file2 content'], 'file2.txt', { type: 'text/plain' });

    // Simulate file input
    const fileInput1 = screen.getByLabelText(/File 1:/i);
    const fileInput2 = screen.getByLabelText(/File 2:/i);

    await act(async () => {
      fireEvent.change(fileInput1, { target: { files: [file1] } });
      fireEvent.change(fileInput2, { target: { files: [file2] } });
    });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Compare Files/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        file1,
        file2,
      });
    });
  });

  it('shows an error when no files are selected', async () => {
    const mockOnSubmit = jest.fn();

    await act(async () => {
      render(<FileUpload onSubmit={mockOnSubmit} />);
    });

    // Simulate form submission without selecting files
    fireEvent.click(screen.getByText(/Compare Files/i));

    await waitFor(() => {
      // Expect the onSubmit not to be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
      const errorMessage = screen.getByTestId('error-message');
      // Check for the presence of an error message
      expect(errorMessage).toHaveTextContent('Please select both files');
    });
  });

  it('validates file types and shows an error for unsupported file types', async () => {
    const mockOnSubmit = jest.fn();

    await act(async () => {
      render(<FileUpload onSubmit={mockOnSubmit} />);
    });

    // Create unsupported mock file
    const unsupportedFile = new File(['file content'], 'file.exe', { type: 'application/x-msdownload' });

    // Simulate file input with unsupported file type
    const fileInput1 = screen.getByLabelText(/File 1:/i);

    await act(async () => {
      fireEvent.change(fileInput1, { target: { files: [unsupportedFile] } });
    });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Compare Files/i));

    await waitFor(() => {
      // Expect the onSubmit not to be called
      expect(mockOnSubmit).not.toHaveBeenCalled();

      // Check for the presence of an error message using a flexible matcher
      expect(screen.getByText((content, element) => content.startsWith('Unsupported') && content.includes('file type'))).toBeInTheDocument();
    });
  });
});
