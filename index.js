#!/usr/bin/env node
const {params,read} = require('./lib')

let cmd = params[0]

if(cmd==undefined || cmd=='-h' || cmd=='--help') {
  let helpfile = read('docs/help.txt','utf-8')
  console.log(helpfile)
}

else if(cmd=='release') {
  require('./lib/release')
}

else if(cmd=='filetree') {
  require('./lib/filetree')
}

else if(cmd=='server') {
  require('./lib/server')
}

else {
  console.error(`ii: Unknown command '${cmd}'`)
}