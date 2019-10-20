import React, {Component} from 'react';
import {AppRegistry, Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
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
      uploadStatus: "Profilbild bearbeiten",
      user: this.props.navigation.getParam('user', false),
      name: this.props.navigation.getParam('user', false).name,
      email: this.props.navigation.getParam('user', false).email,
      password: "",
      confirmPassword: "",
      error: "",
      university: this.props.navigation.getParam('user', false).university,
      onUniversity: false
    };
  };

  changeUserImageButton = async () => {
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (newPermission.status === 'granted') {
          ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images"
          })
          .then(res => {
            if (res.cancelled) return;
    
            ImageManipulator.manipulateAsync(
              res.uri, 
              [],
              { compress: 0.4 }
            )
            .then(manipulatedRes => {
              this.setState({"uploadStatus": "uploading..."});
              const formData = new FormData();
              formData.append('photo', {
                "uri": manipulatedRes.uri,
                "name": `photo.${manipulatedRes.uri.split('.').pop()}`,
                "type": `image/${manipulatedRes.uri.split('.').pop()}`
              });
      
              fetch("https://www.stumarkt.com/api/editUserProfile?id=" + this.state.user._id, {
                method: "POST",
                body: formData,
                headers: {
                  Accept: 'application/json',
                  'x_auth': API_KEY,
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then(response => {return response.json()})
              .then(data => {
                if (data && data.error)
                  return alert("Err: " + data.error);
                
                const newUser = this.state.user;
                newUser.profilePhoto = data.image;
                this.setState({"user": newUser, "uploadStatus": "Profilbild bearbeiten"});
              })
              .catch(err => {
                return alert("Err: " + err);
              });
            });
          })
          .catch(err => {
            return alert("Err: " + err);
          });
        }
    } else {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images"
      })
      .then(res => {
        if (res.cancelled) return;

        ImageManipulator.manipulateAsync(
          res.uri, 
          [],
          { compress: 0.4 }
        )
        .then(manipulatedRes => {
          this.setState({"uploadStatus": "uploading..."});
          const formData = new FormData();
          formData.append('photo', {
            "uri": manipulatedRes.uri,
            "name": `photo.${manipulatedRes.uri.split('.').pop()}`,
            "type": `image/${manipulatedRes.uri.split('.').pop()}`
          });
  
          fetch("https://www.stumarkt.com/api/editUserProfile?id=" + this.state.user._id, {
            method: "POST",
            body: formData,
            headers: {
              Accept: 'application/json',
              'x_auth': API_KEY,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {return response.json()})
          .then(data => {
            if (data && data.error)
              return alert("Err: " + data.error);
  
            const newUser = this.state.user;
            newUser.profilePhoto = data.image;
            this.setState({"user": newUser, "uploadStatus": "Profilbild bearbeiten"});
          })
          .catch(err => {
            return alert("Err: " + err);
          });
        });
      })
      .catch(err => {
        return alert("Err: " + err);
      });
    }
  };

  sendMainButtonController = () => {
    if (!this.state.name || !this.state.email) {
      this.setState({"error": "Please write all the necessary information"});
    } else {
      if (this.state.password.length) {
        if (this.state.password != this.state.confirmPassword) {
          this.setState({"error": "Bitte bestätige dein Passwort!"});
        } else if (this.state.password.length < 6) {
          this.setState({"error": "Dein Passwort muss mindestens 6-stellig sein!"});
        } else {
          fetch(`https://www.stumarkt.com/api/editUser?id=${this.state.user._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x_auth": API_KEY
            },
            body: JSON.stringify({
              "name": this.state.name,
              "email": this.state.email,
              "university": this.state.university,
              "password": this.state.password
            })
          })
            .then(response => {return response.json()})
            .then(data => {
              if (data.error && data.error == 'email already taken')
                return this.setState({"error": "Diese E-mail ist bereits registriert"});
              if (data.error && data.error == 'not valid email')
                return this.setState({"error": "Diese E-mail ist nicht verfügbar"});
              if (data.error) return alert("Err: " + data.error);
              if (!data.user) return alert("Err: An unknown erro occured, please try again.");

              this.props.navigation.push('editDashboard', {
                "user": data.user
              });
            })
            .catch(err => {
              alert("Err: " + err);
            });
        }
      } else {
        fetch(`https://www.stumarkt.com/api/editUser?id=${this.state.user._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x_auth": API_KEY
          },
          body: JSON.stringify({
            "name": this.state.name,
            "email": this.state.email,
            "university": this.state.university
          })
        })
          .then(response => {return response.json()})
          .then(data => {
            if (data.error && data.error == 'email already taken')
              return this.setState({"error": "Diese E-mail ist bereits registriert"});
            if (data.error && data.error == 'not valid email')
              return this.setState({"error": "Diese E-mail ist nicht verfügbar"});
            if (data.error) return alert("Err: " + data.error);
            if (!data.user) return alert("Err: An unknown erro occured, please try again.");

            this.props.navigation.push('editDashboard', {
              "user": data.user
            });
          })
          .catch(err => {
            alert("Err: " + err);
          });
      }
    }
  };

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation} ></Header>
        <View style={styles.content} >
          <ScrollView style={{flex: 1, width: "100%"}} contentContainerStyle={{flexGrow: 1}} ref="scrollView" >
            { !this.state.onUniversity ?
              <View style={styles.formWrapper}>
                <View style={styles.header} >
                  <Text style={styles.title} >
                    Einstellungen
                  </Text>
                </View>
                <TouchableOpacity style={styles.userImageWrapper} onPress={() => {this.changeUserImageButton()}} >
                  <Image style={styles.userImage} source={{uri: this.state.user.profilePhoto}} ></Image>
                  <Text style={styles.userText} >{this.state.uploadStatus}</Text>
                </TouchableOpacity>
                <Text style={styles.inputTitle} >Name:</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="Name"
                  onChangeText={(name) => { this.setState({name: name})}}
                  value={this.state.name}
                >
                </TextInput>
                <Text style={styles.inputTitle} >Email:</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="Email"
                  onChangeText={(email) => {this.setState({email: email})}}
                  value={this.state.email}
                >
                </TextInput>
                <Text style={styles.inputTitle} >Neues Passwort (min. 6-stelling):</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="Passwort"
                  onChangeText={(password) => {this.setState({password: password})}}
                >
                </TextInput>
                <Text style={styles.inputTitle} >Neues Passwort wiederholen:</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="Passwort Wiederholen"
                  onChangeText={(confirmPassword) => {this.setState({confirmPassword: confirmPassword})}}
                >
                </TextInput>
                <TouchableOpacity>
                  <Text></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={() => {this.sendMainButtonController()}} >
                  <Text style={styles.sendButtonText} > Einstellungen </Text>
                </ TouchableOpacity>
                <View style={styles.errorLineWrapper} >
                  <Text style={styles.errorLine} >{this.state.error}</Text>
                </View>
              </View>
              :
              <View style={styles.formWrapper} >
                <View style={styles.header} >
                  <Text style={styles.title} >
                    Select University
                  </Text>
                </View>
                <View style={styles.universitySearchWrapper} >
                <Image source={require('./../../assets/search-icon.png')} style={styles.universitySearchLogo} ></Image>
                  <TextInput style={styles.universitySearchInput} placeholder="Search" onChangeText={(text) => {this.searchUniversityController(text)}} ></TextInput>
                </View>
                <ScrollView style={styles.universityWrapper} >
                  { this.state.universityList.length ?
                    this.state.universityList.map((uni, key) => {
                      return (
                        <TouchableOpacity key={key} style={ this.state.university == uni ? styles.activeUniversityButton : styles.eachUniversityButton} onPress={() => {this.setState({"university": uni})}} >
                          <Text style={styles.eachUniversityText} >{uni}</Text>
                        </TouchableOpacity>
                      )
                    })
                    :
                    <Text style={styles.uniNoResult} >No result</Text>
                  }
                </ScrollView>
                <View style={styles.agreementWrapper} >
                  <Text style={styles.agreementText} >Ich bin mit den Folgenden einverstanden: </Text>
                  <TouchableOpacity>
                    <Text style={styles.agreementLink} >Nutzungsbedingungen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.agreementLink} >Datenschutzerklärung</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={() => {this.registerButtonController()}} >
                  <Text style={styles.sendButtonText} > Registrieren </Text>
                </ TouchableOpacity>
                <View style={styles.errorLineWrapper} >
                  <Text style={styles.errorLine} >{this.state.error}</Text>
                </View>
              </View>
            }
          </ScrollView>
        </View>
        <NavBar navigation={this.props.navigation} pageName="user" ></NavBar>
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
    flex: 8, paddingBottom: 100, paddingLeft: 20, paddingRight: 20,
    justifyContent: "center", alignItems: "center"
  },
  formWrapper: {
    backgroundColor: "white", width: "100%", marginTop: 20, flex: 1, marginBottom: 200,
    paddingLeft: 20, paddingRight: 20,
    borderColor: "rgb(236, 236, 235)", borderWidth: 2, borderRadius: 5,
  },
  header: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 20, marginTop: 10,
  },
  title: {
    fontSize: 25, color: "rgb(112, 112, 112)", fontWeight: "200",
    flex: 3
  },
  formInput: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10,
    borderColor: "rgb(236, 236, 235)", borderWidth: 2, borderRadius: 5,
    color: "rgb(112, 112, 122)", fontSize: 16,
    marginBottom: 15
  },
  userImageWrapper: {
    alignSelf: "center", alignItems: "center"
  },
  userImage: {
    width: 200, height: 200, borderRadius: 100,
    resizeMode: "contain",
  },
  userText: {
    color: "rgb(112, 112, 112)", fontSize: 15, fontWeight: "300",
    marginBottom: 5, marginTop: 2
  },
  inputTitle: {
    color: "rgb(112, 112, 112)", fontSize: 18,
    marginBottom: 5
  },
  universityWrapper: {
    height: 200,
    marginBottom: 15, paddingBottom: 20, paddingLeft: 10, paddingRight: 10
  },
  universitySearchWrapper: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 15
  },
  universitySearchInput: {
    color: "rgb(112, 112, 112)", fontSize: 16
  },
  universitySearchLogo: {
    height: 15, width: 15, resizeMode: "contain",
    marginRight: 5
  },
  uniNoResult: {
    color: "rgb(112, 112, 112)", fontSize: 15, fontWeight: "300", textAlign: "center",
    marginTop: 25
  },
  eachUniversityButton: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10, marginBottom: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 5
  },
  activeUniversityButton: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10, marginBottom: 10,
    borderColor: "rgb(255, 61, 148)", borderWidth: 2, borderRadius: 5
  },
  eachUniversityText:{
    color: "rgb(112, 112, 112)", fontSize: 14, fontWeight: "600", textAlign: "center"
  },
  sendButton: {
    backgroundColor: "rgba(255, 108, 128, 0.3)",
    justifyContent: "center", alignItems: "center",
    borderColor: "rgba(255, 61, 148, 0.4)", borderWidth: 2, borderRadius: 5,
    padding: 10
  },
  sendButtonText: {
    color: "rgb(255, 61, 148)", fontWeight: "700", fontSize: 16
  },
  errorLineWrapper: {
    flexDirection: "row",
    marginTop: 10, marginBottom: 20
  },
  errorLine: {
    flex: 1,
    fontSize: 13, color: "rgb(255, 61, 148)", textAlign: "center"
  }
});


AppRegistry.registerComponent('Index', () => Index);
