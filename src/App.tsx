import React, {useState} from 'react'
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';

import {
  HashRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import AllPosts from './containers/AllPosts';
import PostsBySpecifiedUser from './containers/PostsBySpecifiedUser';

Amplify.configure(awsconfig);

const drawerWidth = 240;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#1EA1F2',
      contrastText: "#fff",
    },
    background: {
      default: '#15202B',
      paper: '#15202B',
    },
    divider: '#37444C',
  },
  typography: {
    fontFamily: [
      'Arial',
    ].join(','),
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    width: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  appBar: {
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const App = () => {
  const [authState, setAuthState] = useState() as any
  const [user, setUser] = useState() as any

  const classes = useStyles();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className={classes.root} >

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <Routes>
            <Route path='/' element={<AllPosts />} />
            <Route path='/global-timeline' element={<AllPosts />} />
            <Route path='/:userId' element={<PostsBySpecifiedUser />}/>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" }
        ]}
      />
    </AmplifyAuthenticator>
  );
}

export default App;