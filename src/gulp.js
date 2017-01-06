import through from 'through2'
import path from 'path'
import Vinyl from 'vinyl'

// Tranfrom .jsx files into 
// _component.js (actual contents)
// component.js (proxy)

const proxyFile = (filename) => {
  return [
    `import { ReactProxy } from '../../dist'`,
    `import Component from './${filename}'`,
    `export default new ReactProxy(Component, __dirname + '/${filename}')`,
  ].join('\n')
}

const isJsx = (filePath) => {
  return path.extname(filePath) === '.jsx'
}

const addUnderscoreToFileName = (file) => {
  const { path } = file
  const slices = path.split('/')
  const filename = slices.pop()

  slices.push(`_${filename}`)

  return slices.join('/')
}

const replaceExtension = (filename, extension) => {
  const slices = filename.split('.')
  const oldExtension = slices.pop()
  slices.push(extension)
  return slices.join('.')
}


export default function(){

  const buffer = function(file, enc, cb){    
    if(!isJsx(file.path)){
      cb(null, file)
      return;
    }

    const originalPath = file.path;

    // Change file path from 'Component.jsx' to '_Component.jsx'
    file.path = addUnderscoreToFileName(file, '_[filename].jsx')
    const orginialFilename = path.basename(file.path)
    const newFilename = replaceExtension(orginialFilename, 'js')

    this.push(new Vinyl({
      path: path.basename(originalPath),
      contents: new Buffer(proxyFile(newFilename))
    }))

    cb(null, file)
  }

  const endStream = function(cb){
    cb()
  }

  return through.obj(buffer, endStream);
}