import React, { Component } from 'react'
import Button from './Button'

class Container extends Component{
  render(){
    return (
      <div style={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
        Container:
        <Button badge={"Awesome"}/>
      </div>
    )
  }
}

export default Container