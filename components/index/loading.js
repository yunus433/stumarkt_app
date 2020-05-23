import React, {Component} from 'react';
import {AsyncStorage, AppRegistry, View, ActivityIndicator, StyleSheet} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

export default class Loading extends Component{
  static navigationOptions = {
    header: null
  };

  addNotificationStatusToAsyncStorage = async (status) => {
    try {
      await AsyncStorage.setItem('notificationPermissionStatus', status);
    } catch (error) {
      alert("An unknown error occured, please try again.");
    }
  }

  sendUserNotificationToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync();
    await this.addNotificationStatusToAsyncStorage("allowed");
    
    fetch("https://stumarkt.herokuapp.com/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x_auth": API_KEY
      },
      body: JSON.stringify({
        "id": this.state.user._id,
        "token": token
      })
    })
    .then(response => {return response.json()})
    .then(data => {
      if (data && data.error)
        return alert("Err: " + data.error);
  
      this.props.navigation.push('main', {"user": data.user});
    })
    .catch(err => {
      return alert("Err: " + err);
    });
  }

  getNotificationPermission = async () => {
    const permission = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (newPermission.status === 'granted') {
          this.sendUserNotificationToken();
        } else {
          this.addNotificationStatusToAsyncStorage("not allowed");
        }
    } else {
      this.sendUserNotificationToken();
    }
  }

  componentDidMount = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');

      if (email != null && password != null) {
        await fetch("https://stumarkt.herokuapp.com/api/login?email=" + email + "&password=" + password, {
          headers: {
            "x_auth": API_KEY
          }
          })
          .then(response => {return response.json()})
          .then(async (data) => {
            if (data.error || !data.user)
              return this.props.navigation.push('login'); 
            
              if (data.user.notificationToken == null) {
                this.getNotificationPermission();
              } else {
                this.props.navigation.push('main', {"user": data.user});
              }
          })
          .catch(err => {
            console.log(err);
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
