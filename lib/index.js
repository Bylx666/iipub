const path = require('path')
const fs = require('fs')

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
const tf = (valueA, valueB, defaultValue=false)=>{// true or false
  let input = get(valueA) || get(valueB) || defaultValue
  if(input=='f'||input=='false') input=false
  else if(input=='t'||input=='true') input=true
  else {
    let e = 'invalid boolean'+input+'! Available in `t`,`true`,`f` and `false`.'
    throw e
  }
  return input
}

module.exports={params,root,get,read,tf}