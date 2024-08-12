import { useState } from 'react';

const useFileUpload = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async (files) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch('/compare', {
        method: 'POST',
        body: files,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFiles,
    result,
    loading,
  };
};

export default useFileUpload;
