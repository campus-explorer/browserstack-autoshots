var exec = require('child_process').exec,
	fs = require('fs');

//if a config file exists, rename it until the test is over
if (fs.existsSync('browserstack.config')){
    fs.renameSync('browserstack.config', 'browserstack.bkp');
}

//restore the original config if it existed when the testing is done
process.on('exit', function (){
    if (fs.existsSync('browserstack.bkp')){
//        fs.renameSync('browserstack.bkp', 'browserstack.config');
    }
});

describe('Server requires configuration', function() {
    afterEach (function (){
        if (fs.existsSync('browserstack.config')){
//            fs.unlinkSync('browserstack.config');
        }
    });

    xit('Should fail if browserstack.config path is not on command line, and no default exists', function(done) {
        var badProcess = exec('node lib/app.js', function (err, stdout, stderr){
            expect(stderr.trim()).toEqual('Missing a browserstack.config file');
            badProcess.kill();
            done();
        });
    });

    xit('Should succeed if browserstack.config exists', function (done){
    	var badProcess;

        fs.writeFileSync('browserstack.config', '{"configuration": {"user": "","key": "","isLocal": "false","localServerSettings": "",');
        fs.appendFileSync('browserstack.config', '"localIdentifier": "","url": "","userFunctions":{"file": "","name": ""');
        fs.appendFileSync('browserstack.config', '}},"capabilities": []}');
        
        
        badProcess = exec('node lib/app.js', function (err, stdout, stderr){
            expect(stderr.trim()).toEqual('');
            expect(stdout).toContain('BrowserStackLocal v3');
            done();
            badProcess.kill();
        });
    });

    xit('Should defer to loading the config file in the cli arguments', function (done){
        var badProcess;

        fs.writeFileSync('tests/pretend.browserstack.config', '{"configuration": {"user": "","key": "","isLocal": "false","localServerSettings": "",');
        fs.appendFileSync('tests/pretend.browserstack.config', '"localIdentifier": "","url": "","userFunctions":{"file": "","name": ""');
        fs.appendFileSync('tests/pretend.browserstack.config', '}},"capabilities": []}');
        
        badProcess = exec('node lib/app.js tests/pretend.browserstack.config', function (err, stdout, stderr){
            expect(stderr.trim()).toEqual('');
            expect(stdout).toContain('BrowserStackLocal v3');
            fs.unlinkSync('tests/pretend.browserstack.config');
            done();
            badProcess.kill();
        });
    });

    it('Should load the .js file in the config', function (done){
        var badProcess;

        var realConfig = fs.readFileSync('browserstack.bkp');
        realConfig = JSON.parse(realConfig);
        key = realConfig.configuration.key;
        user = realConfig.configuration.user;

        fs.writeFileSync('browserstack.config', '{"configuration": {"user": "' + user + '","key": "' + key + '","isLocal": false');
        fs.appendFileSync('browserstack.config', '"url": "http://www.campusexplorer.com","userFunctions":{"file": "tests/testFunction","functionName": "testFunction"');
        fs.appendFileSync('browserstack.config', '}},"capabilities": [{"browser": "Chrome","browser_version": "35.0","os": "Windows","os_version": "8","resolution": "1280x1024","browserstack.user": "' + user + '","browserstack.key": "'+ key + '"}]}');
        
        fs.writeFileSync('tests/testFunction.js', '(function(){console.error ("loaded"); console.info("Loaded")})()');
        
        badProcess = exec('node lib/app.js', function (err, stdout, stderr){
            console.info (err)
            console.info (stdout)
            console.info (stderr)
            if (fs.existsSync('tests/testFunction.js')){
                fs.unlinkSync('tests/testFunction.js');
            }
            done();
        });
    });
});