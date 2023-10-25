import React from 'react';
import './styles.css';
import { GroupOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const SidebarLink = ({ to, label, icon }) => {
  return (
    <div className="link-container">
      <Link className="sidebar-link" to={to}>
        <div>
          {icon}
          <p>{label}</p>
        </div>
      </Link>
    </div>
  );
};

const MainSidebar = () => {
  const links = [
    {
      label: 'Home',
      to: '/',
      icon: <HomeOutlined />,
    },
    {
      label: 'Test Types',
      to: '/',
      icon: <GroupOutlined />,
    },
    {
      label: 'Tests',
      to: '/manage-test',
      icon: <GroupOutlined />,
    },
  ];
  return (
    <div className="main-sidebar">
      {links.map((link) => (
        <SidebarLink
          key={link.to}
          to={link.to}
          label={link.label}
          icon={link.icon}
        />
      ))}
    </div>
  );
};

export default MainSidebar;
