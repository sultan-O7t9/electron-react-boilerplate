import { Button, Radio, Select, Table } from 'antd';
import './styles.css';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useMutation from '../../hooks/useMutation';
import useQuery from '../../hooks/useQuery';
import Input from '../components/input/Input';

const ManageTestPage = () => {
  const [testType, setTestType] = useState('');
  const [testName, setTestName] = useState('');
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [testNormalValue, setTestNormalValue] = useState('');
  const [errors, setErrors] = useState({
    type: '',
    name: '',
  });
  const ERROR_MSG = 'Please fill the input';

  //   const [getAllTests] = useQuery(
  //     `SELECT * FROM test t, test_type tt right join test_type on t.type_id = tt.type_id;`,
  //     setTests,
  //   );

  //   const [getAllTypes] = useQuery(`SELECT * FROM test_type;`, setTypes);

  const addTest = useMutation();
  //   useEffect(() => {
  // getAllTests();
  // getAllTypes();
  //   }, []);

  //   useEffect(() => {
  //     console.log(tests, 'TESTS');
  //   }, [tests]);

  useEffect(() => {
    if (testType) setErrors((state) => ({ ...state, type: '' }));
    if (testName) setErrors((state) => ({ ...state, name: '' }));
  }, [testType, testName]);

  const handleAddData = () => {
    //     if (!testType) {
    //       setErrors((state) => ({ ...state, type: ERROR_MSG }));
    //     }
    //     if (!testName) {
    //       setErrors((state) => ({ ...state, name: ERROR_MSG }));
    //     }
    //     if (!testType || !testName) return;
    //     const query = `INSERT INTO test (type_id,test_name,normal_value) VALUES
    //    (${testType},'${testName}','${testNormalValue}');`;
    //     addTest(query);
    //     toast.success(() => (
    //       <p>
    //         Test: <b>{testName}</b> has been added successfully!
    //       </p>
    //     ));
    // getAllTests();
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'test_id',
      key: 'test_id',
    },
    {
      title: 'Test',
      dataIndex: 'test_name',
      key: 'test_name',
    },
    {
      title: 'Normal Value',
      dataIndex: 'normal_value',
      key: 'normal_value',
    },
    {
      title: 'Test Type',
      dataIndex: 'type_name',
      key: 'type_name',
    },
  ];

  useEffect(() => {
    console.log('TYPE: ', testType);
  }, [testType]);

  const handleTypeChange = (value) => {
    setTestType(value);
  };
  const handleNameChange = (e) => {
    setTestName(e.target.value);
  };
  const handleNormalValueChange = (e) => {
    setTestNormalValue(e.target.value);
  };

  return (
    <section className="main-section">
      <form>
        <section className="patient-section section">
          <h4 className="section-title">Add Test</h4>
          <div className="patient-info">
            <div className="horizontal-field">
              <Input
                label={'Test Name'}
                error={errors.name}
                size="large"
                placeholder="Test Name"
                value={testName}
                onChange={handleNameChange}
              />
              <Input
                label={'Normal Value'}
                error={errors.normal_val}
                size="large"
                placeholder="Enter Normal Value"
                value={testNormalValue}
                onChange={handleNormalValueChange}
              />
              <div style={{ flex: 1 }}>
                <p className="input-label">Test Type</p>
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  value={testType}
                  size="large"
                  placeholder="Select Test Type"
                  optionFilterProp="children"
                  onChange={handleTypeChange}
                  //   onSearch={onSearch}
                  //   filterOption={filterOption}
                  options={types.map((type) => ({
                    label: type?.type_name,
                    value: type?.type_id,
                  }))}
                />
              </div>
            </div>
          </div>
          <Button
            size="large"
            type="primary"
            onClick={handleAddData}
            icon={<PlusOutlined />}
          >
            Add Type
          </Button>
        </section>
      </form>
      <section className="section">
        <h4 className="section-title">All Tests</h4>
        {JSON.stringify(tests)}

        <Table dataSource={tests} columns={columns} />
      </section>
    </section>
  );
};
export default ManageTestPage;
