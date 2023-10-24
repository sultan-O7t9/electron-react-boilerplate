import React, { useCallback } from 'react';

const useMutation = () => {
  const setData = useCallback((q) => {
    console.log(q, 'CALLED');
    window.electron.ipcRenderer.sendMessage('EXEC_QUERY', q);
    console.log('MUTATION');
  }, []);

  return setData;
};

export default useMutation;
