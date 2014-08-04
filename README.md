Browserstack-autoshots
=======================


**config file format**
*configuration*
- user: Browserstack user name,
- key: key provided by Browserstack for that user,
- isLocal: boolean telling the Browserstack service if these tests are being run against a local development server,
- localServerSettings: String in the format of host1, port1, ssl_flag2, host2, port2, ssl_flag2, etc. See http://www.browserstack.com/local-testing#command-line,
- localIdentifier: name for the ad hoc local connection created and used by browserstack binary.  This needs to match the local identifier setting in the capabilities block,
- url: url to be testing against

*capabilities*
- Array of Browserstack compatbile blocks without user, key, local, and localIdentifier.  In most cases will be a listing of objects with browser name/OS, device.

*sample config file*
```
{
    "configuration": {
        "user": "<your_username>",
        "key": "<your_key>",
        "isLocal": "true",
        "localServerSettings": "localhost,3000,0",
        "localIdentifier": "CE1",
        "url": "http://localhost:3000/colleges/534BED4C/California/Los-Angeles/University-of-California-Los-Angeles/"
    },
    "capabilities": [
        {
            "browser": "Chrome",
            "browser_version": "35.0",
            "os": "Windows",
            "os_version": "8",
            "resolution": "1280x1024",
            "browserstack.local": "true",
            "browserstack.user": "<your_username>",
            "browserstack.key": "<your_key>",
            "browserstack.localIdentifier" : "CE1"
        },
        {
            "browser": "IE",
            "browser_version": "11.0",
            "os": "Windows",
            "os_version": "8.1",
            "resolution": "1280x1024",
            "browserstack.local": "true",
            "browserstack.user": "<your_username>",
            "browserstack.key": "<your_key>",
            "browserstack.localIdentifier" : "CE1"
        },
        {
            "browser": "Firefox",
            "browser_version": "30.0",
            "os": "Windows",
            "os_version": "8.1",
            "resolution": "1280x1024",
            "browserstack.local": "true",
            "browserstack.user": "<your_username>",
            "browserstack.key": "<your_key>",
            "browserstack.localIdentifier" : "CE1"
        },
        {
            "browserName" : "iPhone",
			"platform" : "MAC",
 			"device" : "iPhone 5S",
            "browserstack.local": "true",
            "browserstack.user": "<your_username>",
            "browserstack.key": "<your_key>",
            "browserstack.localIdentifier" : "CE1"
        },
        {
            "browserName": "android",
            "platform": "ANDROID",
            "device": "HTC One X",
            "browserstack.local": "true",
            "browserstack.user": "<your_username>",
            "browserstack.key": "<your_key>",
            "browserstack.localIdentifier" : "CE1"
        },
        {
            "browserName": "iPad",
            "platform": "MAC",
            "device": "iPad 3rd (6.0)",
            "browserstack.local": "true",
            "browserstack.user": "<your_username>",
            "browserstack.key": "<your_key>",
            "browserstack.localIdentifier" : "CE1"
        }
    ]
}
```

Set-Up For Local Testing
=========================
- Go to http://www.browserstack.com/local-testing#command-line and download the correct binary for your platform
- Place the binary in to the binaries directory, and make sure it is name BrowserStackLocal