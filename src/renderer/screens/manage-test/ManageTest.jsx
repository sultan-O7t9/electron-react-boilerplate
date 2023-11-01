import { Button, Radio, Select, Table } from 'antd';
import './styles.css';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useMutation from '../../../hooks/useMutation';
import useQuery from '../../../hooks/useQuery';
import Input from '../../components/input/Input';

const ManageTestPage = () => {
  const [testType, setTestType] = useState('');
  const [testName, setTestName] = useState('');
  const [testUnit, setTestUnit] = useState('');
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [testNormalValue, setTestNormalValue] = useState('');
  const [errors, setErrors] = useState({
    type: '',
    name: '',
  });
  const ERROR_MSG = 'Please fill the input';

  const [testsLoading, getAllTests] = useQuery(
    `SELECT test.test_id, test.test_name, test.normal_value, test.test_unit, test.type_id, test_type.type_name
    FROM test
    INNER JOIN test_type ON test.type_id = test_type.type_id`,
  );
  const [typesLoading, getAllTypes] = useQuery(`SELECT * FROM test_type`);

  const addType = useMutation();
  const fetchAllTests = () => {
    getAllTests().then((response) => {
      setTests(response?.data);
    });
  };
  useEffect(() => {
    getAllTypes().then((response) => {
      setTypes(
        response?.data?.map((type) => ({
          label: type?.type_name,
          value: type?.type_id,
        })),
      );
    });
    fetchAllTests();
  }, []);

  const [addTestLoading, addTest] = useMutation();

  useEffect(() => {
    if (testType) setErrors((state) => ({ ...state, type: '' }));
    if (testName) setErrors((state) => ({ ...state, name: '' }));
  }, [testType, testName]);

  const handleAddData = async () => {
    if (!testType) {
      setErrors((state) => ({ ...state, type: ERROR_MSG }));
    }
    if (!testName) {
      setErrors((state) => ({ ...state, name: ERROR_MSG }));
    }
    if (!testType || !testName) return;
    console.log(testType, testName, testNormalValue, testUnit);

    const query = `INSERT INTO test (type_id,test_name,normal_value,test_unit) VALUES
       (${testType},'${testName.toUpperCase()}','${testNormalValue}','${testUnit}');`;
    await addTest(query, () => (
      <p>Test: {testName.toUpperCase()} added successfully!</p>
    ));

    fetchAllTests();
    setTestName('');
    setTestNormalValue('');
    setTestType('');
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
    // {
    //   title: 'Test Unit',
    //   dataIndex: 'test_unit',
    //   key: 'test_unit',
    // },
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
  const handleUnitChange = (e) => {
    setTestUnit(e.target.value);
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
                placeholder="Enter Test Name"
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
              {/* <Input
                label={'Test Unit'}
                // error={errors.name}
                size="large"
                placeholder="Enter Test Unit"
                value={testUnit}
                onChange={handleUnitChange}
              /> */}
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
                  options={types}
                />
              </div>
            </div>
          </div>
          <Button
            size="large"
            disabled={!testName || !testType}
            type="primary"
            onClick={handleAddData}
            icon={<PlusOutlined />}
          >
            Add Test
          </Button>
        </section>
      </form>
      <section className="section">
        <h4 className="section-title">All Tests</h4>

        <Table dataSource={tests} columns={columns} loading={testsLoading} />
      </section>
    </section>
  );
};
export default ManageTestPage;
