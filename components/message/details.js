import React, {Component} from 'react';
import {Animated, Keyboard, AppRegistry, Text, Image, View, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import socketIO from 'socket.io-client'
import { API_KEY } from 'react-native-dotenv'

import Header from './../partials/header';

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
      messages: []
    };

    this.scrollView = React.createRef();
    this.keyboardHeight = new Animated.Value(20);
    this.messagesWrapperMarginBottom = new Animated.Value(0);
  };

  componentWillMount () {
    fetch('https://www.stumarkt.com/api/messages?buyerId=' + this.state.buyer._id + '&productId=' + this.state.product._id, {
      headers: {
        "x_auth": API_KEY
      }
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);

        this.setState({
          "messages": data.messages
        })
      })
      .catch((err) => {
        return alert("Err: " + err);
      })

    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  };

  keyboardWillShow = (event) => {
    this.setState({"clicked": true});

    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height + 10,
      }),
      Animated.timing(this.messagesWrapperMarginBottom, {
        duration: event.duration,
        toValue: event.endCoordinates.height + 10 + this.state.messageInputWrapperHeight,
      })
    ]).start(() => {
      this.scrollView.current._component.scrollToEnd({animated: false});
    });
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 20,
      }),
      Animated.timing(this.messagesWrapperMarginBottom, {
        duration: event.duration,
        toValue: this.state.messageInputWrapperHeight
      })
    ]).start();
  };

  componentDidMount() {
    const socket = socketIO('https://www.stumarkt.com');
    
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
  };

  onNewMessageSend = () => {
    if (this.state.messageContent.length > 0 && this.socket) {
      const newMessageObject = {
        content: this.state.messageContent,
        buyerId: this.state.buyer._id,
        buyerName: this.state.buyer.name,
        ownerName: this.state.owner.name,
        ownerId: this.state.owner._id,
        productProfile: this.state.product.productPhotoArray[0],
        productName: this.state.product.name,
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
            <TouchableOpacity onPress={() => {this.props.navigation.goBack(null)}} >
              <Image source={require('./../../assets/back-button.png')} style={styles.navButtonImage} ></Image>
            </TouchableOpacity>
          </View>
          <Animated.ScrollView style={[styles.messageWrapper, {marginBottom: this.state.clicked ? this.messagesWrapperMarginBottom : this.state.messageInputWrapperHeight}]} ref={this.scrollView}
            onContentSizeChange={() => {  
            this.scrollView.current._component.scrollToEnd({animated: false});
          }} >
            {
              this.state.messages.map((message, key) => {
                if (message.sendedBy == this.state.messagesOf) {
                  return (
                    <View key={key} style={[styles.eachMessage, {marginLeft: "auto"}]} >
                      <View style={[styles.eachMessageContent, {marginRight: 20, alignItems: "flex-end"}]} >
                        <View style={[styles.eachMessageHeader, {alignItems: "flex-end"}]} >
                          <Text style={styles.eachMessageSenderName} >{message[message.sendedBy]}</Text>
                          <Text style={styles.eachMessageDate} >{message.createdAt}</Text>
                        </View>
                        <Text style={[styles.eachMessageText, {textAlign: "right"}]} >{message.content}</Text>
                      </View>
                      <Image style={styles.eachMessageProfile} source={{uri: this.state[message.sendedBy].profilePhoto}} ></Image>
                    </View>
                  )
                } else {
                  return (
                    <View key={key} style={styles.eachMessage} >
                      <Image style={styles.eachMessageProfile} source={{uri: this.state[message.sendedBy].profilePhoto}} ></Image>
                      <View style={[styles.eachMessageContent, {marginLeft: 20}]} >
                        <View style={styles.eachMessageHeader} >
                          <Text style={styles.eachMessageSenderName} >{message[message.sendedBy + "Name"]}</Text>
                          <Text style={styles.eachMessageDate} >{message.createdAt}</Text>
                        </View>
                        <Text style={styles.eachMessageText} >{message.content}</Text>
                      </View>
                    </View>
                  )
                }
              })
            }
          </Animated.ScrollView>
          <Animated.View style={[styles.messageInputWrapper, {bottom: this.keyboardHeight}]} 
            onLayout={(event) => {
              this.setState({"messageInputWrapperHeight": event.nativeEvent.layout.height + 10}); 
            }} >
            <TextInput style={styles.messageInput} placeholder="Type your message" value={this.state.messageContent} onChangeText={(content) => { this.setState({messageContent: content})}} ref="_messageInput" ></TextInput>
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
    justifyContent: "center",
    height: 50, paddingLeft: 20, paddingRight: 20,
    backgroundColor: "white",
    borderBottomWidth: 2, borderBottomColor: "rgb(236, 235, 235)",
  },
  messageWrapper: {
    padding: 20
  },
  eachMessage: {
    width: "90%",
    flexDirection: "row", alignItems: "center",
    marginBottom: 25,
  },
  eachMessageContent: {
    flex: 1
  },
  eachMessageHeader: {
    marginBottom: 5
  },
  eachMessageSenderName: {
    fontSize: 20, color: "rgb(127, 127, 127)", fontWeight: "600",
    marginBottom: 5
  },
  eachMessageDate: {
    fontSize: 15, color: "rgb(219, 219, 219)", fontWeight: "600"
  },
  eachMessageText: {
    fontSize: 18, color: "rgb(160, 169, 177)", fontWeight: "300"
  },
  eachMessageProfile: {
    height: 50, width: 50, resizeMode: "cover",
    borderRadius: 25
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
    fontSize: 20, color: "rgb(112, 112, 112)",
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
