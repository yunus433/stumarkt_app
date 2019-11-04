import React, {Component} from 'react';
import { AsyncStorage, AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

export default class Login extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: ''
    };
  }

  addUserToAsyncStorage = async (email, password, callback) => {
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      callback();
    } catch (error) {
      alert("Your account couldn't be saved. Please try again.")
    }
  };

  onLoginPageSend() {
    Keyboard.dismiss();
    if (this.state.email != '' && this.state.password != '' ) {
      fetch("https://www.stumarkt.com/api/login?email=" + this.state.email + "&password=" + this.state.password, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error && data.error == "User not found") 
          return this.setState({"error": "Sorry, your email or password is wrong"});
        if (data.error)
          return this.setState({"error": "Unknown error, please try again"});

        this.addUserToAsyncStorage(this.state.email, this.state.password, () => {
          this.props.navigation.push('main', {"user": data.user});
        });
      })
      .catch(err => {
        return this.setState({"error": "You must have internet connection to login"});
      });
    } else {
      this.setState({
        "error": "Please write your email and password"
      });
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <View style={styles.innerWrapper} >
          <Image source={require('./../../assets/main-icon.png')} style={styles.logo} ></Image>
          <View style={styles.formWrapper}>
            <View style={styles.header} >
              <Text style={styles.title} >
                Einloggen
              </Text>
              {/* <TouchableOpacity style={styles.lostPasswordWrapper} >
                <Text style={styles.lostPassword} > Passwort </Text>
                <Text style={styles.lostPassword} > vergessen? </Text>
              </TouchableOpacity> */}
            </View>
            <TextInput 
              style={styles.emailInput}
              placeholder="Email"
              onChangeText={(email) => { this.setState({email: email})}}
            >
            </TextInput>
            <TextInput 
              style={styles.passwordInput}
              placeholder="Passwort"
              onChangeText={(password) => {this.setState({password: password})}}
            >
            </TextInput>
            <TouchableOpacity
              onPress={this.onLoginPageSend.bind(this)} 
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText} > Einloggen </Text>
            </ TouchableOpacity>
            <View style={styles.errorLineWrapper} >
              <Text style={styles.errorLine} > {this.state.error} </Text>
            </View>
          </View>
          <View style={styles.bottomLink} >
            <Text style={styles.bottomLinkInfo} > Noch nicht registriert? </Text>
            <TouchableOpacity
              onPress={() => {this.props.navigation.navigate('register')}} 
            >
              <Text style={styles.bottomLinkButton} > In 30 Sekunden registrieren </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
    padding: 25
  },
  innerWrapper: {
    flex: 1
  },
  logo: {
    height: 50,
    width: 70,
    resizeMode: "contain",
    marginLeft: 20,
    marginBottom: 10
  },
  formWrapper: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: "rgb(236, 236, 235)",
    borderWidth: 2,
    borderRadius: 5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 25,
    color: "rgb(112, 112, 112)",
    fontWeight: "200",
    flex: 3
  },
  lostPassword: {
    color: "rgb(255, 61, 148)",
    fontSize: 10
  },
  lostPasswordWrapper: {
    flex: 1,
    alignItems: "flex-end"
  },
  emailInput: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10,
    borderColor: "rgb(236, 236, 235)",
    borderWidth: 2,
    borderRadius: 5,
    color: "rgb(112, 112, 122)",
    marginBottom: 15
  },
  passwordInput: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10,
    borderColor: "rgb(236, 236, 235)",
    borderWidth: 2,
    borderRadius: 5,
    color: "rgb(112, 112, 122)",
    marginBottom: 15
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
  },
  errorLineWrapper: {
    flexDirection: "row",
    marginTop: 10
  },
  errorLine: {
    fontSize: 13,
    color: "rgb(255, 61, 148)",
    flex: 1,
    textAlign: "center"
  },
  bottomLink: {
    paddingLeft: 20,
    marginTop: 10
  },
  bottomLinkInfo: {
    color: "rgb(112, 112, 112)",
    fontSize: 18,
    marginBottom: 5
  },
  bottomLinkButton: {
    color: "rgb(255, 61, 148)",
    fontSize: 18,
    fontWeight: "700"
  }
});

AppRegistry.registerComponent('Login', () => Login);
