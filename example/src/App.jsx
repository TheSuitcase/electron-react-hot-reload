import React, { Component } from 'react'
import Button from './button'

class App extends Component{
  render(){
    return (
      <div style={{
        display: 'flex',
        flex: 1,
        backgroundColor: 'lightblue',
        flexDirection: 'column',
      }}>
        Hello world!
        <Button badge={4}/>
      </div>
    )
  }
}

export default App