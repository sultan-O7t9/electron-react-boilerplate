import printJS from 'print-js';
// import { jsPDF } from 'jspdf';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import './styles.css';
import { Button } from 'antd';

const PrintDocument = () => {
  const tablesContainerRef = useRef(null);
  const tablesRef = useRef([]);
  const [docWidth, setDocWidth] = useState(300);

  const addDivider = (margin, i) => {};

  const handlePrint = () => {
    window.scrollTo(0, 0);
    // printJS({
    //   type: 'html',
    //   printable: 'tables',
    //   targetStyles: ['*'],
    //   documentTitle: '.',
    //   css: './styles.css',
    // });
    var doc = new jsPDF('p', 'pt', 'a4');
    // console.log({ doc });

    const tables = tablesContainerRef.current.getElementsByClassName('table');

    setDocWidth(doc.internal.pageSize.width - 24);

    let paperHeight = doc.internal.pageSize.height - 24;

    // console.log(doc.internal.pageSize.height, doc.internal.pageSize.width);
    let prevTableHeight = 0;
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const tablePosition = table.getBoundingClientRect();
      // console.log({ tableHeight: tablePosition.bottom, table: table.id });
      const tableHeight = tablePosition.bottom - prevTableHeight;
      const tableStart = tablePosition.top;
      // console.log({ tableHeight, tableStart, paperHeight });
      // console.log({ tableStart });
      // console.log('index', i);
      const multipleOf3 = i % 3 === 0 && i !== 0 && i !== tables.length - 1;
      // if (multipleOf3 || tableHeight > paperHeight) {
      if (tableHeight > paperHeight) {
        let margin;
        // if (multipleOf3 && tableHeight > paperHeight) {
        //   margin = parseInt(
        //     (
        //       (paperHeight > tableHeight
        //         ? paperHeight - tableHeight
        //         : tableHeight - paperHeight) + 32
        //     ).toFixed(2),
        //   );
        //   // console.log({ margin, paperHeight, tableStart });
        // } else
        if (tableHeight > paperHeight) {
          margin = parseInt(
            (
              tableHeight -
              paperHeight +
              table.getBoundingClientRect().height +
              32
            ).toFixed(2),
          );
        }
        console.log('adADJ', {
          margin,
          table: table.id,
          tableHeight,
          paperHeight,
          tbl: table.getBoundingClientRect().height,
        });
        // console.log({ margin });
        tablesRef.current[i].setAttribute(
          'style',
          `width: 100%; border-collapse: collapse; margin: 0 0 4rem; padding-top:100px;`,
        );
        const tbl = tablesRef.current[i];
        tbl.innerHTML =
          `<div style='height:${margin}px;width:20px;'></div>` + tbl.innerHTML;
        // console.log(i);
        // console.log(tablesRef.current[i]);

        // paperHeight = paperHeight;
        prevTableHeight = Number(tableHeight) + Number(margin);
        console.log({
          table: table.id,
          margin,
          paperHeight,
          tableHeight,
          prevTableHeight,
        });
      }
    }
    doc.html(tablesContainerRef.current, {
      callback: function (doc) {
        doc.setFontSize(14);
        // console.log(doc.getNumberOfPages());
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.text(
            'LAB TECH _____________________',
            doc.internal.pageSize.width - 250,
            doc.internal.pageSize.height - 20,
          );
          // console.log('SET FOR', i);
        }

        doc.save();
      },
      x: 0,
      y: 0,
      autoPaging: true,
    });
    // doc.save('demo2.pdf');
  };
  return (
    <>
      <div className="">
        <div
          ref={tablesContainerRef}
          id="tables"
          STYLE=" 
        padding: 2rem 0;
        font-family: 
          sans-serif;
      "
          style={{ width: docWidth + 'px' }}
        >
          {/* <div
          STYLE="
          position: absolute;
          bottom: 0;
          height: 100%;
          background-color:transparent;
          right: 0;
          display: flex;
          align-items: flex-end;
        "
        >
          <div STYLE="display: flex; justify-content: end; align-items: flex-end">
            <b STYLE="margin: 0 0.2rem 0 0;">LAB TECH.</b>
            <div STYLE="border-bottom: 1px solid black;">
              <p STYLE="margin: 0; opacity: 0">
                ********************************
              </p>
            </div>
          </div>
        </div> */}
          <h1
            STYLE="
          text-transform: uppercase;text-decoration: underline;
          font-weight: bold;text-align: center;margin: 0 0 0.2rem 0;font-family:  serif;
        "
            className="page-break"
          >
            Shamim Arshad Clinic
          </h1>
          <p
            STYLE="
          text-transform: uppercase;
          text-align: center;
          font-weight: bold;
          font-family: 
            sans-serif;
          margin: 0;
        "
          >
            not valid for any court
          </p>
          <p
            STYLE="
          text-transform: uppercase;
          text-align: center;
          font-family: 
            sans-serif;
          margin: 0;
        "
          >
            Opposite Fauji Tower Eid Gaah Chowk, <b>Kunjah</b>
          </p>
          <p
            STYLE="
            page-break-before: always;
          text-transform: uppercase;
          text-align: center;
          font-family: 
            sans-serif;
          margin: 0 0 2.5rem 0;
        "
          >
            cell number --- <b>0349 4695920</b>
          </p>
          {/* <div className="report-info">
          <div className="patient-info">
            <div>
              <p STYLE="min-width:9rem;">PATIENT NAME</p>
              CHAUDHRY RANA FAIZAN CHAUDHRY RANA FAIZAN
            </div>
            <div className="gaurdian-info">
              <p STYLE="min-width:9rem;">FATHER / HUSBAND</p>
              CHAUDHRY RANA
            </div>
            <div className="age-info">
              <p STYLE="min-width:5rem;">AGE / SEX</p>8 / MALE
            </div>
          </div>
        </div> */}
          <table STYLE="width: 100%; margin: 0 0 4rem;">
            <tbody>
              <tr STYLE="min-height: 1.25rem; display: flex; font-size: 12px;width:100%">
                <td
                  STYLE="
                min-width: 50%;
                flex: 1;
                display: flex;
                align-items: center;
              "
                >
                  <p STYLE="min-width: 8rem" className="font-12 margin-0">
                    REPORT <span>#</span>
                  </p>
                  <p className="font-12 margin-0">8975984092</p>
                </td>
                <td
                  STYLE="
              flex: 1;
              min-width: 50%;
              font-size: 12px;
              display: flex;
              align-items: center;
            "
                >
                  <p STYLE="min-width: 60%;" className="font-12 margin-0">
                    REGISTRATION DATE
                  </p>
                  <p STYLE="min-width:40%" className="font-12 margin-0">
                    20-10-2023
                  </p>
                </td>
              </tr>
              <tr STYLE="min-height:1.25rem; display: flex; font-size: 12px">
                <td
                  STYLE="
              min-width: 50%;
              flex: 1;
              display: flex;
              align-items: center;
            "
                >
                  <p STYLE="min-width: 8rem" className="font-12 margin-0">
                    PATIENT NAME
                  </p>
                  <b STYLE="font-size: 14px" className="font-12 margin-0">
                    CHAUDHRY RANA FAIZAN BHUTTA
                  </b>
                </td>
                <td
                  STYLE="
              flex: 1;
              font-size: 12px;
              min-width: 50%;
              display: flex;
              align-items: center;
            "
                >
                  <p STYLE="margin: 0; min-width: 60%;">
                    REPORT COLLECTION DATE
                  </p>
                  <p STYLE="margin: ;min-width:40%">20-10-2023</p>
                </td>
              </tr>
              <tr STYLE="min-height: 1.25rem; display: flex; font-size: 12px">
                <td
                  STYLE="
              min-width: 50%;
              flex: 1;
              display: flex;
              align-items: center;
            "
                >
                  <p STYLE="margin: 0; min-width: 8rem">FATHER / HUSBAND</p>
                  <b STYLE="margin: 0; font-size: 14px">CHOUDHRY'S FATHER</b>
                </td>
                <td STYLE="min-width: 50%;flex: 1; display: flex; align-items: center; font-size: 12px">
                  <p STYLE="margin: 0; min-width: 10rem">
                    REGISTERATION LOCATION
                  </p>
                  <b STYLE="margin: 0">SHAMIM ARSHAD CLINIC</b>
                </td>
              </tr>
              <tr STYLE="min-height: 1.25rem; display: flex; font-size: 12px;width:100%">
                <td
                  colSpan="2"
                  STYLE="
              min-width: 50%;
              flex: 1;
              display: flex;
              align-items: flex-start;
            "
                >
                  <p STYLE="margin: 0; min-width: 8rem">AGE / SEX</p>
                  <b STYLE="margin: 0">8 / MALE</b>
                </td>
              </tr>
            </tbody>
          </table>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => {
            return (
              <div STYLE="border:2px solid black;">
                <table
                  id={'tbl-' + item}
                  key={item}
                  ref={(el) => (tablesRef.current[i] = el)}
                  className="table"
                  STYLE="width: 100%; border-collapse: collapse; margin: 0 0 2.5rem;"
                >
                  <tbody>
                    <tr>
                      <td
                        STYLE="margin: 0 1rem 1rem 0.5rem; font-size: 18px;font-weight:bold;text-align:center;"
                        colSpan="3"
                      >
                        LIVER FUNCTION TEST
                      </td>
                    </tr>
                    <tr STYLE="display: flex;border:2px solid black; font-size:14px;">
                      <td
                        STYLE="
                  padding: 0.15rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  flex: 1;
                "
                      >
                        TEST NAME
                      </td>
                      <td
                        STYLE="
                  padding: 0.15rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  flex: 1;
                "
                      >
                        RESULT
                      </td>
                      <td
                        STYLE="
                  padding: 0.15rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  flex: 1;
                "
                      >
                        NORMAL VALUE
                      </td>
                    </tr>
                    <tr STYLE="display: flex; font-size: 14px">
                      <td
                        STYLE="
                  padding: 0.15rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  flex: 1;
                "
                      >
                        S. GPT (ALT)
                      </td>
                      <td
                        STYLE="
                  padding: 0.15rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  flex: 1;
                "
                      >
                        25
                      </td>
                      <td
                        STYLE="
                  padding: 0.15rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex: 1;
                "
                      >
                        F=31mg% M=40mg%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
      <Button type="primary" id="print-button" onClick={handlePrint}>
        Print
      </Button>
    </>
  );
};
export default PrintDocument;
