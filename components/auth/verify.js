import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

export default class Login extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);

    this.state = {
      user: this.props.navigation.getParam('user', false),
      message: 'Wir haben dir eine Bestätigungsmail geschickt! Bitte bestätige diese um deine Registration abzuschließen. Falls du keine Mail bekommen haben solltest, klicke den unteren link.'
    };
  }

  newEmailButtonController = () => {
    fetch(`https://www.stumarkt.com/api/verify?id=${this.state.user._id}`, {
      headers: {
        "x_auth": API_KEY
      },
    })
    .then(response => {return response.json()})
    .then(data => {
      if (data.success) {
        this.setState({
          "message": "Check your inbox. You have a mail from us!"
        });
      } else {
        this.setState({
          "message": "Ups, something went wrong!"
        });
      }
    })
    .catch(err => {
      this.setState({
        "message": "Ups, something went wrong!"
      });
    })
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <View style={styles.innerWrapper} >
          <Text style={styles.verifyText} >{this.state.message}</Text>
          <TouchableOpacity style={styles.sendButton} onPress={() => {this.newEmailButtonController()}} >
            <Text style={styles.sendButtonText} >Schick eine neue E-mail!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
    padding: 25
  },
  innerWrapper: {
    backgroundColor: "white",
    padding: 20, paddingTop: 10, paddingBottom: 10,
    borderColor: "rgb(236, 236, 235)", borderWidth: 2, borderRadius: 5
  },
  verifyText: {
    fontSize: 20, color: "rgb(112, 112, 112)", fontWeight: "200", textAlign: "center",
    marginBottom: 25
  },
  sendButton: {
    backgroundColor: "rgba(255, 108, 128, 0.3)",
    borderColor: "rgba(255, 61, 148, 0.4)",
    borderWidth: 2,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  sendButtonText: {
    color: "rgb(255, 61, 148)",
    fontWeight: "700"
  }
});

AppRegistry.registerComponent('Login', () => Login);
