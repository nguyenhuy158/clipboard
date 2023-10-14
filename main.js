const { app, BrowserWindow, Menu, Tray, globalShortcut, ipcMain, clipboard } = require("electron");
const path = require("node:path");

const copiedTextArray = [];
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 300,
        width: 300,
        // maxHeight: 300,
        // maxWidth: 300,
        // minHeight: 300,
        // minWidth: 300,
        // resizable: false,
        // hiddenInMissionControl: true,
        // title: "clipboard by nguyenhuy158",
        // opacity: 1,
        // transparent: false,
        // darkTheme: true,
        // fullscreen: false,
        // titleBarStyle: "hidden",
        // skipTaskbar: true,
        // alwaysOnTop: true,
        // center: true,
        // autoHideMenuBar: true,
        // show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        icon: path.join(__dirname, "clipboard.png"),
    });
    
    mainWindow.loadFile("index.html")
        .then(() => {
            mainWindow.webContents.send("updateCopiedText", copiedTextArray);
        });
    
    const iconPath = path.join(__dirname, "clipboard.png");
    let tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
        { label: "Show App", click: () => mainWindow.show() },
        { label: "Quit", click: () => app.quit() },
    ]);
    
    tray.setToolTip("Clipboard app");
    tray.setContextMenu(contextMenu);
    
    mainWindow.on("close", (event) => {
        event.preventDefault();
        mainWindow.hide();
    });
}

app.whenReady().then(() => {
    createWindow();
    
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    
    // Register a global shortcut for capturing copied text
    const copyKey = globalShortcut.register("CmdOrCtrl+C", () => {
        const copiedText = clipboard.readText();
        console.log("=>(main.js:66) copiedText", copiedText);
        if (copiedText) {
            copiedTextArray.unshift(copiedText);
            console.log("=>(main.js:69) copiedTextArray", copiedTextArray);
            mainWindow.webContents.send("updateCopiedText", copiedTextArray);
        }
        
        ipcMain.on("set-title", (event, title) => {
            const webContents = event.sender;
            const win = BrowserWindow.fromWebContents(webContents);
            win.setTitle(title);
        });
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// Handle app quitting
app.on("will-quit", () => {
    globalShortcut.unregister("CmdOrCtrl+C");
});
