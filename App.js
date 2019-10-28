import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Platform} from 'react-native';

import Loading from './components/index/loading';
import Index from './components/index/index';
import Category from './components/index/category';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Verify from './components/auth/verify';
import BuyDetails from './components/buy/details';
import MessageDashboard from './components/message/dashboard';
import New from './components/sell/new';
import SellDashboard from './components/sell/dashboard';
import SellDetails from './components/sell/details';
import Favorites from './components/favorite/index';
import Edit from './components/edit/index';
import EditUser from './components/edit/user';
import MessageDetails from './components/message/details';

const MainNavigator = createStackNavigator({
  loading: {screen: Loading},
  main: {screen: Index},
  category: {screen: Category},
  login: {screen: Login},
  register: {screen: Register},
  verify: {screen: Verify},
  buyDetails: {screen: BuyDetails},
  new: {screen: New},
  messageDashboard: {screen: MessageDashboard},
  messageDetails: {screen: MessageDetails},
  sellDashboard: {screen: SellDashboard},
  sellDetails: {screen: SellDetails},
  favorites: {screen: Favorites},
  editDashboard: {screen: Edit},
  editUser: {screen: EditUser}
}, {
  transitionConfig : () => ({
  	transitionSpec: {
  		duration: 0
  	},
  })
});

const App = createAppContainer(MainNavigator);

export default App;
