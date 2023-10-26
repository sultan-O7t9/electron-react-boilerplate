import { Button, DatePicker, Radio, Select, Table } from 'antd';
import './styles.css';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useMutation from '../../../hooks/useMutation';
import useQuery from '../../../hooks/useQuery';
import Input from '../../components/input/Input';
import dayjs from 'dayjs';

const AllReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { RangePicker } = DatePicker;

  //   const disabledDate = (current) => {
  //     if (!dates) {
  //       return false;
  //     }
  //     const tooLate = dates[0] && current.diff(dates[0], 'days') >= 7;
  //     const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 7;
  //     return !!tooEarly || !!tooLate;
  //   };

  //   const onOpenChange = (open) => {
  //     alert(open);
  //     if (open) {
  //       setDates([null, null]);
  //       setStartDate(null);
  //     } else {
  //       setDates(null);
  //     }
  //   };

  const [reportsLoading, getAllReports] = useQuery(
    `SELECT *
    FROM test
    JOIN test_type ON test.type_id = test_type.type_id
    JOIN test_report ON test.test_id = test_report.test_id
    JOIN report ON test_report.report_id = report.report_id
    JOIN patient ON report.patient_id = patient.patient_id;`,
  );
  const [dateReportsLoading, getDateFilteredReports] = useQuery(
    `SELECT *
    FROM test
    JOIN test_type ON test.type_id = test_type.type_id
    JOIN test_report ON test.test_id = test_report.test_id
    JOIN report ON test_report.report_id = report.report_id
    JOIN patient ON report.patient_id = patient.patient_id 
    WHERE report.registration_date >= '${startDate}' AND report.registration_date <= '${endDate}';`,
  );

  const getReports = (response) => {
    let formattedReports = [];
    formattedReports = response?.data?.reduce((result, item) => {
      const key = item.report_id;
      if (!result[key]) {
        result[key] = {
          report_id: key,
          patient_id: item.patient_id,
          registration_date: item.registration_date,
          collection_date: item.collection_date,
          date: {
            regOn: item.registration_date,
            collOn: item.collection_date,
          },

          patient_name: item.patient_name,
          data: [],
        };
      }
      result[key].data.push(item.type_name + ' - ' + item.test_name);
      return result;
    }, {});

    setReports(
      Object.values(formattedReports).sort(
        (a, b) => new Date(b.registration_date) - new Date(a.registration_date),
      ),
    );
    //   setTypes(
    //     response?.data?.map((type) => ({
    //       label: type?.type_name,
    //       value: type?.type_id,
    //     })),
    //   );
  };
  useEffect(() => {
    // if (startDate && endDate) {
    //   //   alert('Callaed');
    //   getDateFilteredReports().then(getReports);
    // } else {
    getAllReports().then(getReports);
    // }
  }, [startDate, endDate]);

  const columns = [
    {
      title: 'Report #',
      dataIndex: 'report_id',
      key: 'report_id',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (text) => (
        <p style={{ textTransform: 'capitalize' }}>
          {text.split('---')[0].toLowerCase()}
        </p>
      ),
    },
    {
      title: 'Father / Husband',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (text) => (
        <p style={{ textTransform: 'capitalize' }}>
          {text.split('---')[1].toLowerCase()}
        </p>
      ),
    },
    {
      title: 'Tests',
      dataIndex: 'data',
      key: 'data',
      render: (tests) => (
        <div style={{ textTransform: 'capitalize' }}>
          {tests.map((test) => (
            <p>{test}</p>
          ))}
        </div>
      ),
    },
    {
      title: 'Registered On',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <div>
          <p>
            {/* <b style={{ fontSize: '10px', marginRight: '0.4rem' }}>
              Registered On:{' '}
            </b> */}
            {date.regOn
              ? new Date(date.regOn).toString().split(' GMT')[0]
              : '-'}
          </p>
          {/* <p>
            <b style={{ fontSize: '10px', marginRight: '0.8rem' }}>
              Collected On:{' '}
            </b>
            {date.regOn
              ? new Date(date.regOn).toString().split(' GMT')[0]
              : '-'}
          </p> */}
        </div>
      ),
    },
  ];

  const handleDateFilter = ([st, ed]) => {
    setSelectedDates([dayjs(st.$d), dayjs(ed.$d)]);
    console.log(st.$d, ed.$d);
  };

  return (
    <section className="main-section reports">
      <section className="section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <h4 style={{ fontSize: '1.5rem' }}>All Reports</h4>
          {/* <RangePicker
            disabledDate={(date) =>
              dayjs(date).isAfter(dayjs()) ||
              dayjs(date).isBefore(dayjs().subtract(1, 'M'))
            }
            onCalendarChange={(value) => {
              setDates(value);
              setStartDate(value && value[0] ? value[0] : null);
              setEndDate(value && value[0] ? value[0] : null);
            }}
            changeOnBlur
          /> */}
        </div>

        <Table
          dataSource={reports}
          columns={columns}
          loading={reportsLoading}
        />
      </section>
    </section>
  );
};
export default AllReportsPage;
