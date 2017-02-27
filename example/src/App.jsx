import React, { Component } from 'react'
import Button, { SubButton, data} from './button'
import Container from './container'

class App extends Component{
  render(){
    console.log('render', data)
    return (
      <div style={{
        display: 'flex',
        flex: 1,
        backgroundColor: 'lightblue',
        flexDirection: 'column',
      }}>
        Hello world!
       <Button badge={34}/>
       <SubButton/>
       <Button/>
       <Container/>
       data:{data.toString()}
      </div>
    )
  }
}

export default App