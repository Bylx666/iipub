const eol = require('os').EOL

/**
 * get formats. p refix,d irectory,f ile
 * @param {string} file input file name
 * @returns {object}
 */
module.exports=(file,readme='')=>{
  return {
    txt:{
      p: '| ', // prefix
      d: '+-['+file+']'+eol, // directory
      f: '+-'+file+eol, // file
      dr: '+-['+file+'] '+readme+eol // directory with readme
    },
    md:{
      p: '| ', 
      d: '+-['+file+']'+eol, 
      f: '+-'+file+eol,
      dr: '+-['+file+'] '+readme+eol
    },
    html:{
      p: '| ',
      d: '+-<span class="folder">'+file+'</span><br/>'+eol,
      f: '+-'+file+'<br/>'+eol,
      dr: '+-<span class="folder">'+file+' </span><span class="readme">'+readme+'</span><br/>'+eol
    }
  }
}