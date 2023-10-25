import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const executeQuery = useCallback(
    async (
      query,
      successMessage = 'Query executed successfully!',
      errorMessage = 'Something went wrong!',
    ) => {
      setLoading(true);
      try {
        const result = await window.electron.ipcRenderer.queryDatabase(query);
        toast.success(successMessage);
        return { status: 'success', data: result };
      } catch (error) {
        toast.error(errorMessage);
        console.log(error, query);
        return { status: 'error', data: [], error: error };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return [loading, executeQuery];
};

export default useMutation;
