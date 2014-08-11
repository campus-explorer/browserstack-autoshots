var webdriver = require('browserstack-webdriver'),
    //  queue = require ('./queue'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    async = require ('async'),
    config = {}, //configuration information for the browserstack tests
    capabilitiesBlock = [], //listing of devices and browsers to run the test on
    bs = undefined, //browserstack web driver
    platform = '', //os platform, used to point to correct binary
    configPath = '', //file path to the browserstack.config file
    loadedFunctions = null;

//load the configuration file
if (process.argv[2] && fs.existsSync(process.argv[2])){
    configPath = process.argv[2];
} else {
    configPath = 'browserstack.config';
}

//run the process
async.waterfall([
    readConfig,
    loadUserScripts,
    processCapabilities

], function (err, results){
    if (err){
        console.error (err);
    } else {
        console.log ('Screenshot tasks complete')
    }
    process.exit();
});


//======================Functions==========================
function readConfig (cb){
    if (!fs.existsSync (configPath)){
        cb('Missing a browserstack.config file');
        return false;
    }

    data = fs.readFileSync (configPath, {encoding: 'utf8'});
    if (!data) {
        cb('Missing a browserstack.config file');
        return false;
    }

    data = JSON.parse(data);
    config = data.configuration;
    capabilitiesBlock = data.capabilities;

    if (config.isLocal) {
        //spawn the browserstack web driver, and attach listeners
        bs = spawn('./binaries/BrowserStackLocal', ['-localIdentifier', config.localIdentifier, '-force', config.key, config.localServerSettings]);
        bs.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });

        bs.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        //Give the browserstack web driver time to load before starting tests
        setTimeout(function() {
            cb(null, config, capabilitiesBlock);
        }, 5000);
    } else {
        cb(null, config, capabilitiesBlock);
    }
}

function loadUserScripts (config, capabilitiesBlock, cb){
    var result = '',
        loadedFunctions;

    if (config.userFunctions.file){
        if (fs.existsSync('./' + config.userFunctions.file + '.js')){

            loadedFunctions = require('../' + config.userFunctions.file);
            
            if (!loadedFunctions) {
                cb('Failed to load user script');
            }

            cb(null, loadedFunctions, config, capabilitiesBlock);
        } else {
            cb('Failed to load user script');
        }
    }
}

function processCapabilities (loadedFunctions, config, capabilitiesBlock, asyncCallback) {
    async.eachLimit (capabilitiesBlock, 2, function (i, cb){
        try {
            var capabilities = i,
                driver = {};

            driver = new webdriver.Builder().
            usingServer('http://hub.browserstack.com/wd/hub').
            withCapabilities(capabilities).
            build();

            driver.get(config.url);

            if (loadedFunctions){
                loadedFunctions[config.userFunctions.functionName].call(driver);
            }

            driver
            .takeScreenshot()
            .then(function(data) {
                fs.writeFile(path.join(__dirname.substr(0, __dirname.lastIndexOf('/')), 'screenshots', (capabilities.browser || capabilities.browserName) +
                    '_' + (capabilities.os || capabilities.device) +
                    '_' + (capabilities.os_version || '') +
                    '_' + (capabilities.resolution || '') + '.png'), data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
                    if (err) {
                        cb(err)
                    } else {
                        cb();
                    }
                });
            });
        } catch (e) {
            console.log(e);
            if (driver.quit) driver.quit();
            cb(e);
        }}, function (err){
            if (err) {
                if (bs) bs.kill();
                asyncCallback(err);
            }else{
                asyncCallback(null, 'Screenshots complete');
            }

        }
    );
}