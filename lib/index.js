const path = require('path')
const fs = require('fs')

/**
 * command arguments
 * @this array process.argv.slice(2)
 */
let params = process.argv.slice(2)

/**
 * user directory
 * @this string process.cwd()
 */
let root = process.cwd()

/**
 * get value of an argument
 * @param {string} prm one param
 * @returns {string}
 */
const get = (prm) => {
  if(params.indexOf(prm)==-1) return undefined
  else {
    if(params[params.indexOf(prm) + 1]!=undefined) {
      if(params[params.indexOf(prm) + 1].indexOf('-')!=-1) {
        return undefined
      }
      else {
        return params[params.indexOf(prm) + 1]
      }
    }else {
      return undefined
    }
  }
}

/**
 * read an internal file
 * @param {string} file relative path of an internal file
 * @param {string} encode utf-8 for example
 * @returns {buffer}
 */
const read = (file, encode=undefined) => {
  let filepath = path.join(__dirname,file)
  return fs.readFileSync(filepath, encode)
}

/**
 * return arguments as boolean
 * @param {string} valueA first argument name
 * @param {string} valueB second one
 * @param {string} defaultValue set one of `t f true false` as default
 * @returns {boolean}
 */
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