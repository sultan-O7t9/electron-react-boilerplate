import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

const MainHeader = () => {
  const navigate = useNavigate();
  const handleNavigation = (route) => {
    navigate(route);
  };
  return (
    <header className="main-header">
      <nav className="main-nav">
        <Tooltip title="Go Back">
          <Button
            style={{ marginRight: '1rem', border: '1px solid white' }}
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined style={{ color: 'white' }} />}
            onClick={() => {
              handleNavigation(-1);
            }}
            size={'middle'}
          />
        </Tooltip>
        <Tooltip title="Go to Home">
          <Button
            style={{ marginRight: '1rem', border: '1px solid white' }}
            type="text"
            shape="circle"
            icon={<HomeOutlined style={{ color: 'white' }} />}
            onClick={() => {
              handleNavigation('/');
            }}
            size={'middle'}
          />
        </Tooltip>
      </nav>
      <h3 className="header-title">
        {window.localStorage.getItem('CLINIC_NAME') ?? ''}
      </h3>
    </header>
  );
};
export default MainHeader;
