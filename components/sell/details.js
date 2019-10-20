import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class SellDetails extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false),
      productId: this.props.navigation.getParam('productId', false),
      product: "",
      name: '',
      description: '',
      price: '',
      otherPrice: '',
      address: ''
    };
  };

  componentWillMount = () => {
    fetch(`https://www.stumarkt.com/api/products?id=${this.state.productId}`, {
      headers: {
        "x_auth": API_KEY
      }
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);

        this.setState({
          "product": data.product,
          "name": data.product.name,
          "description": data.product.description,
          "price": data.product.price,
          "otherPrice": data.product.price,
          "address": data.product.location
        })
      })
      .catch((err) => {
        return alert("Err: " + err);
      })
  };

  priceInput = (priceValue) => {
    this.setState({
      "price": priceValue
    });
  }

  editProductButtonController = () => {
    fetch('https://www.stumarkt.com/api/editProduct', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x_auth": API_KEY
      },
      body: JSON.stringify({
        "id": this.state.product._id,
        "name": this.state.name,
        "description": this.state.description,
        "price": this.state.price,
        "location": this.state.address
      })
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);

        this.props.navigation.push('sellDetails', {
          "user": this.state.user,
          "productId": data.product._id
        });
      })
      .catch(err => {
        alert("Err: " + err);
      })
  }

  markProductAsSoldButtonController = () => {
    fetch('https://www.stumarkt.com/api/editProduct', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x_auth": API_KEY
      },
      body: JSON.stringify({
        "id": this.state.product._id,
        "name": this.state.name,
        "description": this.state.description,
        "price": "SOLD",
        "location": this.state.address
      })
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);

        this.props.navigation.push('sellDetails', {
          "user": this.state.user,
          "productId": data.product._id
        });
      })
      .catch(err => {
        alert("Err: " + err);
      })
  };

  deleteProductButtonController = () => {
    fetch('https://www.stumarkt.com/api/editProduct', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x_auth": API_KEY
      },
      body: JSON.stringify({
        "id": this.state.product._id,
        "delete": true
      })
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);
        if (!data.success) return alert("An unknown error occured");

        this.props.navigation.push('sellDashboard', {
          "user": this.state.user
        });
      })
      .catch(err => {
        alert("Err: " + err);
      })
  };

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <ScrollView style={styles.innnerContent} >
            { this.state.product.price != "SOLD" ?
              <View style={styles.mainInnerWrapper} >
                <Text style={styles.contentTitle} >Anzeige Einstellungen</Text>
                <View style={styles.productOptionsWrapper} >
                  <TouchableOpacity style={styles.productOptionButton} onPress={() => {this.deleteProductButtonController()}} >
                    <Text style={styles.productOptionText} >Lösch die Anzeige</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.productOptionButton} onPress={() => {this.markProductAsSoldButtonController()}} >
                    <Text style={styles.productOptionText} >Markiere das Produkt als Verkauft</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.contentTitle} >Anzeigendetails</Text>
                <TextInput 
                  placeholder="Titel" 
                  onChangeText={(name) => { this.setState({name: name})}} 
                  style={styles.nameInput} >
                {this.state.name}
                </TextInput>
                <TextInput 
                  placeholder="Beschreibung" 
                  onChangeText={(description) => { this.setState({description: description})}}
                  style={styles.descriptionInput} 
                  multiline={true} >
                {this.state.description}
                </TextInput>
                <Text style={styles.contentTitle} >Preis</Text>
                <View style={styles.priceWrapper} >
                  <TouchableOpacity onPress={() => this.priceInput(this.state.otherPrice)} style={styles.eachPriceWrapper} >
                      <View style={ this.state.price != "free" && this.state.otherPrice ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                      <TextInput 
                        placeholder="Preis €" 
                        onChangeText={(price) => {this.priceInput(price)}} 
                        style={styles.priceInput} >
                      {this.state.otherPrice}
                      </TextInput>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.priceInput("free")} style={styles.eachPriceWrapper} >
                    <View style={ this.state.price == "free" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                    <Text style={styles.eachPriceText} > Zu Verschenken </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.contentTitle} >Ort</Text>
                <TextInput
                  placeholder="Ort" 
                  onChangeText={(address) => { this.setState({address: address})}}
                  style={styles.addressInput} >
                {this.state.address}
                </TextInput>
                <Text style={styles.contentTitle} >Veröffentliche deine Anzeige</Text>
                <View style={styles.agreementWrapper} >
                  <Text style={styles.agreementText} >Ich bin mit den Folgenden einverstanden: </Text>
                  <TouchableOpacity>
                    <Text style={styles.agreementLink} >Nutzungsbedingungen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.agreementLink} >Datenschutzerklärung</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={() => {this.editProductButtonController()}} >
                  <Text style={styles.sendButtonText} >Einstellungen</Text>
                </TouchableOpacity>
              </View>
              :
              <View style={styles.mainInnerWrapper} >
                <Text style={styles.markAsSoldText} >Du hast deine Anzeigen als “verkauft” markiert.</Text>
                <TouchableOpacity style={styles.productOptionButton} onPress={() => {this.deleteProductButtonController()}} >
                  <Text style={styles.productOptionText} >Lösch die Anzeige</Text>
                </TouchableOpacity>
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
    flex: 8, 
    paddingLeft: 20, paddingRight: 20, paddingBottom: 100
  },
  innnerContent: {
    flex: 1
  },
  markAsSoldText: {
    color: "rgb(112, 112, 112)", fontSize: 20, fontWeight: "300", textAlign: "center",
    marginBottom: 20
  },
  mainInnerWrapper: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15, borderColor: "rgb(236, 235, 235)", borderWidth: 2,
    padding: 15,
  },
  contentTitle: {
    color: "rgb(112, 112, 112)", fontSize: 25, fontWeight: "300",
    marginBottom: 10
  },
  eachRadioInput: {
    height: 15, width: 15,
    backgroundColor: "white",
    borderRadius: 15, borderColor: "rgb(112, 112, 112)", borderWidth: 2,
    marginRight: 3
  },
  activatedRadioInput: {
    height: 2, width: 2,
    backgroundColor: "white",
    borderRadius: 15, borderColor: "rgb(255, 61, 148)", borderWidth: 5,
    padding: 3,
    marginRight: 3
  },
  productOptionsWrapper: {
    paddingLeft: 10, paddingRight: 10
  },
  productOptionButton: {
    padding: 10, marginBottom: 10,
    borderColor: "rgb(255, 61, 148)", borderWidth: 2, borderRadius: 15
  },
  productOptionText: {
    color: "rgb(112, 112, 112)", fontSize: 18, fontWeight: "300", textAlign: "center"
  },
  nameInput: {
    backgroundColor: "rgb(248, 248, 248)",
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 20,
    padding: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    marginBottom: 15
  },
  descriptionInput: {
    height: 150,
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10,
    marginBottom: 20,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 20
  },
  priceWrapper: {
    paddingLeft: 20,
    marginBottom: 20
  },
  eachPriceWrapper: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 5,
    paddingTop: 2, paddingBottom: 2
  },
  eachPriceText: {
    color: "rgb(112, 112, 112)", fontSize: 17, fontWeight: "300"
  },
  priceInput: {
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
    color: "rgb(112, 112, 112)", fontSize: 20, fontWeight: "300",
    padding: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    marginLeft: 3,
  },
  addressInput: {
    color: "rgb(112, 112, 112)", fontSize: 20, fontWeight: "300",
    padding: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    marginTop: 10, marginBottom: 20,
    backgroundColor: "rgb(248, 248, 248)"
  },
  agreementWrapper: {
    marginBottom: 20
  },
  agreementText: {
    fontSize: 17, color: "rgb(112, 112, 112)", fontWeight: "300"
  },
  agreementLink: {
    fontSize: 17, color: "rgb(255, 61, 148)", fontWeight: "300", textDecorationLine: "underline",
    marginTop: 5, marginLeft: 20
  },
  sendButton: {
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255, 108, 128, 0.3)",
    borderColor: "rgba(255, 61, 148, 0.4)", borderWidth: 2, borderRadius: 5,
    padding: 10,
    marginBottom: 20, marginTop: 20
  },
  sendButtonText: {
    color: "rgb(255, 61, 148)", fontWeight: "700"
  }
});


AppRegistry.registerComponent('SellDetails', () => SellDetails);
