import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import './styles.css';
import { Button } from 'antd';
import html2pdf from 'html2pdf.js';
const { ipcRenderer } = window.electron;
const HtmlToPdf = (props) => {
  const { data, closeModal } = props;
  const docHeight = 1038;
  const footerHeight = 21;
  const docWidth = 709;
  const tablesContainerRef = useRef(null);
  const [docPages, setDocPages] = useState(1);
  const [link, setLink] = useState('');

  const handlePrint = () => {
    console.log({ data });
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
        pdf.setFontSize(14);
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.text(
            'LAB TECH _____________________',
            pdf.internal.pageSize.width - 250,
            pdf.internal.pageSize.height - 20,
          );
        }

        const l = pdf.output('bloburl');
        console.log(l);

        window.electron.ipcRenderer.sendMessage('show-generated-pdf', l);
        closeModal();
      });
  };
  return (
    <div className="html-to-pdf">
      <Button type="primary" id="print-button" onClick={handlePrint}>
        Print PDF
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
          <h1 STYLE="text-transform: uppercase; text-decoration: underline; font-weight: bold; text-align: center; margin:  0 0 8px; font-family:  serif;">
            {window.localStorage.getItem('CLINIC_NAME') ?? ''}
          </h1>
          <div
            style={{
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
            STYLE="text-transform: uppercase; text-align: center; font-family:  sans-serif;"
          >
            <b STYLE="font-size: 12px; margin: 0;">not valid for any court</b>
            <p STYLE="font-size: 10px; margin: 0;">
              {window.localStorage.getItem('CLINIC_LOCATION') ?? ''},{' '}
              <b STYLE="font-size: 12px; margin: 0;">
                {window.localStorage.getItem('CLINIC_CITY') ?? ''}
              </b>
            </p>
            <p STYLE="font-size: 10px; margin: 0; margin-bottom: 48px;">
              cell number ---{' '}
              <b STYLE="font-size: 12px; margin: 0;">
                {window.localStorage.getItem('CLINIC_CONTACT') ?? ''}
              </b>
            </p>
          </div>

          <table STYLE="width: 100%; margin: 0 auto 64px;">
            <tbody>
              <tr STYLE="min-height:  24px; display:  flex; font-size:  12px;">
                <td STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;">
                  <p STYLE="font-size: 10px; margin: 0; min-width: 128px;">
                    REPORT <span>#</span>
                  </p>
                  <p STYLE="font-size: 10px; margin: 0;">
                    {data?.report?.report_id}
                  </p>
                </td>
                <td STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;">
                  <p STYLE="font-size: 10px; margin: 0; min-width:  160px;">
                    REGISTRATION DATE
                  </p>
                  <p STYLE="font-size: 10px; margin: 0;">
                    {new Date(data?.report?.registration_date).toDateString()}
                  </p>
                </td>
              </tr>
              <tr STYLE="min-height:  24px; display:  flex; font-size:  12px;">
                <td STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;">
                  <p STYLE="font-size: 10px; margin: 0; min-width: 128px;">
                    PATIENT NAME
                  </p>
                  <b STYLE="font-size: 12px; margin: 0;">
                    {data?.patient?.patient_name?.split('---')[0]}
                  </b>
                </td>
                <td STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;">
                  <p STYLE="font-size: 10px; margin: 0; min-width: 160px;">
                    REPORT COLLECTION DATE
                  </p>
                  <p STYLE="font-size: 10px; margin: 0;">
                    {new Date(data?.report?.collection_date).toDateString()}
                  </p>
                </td>
              </tr>
              <tr STYLE="min-height:  24px; display:  flex; font-size:  12px;">
                <td STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;">
                  <p STYLE="font-size: 10px; margin: 0; min-width: 128px;">
                    FATHER / HUSBAND
                  </p>
                  <b STYLE="font-size: 12px; margin: 0;">
                    {data?.patient?.patient_name?.split('---')[1]}
                  </b>
                </td>
                <td STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;">
                  <p STYLE="font-size: 10px; margin: 0; min-width: 160px;">
                    REGISTERATION LOCATION
                  </p>
                  <p STYLE="font-size: 10px; margin: 0;">
                    {window.localStorage.getItem('REGISTRATION_LOCATION') ?? ''}
                  </p>
                </td>
              </tr>
              <tr STYLE="min-height:  24px; display:  flex; font-size:  12px;">
                <td
                  colSpan="2"
                  STYLE="flex:  1; min-width:  50%; display:  flex; align-items:  center; margin-right:  1rem;"
                >
                  <p STYLE="font-size: 10px; margin: 0; min-width: 8rem;">
                    AGE / SEX
                  </p>
                  <b STYLE="font-size: 12px; margin: 0;">
                    {data?.patient?.age} / {data?.patient?.gender}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>

          {data?.tests?.map((item, i) => {
            return (
              <table
                key={item?.type_id}
                id={'tbl-' + item}
                key={item}
                className="table"
                STYLE="width:  100%; border-collapse:  collapse; margin:  0;"
              >
                <tbody>
                  <tr>
                    <td
                      STYLE="margin: 0 1rem 1rem 0; padding-bottom:0.75rem font-size: 18px; font-weight: bold;
                        text-align: center;"
                      colSpan="3"
                    >
                      {item?.type_name}
                    </td>
                  </tr>
                  <tr
                    STYLE="border:  2px solid black; display:  flex;
                    font-size:  14px;"
                  >
                    <td STYLE="padding:  0.15rem;display:  flex;align-items:  center; justify-content:  center;font-weight:  bold; flex:  1;">
                      TEST NAME
                    </td>
                    <td STYLE="padding:  0.15rem; display:  flex; align-items:  center; justify-content:  center; font-weight:  bold; flex:  1;">
                      RESULT
                    </td>
                    <td STYLE="padding:  0.15rem; display:  flex; align-items:  center; justify-content:  center; font-weight:  bold; flex:  1;">
                      NORMAL VALUE
                    </td>
                  </tr>
                  {item?.data?.map((test) => (
                    <tr
                      key={test?.test_id}
                      STYLE="display:  flex; font-size:  14px;"
                    >
                      <td STYLE="padding-top:  1rem; display:  flex; align-items:  center; justify-content:  center; font-weight:  bold; flex:  1;">
                        {test?.test_name}
                      </td>
                      <td STYLE="padding-top:  1rem; display:  flex; align-items:  center; justify-content:  center; font-weight:  bold; flex:  1;">
                        {test?.result}
                      </td>
                      <td STYLE="padding-top:  1rem; display:  flex; align-items:  center; justify-content:  center; flex:  1;">
                        {test?.normal_value ? test?.normal_value : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <div STYLE="height: 128px;"></div>
              </table>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default HtmlToPdf;
