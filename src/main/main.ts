/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const sqlite3 = require('sqlite3');
const firstRun = require('electron-first-run');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

let newWindow;
let db: any = null;

function createNewWindow(url: string) {
  newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Generated Report',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newWindow.loadURL(url);

  newWindow.on('closed', () => {
    newWindow = null;
  });
}
ipcMain.on('show-generated-pdf', async (event, arg) => {
  createNewWindow(arg);
});
ipcMain.on('EXEC_QUERY', async (event, sqlQuery) => {
  let data = {};

  db.all(sqlQuery, (err: any, rows: any) => {
    if (err) {
      console.error(err);
      event.reply('EXEC_QUERY', { status: 'error', data: err });
    } else {
      console.log(rows);
      event.reply('EXEC_QUERY', { status: 'success', data: rows });
    }
  });
  console.log('EXEC_QUERY: ', sqlQuery);
});
ipcMain.on('hello', (event, arg) => {
  const { product } = arg;
  db.exec(
    `
  CREATE TABLE If not exists sharks 
  (
    ID INTEGER PRIMARY KEY ,
    name   VARCHAR(50) NOT NULL,
    color   VARCHAR(50) NOT NULL,
    weight INTEGER NOT NULL
  );
`,
  );
  event.reply('hello', 'pong');

  console.log(product);
});

/**
 * Add event listeners...
 */
const execQuery = async (event: any, sql: string) => {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err: any, rows: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    ipcMain.handle('EXEC_QUERY', execQuery);
    createWindow();

    db = new sqlite3.Database(
      path.join(path.join(app.getPath('documents'), 'db.db')),
    );
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS patient (
        patient_id INTEGER PRIMARY KEY ,
        patient_name TEXT,
        age INTEGER,
        gender TEXT
      );`);
      db.run(`CREATE TABLE IF NOT EXISTS test_type (
        type_id INTEGER PRIMARY KEY,
        type_name TEXT
      );`);
      db.run(`CREATE TABLE IF NOT EXISTS test (
        test_id INTEGER PRIMARY KEY ,
        test_name TEXT,
        normal_value TEXT,
        test_unit TEXT,
        type_id INTEGER,
        FOREIGN KEY (type_id) REFERENCES test_type(type_id)
      );`);
      db.run(`
      CREATE TABLE IF NOT EXISTS report (
        report_id INTEGER PRIMARY KEY,
        registration_date DATETIME,
        collection_date DATETIME,
        patient_id INTEGER,
        FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
      );`);
      db.run(`
      CREATE TABLE IF NOT EXISTS test_report (
        report_id INTEGER,
        test_id INTEGER,
        result TEXT,
        FOREIGN KEY (report_id) REFERENCES report (report_id),
        FOREIGN KEY (test_id) REFERENCES test (test_id),
        PRIMARY KEY (report_id, test_id)
      );`);
    });

    const isFirstRun = firstRun();

    // if (isFirstRun) {
    // Then insert all basic data
    db.all(
      "SELECT * FROM test_type WHERE type_id=1 AND type_NAME='LIPID PROFILE';",
      (_: any, data: any) => {
        console.log('QUERY_MAIN', data.length);
        if (data?.length > 0) return;
        db.serialize(() => {
          db.run(`
            INSERT INTO test_type (type_id,type_name)
            VALUES
              (1, 'LIPID PROFILE'),
              (2, 'H-PYLORI'),
              (3, 'LIVER FUNCTION TEST'),
              (4, 'RENAL FUNCTION TEST'),
              (5, 'SEROLOGY'),
              (6, 'M.P'),
              (7, 'H.B'),
              (8, 'CA'),
              (9, 'TYPHOID'),
              (10, 'HEPATITIS');
            `);
          db.run(`
            INSERT INTO test (test_id, test_name, normal_value, test_unit, type_id)
            VALUES
              (1,'CHOLESTORL','150 - 200mg%','',1),
              (2,'TRIGLYCRIDE','Upto 150 mg%','',1),
              (3,'HDL','More than 40mg%','',1),
              (4,'LDL','Upto 150 mg%','',1),

              (5,'HPL','','',2),

              (6,'S.GPT (ALT)','F=31mg% M=40mg%','',3),
              (7,'S.GOT (ALT)','F=31mg% M=40mg%','',3),
              (8,'S BILLIRUBIN','0.5 - 1.0mg%','',3),
              (9,'ALK.PHOS','98 - 179mg%','',3),

              (10,'URIC ACID','M:3.0 - 7.0   F:2.5 - 5.0','',4),
              (11,'BLOOD UREA','10 - 50mg%','',4),
              (12,'S.CREATENINE','0.5 - 1.3mg%','',4),

              (13,'BLOOD SUGAR','70 - 120 mg/dl','',5),
              (14,'BLOOD GROUP','','',5),
              
              (15,'M.P','','',6),
              
              (16,'H.B','12 to 15','',7),
              
              (17,'CA','M:8.5 to 10.5   F:8.6 to 10.7','',8),

              (18,'IGG','','',9),
              (19,'IGM','','',9),
              
              (20,'ANTI HCV','','',10),
              (21,'HEP B','','',10);
            `);
        });
      },
    );
    // }

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
