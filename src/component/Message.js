import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class Message extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      text: '',
      result: null,

      usernameError: false,
      emailError: false,
      textError: false,
    };
    this.clean = this.clean.bind(this);
    this.save = this.save.bind(this);
    this.routeChange = this.routeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }  

  routeChange() {
    let path = `/`;
    this.props.history.push(path);
  }

  handleChange(e) {
    this.setState({[e.target.id]: e.target.value});
  }

  handleSubmit() {
    this.setState({usernameError: false, textError: false, emailError: false});
    if (this.state.username === '') {
      this.setState({ usernameError: true });
    }
    if (this.state.text === '') {
      this.setState({ textError: true });
    }
    if (this.state.email === '' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email )) {
      this.setState({ emailError: true });
    }

    if (!this.state.usernameError && !this.state.emailError && !this.state.textError) {
      this.save();
    }

  }

  async save() {
    try {
      await fetch('http://127.0.0.1:8000/api/messages/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "username": this.state.username,
          "email": this.state.email,
          "text": this.state.text
        })
      })
      .then(response => response.json())
      .then(result => this.setState({ result: result }));
    } catch (error) {
      console.log(error);
    }
    if (this.state.result !== null) {
      if (this.state.result.success === 'true') {
        this.routeChange();
      }
      
      if (this.state.result !== null && 'failed' in this.state.result) {
        this.setState({ [this.state.result.failed + 'Error']: true });
      } 
    }
  }

  clean() {
    this.setState({ username: '', email: '', text: ''});
  }

  render() {
    return (
      <div>
        <TextField
          id="username"
          error={ this.state.usernameError }
          label="Username"
          value={this.state.username}
          onChange={this.handleChange.bind(this)}
          margin="normal"
        />
        {this.state.usernameError ?  <div style={{ color: 'red', fontSize: '12px' }}>Поле не может быть пустым</div> : null}
        <br/>
        <TextField
          id="email"
          error={ this.state.emailError }
          label="E-mail"
          type="email"
          value={this.state.email}
          onChange={this.handleChange.bind(this)}
          margin="normal"
        />
        {this.state.emailError ?  <div style={{ color: 'red', fontSize: '12px' }}>Невалидное значение E-mail</div> : null}
        <br/>
        <TextField
          id="text"
          error={ this.state.textError }
          label="Сообщение"
          value={this.state.text}
          multiline
          rows="4"
          onChange={this.handleChange.bind(this)}
          margin="normal"
        />
        {this.state.textError ?  <div style={{ color: 'red', fontSize: '12px' }}>Поле не может быть пустым</div> : null}
        <br/>
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          отправить
        </Button>
        <Button variant="contained" onClick={this.clean}>
          очистить
        </Button>
        <Button variant="contained" onClick={this.routeChange}>
          отмена
        </Button>
      </div>
    );
  }
}

export default Message;