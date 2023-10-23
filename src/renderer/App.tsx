import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.global.scss';
import HtmlToPdf from './components/html-to-pdf/HtmlToPdf';

function Hello() {
  return (
    <div>
      <HtmlToPdf />
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
