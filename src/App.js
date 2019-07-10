import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom'
import './App.css';
import GuestBook from './component/GuestBook';
import NewMessage from './component/Message';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Route exact path="/" component={GuestBook} />
          <Route exact path="/new_message" component={NewMessage} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
