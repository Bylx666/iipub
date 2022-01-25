const { exec } = require('child_process')

exec('npm version patch && npm publish && git push --follow-tags',(err,stdout,stderr)=>{
  if(err) {
    console.log(err)
  }else {
    console.log(stdout)
    console.log(stderr)
  }
})