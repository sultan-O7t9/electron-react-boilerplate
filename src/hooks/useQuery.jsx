import React, { useCallback, useEffect, useState } from 'react';

const useQuery = (query) => {
  const [data, setData] = useState([]);
  const getData = useCallback(() => {
    console.log(query, 'CALLED');
    window.electron.ipcRenderer.sendMessage('EXEC_QUERY', query);
  }, [query]);

  useEffect(() => {
    window.electron.ipcRenderer.on('EXEC_QUERY', (e, a) => {
      setData(e);
      console.log(e);
    });
  }, []);

  return [data, getData];
};

export default useQuery;
