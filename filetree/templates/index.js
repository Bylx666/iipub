const eol = require('os').EOL

module.exports=(file)=>{
  return {
    txt:{
      p: '| ', // prefix
      d: '+-['+file+']'+eol, // directory
      f: '+-'+file+eol // file
    },
    md:{
      p: '| ', 
      d: '+-['+file+']'+eol, 
      f: '+-'+file+eol
    },
    html:{
      p: '| ',
      d: '+-<span class="folder">'+file+'</span><br/>'+eol,
      f: '+-'+file+'<br/>'+eol
    }
  }
}