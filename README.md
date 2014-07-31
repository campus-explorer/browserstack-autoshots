Browserstack-autoshots
=======================


config file format
{	
	configuration: {
		user: Browserstack user name,
		key: key provided by Browserstack for that user,
		isLocal: boolean telling the Browserstack service if these tests are being run against a local development server,
	},
	capabilities: [
		Array of Browserstack compatbile blocks without user, key, local, and localIdentifier.  In most cases will be a listing of objects with browser name/OS, device.
	]
}