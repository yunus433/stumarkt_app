import React, {Component} from 'react';
import {AsyncStorage, AppRegistry, Animated, View, Image, ScrollView, TouchableOpacity, TextInput, Keyboard, Platform, Text, StyleSheet} from 'react-native';
import socketIO from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

const apiRequest = require('../../utils/apiRequest');

export default class Message extends Component{
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      chat_id: this.props.navigation.getParam('chat_id', null),
      id: this.props.navigation.getParam('id', null),
      chat: {
        buyer: {},
        owner: {},
        product: {}
      },
      messages: [],
      message_content: ""
    };

    this.scrollView = React.createRef();
    this.keyboardHeight = new Animated.Value(30);
    this.messagesWrapperMarginBottom = new Animated.Value(0);
  }

  getChat = () => {
    apiRequest({
      method: 'GET',
      url: '/messages/details',
      query: {
        id: this.state.chat_id,
        user: this.state.id
      }
    }, (err, data) => {
      if (err || data.error) return this.props.navigation.navigate('Chat', { id: this.state.id });

      this.setState({
        chat: data.chat,
        messages: data.chat.messages
      });
    });
  }

  keyboardWillShow = (event) => {
    this.setState({"clicked": true});

    if (Platform.OS == "ios") {
      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: event.endCoordinates.height + 10,
          useNativeDriver: false
        }),
        Animated.timing(this.messagesWrapperMarginBottom, {
          duration: event.duration,
          toValue: event.endCoordinates.height + this.state.messageInputWrapperHeight,
          useNativeDriver: false
        })
      ]).start();

      setTimeout(() => {
        this.scrollView.getNode().scrollToEnd({animated: false})
      }, event.duration + 10);
    } else {
      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: 0,
          toValue: event.endCoordinates.height + 10,
          useNativeDriver: false
        }),
        Animated.timing(this.messagesWrapperMarginBottom, {
          duration: 0,
          toValue: event.endCoordinates.height + this.state.messageInputWrapperHeight,
          useNativeDriver: false
        })
      ]).start();

      setTimeout(() => {
        this.scrollView.getNode().scrollToEnd({animated: false})
      })
    }
  };

  keyboardWillHide = (event) => {
    if (Platform.OS == "ios") {
      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: 30,
          useNativeDriver: false
        }),
        Animated.timing(this.messagesWrapperMarginBottom, {
          duration: event.duration,
          toValue: this.state.messageInputWrapperHeight,
          useNativeDriver: false
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: 0,
          toValue: 30,
          useNativeDriver: false
        }),
        Animated.timing(this.messagesWrapperMarginBottom, {
          duration: 0,
          toValue: this.state.messageInputWrapperHeight,
          useNativeDriver: false
        })
      ]).start();
    }
  };

  componentDidMount = () => {
    this.getChat();

    const socket = socketIO('https://stumarkt.herokuapp.com');
    
    socket.connect();

    socket.on('connect', () => { 
      this.socket = socket;
      
      socket.emit('join', {
        room: this.state.chat_id.toString()
      });

      socket.on('newMessage', params => {
        if (!this.state.chat.messages.length || this.state.chat.messages[this.state.chat.messages.length-1]._id != params.message._id) {
          this.setState((state) => {
            return {
              messages: state.messages.concat(params.message)
            }
          });
        }
      });
    });

    // this.refs._messageInput.focus();
  
    if (Platform.OS == "ios") {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    } else {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
      this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }
  };

  onNewMessageSend = () => {
    if (this.state.message_content.trim().length > 0 && this.socket) {
      const newMessageObject = {
        content: this.state.message_content.trim(),
        sendedBy: this.state.id
      };

      this.socket.emit('newMessageSend', {
        message: newMessageObject,
        to: this.state.chat_id
      }, (err, message) => {
        if (err) return alert("Err " + err);

        this.setState((state) => {
          return {
            messages: state.messages.concat(message),
            message_content: ""
          }
        });

        this.refs._messageInput.clear();
      });
    }
  }


  render() {
    return (
      <View style={styles.main_wrapper}>
        <View style={styles.message_header} >
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} >
            <FontAwesomeIcon icon={faArrowLeft} color="rgb(28, 28, 28)" size={17} />
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: "row"}} onPress={() => this.props.navigation.navigate('Profile', { id: this.state.id, profile_id: this.state.chat.buyer._id == this.state.id ? this.state.chat.owner._id : this.state.chat.buyer._id })} >
            <Image source={{uri: this.state.chat.buyer._id == this.state.id ? this.state.chat.owner.profilePhoto : this.state.chat.buyer.profilePhoto}} style={styles.user_profile} ></Image>
            <View>
              <Text style={styles.user_name} >{this.state.chat.buyer._id == this.state.id ? this.state.chat.owner.name : this.state.chat.buyer.name}</Text>
              <Text style={styles.user_school} >{this.state.chat.product.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Animated.ScrollView
          style={[styles.message_wrapper, {marginBottom: this.state.clicked ? this.messagesWrapperMarginBottom : this.state.messageInputWrapperHeight}]}
          ref={ref => (this.scrollView = ref)}
          onContentSizeChange={() => this.scrollView.getNode().scrollToEnd({animated: false}) } 
        >
          {this.state.messages.map((message, key) => {
            if (key == 0 || this.state.messages[key-1].day != message.day) {
              return (
                <View key={key}>
                  <View style={styles.day_text_wrapper} >
                    <Text style={styles.day_text} >{message.day}</Text>
                  </View>
                  <View style={message.sendedBy == this.state.id ? styles.each_message_user : styles.each_message} >
                    <Text style={message.sendedBy == this.state.id ? styles.each_message_text_user : styles.each_message_text} >{message.content}</Text>
                    <Text style={message.sendedBy == this.state.id ? styles.each_message_time_user : styles.each_message_time} >{message.time}</Text>
                  </View>
                </View>
              )
            } else {
              return (
                <View style={message.sendedBy == this.state.id ? styles.each_message_user : styles.each_message} key={key} >
                  <Text style={message.sendedBy == this.state.id ? styles.each_message_text_user : styles.each_message_text} >{message.content}</Text>
                  <Text style={message.sendedBy == this.state.id ? styles.each_message_time_user : styles.each_message_time} >{message.time}</Text>
                </View>
              )
            }
          })}
          <View style={{height: 40}} ></View>
        </Animated.ScrollView>
        <Animated.View style={[styles.messageInputWrapper, {bottom: this.keyboardHeight}]} 
          onLayout={(event) => {
            this.setState({"messageInputWrapperHeight": event.nativeEvent.layout.height + 25}); 
          }} >
          <TextInput
            style={styles.messageInput} placeholder="Mesajınızı yazın" value={this.state.messageContent}
            onChangeText={(content) => { this.setState({message_content: content})}} ref="_messageInput"
            onSubmitEditing={() => {this.onNewMessageSend()}}
          ></TextInput>
          <TouchableOpacity style={styles.messageSendButton}  onPress={() => {this.onNewMessageSend()}} >
              <FontAwesomeIcon icon={faPaperPlane} color="rgb(88, 0, 232)" size={23} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1, backgroundColor: "rgb(248, 248, 248)",
    alignItems: "center"
  },
  message_header: {
    paddingTop: STATUS_BAR_HEIGHT, flexDirection: "row",
    paddingLeft: 20, paddingRight: 20, height: 120, width: "100%",
    alignItems: "center", backgroundColor: "rgb(254, 254, 254)",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2
  },
  user_profile: {
    width: 50, height: 50, borderRadius: 25, resizeMode: "contain",
    marginLeft: 10, marginRight: 10
  },
  user_name: {
    fontSize: 17, fontWeight: "600", color: "rgb(28, 28, 28)"
  },
  user_school: {
    fontSize: 14, fontWeight: "300", color: "rgb(112, 112, 112)",
    marginTop: 5
  },
  message_wrapper: {
    width: "100%", paddingLeft: 20, paddingRight: 20
  },
  day_text_wrapper: {
    alignSelf: "center", backgroundColor: "rgb(254, 254, 254)", padding: 5, paddingLeft: 10, paddingRight: 10,
    borderWidth: 2, borderColor: "rgb(236, 236, 236)", borderRadius: 15, marginTop: 25
  },
  day_text: {
    color: "rgba(15, 15, 15, 0.6)", fontSize: 14, fontWeight: "300"
  },
  each_message: {
    maxWidth: "50%", backgroundColor: "rgb(254, 254, 254)", borderRadius: 30, borderTopLeftRadius: 0,
    padding: 15, marginTop: 20
  },
  each_message_user: {
    maxWidth: "50%", backgroundColor: "rgb(88, 0, 232)", borderRadius: 30, borderTopRightRadius: 0,
    padding: 15, marginTop: 20, marginLeft: "auto"
  },
  each_message_text: {
    color: "rgb(15, 15, 15)", fontWeight: "500", fontSize: 15
  },
  each_message_text_user: {
    color: "rgb(254, 254, 254)", fontWeight: "700", fontSize: 15
  },
  each_message_time: {
    color: "rgb(15, 15, 15)", fontWeight: "300", fontSize: 15,
    marginTop: 5
  },
  each_message_time_user: {
    color: "rgb(254, 254, 254)", fontWeight: "400", fontSize: 15,
    marginTop: 5
  },
  messageInputWrapper: {
    position: "absolute", width: "94%", height: 70, marginBottom: 5,
    backgroundColor: "white", flexDirection: "row", alignItems: "center",
    borderWidth: 2, borderColor: "rgb(236, 235, 235)", borderRadius: 35
  },
  messageInput: {
    flex: 5, height: "90%", paddingLeft: 15,
    fontSize: 20, color: "rgb(112, 112, 112)"
  },
  messageSendButton: {
    flex: 1, height: "90%",
    justifyContent: "center", alignItems: "center",
  },
});


AppRegistry.registerComponent('Message', () => Message);
