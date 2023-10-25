import { Button, Radio, Table } from 'antd';
import './styles.css';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Input from '../../components/input/Input';
import useMutation from '../../../hooks/useMutation';
import useQuery from '../../../hooks/useQuery';

const ManageTestType = () => {
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [typeError, setTypeError] = useState('');
  const TYPE_ERROR = 'Please fill the input';

  const [getTypesLoading, getAllTypes] = useQuery(`SELECT * FROM test_type`);
  const [addTypeLoading, addType] = useMutation();

  const getAllTypesFromDB = async () => {
    let response = await getAllTypes();
    setTypes(response.data);
  };

  useEffect(() => {
    getAllTypesFromDB();
  }, []);

  useEffect(() => {
    if (type) setTypeError('');
  }, [type]);

  const handleAddData = async () => {
    if (!type) {
      setTypeError(TYPE_ERROR);
      return;
    }
    const query = `INSERT INTO test_type (type_name) VALUES
   ('${type.toUpperCase()}');`;

    await addType(query, () => (
      <p>
        Test Type: <b>{type}</b> has been added successfully!
      </p>
    ));
    getAllTypesFromDB();
  };

  const handleChange = (e) => {
    setType(e.target.value);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'type_id',
      key: 'type_id',
    },
    {
      title: 'Test Type',
      dataIndex: 'type_name',
      key: 'type_name',
    },
  ];

  return (
    <section className="main-section">
      <form>
        <section className="patient-section section">
          <h4 className="section-title">Add Test Type</h4>
          <div className="patient-info">
            <Input
              label={'Test Type'}
              error={typeError}
              size="large"
              placeholder="Enter Test Type"
              value={type}
              onChange={handleChange}
            />
          </div>
          <Button
            size="large"
            disabled={!type}
            type="primary"
            onClick={handleAddData}
            icon={<PlusOutlined />}
          >
            Add Type
          </Button>
        </section>
      </form>
      <section className="section">
        <h4 className="section-title">All Test Types</h4>

        <Table dataSource={types} columns={columns} loading={getTypesLoading} />
      </section>
    </section>
  );
};
export default ManageTestType;
