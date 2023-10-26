import { Button, Input, Radio, Table } from 'antd';
import './styles.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SYS_CONFIGS = [
  'CLINIC_NAME',
  'CLINIC_LOCATION',
  'CLINIC_CITY',
  'CLINIC_CONTACT',
  'REGISTRATION_LOCATION',
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [sysConfigs, setSysConfigs] = useState(() => {
    const configs = {};
    SYS_CONFIGS.forEach((config) => {
      configs[config] = window.localStorage.getItem(config) ?? '';
    });
    return configs;
  });

  const handleAddData = async () => {
    Object.keys(sysConfigs).forEach((config) => {
      window.localStorage.setItem(config, sysConfigs[config].toUpperCase());
    });
    toast.success(() => {
      return (
        <div>
          <b>Settings Saved Sucessfully!</b>
        </div>
      );
    });
    setTimeout(() => {
      navigate('/config');
    }, 500);
  };

  const handleChange = (config, value) => {
    setSysConfigs((state) => ({ ...state, [config]: value }));
  };

  return (
    <section className="main-section">
      <form>
        <section className="patient-section section">
          <h4 className="section-title">Settings</h4>
          <div className="patient-info">
            {Object.keys(sysConfigs).map((config) => (
              <div className="input-container">
                <p>{config}</p>
                <Input
                  value={sysConfigs[config]}
                  onChange={(e) => {
                    handleChange(config, e.target.value);
                  }}
                />
              </div>
            ))}
          </div>
          <Button size="large" type="primary" onClick={handleAddData}>
            Save Settings
          </Button>
        </section>
      </form>
    </section>
  );
};
export default SettingsPage;
