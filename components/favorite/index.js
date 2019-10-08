import React, {Component} from 'react';
import {AppRegistry, Text, View, StyleSheet} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

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

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation} ></Header>
        <View style={styles.content} >
          <Text style={styles.contentText} >Dieses Feature wird im kurzen verfügbar.</Text>
        </View>
        <NavBar navigation={this.props.navigation} pageName="favorite" ></NavBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
  },
  content: {
    flex: 8, paddingBottom: 100,
    justifyContent: "center", alignItems: "center"
  },
  contentText: {
    color: "rgb(112, 112, 112)", fontSize: 20
  }
});


AppRegistry.registerComponent('Index', () => Index);
