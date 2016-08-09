const electron = require('electron')
const {
  app, 
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} = require('electron')

const path = require('path')
const Config = require('electron-config')
const { Observable } = require('rx')

const config = new Config()
!config.get('interval') && config.set('interval', 10) //min
!config.get('gap') && config.set('gap', 30) //sec


app.dock.hide()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let settingWindow
let aboutWindow
let myScreen
let tray
let disposable

function createWindow () {
  myScreen = electron.screen.getAllDisplays()[0]
  // Create the browser window.
  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    width: myScreen.size.width,
    height: myScreen.size.height,
    alwaysOnTop: true,
    type: 'desktop',
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    startInterval()
  })
}

function createSettingWindow () {
  // Create the browser window.
  settingWindow = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    title: 'Preference',
  })

  // and load the index.html of the app.
  settingWindow.loadURL(`file://${__dirname}/setting.html`)

  // Open the DevTools.
  // settingWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  settingWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    settingWindow = null
    startInterval()
  })
}

function createAboutWindow () {
  if (aboutWindow) { 
    return aboutWindow.focus()
  }

  aboutWindow = new BrowserWindow({
    width: 250,
    height: 300,
    resizable: false,
    title: 'About'
  })

  aboutWindow.loadURL(`file://${__dirname}/about.html`)
  aboutWindow.on('closed', function () {
    aboutWindow = null
  })
}


function createMenuIcon () {
  tray = new Tray(path.join(__dirname, 'menuiconTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Setting',
      click () {
        createSettingWindow()
      }
    },
    {
      label: 'About',
      click () {
        createAboutWindow()
      }
    },
    {
      label: 'Quit', 
      click () {
        app.quit()
      }
    }
  ])
  tray.setToolTip('Time to have a rest.')
  tray.setContextMenu(contextMenu)
}

function startInterval () {
  if (mainWindow) {
    mainWindow.close()
  }

  if (disposable && disposable.dispose) {
    disposable.dispose()
  }

  disposable = Observable.interval(1000)
  .take(60 * config.get('interval'))
  // .take(3)
  .subscribe({
    onNext (x) {
      // console.log(x)
      return
    },
    onCompleted () {
      createWindow()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMenuIcon()
  startInterval()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
