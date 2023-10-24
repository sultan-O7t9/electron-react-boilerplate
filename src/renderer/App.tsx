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

function Hello() {
  const navigate = useNavigate();

  return (
    <div>
      <AddReportPage />
    </div>
  );
}
function Login() {
  return <div>Login</div>;
}
export default function App() {
  return (
    <>
      <Router>
        <MainHeader />
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/abc" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}
