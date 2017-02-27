import React, { Component } from 'react'

class Button extends Component{
  state = {
    count: 30,
  }
  renderBadge(){
    return `(${this.props.badge})`
  }
  render(){
    return (
      <div style={{ backgroundColor: 'lightgreen', padding: 10, borderRadius: 5, margin: 10}}>
        I am a button {this.renderBadge()} ({this.state.count})
      </div>
    )
  }
}

export default Button

export class SubButton extends Component{
  render(){
    return (
      <div> SubButton 2 </div>
    )
  }
}


export const data = "Hello, here is some data143!"