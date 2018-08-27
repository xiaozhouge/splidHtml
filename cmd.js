
exports.cmd = function (cmd){
    let  exec = require('child_process').exec; 
    let  cmdStr = cmd;
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            console.log('get weather api error:'+stderr);
        } else {
            let  data = JSON.parse(stdout);
            console.log(data);
        }
    });
}