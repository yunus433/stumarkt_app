import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class MessageDetails extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false),
      ownerMessages: [],
      buyerMessages: [],
      messagesOn: "buyerMessages"
    };
  };

  get_content = () => {
    fetch(`https://stumarkt.herokuapp.com/api/messages?id=${this.state.user._id}`, {
      headers: {
        "x_auth": API_KEY
      }
    })
    .then(result => result.json())
    .then(data => {
      if (data.error) 
        return alert(data.error)
      
      return this.setState({
        "buyerMessages": data.buyerMessages,
        "ownerMessages": data.ownerMessages
      });
    })
    .catch(err => {
      alert("Error: " + err)
    });
  }

  message_details_controller = (id) => {
    this.props.navigation.push('messageDetails', {
      "user": this.state.user,
      "id": id,
    });
  }

  componentDidMount = () => {
    this.get_content();
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <View style={styles.messageChangeButtonsWrapper} >
            <TouchableOpacity style={this.state.messagesOn == "buyerMessages" ? styles.messageChangeButtonActive : styles.messageChangeButton} onPress={() => {this.setState({"messagesOn": "buyerMessages"})}} >
              <Text style={styles.messageChangeButtonText} >Aldıklarım</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.messagesOn == "ownerMessages" ? styles.messageChangeButtonActive : styles.messageChangeButton} onPress={() => {this.setState({"messagesOn": "ownerMessages"})}} >
              <Text style={styles.messageChangeButtonText} >Sattıklarım</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messagesWrapper} >
            <ScrollView style={{flex: 1}} >
              { this.state.messagesOn == "buyerMessages" ?
                this.state.buyerMessages.length ?
                  this.state.buyerMessages.map((chat, key) => {
                    return (
                      <TouchableOpacity key={key} style={styles.eachMessageWrapper} onPress={() => {this.message_details_controller(chat._id.toString())}} >
                        <Image style={styles.eachMessageProductImage} source={{uri: chat.product.productPhotoArray[0]}} ></Image>
                        <View style={styles.eachMessageContentWrapper} >
                          <Text style={styles.eachMessageProductName} >{chat.product.productName}</Text>
                          <View style={{flexDirection: "row"}} >
                            <Text style={styles.eachMessageUserName} >{chat.owner.name} - </Text>
                            <Text style={styles.eachMessageTotalNumber} >{chat.messages.length} mesaj</Text>
                          </View>
                        </View>
                        { chat.messages.filter(eachMessage => {return !eachMessage.read && eachMessage.sendedBy == chat.owner._id.toString()}).length ? 
                          <View style={styles.notReadMessageNumberWrapper} >
                            <Text style={styles.notReadMessageNumber} >{chat.messages.filter(eachMessage => {return !eachMessage.read && eachMessage.sendedBy == chat.owner._id.toString()}).length}</Text>
                          </View> 
                          :
                          null }
                      </TouchableOpacity>
                  )})
                  :
                  <View style={styles.noMessageWrapper} >
                    <Text style={styles.noMessageText} >Hiçbir ürüne mesaj atmadınız.</Text>
                  </View>
                :
                this.state.ownerMessages.length ?
                  this.state.ownerMessages.map((chat, key) => {
                    return (
                      <TouchableOpacity key={key} style={styles.eachMessageWrapper} onPress={() => {this.message_details_controller(chat._id.toString())}} >
                        <Image style={styles.eachMessageProductImage} source={{uri: chat.product.productPhotoArray[0]}} ></Image>
                        <View style={styles.eachMessageContentWrapper} >
                          <Text style={styles.eachMessageProductName} >{chat.product.productName}</Text>
                          <View style={{flexDirection: "row"}} >
                            <Text style={styles.eachMessageUserName} >{chat.buyer.name} - </Text>
                            <Text style={styles.eachMessageTotalNumber} >{chat.messages.length} mesaj</Text>
                          </View>
                        </View>
                        { chat.messages.filter(eachMessage => {return !eachMessage.read && eachMessage.sendedBy == chat.buyer._id.toString()}).length ? 
                          <View style={styles.notReadMessageNumberWrapper} >
                            <Text style={styles.notReadMessageNumber} >{chat.messages.filter(eachMessage => {return !eachMessage.read && eachMessage.sendedBy == chat.buyer._id.toString()}).length}</Text>
                          </View> 
                          :
                          null }
                      </TouchableOpacity>
                  )})
                  :
                  <View style={styles.noMessageWrapper} >
                    <Text style={styles.noMessageText} >Hiçbir ürününüze mesaj atılmamış.</Text>
                  </View>
              }
            </ScrollView>
          </View>
        </View> 
        <NavBar navigation={this.props.navigation} pageName="message" ></NavBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1
  },
  content: {
    flex: 8,
    backgroundColor: "rgb(248, 248, 248)"
  },
  messagesWrapper: {
    flex: 9,
    padding: 20
  },
  eachMessageWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderWidth: 2, borderColor: "rgb(236, 235, 235)", borderRadius: 10
  },
  eachMessageProductImage: {
    height: 30, width: 30,
    resizeMode: "contain",
    marginRight: 5
  },
  eachMessageProductName: {
    fontSize: 16, color: "rgb(112, 112, 112)", fontWeight: "600",
    marginRight: 5
  },
  eachMessageUserName: {
    fontSize: 14, color: "rgb(112, 112, 112)", fontWeight: "300"
  },
  eachMessageTotalNumber: {
    fontSize: 14, color: "rgb(112, 112, 112)", fontWeight: "300"
  },
  notReadMessageNumberWrapper: {
    height: 30, width: 30,
    backgroundColor:  "rgb(255, 67, 148)",
    justifyContent: "center", alignItems: "center",
    marginLeft: "auto",
    borderRadius: 15
  },
  notReadMessageNumber: {
    color: "white", fontSize: 15, fontWeight: "600"
  },
  noMessageWrapper: {
    flex: 1,
    justifyContent: "center", alignItems: "center"
  },
  noMessageText: {
    color: "rgb(112, 112, 112)", fontSize: 18, fontWeight: "300", textAlign: "center"
  },
  messageChangeButtonsWrapper: {
    flex: 1,
    flexDirection: "row"
  },
  messageChangeButton: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "white",
    borderColor: "rgb(236, 235, 235)", borderWidth: 1, borderTopWidth: 0, borderBottomWidth: 2
  },
  messageChangeButtonActive: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgb(252, 249, 247)",
    borderColor: "rgb(236, 235, 235)", borderWidth: 1, borderTopWidth: 0, borderBottomWidth: 2
  },
  messageChangeButtonText: {
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 20, textAlign: "center"
  }
});


AppRegistry.registerComponent('MessageDetails', () => MessageDetails);
