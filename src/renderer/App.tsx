import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
// import './App.css';
import JsPdfPrintDocument from './components/print-document/PrintDocument';
import './styles.global.scss';
import HtmlToPdf from './components/html-to-pdf/HtmlToPdf';

function Hello() {
  return (
    <div>
      {/* <JsPdfPrintDocument /> */}
      <HtmlToPdf />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
