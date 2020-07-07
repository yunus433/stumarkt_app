import {createStackNavigator, createAppContainer} from 'react-navigation';

import Landing from './components/index/Landing';
import Loading from './components/index/Loading';
import Index from './components/index/Index';
import Filter from './components/index/Filter';

import Details from './components/buy/Details';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import Profile from './components/user/Profile';

import Favorites from './components/favorites/Favorites';

import New from './components/sell/New';

import Chat from './components/messages/Chat';
import Message from './components/messages/Message';


const MainNavigator = createStackNavigator({
  Loading: {screen: Loading},
  Landing: {screen: Landing},
  Register: {screen: Register},
  Login: {screen: Login},
  Index: {screen: Index},
  Filter: {screen: Filter},
  Details: {screen: Details},
  Profile: {screen: Profile},
  New: {screen: New},
  Favorites: {screen: Favorites},
  Chat: {screen: Chat},
  Message: {screen: Message}
}, {
  transitionConfig : () => ({
  	transitionSpec: {
  		duration: 0
  	},
  })
});

const App = createAppContainer(MainNavigator);

export default App;
