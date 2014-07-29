var webdriver = require('browserstack-webdriver'),
	queue = require ('./queue'),
	fs = require ('fs'),
	path = require ('path'),
	spawn = require('child_process').spawn,
	capabilitiesBlocks = [];

	queue.on ('done', function (){
		cleanUp();
	});

	queue.on ('error', function (e){
		console.log (e);
		cleanUp();
	});

	var bs = spawn ('./binaries/BrowserStackLocal_Mac', ['-localIdentifier', 'test', '-force', '', 'localhost,3000,0']);
	bs.stdout.on ('data', function (data){
		console.log ('stdout: ' + data);
	});

	bs.stderr.on ('data', function (data){
		console.log ('stderr: ' + data);
	});

	capabilitiesBlocks = [ 
		// Input capabilities
		{
			'browserName' : 'iPhone',
			'device' : 'iPhone 5',
			'browserstack.user' : '',
			'browserstack.key' : '',
			'browserstack.local': true,
			'browserstack.localIdentifier': 'test'
		}
	];



	capabilitiesBlocks.forEach (function (i){
		queue.add (function (done){
			try{
				var capabilities = i,
					driver = {};
				
				driver = new webdriver.Builder().
				usingServer('http://hub.browserstack.com/wd/hub').
				withCapabilities(capabilities).
				build();

				driver.get('http://localhost:3000/colleges/534BED4C/California/Los-Angeles/University-of-California-Los-Angeles/');
				driver.takeScreenshot().then (function (data){
					fs.writeFile( path.join (__dirname,'screenshots', 
						(capabilities.browser || capabilities.browserName) +
						'_' + (capabilities.os || capabilities.device) +
						'_' + (capabilities.os_version || '') +
						'_' + (capabilities.resolution || '') + '.png'), data.replace(/^data:image\/png;base64,/,''), 'base64', function(err) {
						if(err) console.log (err);
						driver.quit();
						done();
					});
				});
			}catch(e){
				console.log (e);
				if (driver.quit) driver.quit();
				done();
			}
		});
	});

setTimeout(function (){
	queue.run ();
}, 3000);


function cleanUp (){
	if (driver.quit) driver.quit();
	if (bs.kill) bs.kill();
	process.exit();
}
