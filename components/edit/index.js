import React, {Component} from 'react';
import {AsyncStorage, AppRegistry, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class Index extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false)
    };
  };

  logoutButtonController = async () => {
    try {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('notificationPermissionStatus');
      this.props.navigation.navigate('login')
    }
    catch(exception) {
      alert("Err: An unknown error occured");
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation} ></Header>
        <View style={styles.content} >
          <ScrollView style={{width: "100%", flex: 1}} >
            <View style={styles.userWrapper} >
              <TouchableOpacity style={styles.editIconWrapper} onPress={() => {this.props.navigation.push('editUser', {user: this.state.user})}} >
                <Image source={require('./../../assets/edit-icon.png')} style={styles.editIcon} ></Image>
              </TouchableOpacity>
              <Image source={{uri: this.state.user.profilePhoto}} style={styles.profilePhoto}></Image>
              <Text style={styles.userName} >{this.state.user.name}</Text>
              <Text style={styles.userUni} >{this.state.user.university}</Text>
            </View>
            <TouchableOpacity style={styles.productsButton} onPress={() => {this.props.navigation.navigate('sellDashboard', {'user': this.state.user})}}>
              <Text style={styles.productsButtonText} >Meine Anzeigen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={() => {this.logoutButtonController()}}>
              <Text style={styles.logoutButtonText} >Ausloggen</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <NavBar navigation={this.props.navigation} pageName="user" ></NavBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1
  },
  content: {
    flex: 8, paddingLeft: 20, paddingRight: 20,
    backgroundColor: "rgb(248, 248, 248)",
    justifyContent: "center", alignItems: "center"
  },
  userWrapper: {
    width: "100%", marginTop: 20, flex: 1
  },
  editIconWrapper: {
    justifyContent: "center", alignItems: "center",
    marginBottom: -30, marginLeft: "auto",
    width: 40, height: 40, 
    borderColor: "rgb(82, 82, 82)", borderWidth: 2, borderRadius: 20
  },
  editIcon: {
    height: 20
  },
  profilePhoto: {
    width: 200, height: 200,
    resizeMode: "contain", alignSelf: "center"
  },
  userName: {
    alignSelf: "center", marginTop: 15,
    color: "rgb(82, 82, 82)", fontSize: 28, fontWeight: "700"
  },
  userUni: {
    alignSelf: "center", marginTop: 10, textAlign: "center",
    color: "rgb(82, 82, 82)", fontSize: 18, fontWeight: "300"
  },
  productsButton: {
    backgroundColor: "rgb(255, 94, 135)", padding: 15, borderRadius: 25,
    justifyContent: "center", alignItems: "center", marginTop: 100, alignSelf: "center"
  },
  productsButtonText: {
    color: "white", fontWeight: "700", fontSize: 20
  },
  logoutButton: {
    alignSelf: "center", marginTop: 10, marginBottom: 50
  },
  logoutButtonText: {
    color: "rgb(255, 94, 135)", fontSize: 18, fontWeight: "300", textDecorationLine: "underline"
  }
});


AppRegistry.registerComponent('Index', () => Index);
