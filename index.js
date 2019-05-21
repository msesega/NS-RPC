/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require("electron");
const rpc = require("discord-rich-presence")("574263592908488705");
const gameData = require("./games");  

// Per l’amor de Déu si us plau que hi hagi una millor manera de gestionar això
if (require("./installer-events").handleSquirrelEvent(app)) return;

let window;
let aboutWindow;

// Utilitzat per crear la finestra
function createWindow () {
    window = new BrowserWindow({
        width: 400,
        height: 500,
        resizable: false,
        maximizable: false,
        icon: "icon.png",
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.setMenu(null);
    window.loadFile("index.html");
    
    window.on("closed", () => {
        window = null;
    });
    
    window.on("ready-to-show", () => window.show());
    
    setIdle();
}

// Utilitzat per la finestra de Quant a
function createAboutWindow () {
    aboutWindow = new BrowserWindow({
        width: 500,
        height: 200,
        resizable: false,
        maximizable: false,
        icon: "icon.png",
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    aboutWindow.setMenu(null);
    aboutWindow.loadFile("about.html");

    aboutWindow.on("closed", () => {
        aboutWindow = null;
    });

    aboutWindow.on("ready-to-show", () => aboutWindow.show());
}

// Defineix les variables que contindran les dades dels jocs
let name;
let desc;
let img;

// Executa quan les dades dels jocs es reben
ipcMain.on("game", (e, game, status) => {
    if (status === "") desc = "En línia";
    else desc = status.charAt(0).toUpperCase() + status.slice(1);
    name = game;
    setRPC();
});

// Executa quan la dada d'Ausent es rep
ipcMain.on("idle", () => {
    setIdle();
});

// Executa quan es rep la dada de Quant A
ipcMain.on("about", () => {
    createAboutWindow();
});

// Posa la prescència a Ausent
function setIdle() {
    if (idle === 16) return rpc.updatePresence({
        details: "La puta illa d'en Yoshi", 
        state: "Aquesta primavera", 
        largeImageKey: "yfi",
        largeImageText: "ell està sentat allà"});
    rpc.updatePresence({
        details: "Menú", 
        state: "Ausent", 
        largeImageKey: "switch", 
        largeImageText: "Menú"
    });
}

// Busca la imatge del joc i posa la prescència
function setRPC() {
    for (i = 0; i < gameData.games.length; i++) {
        if (gameData.games[i].name === name) {
            img = gameData.games[i].img;
            break;
        }
    }

    rpc.updatePresence({
        details: name, 
        state: desc, 
        largeImageKey: img, 
        largeImageText: name
    });
}

// Events per escoltar
app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (window === null) createWindow();
});
