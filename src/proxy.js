import chokidar from 'chokidar'

class OuterProxy {
  constructor({ targets = [], newComponent}){
    this.targets = targets
    this.newComponent = newComponent
  }
  setNewComponent(newComponent){
    this.newComponent = newComponent;
  }
  get(target, key){
    if(this.targets.indexOf(target) === -1){
      this.targets.push(target)
    }

    if(key === 'props'){
      return target.props;
    }

    if(key === 'state'){
      if(this.newComponent){
        return this.newComponent.state;
      }
      return target[key]
    }

    if(this.newComponent){
      return this.newComponent[key]
    }

    return target[key]
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
  constructor(Component, filename){
    this.Component = Component
    this.newComponent = undefined;

    this.filename = filename
    this.targets = [];
    this.watch;

    this.outerProxy = new OuterProxy({
      targets: this.targets,
      newComponent: this.newComponent,
    })

    this.innerProxy = new InnerProxy({
      Component: this.Component,
      outerProxy: this.outerProxy
    })

    this.watchFile()

    return new Proxy(this.Component, this.innerProxy)
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
  fileDidChange(path){
    // Empty the current cache for this file.
    delete require.cache[path]

    // Reload the file.
    let Component = require(path)
    if(Component.default){
      Component = Component.default
    }

    const newComponent = new Component();
    this.outerProxy.setNewComponent(newComponent)

    // Update all targets and make them rerender.
    this.forceUpdateAllTargets()
  }
  forceUpdateAllTargets(){
    this.targets.forEach((target) => {
      target.forceUpdate()
    })
  }
}

export default ReactProxy;