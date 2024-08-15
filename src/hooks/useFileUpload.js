import { useState, useCallback } from 'react';

const useFileUpload = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFiles = useCallback(async ({ file1, file2 }) => {
    setLoading(true);
    setResult(null);

    try {
      const content1 = await file1.text();
      const content2 = await file2.text();

      const isEqual = content1 === content2;
      setResult({
        files: {
          file1: content1,
          file2: content2,
        },
        comparison: {
          identical: isEqual,
          differences: isEqual ? [] : getDifferences(content1, content2), // Function to find differences
        },
      });
    } catch (error) {
      setResult({ error: 'An error occurred during file comparison' });
    } finally {
      setLoading(false);
    }
  }, []);

  const getDifferences = (content1, content2) => {
    const diff = [];
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      if (lines1[i] !== lines2[i]) {
        diff.push({
          line: i + 1,
          file1: lines1[i] || '',
          file2: lines2[i] || '',
        });
      }
    }

    return diff;
  };

  return { uploadFiles, result, loading };
};

export default useFileUpload;
