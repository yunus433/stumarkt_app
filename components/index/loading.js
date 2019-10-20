import React, {Component} from 'react';
import {AsyncStorage, AppRegistry, View, ActivityIndicator, StyleSheet} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

export default class Loading extends Component{
  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');

      if (email != null && password != null) {
        await fetch("https://www.stumarkt.com/api/login?email=" + email + "&password=" + password, {
          headers: {
            "x_auth": API_KEY
          }
          })
          .then(response => {return response.json()})
          .then(data => {
            if (data.error || !data.user)
              return this.props.navigation.push('login'); 

            this.props.navigation.push('main', {"user": data.user});
          })
          .catch(err => {
            this.props.navigation.push('login');
          });
      } else {
        this.props.navigation.push('login');
      }
    } catch (error) {
      this.props.navigation.push('login');
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <ActivityIndicator size="large" color="rgb(255, 67, 148)" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
    justifyContent: "center",
    alignItems: "center"
  }
});


AppRegistry.registerComponent('Loading', () => Loading);
