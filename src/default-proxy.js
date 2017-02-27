import chokidar from 'chokidar'

class Handler {
  constructor({ targets = [], newComponent}){
    this.targets = targets
    this.newComponent = newComponent
  }
  setNewComponent(newComponent){
    this.newComponent = newComponent;
  }
  get(target, key){
    console.log('get', target, key)
    if(method === 'toString'){
      return () => {return target.default.toString() }
      // return obj.default.toString
    }
    return target.default[method]
  }
}

class InnerProxy{
  constructor({ Component, outerProxy }){
    this.Component = Component
    this.outerProxy = outerProxy
  }
  construct(target, args){
    return new Proxy(
      new target(...args),
      this.outerProxy
    )
  }
}


class ReactProxy {
  constructor(Component, name, filename){
    this.Component = Component
    this.newComponent = Component;

    this.filename = filename
    this.targets = [];
    this.watch;
    this.name = name;

    // this.outerProxy = new OuterProxy({
    //   targets: this.targets,
    //   newComponent: this.newComponent,
    // })

    // this.innerProxy = new InnerProxy({
    //   Component: this.Component,
    //   outerProxy: this.outerProxy
    // })

    this.watchFile()

    return new Proxy(this.Component, {
      get: ::this.get,
    })
  }
  watchFile(){
    this.watcher = chokidar.watch(
      this.filename,
      {
        ignored: /(^|[\/\\])\../,
        persistent: true,
      }
    )

    this.watcher.on('change', ::this.fileDidChange)
  }
  get(target, method){
     if(method === 'toString'){
      return () => {return this.newComponent.default.toString() }
      // return obj.default.toString
    }
    return this.newComponent.default[method]
  }
  fileDidChange(path){
    // Empty the current cache for this file.
    delete require.cache[path]

    // Reload the file.
    let Component = require(path)
    // const name = this.Component.name
    const name = this.name
    console.log('file did change')
    if(Component[name]){
      Component = Component[name]
    }else if(Component.default.name == name){
      Component = Component.default
    }else{
      console.log(`Could not find ${name} in ${path}`)
      return;
    }

    // const newComponent = new Component();
    this.newComponent = {default: Component}

    // Update all targets and make them rerender.
    this.forceUpdateAllTargets()
  }
  forceUpdateAllTargets(){
    console.log('targets', this.targets)
    this.targets.forEach((target) => {
      target.forceUpdate()
    })
  }
}

export default ReactProxy;