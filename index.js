#!/usr/bin/env node
let params = process.argv.slice(2)
const get = (prm)=> {
  if(params.indexOf(prm)==-1) return undefined
  else return params[params.indexOf(prm) + 1]
}

let cmd = params[0]
let file = get('-h')
console.log(process.cwd(),cmd,file)
