import React from 'react';
import FileUpload from './components/FileUpload';
import useFileUpload from './hooks/useFileUpload';

const App = () => {
  const { uploadFiles, result, loading } = useFileUpload();

  return (
    <div>
      <h1 className='main-heading'>File Comparison Tool</h1>
      <FileUpload onSubmit={uploadFiles} />
      {loading && <p>Comparing files...</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default App;
