# documents
`ii filetree -o tree -g f`

You can use `ii -h` for help!
`Cd` to your work directory first, because the program work based on your current directory.
## available commands
1. `release` run publish commands
2. `filetree` build a filetree with markdown, html etc.
3. `server` run a local server for your current folder.

## values
### `boolean`
You can use `t`, `true`, `f` and `false` for a boolean value.
***
## details
### `release`
`ii release` == `npm version patch && npm publish && git push --follow-tags`
#### params
no params available for `ii release`
***

### `filetree`
build a text file containing the file structure of the directory.
#### `-o`, `--output` 
set name for output file. Default of 'filetree'
#### `-t`, `--type`
using file type. Available in 'html','markdown', 'md' and 'txt'.
#### `-g`, `--gitignore`
use .gitignore file. Values with boolean. Default 't'.
#### `-s`, `--subfolder`
use only the referred folder to make a file tree. Value with a string of your folder inside current directory.
#### `--try-readme`
try to read readme file in each directory and note for the directory. Values with filename, with empty to use default 'readme.md'
***

### `server`
run a local static server. It is able to return correct mime type according to file suffix.
#### `-p`, `--port`
set port for the server
#### `-acao`, `--allow-cors`
set Access-Control-Allow-Origin to '*'. Values with  boolean. Default 't'.
#### `-pd`, `--print-detail`
print every requests of the file. Values boolean Default 't'.
#### `-i`, `--index`
set the index file. Default 'index.html'.
#### `--set-mime`
do NOT accept values. Run `ii server --set-mime` to configure mime types.
***
