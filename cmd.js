const { exec } = require('child_process');
exports.cmd=()=>{
exec('zip -r  public.zip ./public', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
}
