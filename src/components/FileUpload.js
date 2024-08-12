import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ onSubmit }) => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [error, setError] = useState('');

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject('Failed to read file');
      reader.readAsText(file);
    });
  };

  const isValidFileType = (file) => {
    const validTypes = ['text/plain', 'application/json'];
    return validTypes.includes(file.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file1 || !file2) {
      setError('Please select both files');
      return;
    }

    if (!isValidFileType(file1) || !isValidFileType(file2)) {
      setError('Unsupported file type');
      return;
    }

    try {
      const [content1, content2] = await Promise.all([
        readFileContent(file1),
        readFileContent(file2),
      ]);

      if (content1 === content2) {
        setError('Files are identical');
        return;
      }

      if (onSubmit) {
        await onSubmit({ file1, file2 });
      }
    } catch (e) {
      setError('An error occurred while reading the files');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='file-upload-wrapper'> 
        <label htmlFor="file1">File 1:</label>
        <input
          id="file1"
          type="file"
          accept=".txt, .json, .pdf"  // Limit file types
          onChange={(e) => setFile1(e.target.files[0])}
        />
      </div>
      <div className='file-upload-wrapper'>
        <label htmlFor="file2">File 2:</label>
        <input
          id="file2"
          type="file"
          accept=".txt, .json, .pdf"  // Limit file types
          onChange={(e) => setFile2(e.target.files[0])}
        />
      </div>
      {error && <p data-testid="error-message" className='error-messsage'>{error}</p>}
      <button type="submit" className='compare-btn'>Compare Files</button>
    
    </form>
  );
};

FileUpload.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FileUpload;
