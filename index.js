#!/usr/bin/env node
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const rl = require('readline')
const templates = require('./filetree/templates')
const http = require('http')

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

let cmd = params[0]

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
  let type = get('-t') || get('--type') || 'md'
  let filename = (get('-o') || get('--output') || 'filetree')+'.'+type
  let gitignore = tf('-g','--gitignore','t')
  let folder = path.join(root, get('-s') || get('--subfolder') || '/')

  let data = ''
  let ignores = []
  /**
   * core of the filetree program
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
      let tmpl = templates(file)[type] || templates(file)['txt']
      for (let i = 0; i < fileLevel; i++) {
        data += tmpl.p
      }
      if(fs.statSync(filepath).isDirectory()) {
        data += tmpl.d
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
        ignores = fs.readFileSync(path.join(folder,'.gitignore'),{encoding:'utf8'}).split(require('os').EOL) 
      }catch(err){
        console.warn(`Ignore file not found: ${err.path}`)
      }
    }
    
    if(templates()[type]==undefined) type='txt'
    if(type!='txt') data+=read('filetree/templates/a.'+type,'utf8')
    readEach(folder,0)
    if(type!='txt') data+=read('filetree/templates/b.'+type,'utf8')
    fs.writeFileSync(outputPath,data)
    console.log('DONE.')
  }
}

else if(cmd=='server') {
  let port = parseInt( get('-p') || get('--port') || 8088 )
  let acao = tf('-acao','--allow-cors','t') 
  let pd = tf('-pd','--print-detail','t')
  let index = get('-i') || get('--index') || 'index.html'

  let server = http.createServer((req,res)=>{
    if(acao) res.setHeader('access-control-allow-origin','*')
    if(req.url=='/') req.url=index

    if(req.url=='/favicon.ico') {
      res.writeHead(200, {'content-type':'image/png'})
      res.end(read('server/favicon.png'))
    }else {
      try {
        let file = fs.readFileSync(path.join(root,req.url))
        res.writeHead(200)
        res.end(file)
      }catch (e) {
        if(pd) console.log(e.message)
        res.writeHead(404, {'content-type':'text/plain; charset=utf-8'})
        res.end('file not found')
      }
      
    }
    if(pd) console.log(req.url)
  }).listen(port)

  const listenAnotherPort = ()=>{
    port++
    server.listen(port)
  }
  server.on('error', (e)=>{
    if(e.syscall=='listen') {
      listenAnotherPort()
      rl.clearLine(process.stdout, 0)
      rl.cursorTo(process.stdout, 0)
      console.log(`server running at http://localhost:${port} → ${root}`)
    }
  })

  console.log(`server running at http://localhost:${port} → ${root}`)
}

else {
  console.error(`ii: Unknown command '${cmd}'`)
}