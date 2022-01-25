const templates = require('./filetree/templates')
const path = require('path')
const fs = require('fs')
const rl = require('readline')
const eol = require('os').EOL
const { root, get, read, tf, params } = require('./index.js')

let type = get('-t') || get('--type') || 'md'
let filename = (get('-o') || get('--output') || 'filetree')+'.'+type
let gitignore = tf('-g','--gitignore','t')
let folder = path.join(root, get('-s') || get('--subfolder') || '/')
let readme
if(params.indexOf('--try-readme')!=-1) readme = get('--try-readme') || 'readme.md'


const getReadme = (fileDir)=>{
  try {
    let filePath = path.join(fileDir,readme)
    let file = fs.readFileSync(filePath,{ encoding: 'utf-8' })
    fileLines = file.split(eol)
    console.log(filePath+' resolved')
    if(fileLines[0].indexOf('#')==-1) return fileLines[0]
    else {
      if(fileLines[1]!=undefined) return fileLines[1]
    }
    return ''
  }catch(e) {
    return ''
  }
}

let data = ''
let ignores = []
/**
 * core of the filetree program, writes data into `data` string.
 * @param {string} dirPath input directory
 * @param {string} parPath its parent directory
 * @param {number} fileLevel its level
 * @returns void
 */
const readEach = (dirPath,fileLevel)=>{
  fs.readdirSync(dirPath).forEach((file)=>{
    if(file=='.git'||file=='.gitignore'||file=='node_module') return
    if(gitignore) {
      let isBreak = false
      ignores.forEach((igFile)=>{
        if(file==igFile) isBreak = true
      })
      if(isBreak) return
    }

    let filepath = path.join(dirPath,file)
    let tmpl
    if(readme!=undefined) {
      tmpl = templates(file,getReadme(filepath))[type] 
          || templates(file,getReadme(filepath))['txt']
    }else {
      tmpl = templates(file)[type] || templates(file)['txt']
    }
    for (let i = 0; i < fileLevel; i++) {
      data += tmpl.p
    }
    if(fs.statSync(filepath).isDirectory()) {
      if(readme!=undefined) {
        data += tmpl.dr
      }else {
        data += tmpl.d
      }
      readEach(filepath,fileLevel+1)
    }else {
      data += tmpl.f
    }
  })
}

if(type=='markdown') type = 'md'
let outputPath = path.join(root,filename)
fs.open(outputPath, 'wx', (err)=>{
  if(err) {
    if(!err.code=='EEXIST') return
    let q = rl.createInterface({
      input:process.stdin,
      output:process.stdout
    })
    q.question(filename+' already exists. over ride it? (Y/n)',(ans)=>{
      q.close()
      if(ans=='n'||ans=='no'||ans=='No'||ans=='NO'||ans=='N') return
      start()
    })
  }else {
    console.log(`New file: ${outputPath}`)
    start()
  }
})

const start = ()=>{
  if(gitignore) {
    try{
      ignores = fs.readFileSync(path.join(folder,'.gitignore'),{encoding:'utf8'}).split(eol) 
    }catch (err) {
      console.warn(`Ignore file not found: ${err}`)
    }
  }
  
  if(templates()[type]==undefined) type='txt'
  if(type!='txt') data+=read('filetree/templates/a.'+type,'utf8')
  readEach(folder,0)
  if(type!='txt') data+=read('filetree/templates/b.'+type,'utf8')
  fs.writeFileSync(outputPath,data)
  console.log('DONE.')
}
