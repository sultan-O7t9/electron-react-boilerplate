import { Button, Radio, Table } from 'antd';
import './styles.css';
import { useEffect, useState } from 'react';
import useQuery from '../../../hooks/useQuery';
import useMutation from '../../../hooks/useMutation';
import { PlusOutlined } from '@ant-design/icons';
import Input from '../input/Input';
import { toast } from 'react-toastify';

const AddTypePage = () => {
  const [type, setType] = useState('');
  const [typeError, setTypeError] = useState('');
  const TYPE_ERROR = 'Please fill the input';

  const [types, getAllTypes] = useQuery(`SELECT * FROM test_type`);
  const addType = useMutation();
  useEffect(() => {
    getAllTypes();
  }, []);

  useEffect(() => {
    if (type) setTypeError('');
  }, [type]);

  const handleAddData = () => {
    if (!type) {
      setTypeError(TYPE_ERROR);
      return;
    }
    const query = `INSERT INTO test_type (type_name) VALUES
   ('${type}');`;
    addType(query);
    toast.success(() => (
      <p>
        Test Type: <b>{type}</b> has been added successfully!
      </p>
    ));
    getAllTypes();
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
              label={'Enter Test Type'}
              error={typeError}
              size="large"
              placeholder="Test Type"
              value={type}
              onChange={handleChange}
            />
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
        <h4 className="section-title">All Test Types</h4>

        <Table dataSource={types} columns={columns} />
      </section>
    </section>
  );
};
export default AddTypePage;
