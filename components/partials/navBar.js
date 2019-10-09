import React, {Component} from 'react';
import {AppRegistry, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import { white } from 'ansi-colors';

export default class NavBar extends Component{
  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false)
    };
  };

  navigateController = (page) => {
    this.props.navigation.push(page, {"user": this.state.user});
  }

  render() {
    return (
      <View style={styles.navigationBar} >
        <TouchableOpacity style={styles.mainPageNavButton} onPress={() => {this.navigateController('main')}} >
          { this.props.pageName == "main" ? 
            <Image source={require('./../../assets/main-page-nav-icon-selected.png')} style={styles.navButtonImage} ></Image>
            :
            <Image source={require('./../../assets/main-page-nav-icon.png')} style={styles.navButtonImage} ></Image>
          }
        </TouchableOpacity>
        <TouchableOpacity style={styles.messagesPageNavButton} onPress={() => {this.navigateController('messageDashboard')}} >
          { this.props.pageName == "message" ? 
            <Image source={require('./../../assets/messages-page-nav-icon-selected.png')} style={styles.navButtonImage} ></Image>
            :
            <Image source={require('./../../assets/messages-page-nav-icon.png')} style={styles.navButtonImage} ></Image>
          }
        </TouchableOpacity>
        <View style={styles.newProductNavButtonWrapper}>
          <TouchableOpacity style={styles.newProductNavButton} onPress={() => {this.navigateController('new')}} >
            <Image source={require('./../../assets/new-page-nav-icon.png')} style={styles.navButtonImage} ></Image>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.favoritesPageNavButton} onPress={() => {this.navigateController('favorites')}} >
          { this.props.pageName == "favorite" ? 
            <Image source={require('./../../assets/favorites-page-nav-icon-selected.png')} style={styles.navButtonImage} ></Image>
            :
            <Image source={require('./../../assets/favorites-page-nav-icon.png')} style={styles.navButtonImage} ></Image>
          }
        </TouchableOpacity>
        <TouchableOpacity style={styles.userPageNavButton} onPress={() => {this.navigateController('editDashboard')}} >
          { this.props.pageName == "user" ? 
            <Image source={require('./../../assets/user-page-nav-icon-selected.png')} style={styles.navButtonImage} ></Image>
            :
            <Image source={require('./../../assets/user-page-nav-icon.png')} style={styles.navButtonImage} ></Image>
          }
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: "white",
    position: "absolute", width: "100%", zIndex: 2,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    bottom: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 10
  },
  mainPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderColor: "rgb(112, 112, 112)", borderWidth: 1, borderTopLeftRadius: 20, borderBottomLeftRadius: 20
  },
  messagesPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderTopColor: "rgb(112, 112, 112)", borderTopWidth: 1, borderBottomColor: "rgb(112, 112, 112)", borderBottomWidth: 1
  },
  favoritesPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderTopColor: "rgb(112, 112, 112)", borderTopWidth: 1, borderBottomColor: "rgb(112, 112, 112)", borderBottomWidth: 1
  },
  userPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderColor: "rgb(112, 112, 112)", borderWidth: 1, borderTopRightRadius: 20, borderBottomRightRadius: 20
  },
  newProductNavButtonWrapper: {
    width: 75
  },
  newProductNavButton: {
    justifyContent: "center", alignItems: "center", height: 75, width: 75,
    backgroundColor: "rgb(255, 94, 135)", 
    borderColor: "rgb(112, 112, 112)", borderWidth: 1, borderRadius: 23
  },
  navButtonImage: {
    height: 35, width: 35,
    resizeMode: "contain",
  },
});

AppRegistry.registerComponent('NavBar', () => NavBar);
