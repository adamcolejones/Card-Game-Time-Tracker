// File run order
// package.json > main.js > index.html
//###################################################################################################################################################################
   // Create the browser window and its functionality.
    const { app, BrowserWindow, ipcMain } = require('electron');
    const path = require('path');
    const fs = require('fs');

    function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('main.html');
    }

    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    });

    app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
    });

//###################################################################################################################################################################                                                                                                    
    // SAVE DATA goes from index.html > preload.js > main.js > data.json
    // ipcMain.on("saveData", (event, newData) => {
    //     try {
    //         let existingData = '[]'; // Default to an empty array
    //         if (fs.existsSync("data.json")) {
    //             const fileContent = fs.readFileSync("data.json", "utf8").trim();
    //             existingData = fileContent ? fileContent : '[]';
    //         }
    //         let jsonData = JSON.parse(existingData);

    //         // Ensure the structure includes "Games" and "Records"
    //         if (!jsonData.Games) {
    //             jsonData.Games = [];
    //         }
    //         if (!jsonData.Records) {
    //             jsonData.Records = [];
    //         }

    //         jsonData.Games.push(newData); // Spread operator to push all items in the array
            
    //         let updatedData = JSON.stringify(jsonData, null, 2);
    //         fs.writeFileSync("data.json", updatedData);
    //         console.log(`Data Saved`);
    //     } catch (error) {
    //         console.error("Error while saving data:", error.message);
    //     }
    // });
    ipcMain.on("saveData", (event, newData) => {
        try {
            let existingData = '[]'; // Default to an empty array
            if (fs.existsSync("data.json")) {
                const fileContent = fs.readFileSync("data.json", "utf8").trim();
                existingData = fileContent ? fileContent : '[]';
            }
            let jsonData = JSON.parse(existingData);
    
            // Ensure the structure includes "Games" and "Records"
            if (!jsonData.Games) {
                jsonData.Games = [];
            }
            if (!jsonData.Records) {
                jsonData.Records = [];
            }
    
            // Find index of the existing game
            const gameIndex = jsonData.Games.findIndex(game => game.id === newData.id);
            if (gameIndex !== -1) {
                // Overwrite existing game
                jsonData.Games[gameIndex] = newData;
            } else {
                // Add new game
                jsonData.Games.push(newData);
            }
    
            let updatedData = JSON.stringify(jsonData, null, 2);
            fs.writeFileSync("data.json", updatedData);
            console.log(`Data Saved`);
        } catch (error) {
            console.error("Error while saving data:", error.message);
        }
    });
    
  //###################################################################################################################################################################

  // fetch data in app.js, I want this to be the main.js file though, or index.
  // main.html has a script link to app.js as a module
