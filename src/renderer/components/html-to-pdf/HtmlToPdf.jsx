import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import './styles.css';
import { Button } from 'antd';
import html2pdf from 'html2pdf.js';
const { ipcRenderer } = window.electron;
const HtmlToPdf = () => {
  const docHeight = 1038;
  const footerHeight = 21;
  const docWidth = 709;
  const tablesContainerRef = useRef(null);
  const [docPages, setDocPages] = useState(1);
  const [link, setLink] = useState('');

  const handlePrint = () => {
    window.scrollTo(0, 0);
    var doc = new jsPDF('p', 'pt', 'a4');
    let paperHeight = docHeight;
    let orgPaperHeight = docHeight;
    console.log(paperHeight);
    console.log(
      doc.internal.pageSize,
      'SIZE',
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
    );
    const tables = tablesContainerRef.current.querySelectorAll('.table');

    let prevTableHeight = 0;
    let pages = 1;
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];

      const tablePosition = table.getBoundingClientRect();
      const tableStart = tablePosition.top;
      let tableHeight = tablePosition.bottom / pages;
      const multipleOf3 = i % 3 === 0 && i !== 0 && i !== tables.length - 1;

      if (tableHeight > paperHeight) {
        let margin;

        let tbl = tables[i];
        console.log(tableHeight, paperHeight, 'PEP');

        tbl.className = tbl.className + ' page-break';
        pages += 1;
        prevTableHeight = tableHeight;

        console.log(tbl.id, tbl.className);
        console.log('PAGE BREAK ADDED');
      }
      console.log({
        table: table.id,
        paperHeight,
        tableHeight,
        margin: tableHeight - paperHeight,
      });
    }

    var opt = {
      margin: 32,
      pagebreak: { avoid: 'table' },
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 300, letterRendering: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    };
    console.log(
      Math.ceil(
        tables[tables.length - 1].getBoundingClientRect().bottom / paperHeight,
      ),
      'TOTAL_PAGES',
    );
    pages = Math.ceil(
      tables[tables.length - 1].getBoundingClientRect().bottom / paperHeight,
    );
    setDocPages(pages);
    html2pdf()
      .set(opt)
      .from(document.getElementById('tables'))
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const l = pdf.output('bloburl');
        window.electron.ipcRenderer.sendMessage('show-generated-pdf', l);
      });
  };
  return (
    <div className="html-to-pdf">
      <Button type="primary" id="print-button" onClick={handlePrint}>
        Print
      </Button>
      <div className="hide">
        <div
          ref={tablesContainerRef}
          id="tables"
          style={{
            width: docWidth + 'px',
            height: (docHeight - footerHeight) * docPages + 'px',
            padding: '32px 0',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {new Array(docPages).fill(1).map((el, i) => {
            return (
              <div
                id="tech-sign"
                key={i}
                style={{
                  position: 'absolute',
                  top: (i + 1) * docHeight - footerHeight,
                  right: 0,
                }}
              >
                LAB TECH________________________
              </div>
            );
          })}
          <h1
            style={{
              textTransform: 'uppercase',
              textDecoration: 'underline',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: ' 0 0 8px',
              fontFamily: 'serif',
            }}
          >
            SClinic
          </h1>
          <div
            style={{
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
          >
            <b>not valid for any court</b>
            <p>
              Opposite Fauji Tower Eid Gaah Chowk, <b>Kunjah</b>
            </p>
            <p style={{ marginBottom: '48px' }}>
              cell number --- <b>0349 4695920</b>
            </p>
          </div>

          <table style={{ width: '100%', margin: '0 auto 64px' }}>
            <tbody>
              <tr className="info-row">
                <td className="info">
                  <p style={{ minWidth: '128px' }}>
                    REPORT <span>#</span>
                  </p>
                  <p>8975984092</p>
                </td>
                <td className="info">
                  <p style={{ minWidth: '160px' }}>REGISTRATION DATE</p>
                  <p>20-10-2023</p>
                </td>
              </tr>
              <tr className="info-row">
                <td className="info">
                  <p style={{ minWidth: '128px' }}>PATIENT NAME</p>
                  <b>CHAUDHRY RANA FAIZAN BHUTTA</b>
                </td>
                <td className="info">
                  <p style={{ minWidth: '160px' }}>REPORT COLLECTION DATE</p>
                  <p>20-10-2023</p>
                </td>
              </tr>
              <tr className="info-row">
                <td className="info">
                  <p style={{ minWidth: '128px' }}>FATHER / HUSBAND</p>
                  <b>CHOUDHRY'S FATHER</b>
                </td>
                <td className="info">
                  <p style={{ minWidth: '160px' }}>REGISTERATION LOCATION</p>
                  <p>SHAMIM ARSHAD CLINIC</p>
                </td>
              </tr>
              <tr className="info-row">
                <td colSpan="2" className="info">
                  <p style={{ minWidth: '8rem' }}>AGE / SEX</p>
                  <b>8 / MALE</b>
                </td>
              </tr>
            </tbody>
          </table>

          {[1, 2, 3, 4, 5].map((item, i) => {
            return (
              <table id={'tbl-' + item} key={item} className="table test-table">
                <tbody>
                  <tr>
                    <td
                      style={{
                        margin: '0 1rem 1rem 0.5rem',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                      colSpan="3"
                    >
                      LIVER FUNCTION TEST
                    </td>
                  </tr>
                  <tr className="test-table-row table-col-head">
                    <td className="test-col">TEST NAME</td>
                    <td className="test-col">RESULT</td>
                    <td className="test-col">NORMAL VALUE</td>
                  </tr>
                  <tr className="test-table-row">
                    <td className="table-data">S. GPT (ALT)</td>
                    <td className="table-data">25</td>
                    <td className="table-data table-data-light">
                      F=31mg% M=40mg%
                    </td>
                  </tr>
                </tbody>
                <div style={{ height: '128px' }}></div>
              </table>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default HtmlToPdf;
