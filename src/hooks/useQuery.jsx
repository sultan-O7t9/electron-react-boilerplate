import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useQuery = (query) => {
  const [loading, setLoading] = useState(false);
  const executeQuery = useCallback(async () => {
    try {
      const result = await window.electron.ipcRenderer.queryDatabase(query);
      return { status: 'success', data: result };
    } catch (error) {
      toast.error(() => <p>Something went wrong!</p>);
      console.log(error, query);
      return { status: 'error', data: [], error: error };
    }
    return result;
  }, [query]);

  return [loading, executeQuery];
};

export default useQuery;
