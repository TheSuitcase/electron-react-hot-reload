import through from 'through2'
import path from 'path'
import Vinyl from 'vinyl'

// Tranfrom .jsx files into 
// _component.js (actual contents)
// component.js (proxy)

const proxyFile = (filename) => {
  return [
    // `import { ReactProxy } from 'electron-react-hot-reload'`,
    `import { ReactProxy, DefaultProxy } from '${path.join(__dirname, '../dist')}'`,
    `import React from 'react'`,
    `import * as im from './${filename}'`,
    `const im2 = {...im}`,
    `const forExport = {__esModule: true}`,
    `console.log('import', im)`,

    `
      console.log('proxyFile: ', '${filename}')
      Object.keys(im).forEach((item) => {
        if(Object.getPrototypeOf(im[item]).name === 'ReactComponent'){
          im2[item] = new ReactProxy(im[item], __dirname + '/${filename}')
        }else{
          im2[item] = new DefaultProxy({default: im[item]}, item, __dirname + '/${filename}')
          // im2[item] = new Proxy({default: im[item]}, {
          //   get(obj, method, proxy){
          //     console.log('get', method)
          //     // return Reflect.get(obj.default, method);
          //     if(method === 'toString'){
          //       return () => {return obj.default.toString() }
          //       // return obj.default.toString
          //     }
          //     return obj.default[method]
          //   }

          // })
        }
      })


      console.log('exports', im2)
      im2.__esModule = true;
      module.exports = im2
    `

  ].join('\n')
}

const isJsx = (filePath) => {
  return path.extname(filePath) === '.jsx'
}

const addUnderscoreToFileName = (path) => {
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
    file.path = addUnderscoreToFileName(file.path)
    const orginialFilename = path.basename(file.path)
    const newFileName = replaceExtension(orginialFilename, 'js')
console.log('newfilename', newFileName)
    this.push(new Vinyl({
      base: file.base,
      path: originalPath,
      contents: new Buffer(proxyFile(newFileName))
    }))

    cb(null, file)
  }

  const endStream = function(cb){
    cb()
  }

  return through.obj(buffer, endStream);
}