// ARKIA BOOSTRAP v1.0 BY SAVALET //

const {app, BrowserWindow} = require('electron');
const fs = require('original-fs');
const unzip = require('unzip-stream');
var request = require('request');
const child = require('child_process').execFile;
let date_ob = new Date();

if (!fs.existsSync(process.env.APPDATA + "/Arkia Boostrap")){
  fs.mkdirSync(process.env.APPDATA + "/Arkia Boostrap");
}
if (!fs.existsSync(process.env.APPDATA + "/Arkia Boostrap/config")){
  fs.mkdirSync(process.env.APPDATA + "/Arkia Boostrap/config");
  const req = request('http://api.arkia-mc.fr:400/folder_first_launch', function (error, response, body) {
    fs.writeFile(process.env.APPDATA + "/Arkia Boostrap/config/config.json", body, (err) => {
      if (err) throw err;
    });
    logger('[INFO] Config File Write !');
  });
}
if (!fs.existsSync(process.env.APPDATA + "/Arkia Boostrap/logs")){
  fs.mkdirSync(process.env.APPDATA + "/Arkia Boostrap/logs");
}
if (!fs.existsSync(process.env.APPDATA + "/Arkia Boostrap/launcher")){
  fs.mkdirSync(process.env.APPDATA + "/Arkia Boostrap/launcher");
}
if (!fs.existsSync(process.env.APPDATA + "/Arkia Boostrap/launcher/zip")){
  fs.mkdirSync(process.env.APPDATA + "/Arkia Boostrap/launcher/zip");
}
if (!fs.existsSync(process.env.APPDATA + "/Arkia Boostrap/launcher/data")){
  fs.mkdirSync(process.env.APPDATA + "/Arkia Boostrap/launcher/data");
  const req = request('http://api.arkia-mc.fr:400/folder_first_launch', function (error, response, body) {
    fs.writeFile(process.env.APPDATA + "/Arkia Boostrap/config/config.json", body, (err) => {
      if (err) throw err;
    });
    logger('[INFO] Config File Write !');
  });
}
fs.writeFile(process.env.APPDATA + "/Arkia Boostrap/logs/latest.log", "", (err) => {
  if (err) throw err;
});
function logger(msg) {
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  console.log('[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] ' + msg)
  fs.appendFileSync(process.env.APPDATA + '/Arkia Boostrap/logs/latest.log', '[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] ' + msg + '\n')
}
function logdel() {
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  fs.readFile(process.env.APPDATA + '/Arkia Boostrap/logs/latest.log', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    fs.appendFileSync(process.env.APPDATA + "/Arkia Boostrap/logs/" + year + "-" + month + "-" + date + ".log", data, (err) => {
      if (err) throw err;
      app.quit()
    });
  });
}


app.whenReady().then(() => {
  let config = require(process.env.APPDATA + "/Arkia Boostrap/config/config.json");
  logger("")
  logger("  /$$$$$$            /$$       /$$          ")
  logger(" /$$__  $$          | $$      |__/          ")
  logger("| $$  \ $$  /$$$$$$ | $$   /$$ /$$  /$$$$$$ ")
  logger("| $$$$$$$$ /$$__  $$| $$  /$$/| $$ |____  $$")
  logger("| $$__  $$| $$  \__/| $$$$$$/ | $$  /$$$$$$$")
  logger("| $$  | $$| $$      | $$_  $$ | $$ /$$__  $$")
  logger("| $$  | $$| $$      | $$ \  $$| $$|  $$$$$$$")
  logger("|__/  |__/|__/      |__/  \__/|__/ \_______/")
  logger("")
  logger("Arkia Boostrap by savalet")
  logger("")

  // WIN PARAMS //
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    resizable: false,
    icon: __dirname + "/assets/img/icon.png",
  });
  mainWindow.loadFile('index.html')
  // VERIFY BOOTSTRAP VERSION //
  const req = request('http://api.arkia-mc.fr:400/', function (error, response, body) {
    if (JSON.parse(body).bootstrap_version > config.bootstrap_version) {
      // IF NEW VERSION UPDATE //
      mainWindow.setProgressBar(0.1, {
        mode: "determinate "
      });
      logger("[INFO] New boostrap version available (" + JSON.parse(body).bootstrap_version + ")");
      mainWindow.loadFile('update.html')
      // DOWNLOAD AND EXTRACT NEW VERSION //
      var d = {
        "request": {
          "method": "getuser"
        }
      };
      process.noAsar = true
      request.post({
        url: 'https://download.arkia-mc.fr/Arkia.exe',
        headers:{
          'Content-Type' : 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(d)
      }).pipe(fs.createWriteStream(process.env.APPDATA + '/Arkia Boostrap/Arkia.exe')).on('close', function () {
        logger('[INFO] Bootstrap File Downloaded !');
        mainWindow.setProgressBar(0.5, {
          mode: "determinate "
        });

        // EXTRACT AND LAUNCH INSTALLER //
        logger('[INFO] Bootstrap File Executed !');
        mainWindow.setProgressBar(1, {
          mode: "determinate "
        });
        child(process.env.APPDATA + "/Arkia Boostrap/Arkia.exe", function(err) {
          if(err){
             logger("[ERROR] " + err);
             return;
          }
          logdel()
        }); 
      });

      const req = request('http://api.arkia-mc.fr:400/first_launch', function (error, response, body) {
        fs.writeFile(process.env.APPDATA + "/Arkia Boostrap/config/config.json", body, (err) => {
          if (err) throw err;
        });
        logger('[INFO] Config File Write !');
      });
    } else {
      logger("[INFO] No new boostrap version are available. Current version is " + config.bootstrap_version)
      // VERIFY FIRST LAUNCH //
      if (config.first_launch == true) {
        // IF TRUE INSTALL LAUNCHER //
        logger("[INFO] First launch !");
        mainWindow.loadFile('install.html')
        var d = {
          "request": {
            "method": "getuser"
          }
        };
        process.noAsar = true
        request.post({
          url: 'https://download.arkia-mc.fr/arkia-launcher-win32-x64.zip',
          headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
          },
          body:JSON.stringify(d)
        }).pipe(fs.createWriteStream(process.env.APPDATA + '/Arkia Boostrap/launcher/zip/arkia-launcher-win32-x64.zip')).on('close', function () {
          logger('[INFO] Files Downloaded !');
          fs.createReadStream(process.env.APPDATA + '/Arkia Boostrap/launcher/zip/arkia-launcher-win32-x64.zip') .pipe(unzip.Extract({
            path: process.env.APPDATA + '/Arkia Boostrap/launcher/data/'
          })).on('close', function () {
            logger('[INFO] Files Extracted !');
            child(process.env.APPDATA + "/Arkia Boostrap/launcher/data/arkia.exe", function(err) {
              if(err){
                logger("[ERROR] " + err);
                return;
              }
              logger("[INFO] bye bye =)")
              logdel()
            }); 
            mainWindow.hide();
          });
        });
        const req = request('http://api.arkia-mc.fr:400/first_launch', function (error, response, body) {
          fs.writeFile(process.env.APPDATA + "/Arkia Boostrap/config/config.json", body, (err) => {
            if (err) throw err;
          });
          logger('[INFO] Config File Write !');
        });
      } else {
        // ELSE VERIFY IF AN UPDATE IS AVAILABLE //
        mainWindow.setProgressBar(0.5, {
          mode: "indeterminate "
        });  
        
        const req = request('http://api.arkia-mc.fr:400/', function (error, response, body) {
          if (JSON.parse(body).launcher_version == 9999) {
            logger('[WARN] Arkia is in maintenance !')
            mainWindow.setIcon("./assets/img/maintenance_icon.png")
            mainWindow.loadFile('maintenance.html')
            mainWindow.setProgressBar(1, {
              mode: 'error'
            });
          } else {
            if (JSON.parse(body).launcher_version > config.launcher_version) {
              // IF NEW VERSION UPDATE //
              mainWindow.setProgressBar(0.1, {
                mode: "determinate "
              });
              logger("[INFO] New version available (" + JSON.parse(body).launcher_version + ")");
              mainWindow.loadFile('update.html')
              // DOWNLOAD AND EXTRACT NEW VERSION //
              var d = {
                "request": {
                  "method": "getuser"
                }
              };
              process.noAsar = true
              request.post({
                url: 'https://download.arkia-mc.fr/arkia-launcher-win32-x64.zip',
                headers:{
                  'Content-Type' : 'application/x-www-form-urlencoded',
                },
                body:JSON.stringify(d)
              }).pipe(fs.createWriteStream(process.env.APPDATA + '/Arkia Boostrap/launcher/zip/arkia-launcher-win32-x64.zip')).on('close', function () {
                logger('[INFO] Files Downloaded !');
                mainWindow.setProgressBar(0.5, {
                  mode: "determinate "
                });
      
                // EXTRACT AND LAUNCH LAUNCHER //
                fs.createReadStream(process.env.APPDATA + '/Arkia Boostrap/launcher/zip/arkia-launcher-win32-x64.zip') .pipe(unzip.Extract({
                  path: process.env.APPDATA + '/Arkia Boostrap/launcher/data/'
                })).on('close', function () {
                  logger('[INFO] Files extracted !');
                  mainWindow.setProgressBar(1, {
                    mode: "determinate "
                  });
                  child(process.env.APPDATA + "/Arkia Boostrap/launcher/data/arkia.exe", function(err) {
                    if(err){
                      logger("[ERROR] " + err);
                      return;
                    }
                    logger("[INFO] bye bye =)")
                    logdel()
                  }); 
                  mainWindow.hide();
                });
              });
              // DOWNLOAD CONFIG FILE //
              const req = request('http://api.arkia-mc.fr:400/first_launch', function (error, response, body) {
                fs.writeFile(process.env.APPDATA + "/Arkia Boostrap/config/config.json", body, (err) => {
                  if (err) throw err;
                });
                logger('[INFO] Config File Write !');
              });
            } else {
              // ELSE LAUNCH THE LAUNCHER //
              logger("[INFO] No new version are available. Current version is " + JSON.parse(body).launcher_version)
              mainWindow.loadFile('start.html')
              child(process.env.APPDATA + "/Arkia Boostrap/launcher/data/arkia.exe", function(err) {
                if(err){
                  logger("[ERROR] " + err);
                  return;
                }
                logger("[INFO] bye bye =)")
                logdel()
              });
              mainWindow.hide();
            }
          }
        })
        req.on('error', function(err) {
          mainWindow.loadFile('error_verify.html')
          mainWindow.setProgressBar(1, {
            mode: 'error'
          });
          logger('[ERROR] ' + err)
        })
  } 
    }
  });
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  }) 
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') logdel()
})