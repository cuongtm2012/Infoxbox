const child_process = require('child_process');
var path = require('path');
const __dad = path.join(__dirname, '../..');
const pathSh = path.join(__dad, 'shellScript', 'restartPm2.sh');

module.exports = {
    restartInternal: function () {
        const ls = child_process.exec(pathSh, function (error, stdout, stderr) {
            if (error !== null) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
            }
            console.log('Child Process STDOUT: ' + stdout);
            console.log('Child Process STDERR: ' + stderr);
        });

        ls.on('exit', function (code) {
            console.log('Child process exited with exit code ' + code);
        });
    }
}