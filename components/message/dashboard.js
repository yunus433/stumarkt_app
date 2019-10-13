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

  getAllMessages = () => {
    fetch(`https://www.stumarkt.com/api/messages?buyer=${this.state.user._id}`, {
      headers: {
        "x_auth": API_KEY
      }
    })
    .then(result => result.json())
    .then(data => {
      if (data.error) 
        return alert(data.error);
      
      this.setState({
        "buyerMessages": data.messages
      });
    })
    .catch(err => {
      alert("Error: " + err)
    });

    fetch(`https://www.stumarkt.com/api/messages?owner=${this.state.user._id}`, {
      headers: {
        "x_auth": API_KEY
      }
    })
    .then(result => result.json())
    .then(data => {
      if (data.error) 
        return alert(data.error);

      this.setState({
        "ownerMessages": data.messages
      });
    })
    .catch(err => {
      alert("Error: " + err)
    });
  }

  messageDetailsButtonController = (messagesOf, buyerId, productId) => {
    if (messagesOf == "buyer") {
      fetch(`https://www.stumarkt.com/api/products?id=${productId}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
        .then(response => {return response.json()})
        .then(data => {
          if (data.error) return alert("Err: " + data.error);

          fetch('https://www.stumarkt.com/api/users?id=' + data.product.owner, {
            headers: {
              "x_auth": API_KEY
            }
          })
            .then(response => {return response.json()})
            .then(userData => {
              if (userData.error) return alert("Err: " + userData.error);

              this.props.navigation.push('messageDetails', {
                "user": this.state.user,
                "buyer": this.state.user,
                "owner": userData.user,
                "product": data.product,
                messagesOf
              })
            })
            .catch((err) => {
              return alert("Err: " + err);
            })
        })
        .catch((err) => {
          return alert("Err: " + err);
        })
    } else if (messagesOf == "owner") {
      fetch(`https://www.stumarkt.com/api/products?id=${productId}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
        .then(response => {return response.json()})
        .then(data => {
          if (data.error) return alert("Err: " + data.error);

          fetch('https://www.stumarkt.com/api/users?id=' + buyerId, {
            headers: {
              "x_auth": API_KEY
            }
          })
            .then(response => {return response.json()})
            .then(userData => {
              if (userData.error) return alert("Err: " + userData.error);

              this.props.navigation.push('messageDetails', {
                "user": this.state.user,
                "buyer": userData.user,
                "owner": this.state.user,
                "product": data.product,
                messagesOf
              })
            })
            .catch((err) => {
              return alert("Err: " + err);
            })
        })
        .catch((err) => {
          return alert("Err: " + err);
        })
    } else {
      alert("Err: An unknown error occured");
    }
  }

  componentWillMount() {
    this.getAllMessages();
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <View style={styles.messageChangeButtonsWrapper} >
            <TouchableOpacity style={this.state.messagesOn == "buyerMessages" ? styles.messageChangeButtonActive : styles.messageChangeButton} onPress={() => {this.setState({"messagesOn": "buyerMessages"})}} >
              <Text style={styles.messageChangeButtonText} >Einkauf</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.messagesOn == "ownerMessages" ? styles.messageChangeButtonActive : styles.messageChangeButton} onPress={() => {this.setState({"messagesOn": "ownerMessages"})}} >
              <Text style={styles.messageChangeButtonText} >Verkauf</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messagesWrapper} >
            <ScrollView style={{flex: 1}} >
              { this.state.messagesOn == "buyerMessages" ?
                this.state.buyerMessages.length ?
                this.state.buyerMessages.map((messageArray, key) => {
                  return (
                    <TouchableOpacity key={key} style={styles.eachMessageWrapper} onPress={() => {this.messageDetailsButtonController("buyer", messageArray[0].buyerId, messageArray[0].productId)}} >
                      <Image style={styles.eachMessageProductImage} source={{uri: messageArray[messageArray.length-1].productProfile}} ></Image>
                      <View style={styles.eachMessageContentWrapper} >
                        <Text style={styles.eachMessageProductName} >{messageArray[messageArray.length-1].productName}</Text>
                        <View style={{flexDirection: "row"}} >
                          <Text style={styles.eachMessageUserName} >{messageArray[messageArray.length-1].ownerName} - </Text>
                          <Text style={styles.eachMessageTotalNumber} >{messageArray.length} message{messageArray.length > 1 ? 's' : ''}</Text>
                        </View>
                      </View>
                      { messageArray.filter(message => {return !message.read && message.sendedBy == 'owner'}).length ? 
                        <View style={styles.notReadMessageNumberWrapper} >
                          <Text style={styles.notReadMessageNumber} >{messageArray.filter(message => {return !message.read && message.sendedBy == 'owner'}).length}</Text>
                        </View> 
                        :
                        null }
                    </TouchableOpacity>
                  )})
                  :
                  <View style={styles.noMessageWrapper} >
                    <Text style={styles.noMessageText} >Du hast noch keine Nachricht geschrieben.</Text>
                  </View>
                :
                this.state.ownerMessages.length ?
                this.state.ownerMessages.map((messageProductsArray, key) => {
                  return (
                    <View key={key}> 
                      { messageProductsArray.map((messageArray, key) => {
                          return (
                            <TouchableOpacity key={key} style={styles.eachMessageWrapper} onPress={() => {this.messageDetailsButtonController("owner", messageArray[0].buyerId, messageArray[0].productId)}} >
                              <Image style={styles.eachMessageProductImage} source={{uri: messageArray[messageArray.length-1].productProfile}} ></Image>
                              <View style={styles.eachMessageContentWrapper} >
                                <Text style={styles.eachMessageProductName} >{messageArray[messageArray.length-1].productName}</Text>
                                <View style={{flexDirection: "row"}} >
                                  <Text style={styles.eachMessageUserName} >{messageArray[messageArray.length-1].buyerName} - </Text>
                                  <Text style={styles.eachMessageTotalNumber} >{messageArray.length} message{messageArray.length > 1 ? 's' : ''}</Text>
                                </View>
                              </View>
                              { messageArray.filter(message => {return !message.read && message.sendedBy == 'buyer'}).length ? 
                                <View style={styles.notReadMessageNumberWrapper} >
                                  <Text style={styles.notReadMessageNumber} >{messageArray.filter(message => {return !message.read && message.sendedBy == 'buyer'}).length}</Text>
                                </View> 
                                :
                                null }
                            </TouchableOpacity>
                          );
                        })
                      }
                    </View>
                  )})
                  :
                  <View style={styles.noMessageWrapper} >
                    <Text style={styles.noMessageText} >Du hast leider keine Nachricht für deine Produkten.</Text>
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
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
  },
  content: {
    flex: 8, paddingBottom: 100
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
