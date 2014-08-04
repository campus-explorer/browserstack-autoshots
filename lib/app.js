var webdriver = require('browserstack-webdriver'),
    //  queue = require ('./queue'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    async = require ('async'),
    config = {}, //configuration information for the browserstack tests
    capabilitiesBlock = [], //listing of devices and browsers to run the test on
    bs = undefined, //browserstack web driver
    platform = ''; //os platform, used to point to correct binary

//load the configuration file
fs.readFile('browserstack.config', function(err, data) {
    if (err) {
        console.error('Missing a browserstack.config file\n');
        process.exit();
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
            processCapabilities();
        }, 5000);
    } else {        
        processCapabilities();
    }
});

//    capabilitiesBlock.forEach(function(i) {
//        queue.add(function(done) {
function processCapabilities () {
    async.eachLimit (capabilitiesBlock, 2, function (i, cb){
        try {
            var capabilities = i,
                driver = {};

            driver = new webdriver.Builder().
            usingServer('http://hub.browserstack.com/wd/hub').
            withCapabilities(capabilities).
            build();

            console.log (i);
            driver.get(config.url);
            driver.takeScreenshot().then(function(data) {
                fs.writeFile(path.join(__dirname.substr(0, __dirname.lastIndexOf('/')), 'screenshots', (capabilities.browser || capabilities.browserName) +
                    '_' + (capabilities.os || capabilities.device) +
                    '_' + (capabilities.os_version || '') +
                    '_' + (capabilities.resolution || '') + '.png'), data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
                    if (err) console.log(err);
                    driver.quit();
                    cb();
                });
            });
        } catch (e) {
            console.log(e);
            if (driver.quit) driver.quit();
            cb();
        }}, function (err){
            if (err) {
                if (bs.kill) bs.kill();
                process.exit();                
            }else{
                console.log ('Complete');
            }

        }
    );
}
/*function cleanUp() {
    if (driver.quit) driver.quit();
    if (bs.kill) bs.kill();
    process.exit();
}*/