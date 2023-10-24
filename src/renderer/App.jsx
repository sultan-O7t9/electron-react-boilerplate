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
import AddReportPage from './components/add-report/AddReportPage';
import AddTypePage from './components/add-type/AddType';
import { notification } from 'antd';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import MainSidebar from './components/main-sidebar/MainSidebar';

function Hello() {
  const navigate = useNavigate();

  return (
    <div>
      {/* <AddReportPage /> */}
      <AddTypePage />
    </div>
  );
}
function Login() {
  return <div>Login</div>;
}

const RoutesContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<Hello />} />
      <Route path="/abc" element={<Login />} />
    </Routes>
  );
};

export default function App() {
  return (
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
  );
}
