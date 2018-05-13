import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Title = ({text}) => <div>{text}</div>;

class App extends Component {
  state = {
    on: false,
    textInput: '',
    mainColor: 'blue'
  }
  componentDidMount() {}
  componentWillReceiveProps() {}
  handleStrings(str) { return !!str; }
  render() {
    return (
      <div className="App">
        <Title text='New title' />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ul className='dropdown'>
          <li>Test1</li>
          <li>Test2</li>
          <li>Test3</li>
        </ul>
        <p className='button-state'>{this.state.on ? 'Yes' : 'No'}</p>
        <button onClick={() => this.setState({ on: !this.state.on })}>Click</button>
        <p className='inputText'>{this.state.inputText}</p>
        <input onChange={evt => this.setState({ inputText: evt.currentTarget.value})}/>
        <p className={this.state.mainColor}>Everyone is Welcome!</p>
      </div>
    );
  }
}

export class Link extends Component {
  render() {
    return this.props.hide ? null : <a href={this.props.address}>Click</a>;
  }
}

export default App;
