import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  ListItemIcon,
} from '@material-ui/core';
import {
  Person as PersonIcon,
  Public as PublicIcon,
} from '@material-ui/icons';

import {Auth, API, graphqlOperation } from 'aws-amplify';

import { createPost } from '../graphql/mutations';
import { useNavigate } from 'react-router';

import { withAuthenticator } from '@aws-amplify/ui-react';


const drawerWidth = 340;
const MAX_POST_CONTENT_LENGTH: number = 140;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    position: 'relative',
  },
  drawerPaper: {
    width: drawerWidth,
    position: 'relative',
  },
  toolbar: theme.mixins.toolbar,
  textField: {
    width: drawerWidth,
  },
  list: {
    width: 300,
  },
}));

export default withAuthenticator(function Sidebar(props: any) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [value, setValue] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  const handleChange = (event: any) => {
    setValue(event.target.value);
    if (event.target.value.length > MAX_POST_CONTENT_LENGTH) {
      setIsError(true);
      setHelperText(String(MAX_POST_CONTENT_LENGTH - event.target.value.length));
    } else {
      setIsError(false);
      setHelperText('');
    }
  };

  const onPost = async () => {
    const res = await API.graphql(graphqlOperation(createPost, { input: {
        type: 'post',
        content: value,
        timestamp: Math.floor(Date.now() / 1000),
      }}));

    console.log(res)
    setValue('');
  }

  const signOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem
          button
          selected={props.activeListItem === 'global-timeline'}
          onClick={() => {
            Auth.currentAuthenticatedUser().then((user) => {
              navigate('/global-timeline');
            })
          }}
          key='global-timeline'
        >
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary="Global Timeline" />
        </ListItem>
        <ListItem
          button
          selected={props.activeListItem === 'profile'}
          onClick={() => {
            Auth.currentAuthenticatedUser().then((user) => {
              navigate('/' + user.username);
            })
          }}
          key='profile'
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem key='post-input-field'>
          <ListItemText primary={
            <TextField
              error={isError}
              helperText={helperText}
              id="post-input"
              label="Type your post!"
              multiline
              rowsMax="8"
              variant="filled"
              value={value}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          } />
        </ListItem>
        <ListItem key='post-button'>
          <ListItemText primary={
            <Button
              variant="contained"
              color="primary"
              disabled={isError}
              onClick={onPost}
              fullWidth
            >
              Post
            </Button>
          } />
        </ListItem>
        <ListItem key='logout'>
          <ListItemText primary={
            <Button
              variant="outlined"
              onClick={signOut}
              fullWidth
            >
              Logout
            </Button>
          } />
        </ListItem>
      </List>
    </Drawer>
  )
})