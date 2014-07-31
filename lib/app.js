var webdriver = require('browserstack-webdriver'),
    //	queue = require ('./queue'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    config = {}, //configuration information for the browserstack tests
    capabilitiesBlock = []; //listing of devices and browsers to run the test on

/*	queue.on ('done', function (){
		cleanUp();
	});

	queue.on ('error', function (e){
		console.log (e);
		cleanUp();
	});*/

fs.readFile('browserstack.config', function(err, data) {
    if (err) {
        console.error('Missing a browserstack.config file\n');
        process.exit();
    }

    config = data.configuration;
    capabilitiesBlock = data.capabilities;
});


var bs = spawn('./binaries/BrowserStackLocal_Mac', ['-localIdentifier', 'test', '-force', '', 'localhost,3000,0']);
bs.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});

bs.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
});

capabilitiesBlock.forEach(function(i) {
    queue.add(function(done) {
        try {
            var capabilities = i,
                driver = {};

            driver = new webdriver.Builder().
            usingServer('http://hub.browserstack.com/wd/hub').
            withCapabilities(capabilities).
            build();

            driver.get('http://localhost:3000/colleges/534BED4C/California/Los-Angeles/University-of-California-Los-Angeles/');
            driver.takeScreenshot().then(function(data) {
                fs.writeFile(path.join(__dirname, 'screenshots', (capabilities.browser || capabilities.browserName) +
                    '_' + (capabilities.os || capabilities.device) +
                    '_' + (capabilities.os_version || '') +
                    '_' + (capabilities.resolution || '') + '.png'), data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
                    if (err) console.log(err);
                    driver.quit();
                    done();
                });
            });
        } catch (e) {
            console.log(e);
            if (driver.quit) driver.quit();
            done();
        }
    });
});

setTimeout(function() {
    queue.run();
}, 3000);


function cleanUp() {
    if (driver.quit) driver.quit();
    if (bs.kill) bs.kill();
    process.exit();
}