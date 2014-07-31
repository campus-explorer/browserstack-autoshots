var exec = require('child_process').exec;

describe('Server fails if configuration is missing', function() {
    it('Should fail', function(done) {
        var badProcess = exec('node lib/app.js', function (err, stdout, stderr){
            expect(stderr.trim()).toEqual('Missing a browserstack.config file');
            done();
        })
    })
})