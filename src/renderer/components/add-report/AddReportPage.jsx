import { Button, Input, Radio } from 'antd';
import './styles.css';
import { useEffect } from 'react';

const AddReportPage = () => {
  useEffect(() => {
    window.electron.ipcRenderer.on('hello', (e, a) => {
      console.log('RETURNED');
    });
  }, []);

  const onClick = () => {
    window.electron.ipcRenderer.sendMessage('hello', 'asdfgh');
  };
  return (
    <section className="main-section">
      <button onClick={onClick}>Hello</button>
      <form>
        <section className="patient-section section">
          <h4 className="section-title">Patient Details</h4>
          <div className="patient-info">
            <div className="horizontal-field">
              <div>
                <p className="input-label">Patient Name</p>
                <Input size="large" placeholder="Name" />
              </div>
              <div>
                <p className="input-label">Father / Husband</p>
                <Input size="large" placeholder="Father / Husband's Name" />
              </div>
            </div>
            {/*  */}
            <div className="horizontal-field">
              <div>
                <p className="input-label">Age</p>
                <Input type="number" size="large" placeholder="Name" />
              </div>
              <div style={{ marginLeft: '2rem' }}>
                <p className="input-label">Gender</p>
                <Radio.Group>
                  <Radio size={'large'} value={'MALE'}>
                    Male
                  </Radio>
                  <Radio size={'large'} value={'FEMALE'}>
                    Female
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            {/*  */}
          </div>
        </section>
        <section className="section">
          <h4 className="section-title">Report Details</h4>
          <div className="patient-info">
            <div className="horizontal-field">
              <div>
                <p className="input-label">Patient Name</p>
                <Input size="large" placeholder="Name" />
              </div>
              <div>
                <p className="input-label">Father / Husband</p>
                <Input size="large" placeholder="Father / Husband's Name" />
              </div>
            </div>
            {/*  */}
            <div className="horizontal-field">
              <div>
                <p className="input-label">Age</p>
                <Input type="number" size="large" placeholder="Name" />
              </div>
              <div style={{ marginLeft: '2rem' }}>
                <p className="input-label">Gender</p>
                <Radio.Group>
                  <Radio size={'large'} value={'MALE'}>
                    Male
                  </Radio>
                  <Radio size={'large'} value={'FEMALE'}>
                    Female
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            {/*  */}
          </div>
        </section>
      </form>
    </section>
  );
};
export default AddReportPage;
