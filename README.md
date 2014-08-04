Browserstack-autoshots
=======================


*config file format*

{	
	configuration: {
		+user: Browserstack user name,
		+key: key provided by Browserstack for that user,
		+isLocal: boolean telling the Browserstack service if these tests are being run against a local development server,
		+localServerSettings: String in the format of host1, port1, ssl_flag2, host2, port2, ssl_flag2, etc. See http://www.browserstack.com/local-testing#command-line,
		+localIdentifier: name for the ad hoc local connection created and used by browserstack binary.  This needs to match the local identifier setting in the capabilities block,
		+url: url to be testing against,

	},
	capabilities: [
		Array of Browserstack compatbile blocks without user, key, local, and localIdentifier.  In most cases will be a listing of objects with browser name/OS, device.
	]
}


Set-Up For Local Testing
=========================
1) Go to http://www.browserstack.com/local-testing#command-line and download the correct binary for your platform
2) Place the binary in to the binaries directory, and make sure it is name BrowserStackLocal