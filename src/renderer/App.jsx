import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './styles.global.scss';
import HtmlToPdf from './components/html-to-pdf/HtmlToPdf';
import './App.css';
import MainHeader from './components/main-header/MainHeader';
import { ConfigProvider, notification } from 'antd';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import MainSidebar from './components/main-sidebar/MainSidebar';
import ManageTestPage from './screens/manage-test/ManageTest';
import ManageTestTypePage from './screens/manage-test-type/ManageTestType';
import AddReportPage from './screens/add-report/AddReport';
import AllReportsPage from './screens/all-reports/AllReports';
import SettingsPage from './screens/settings/Settings';

const RoutesContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<AddReportPage />} />
      <Route path="/reports" element={<AllReportsPage />} />
      <Route path="/manage-test-type" element={<ManageTestTypePage />} />
      <Route path="/manage-test" element={<ManageTestPage />} />
      <Route path="/config" element={<SettingsPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(115, 101, 249)',
        },
      }}
    >
      <div>
        <Router>
          <div className="layout">
            <MainSidebar />
            <div style={{ flex: 1 }}>
              <MainHeader />
              <RoutesContainer />
            </div>
          </div>
        </Router>

        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
        />
      </div>
    </ConfigProvider>
  );
}
