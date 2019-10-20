import React, {Component} from 'react';
import {AppRegistry, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { API_KEY } from 'react-native-dotenv'

export default class NavBar extends Component{
  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false)
    };
  };

  navigateController = (page) => {
    fetch("https://www.stumarkt.com/api/users?id=" + this.state.user._id, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error)
          this.props.navigation.push('login');

          this.props.navigation.push(page, {"user": data.user});
      })
      .catch(err => {
        this.props.navigation.push('login');
      });
  }

  newProductButtonController = async () => {
    const permission = await Permissions.getAsync(Permissions.CAMERA);
    if (permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA);
        if (newPermission.status === 'granted') {
          ImagePicker.launchCameraAsync({
            mediaTypes: "Images",
            allowsEditing: "true"
          })
          .then(res => {
            if (res.cancelled) return;
    
            ImageManipulator.manipulateAsync(
              res.uri, 
              [],
              { compress: 0.4 }
            )
            .then(manipulatedRes => {
              const formData = new FormData();
              formData.append('photo', {
                "uri": manipulatedRes.uri,
                "name": `photo.${manipulatedRes.uri.split('.').pop()}`,
                "type": `image/${manipulatedRes.uri.split('.').pop()}`
              });
      
              fetch("https://www.stumarkt.com/api/newProductImage", {
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
      
                if (!data || !data.fileName)
                  return alert("Err: Unknown error occured, please try again");
                  
                this.props.navigation.push('new', {"user": this.state.user, "productPhotoArray": [data.fileName], "productPhotoNameArray": [manipulatedRes.uri]})
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
      ImagePicker.launchCameraAsync({
        mediaTypes: "Images",
        allowsEditing: "true"
      })
      .then(res => {
        if (res.cancelled) return;

        ImageManipulator.manipulateAsync(
          res.uri, 
          [],
          { compress: 0.4 }
        )
        .then(manipulatedRes => {
          const formData = new FormData();
          formData.append('photo', {
            "uri": manipulatedRes.uri,
            "name": `photo.${manipulatedRes.uri.split('.').pop()}`,
            "type": `image/${manipulatedRes.uri.split('.').pop()}`
          });
  
          fetch("https://www.stumarkt.com/api/newProductImage", {
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
  
            if (!data || !data.fileName)
              return alert("Err: Unknown error occured, please try again");
              
            this.props.navigation.push('new', {"user": this.state.user, "productPhotoArray": [data.fileName], "productPhotoNameArray": [manipulatedRes.uri]})
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
          { this.state.user.notReadMessage > 0 ?
            this.props.pageName == "message" ?
              <View style={styles.notReadMessageSelected} >
                <Text style={styles.notReadMessageText} >{this.state.user.notReadMessage}</Text>
              </View>
              :
              <View style={styles.notReadMessage} >
                <Text style={styles.notReadMessageText} >{this.state.user.notReadMessage}</Text>
              </View>
            :
            <View></View>
          }
          { this.props.pageName == "message" ? 
            <Image source={require('./../../assets/messages-page-nav-icon-selected.png')} style={styles.navButtonImage} ></Image>
            :
            <Image source={require('./../../assets/messages-page-nav-icon.png')} style={styles.navButtonImage} ></Image>
          }
        </TouchableOpacity>
        <View style={styles.newProductNavButtonWrapper}>
          <TouchableOpacity style={styles.newProductNavButton} onPress={() => {this.newProductButtonController()}} >
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
    height: 50,
    borderColor: "rgb(112, 112, 112)", borderWidth: 1, borderTopLeftRadius: 20, borderBottomLeftRadius: 20
  },
  messagesPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    height: 50,
    borderTopColor: "rgb(112, 112, 112)", borderTopWidth: 1, borderBottomColor: "rgb(112, 112, 112)", borderBottomWidth: 1
  },
  favoritesPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    height: 50,
    borderTopColor: "rgb(112, 112, 112)", borderTopWidth: 1, borderBottomColor: "rgb(112, 112, 112)", borderBottomWidth: 1
  },
  userPageNavButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    height: 50,
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
    height: 30, width: 30,
    resizeMode: "contain",
  },
  notReadMessage: {
    height: 25, width: 25,
    backgroundColor: "rgb(255, 94, 135)", zIndex: 2,
    marginLeft: "auto", marginRight: 5 ,marginBottom: -15,
    justifyContent: "center", alignItems: "center",
    borderColor: "rgb(112, 112, 112)", borderWidth: 2, borderRadius: 12.5
  },
  notReadMessageSelected: {
    height: 25, width: 25,
    backgroundColor: "rgb(255, 176, 101)", zIndex: 2,
    marginLeft: "auto", marginRight: 5 ,marginBottom: -15,
    justifyContent: "center", alignItems: "center",
    borderColor: "rgb(112, 112, 112)", borderWidth: 2, borderRadius: 12.5
  },
  notReadMessageText: {
    color: "white", fontSize: 12, fontWeight: "600"
  }
});

AppRegistry.registerComponent('NavBar', () => NavBar);
