import React from 'react';
import './styles.css';
import {
  GroupOutlined,
  HomeOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
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
      label: 'Add Report',
      to: '/',
      icon: <ProfileOutlined />,
    },
    {
      label: 'All Reports',
      to: '/reports',
      icon: <ProfileOutlined />,
    },
    {
      label: 'Test Types',
      to: '/manage-test-type',
      icon: <GroupOutlined />,
    },
    {
      label: 'Tests',
      to: '/manage-test',
      icon: <GroupOutlined />,
    },
    {
      label: 'Settings',
      to: '/config',
      icon: <SettingOutlined />,
    },
  ];
  return (
    <>
      <div className="main-sidebar" style={{ position: 'relative' }}></div>
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
    </>
  );
};

export default MainSidebar;
