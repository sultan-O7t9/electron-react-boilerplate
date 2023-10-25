// import React, { useCallback, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

// const useQuery = (query) => {
//   const [data, setData] = useState([]);
//   const getData = useCallback(() => {
//     console.log(query, 'CALLED');
//     window.electron.ipcRenderer.sendMessage('EXEC_QUERY', query);
//   }, [query]);

//   useEffect(() => {
//     window.electron.ipcRenderer.on('EXEC_QUERY', (response, a) => {
//       // setData(e);
//       if(response.status==='error'){
//         toast.error(() => (
//           <p>
//             Something went wrong!
//           </p>
//         ));
//           setData([])
//       }
//       else{
//         setData(response?.data??[])
//       }
//       console.log(e);
//     });
//   }, []);

//   return [data, getData];
// };

// export default useQuery;

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useQuery = (query) => {
  const getData = useCallback(async () => {
    const result = window.electron.ipcRenderer.queryDatabase(query);
    return result;
  }, [query]);

  return getData;
};

export default useQuery;
