import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import queryString from 'query-string'

const HOST = 'http://127.0.0.1:8000';
const LIMIT = 10;

class GuestBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      count: null,
      nextPage: null,
      previousPage: null
    };
    this.routeChange = this.routeChange.bind(this);
    this.pageDown = this.pageDown.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount() {
    if (this.props.location.search === '') {
      this.setState({page: 1}); 
      this.getMessages(HOST+'/api/messages/');
    } else {
      const values = queryString.parse(this.props.location.search);
      this.getMessages(values.page);
    }
  }

  getMessages(page) {
    this.setState({page: page});

    fetch(HOST+'/api/messages/?limit='+LIMIT+'&offset='+parseInt((LIMIT*(page-1))))
    .then(response => response.json())
    .then(result => this.setState({ 
      messages: result['results'], 
      count: result['count'], 
      nextPage: result['next'],
      previousPage: result['previous'] 
      }));
  }

  pageDown() {
    this.props.history.push('/?page='+(+this.state.page - +1));
    this.getMessages((+this.state.page - +1));
  }
  pageUp() {
    this.props.history.push('/?page='+(+this.state.page + +1));
    this.getMessages((+this.state.page + +1));
  }

  routeChange() {
    let path = `/new_message`;
    this.props.history.push(path);
  }

  render() {
    const { messages } = this.state;

    return (
      <div className='guest-book'>
        <h2>Гостевая книга (тестовая)</h2>
        <List>
          {messages.map(message =>
            <div>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar> {message.username.substring(0, 1)} </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={message.text}
                  secondary={
                    <React.Fragment>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }}>
                        <div>
                          {message.username}
                        </div>
                        <div>
                          {message.email} - {message.created_at}
                        </div>
                      </div>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          )}
        </List>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button style={{ margin: '20px' }} variant="contained" onClick={this.routeChange}>
            добавить сообщение
          </Button>
          <div>
            { this.state.previousPage !== null ? 
              <Button style={{ margin: '20px' }} variant="contained" onClick={this.pageDown}>
                Ранее
              </Button> : null 
            }
            { this.state.nextPage !== null ? 
              <Button style={{ margin: '20px' }} variant="contained" onClick={this.pageUp}>
                Далее
              </Button> : null 
            }
          </div>
        
        </div>
      
      </div>
      
    );
  }
}

export default GuestBook;