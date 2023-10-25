import { Button, Divider, Modal, Radio, Select, Spin } from 'antd';
import './styles.css';
import { useEffect, useState } from 'react';
import Input from '../../components/input/Input';
import useQuery from '../../../hooks/useQuery';
import useMutation from '../../../hooks/useMutation';
import HtmlToPdf from '../../components/html-to-pdf/HtmlToPdf';

const AddReportPage = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [gender, setGender] = useState('MALE');
  const [age, setAge] = useState(0);
  const [addRecordLoading, setAddRecordLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printData, setPrintData] = useState({});

  const name = fName.toUpperCase() + '---' + lName.toUpperCase();

  const isDisabled =
    !fName ||
    !lName ||
    !selectedTestIds?.length ||
    !selectedTests.every((type) => type?.data?.every((test) => test?.result));

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [testsLoading, getAllTests] = useQuery(
    `SELECT test.test_id, test.test_name, test.normal_value, test.type_id, test_type.type_name
        FROM test
        INNER JOIN test_type ON test.type_id = test_type.type_id`,
  );

  const [_, getPatientByName] = useQuery(
    `SELECT * FROM patient WHERE patient_name = '${name}';`,
  );
  const [_recentLoading, getRecentReport] = useQuery(
    `SELECT *
    FROM report
    ORDER BY report_id DESC
    LIMIT 1;`,
  );

  const [_mutationLoading, mutate] = useMutation();

  const fetchAllTests = () => {
    getAllTests().then((response) => {
      setAllTests(response?.data?.map((test) => ({ ...test, result: '' })));
    });
  };
  useEffect(() => {
    fetchAllTests();
  }, []);

  const handleSelectedTests = (value) => {
    setSelectedTestIds(value);
    const filteredTests = Object.values(
      allTests
        .filter((test) => value.find((item) => item === test.test_id))
        .reduce((result, item) => {
          const key = item.type_name;
          if (!result[key]) {
            result[key] = { type_name: key, data: [] };
          }
          result[key].data.push(item);
          return result;
        }, {}),
    );
    setSelectedTests(filteredTests);
    console.log({ filteredTests });
  };

  const handleResultChange = (val, typeIndex, testIndex) => {
    const temp = [...selectedTests];
    temp[typeIndex].data[testIndex].result = val;
    console.log(temp[typeIndex].data[testIndex], typeIndex, testIndex);
    setSelectedTests(temp);
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    setAddRecordLoading(true);

    // Patient Data
    const reportInfo = {};

    const patientExists = await getPatientByName();
    console.log(patientExists, 'PATIENT');
    const id =
      patientExists?.data?.length && patientExists?.data[0]?.patient_id
        ? patientExists?.data[0]?.patient_id
        : null;
    console.log('patient_id', id);
    if (!id)
      await mutate(`INSERT INTO patient (patient_name, age, gender)
            VALUES
              ('${name}', ${parseInt(age)}, '${gender}');`);
    else
      await mutate(`UPDATE patient
    SET age = ${parseInt(age)}, gender = '${gender}'
    WHERE patient_id = ${id};`);
    const result = await getPatientByName();

    reportInfo.patient = result?.data[0];

    const patientId = result?.data[0]?.patient_id;
    // Now create Report

    const date = new Date().toISOString();

    await mutate(`INSERT INTO report (registration_date, collection_date, patient_id)
            VALUES ('${date}','${date}',${patientId});`);

    // GET REPORT
    const reportRes = await getRecentReport();
    reportInfo.report = reportRes?.data[0];
    const reportId = reportRes?.data[0]?.report_id;

    // After Report Creation, Link it to tests
    const flattenedTests = [];
    reportInfo.tests = selectedTests;
    selectedTests.forEach((type) => {
      type.data.forEach((test) => {
        flattenedTests.push(`(${reportId},${test.test_id},'${test.result}')`);
      });
    });
    console.log(flattenedTests.join(','));

    // LINK
    await mutate(`INSERT INTO test_report (report_id, test_id, result)
    VALUES ${flattenedTests.join(',')};`);
    setSelectedTests([]);
    setFName('');
    setLName('');
    setAge(0);
    setGender('MALE');
    setSelectedTestIds([]);
    window.scrollTo(0, 0);
    reportInfo?.tests?.sort(
      (aType, bType) => aType?.data?.length - bType?.data?.length,
    );

    setPrintData(reportInfo);

    setTimeout(() => {
      setAddRecordLoading(false);
    }, 2500);
    setIsModalOpen(true);
  };

  return (
    <Spin spinning={addRecordLoading}>
      <section className="main-section">
        <form>
          <section className="patient-section section">
            <h4 className="section-title">Patient Details</h4>
            <div className="patient-info">
              <div className="horizontal-field">
                <Input
                  label={'Name'}
                  size="large"
                  placeholder="Enter Patient's Name"
                  value={fName}
                  onChange={(e) => {
                    setFName(e.target.value);
                  }}
                />
                <Input
                  label={'Father / Husband'}
                  size="large"
                  placeholder="Enter Father / Husband's Name"
                  value={lName}
                  onChange={(e) => {
                    setLName(e.target.value);
                  }}
                />
              </div>

              <div className="horizontal-field">
                <Input
                  label={'Age'}
                  size="large"
                  type="number"
                  placeholder="Enter Age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                />

                <div style={{ flex: 1 }}>
                  <p className="input-label">Gender</p>
                  <Select
                    style={{ width: '100%' }}
                    value={gender}
                    size="large"
                    placeholder="Select Gender"
                    optionFilterProp="children"
                    onChange={(value) => {
                      setGender(value);
                    }}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="section">
            <h4 className="section-title">Report Details</h4>
            <div className="patient-info">
              <div style={{ flex: 1 }}>
                <p className="input-label">Test Type</p>
                <Select
                  value={selectedTestIds}
                  style={{ width: '100%' }}
                  showSearch
                  allowClear
                  mode="multiple"
                  size="large"
                  placeholder="Select Test Type"
                  optionFilterProp="children"
                  onChange={handleSelectedTests}
                  options={allTests.map((test) => ({
                    value: test.test_id,
                    label: test.type_name + '  -  ' + test.test_name,
                  }))}
                />
              </div>
            </div>
            <div>
              <Divider />
              {selectedTests?.map((selectedType, typeIndex) => (
                <>
                  <div className="type-table">
                    <b>{selectedType.type_name}</b>
                    <div className="test-table">
                      <div className="head">
                        <p className="test-title">TEST NAME</p>
                        <p className="test-title">RESULT</p>
                        <p className="test-title">NORMAL VALUE</p>
                      </div>
                      {selectedType.data?.map((test, testIndex) => (
                        <div className="row">
                          <div className="test-col">{test.test_name}</div>
                          <div className="test-col">
                            <Input
                              value={test.result}
                              onChange={(e) => {
                                handleResultChange(
                                  e.target.value,
                                  typeIndex,
                                  testIndex,
                                );
                              }}
                              size="small"
                              placeholder="Result"
                            />
                          </div>
                          <div className="test-col">
                            {test.normal_value ? test.normal_value : '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </>
              ))}
            </div>
          </section>
          <Button
            size="large"
            disabled={isDisabled}
            block
            type="primary"
            style={{ marginTop: '1rem' }}
            onClick={handleAddReport}
          >
            Create Report
          </Button>
        </form>
      </section>
      <Modal
        title="Generate PDF"
        open={isModalOpen}
        footer={[
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <HtmlToPdf data={printData} closeModal={closeModal} />
            <Button
              disabled={true}
              type="default"
              onClick={closeModal}
              style={{ marginLeft: '1rem' }}
            >
              Print Later
            </Button>
          </div>,
        ]}
      >
        <p>Report has been created Successfully</p>
      </Modal>
    </Spin>
  );
};
export default AddReportPage;
