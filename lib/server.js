const { exec } = require('child_process')
const http = require('http')
const path = require('path')
const fs = require('fs')
const rl = require('readline')
const eol = require('os').EOL
const { params, root, get, tf, read } = require('./index.js')

if(params.indexOf('--set-mime')!=-1) {
  exec(path.join(__dirname,'server/mime.types'), (error,stdout,stderr)=>{
    if(error) console.log(error)
    else {
      console.log(stdout)
      console.log(stderr)
    }
  })
  throw undefined
}

let port = parseInt( get('-p') || get('--port') || 8088 )
let acao = tf('-acao','--allow-cors','t') 
let pd = tf('-pd','--print-detail','t')
let index = get('-i') || get('--index') || 'index.html'

const getMime = ()=> {
  let mimefile = read('server/mime.types','utf-8')
    .replace(new RegExp(eol,'g'),'') // delete eols
    .replace('types {','').replace('}','') // delete outside of {}
    .replace(/ +/g,' ').replace(/(?<=;) /g,'').replace(/^ /,'') // cut spaces
    .split(';')
  let mimeList = []
  mimefile.pop() // delete last empty object in array
  mimefile.forEach((val)=>{
    val = val.split(' ')
    let dest = val[0]
    val.shift()
    mimeList.push({
      dest:dest,
      value:val
    })
  })
  return mimeList
}
let mimes = getMime()

let server = http.createServer((req,res)=>{
  if(acao) res.setHeader('access-control-allow-origin','*')
  if(req.url=='/') req.url=index

  if(req.url=='/favicon.ico') {
    res.writeHead(200, {'content-type':'image/png'})
    res.end(read('server/favicon.png'))
  }else {
    try {
      let file = fs.readFileSync(path.join(root,req.url))
      let fileSuffix = req.url.split('.').pop()
      let contentType
      mimes.forEach((obj)=>{
        obj.value.forEach((val)=>{
          if(fileSuffix==val) contentType = obj.dest
        })
      })
      if(!contentType) contentType = 'application/octet-stream'
      res.writeHead(200,{'content-type':contentType})
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
