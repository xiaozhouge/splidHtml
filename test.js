const { exec } = require('child_process');
exports.test=()=>{
exec('wget -i tmpImg.txt  -P /home/gxz/splidHtml/splidHtml/public', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
}
