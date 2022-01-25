const eol = require('os').EOL

/**
 * get formats. p refix,d irectory,f ile
 * @param {string} file input file name
 * @returns {object}
 */
module.exports=(file)=>{
  return {
    txt:{
      p: '| ', // prefix
      d: '+-['+file+']', // directory
      f: '+-'+file // file
    },
    md:{
      p: '| ', 
      d: '+-['+file+']', 
      f: '+-'+file
    },
    html:{
      p: '| ',
      d: '+-<span class="folder">'+file+'</span><br/>',
      f: '+-'+file+'<br/>'
    }
  }
}