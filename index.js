#!/usr/bin/env node
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

let params = process.argv.slice(2)
let root = process.cwd()
const get = (prm) => {
  if(params.indexOf(prm)==-1) return undefined
  else return params[params.indexOf(prm) + 1]
}
const read = (file, encode=undefined) => {
  let filepath = path.join(__dirname,file)
  return fs.readFileSync(filepath, encode)
}

let cmd = params[0]
let file = get('-h')
console.log(cmd,file)

if(cmd==undefined || cmd=='-h' || cmd=='--help') {
  let helpfile = read('docs/help.txt','utf-8')
  console.log(helpfile)
}

else if(cmd=='release') {
  exec('npm version patch && npm publish && git push --follow-tags',(err,stdout,stderr)=>{
    if(err) {
      console.log(err)
    }else {
      console.log(stdout)
      console.log(stderr)
    }
  })
}

else if(cmd=='filetree') {

}

else {
  console.error('ii: Unknown command')
}