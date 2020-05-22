import React, {Component} from 'react';
import {Animated, Keyboard, AppRegistry, Text, Image, View, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import socketIO from 'socket.io-client';
import Constants from 'expo-constants';
import { API_KEY } from 'react-native-dotenv';

import Header from '../partials/header';

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class MessageDetails extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);

    this.state = {
      clicked: false,
      messageContent: this.props.navigation.getParam('messageContent', ""),
      messageInputWrapperHeight: 0,
      user: this.props.navigation.getParam('user', false),
      buyer: this.props.navigation.getParam('buyer', false),
      owner: this.props.navigation.getParam('owner', false),
      product: this.props.navigation.getParam('product', false),
      messagesOf: this.props.navigation.getParam('messagesOf', false),
      messages: [],
      message: null
    };

    this.scrollView = React.createRef();
    this.keyboardHeight = new Animated.Value(20);
    this.messagesWrapperMarginBottom = new Animated.Value(0);
  };

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.setState({"clicked": true});

    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: (Platform.OS == "ios" ? event.duration : 0),
        toValue: event.endCoordinates.height + (Platform.OS == "ios" ? 10 : 10),
      }),
      Animated.timing(this.messagesWrapperMarginBottom, {
        duration: (Platform.OS == "ios" ? event.duration : 0),
        toValue: event.endCoordinates.height + this.state.messageInputWrapperHeight,
      })
    ]).start();
    setTimeout(() => {
      this.scrollView.current._component.scrollToEnd({animated: Platform.OS == "ios"});
    }, (Platform.OS == "ios" ? event.duration + 100 : 100));
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: (Platform.OS == "ios" ? event.duration : 0),
        toValue: 20,
      }),
      Animated.timing(this.messagesWrapperMarginBottom, {
        duration: (Platform.OS == "ios" ? event.duration : 0),
        toValue: this.state.messageInputWrapperHeight
      })
    ]).start();
  };

  componentDidMount = () => {
    if (Platform.OS == "ios") {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    } else {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
      this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    const socket = socketIO('https://stumarkt.herokuapp.com');
    
    socket.connect();

    socket.on('connect', () => { 
      this.socket = socket;
      
      socket.emit('join', {
        room: this.state.user._id
      });

      socket.on('newMessage', params => {
        this.setState((state) => {
          const messagesArr = state.messages.concat(params.message);
  
          return {
            "messages": messagesArr
          }
        })
      });
    });

    if (this.props.navigation.getParam('messageContent', undefined)) {
      this.refs._messageInput.focus();
    }

    fetch('https://stumarkt.herokuapp.com/api/messages?buyer=' + this.state.buyer._id + '&product=' + this.state.product._id + '&sendedBy=' + (this.state.messagesOf == 'buyer' ? 'owner' : 'buyer') + '&user=' + this.state.user._id, {
      headers: {
        "x_auth": API_KEY
      }
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);
  
        this.setState({
          "messages": data.message.messages,
          "message": data.message
        });
      })
      .catch((err) => {
        return alert("Err: " + err);
      });
  };

  onNewMessageSend = () => {
    if (this.state.messageContent.length > 0 && this.socket) {
      const newMessageObject = {
        content: this.state.messageContent,
        buyerId: this.state.buyer._id,
        ownerId: this.state.owner._id,
        productId: this.state.product._id,
        sendedBy: this.state.messagesOf,
        read: false,
        createdAt: ""
      };

      this.socket.emit('newMessageSend', {
        message: newMessageObject,
        to: this.state[this.state.messagesOf]._id
      }, (err, message) => {
        if (err) return alert("Err " + err);

        this.setState((state) => {
          const messagesArr = state.messages.concat(message);

          return {
            "messages": messagesArr,
            "messageContent": ''
          }
        });

        this.refs._messageInput.clear();
      });
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <View style={styles.contentHeader} >
            <TouchableOpacity onPress={() => {this.props.navigation.push("messageDashboard", {"user": this.state.user});}} >
              <Image source={require('./../../assets/back-button.png')} style={styles.navButtonImage} ></Image>
            </TouchableOpacity>
            { this.state.messagesOf == "buyer" ? 
              <View style={{flexDirection: "row", alignItems: "center"}} >
                <Image source={{uri: this.state.owner.profilePhoto}} style={styles.userProfilePhoto} ></Image>
                <Text style={styles.userName} >{this.state.owner.name}</Text>
              </View>
              :
              <View style={{flexDirection: "row", alignItems: "center"}} >
                <Image source={{uri: this.state.buyer.profilePhoto}} style={styles.userProfilePhoto} ></Image>
                <Text style={styles.userName} >{this.state.buyer.name}</Text>
              </View>
            }
          </View>
          <Animated.ScrollView style={[styles.messageWrapper, {marginBottom: this.state.clicked ? this.messagesWrapperMarginBottom : this.state.messageInputWrapperHeight}]} ref={this.scrollView}
            onContentSizeChange={() => {  
            this.scrollView.current._component.scrollToEnd({animated: false});
          }} >
            {
              this.state.messages.map((message, key) => {
                if (message.sendedBy == this.state.messagesOf) {
                  if (key == 0) {
                    return (
                      <View key={key} >
                        <View style={styles.day_wrapper} >
                          <Text style={styles.each_day} >{message.day}</Text>
                        </View>
                        <View style={styles.each_message_wrapper_user} >
                          <Text style={styles.each_message_text_user} >{message.content}</Text>
                          <Text style={styles.each_message_time_user} >{message.time}</Text>
                        </View>
                      </View>
                    );
                  } else if (message.day != this.state.messages[key-1].day) {
                    return (
                      <View key={key} >
                        <View style={styles.day_wrapper} >
                          <Text style={styles.each_day} >{message.day}</Text>
                        </View>
                        <View style={styles.each_message_wrapper_user} >
                          <Text style={styles.each_message_text_user} >{message.content}</Text>
                          <Text style={styles.each_message_time_user} >{message.time}</Text>
                        </View>
                      </View>
                    );
                  } else {
                    return (
                      <View key={key} style={styles.each_message_wrapper_user} >
                        <Text style={styles.each_message_text_user} >{message.content}</Text>
                        <Text style={styles.each_message_time_user} >{message.time}</Text>
                      </View>
                    );
                  }
                } else {
                  if (key == 0) {
                    return (
                      <View key={key} >
                        <View style={styles.day_wrapper} >
                          <Text style={styles.each_day} >{message.day}</Text>
                        </View>
                        <View style={styles.each_message_wrapper} >
                          <Text style={styles.each_message_text} >{message.content}</Text>
                          <Text style={styles.each_message_time} >{message.time}</Text>
                        </View>
                      </View>
                    );
                  } else if (message.day != this.state.messages[key-1].day) {
                    return (
                      <View key={key} >
                        <View style={styles.day_wrapper} >
                          <Text style={styles.each_day} >{message.day}</Text>
                        </View>
                        <View style={styles.each_message_wrapper} >
                          <Text style={styles.each_message_text} >{message.content}</Text>
                          <Text style={styles.each_message_time} >{message.time}</Text>
                        </View>
                      </View>
                    );
                  } else {
                    return (
                      <View key={key} style={styles.each_message_wrapper} >
                        <Text style={styles.each_message_text} >{message.content}</Text>
                        <Text style={styles.each_message_time} >{message.time}</Text>
                      </View>
                    );
                  }
                }
              })
            }
          </Animated.ScrollView>
          <Animated.View style={[styles.messageInputWrapper, {bottom: this.keyboardHeight}]} 
            onLayout={(event) => {
              this.setState({"messageInputWrapperHeight": event.nativeEvent.layout.height + 25}); 
            }} >
            <TextInput style={styles.messageInput} placeholder="Mesajınızı yazın" value={this.state.messageContent} onChangeText={(content) => { this.setState({messageContent: content})}} ref="_messageInput" ></TextInput>
            <TouchableOpacity style={styles.messageSendButton}  onPress={() => {this.onNewMessageSend()}} >
              <Image source={require('./../../assets/send-icon.png')} style={styles.sendIcon} ></Image>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
    flex: 8,
    backgroundColor: "rgb(252, 249, 247)",
  },
  contentHeader: {
    alignItems: "center",
    height: 50, paddingLeft: 20, paddingRight: 20,
    backgroundColor: "white", flexDirection: "row",
    borderBottomWidth: 2, borderBottomColor: "rgb(236, 235, 235)",
  },
  userProfilePhoto: {
    width: 30, height: 30,
    resizeMode: "contain", borderRadius: 15,
    marginLeft: 20
  },
  userName: {
    fontSize: 15, color: "rgb(112, 112, 112)", fontWeight: "600",
    marginLeft: 10
  },
  messageWrapper: {
    padding: 20
  },
  day_wrapper: {
    alignSelf: "center", marginBottom: 15,
    backgroundColor: "rgb(236, 236, 236)",
    padding: 10, paddingLeft: 15, paddingRight: 15,
    borderRadius: 10
  },
  each_day: {
    fontSize: 15, fontWeight: "300", color: "rgb(112, 112, 112)"
  },
  each_message_wrapper_user: {
    maxWidth: "90%", alignItems: "flex-end",
    marginBottom: 15, marginLeft: "auto", padding: 15,
    borderRadius: 25, borderTopRightRadius: 0,
    backgroundColor: "rgba(255, 61, 148, 0.8)"
  },
  each_message_text_user: {
    color: "rgb(251, 251, 251)", fontWeight: "600", fontSize: 17,
    lineHeight: 25
  },
  each_message_time_user: {
    color: "rgb(251, 251, 251)", fontWeight: "400", fontSize: 15,
    marginTop: 3
  },
  each_message_wrapper: {
    maxWidth: "90%", marginRight: "auto", marginBottom: 15, padding: 15,
    borderRadius: 25, borderTopLeftRadius: 0,
    backgroundColor: "rgb(251, 251, 251)",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2
  },
  each_message_text: {
    color: "rgb(112, 112, 112)", fontWeight: "500", fontSize: 17,
    lineHeight: 25
  },
  each_message_time: {
    color: "rgba(112, 112, 112, 0.8)", fontWeight: "400", fontSize: 15,
    marginTop: 3
  },
  messageInputWrapper: {
    position: "absolute", width: "96%", height: "10%",
    backgroundColor: "white",
    flexDirection: "row", alignItems: "center",
    marginLeft: "2%", marginRight: "2%",
    borderWidth: 2, borderColor: "rgb(236, 235, 235)", borderRadius: 15
  },
  messageInput: {
    flex: 5, height: "90%",
    paddingLeft: 15,
    fontSize: 20, color: "rgb(112, 112, 112)"
  },
  messageSendButton: {
    flex: 1, height: "90%",
    justifyContent: "center", alignItems: "center",
  },
  sendIcon: {
    resizeMode: "contain",
    height: "60%", width: "60%"
  }
});


AppRegistry.registerComponent('MessageDetails', () => MessageDetails);
