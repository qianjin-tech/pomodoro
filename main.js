const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');

const trayIcon = nativeImage.createFromDataURL(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA' +
  'tklEQVQ4y2P4//8/AzmAiYEEg5mwGBiNgaTYwEQXA5goNWIgeAGx5gMxM4iNR0NjxAYQ' +
  'K9AYAQ6Cg4RnALECGAMxAxYTGFAMYGAIVaAAlkBXoAJdFSoA1gW5CwYDPhNgA+C6CSz' +
  'AXQxmIXUAaIAFFy+gEOA2AZcBuGgCkQMGAJUBYoiK+gAA82QqxTkFevEAAAAASUVORK5CYII='
);

let win = null;
let tray = null;
let isQuitting = false;

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 620,
    resizable: false,
    title: '番茄钟',
    icon: trayIcon,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile('pomodoro.html');

  // Minimize to tray instead of closing
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });
}

function createTray() {
  tray = new Tray(trayIcon);
  tray.setToolTip('番茄钟');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        if (win) {
          win.show();
          win.focus();
        }
      },
    },
    {
      label: '置顶',
      type: 'checkbox',
      checked: false,
      click: (menuItem) => {
        if (win) win.setAlwaysOnTop(menuItem.checked);
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (win) {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  // Don't quit — keep running in tray
});

app.on('before-quit', () => {
  isQuitting = true;
});
