import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class SellDashboard extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false),
      products: []
    };
  };

  getUserProducts = () => {
    fetch(`https://www.stumarkt.com/api/products?owner=${this.state.user._id}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(result => result.json())
      .then(data => {
        if (data.error) 
          return alert(data.error);
  
        this.setState({
          "products": data.products
        });
      })
      .catch(err => {
        alert("Error: " + err)
      });
  };

  componentWillMount = () => {
    this.getUserProducts();
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <View style={{padding: 20, flex: 1}} >
            <Text style={styles.contentTitle} >Anzeigen</Text>
            <Text style={styles.contentInfo} >Hier kannst du deine Anzeigen bearbeiten, wenn du darauf klickst.</Text>
            { this.state.products.length ?
              <ScrollView ref="_innerContentScrollView" >
                {
                  this.state.products.map((product, key) => {
                    return (
                      <TouchableOpacity key={key} style={styles.eachProductWrapper} onPress={() => {this.props.navigation.push('sellDetails', {"user": this.state.user, "productId": product._id})}} > 
                        <View style={styles.eachProductLeftSide} >
                          <Image source={{uri: product.productPhotoArray[0]}} style={styles.eachProductImage} ></Image>
                        </View>
                        <View style={styles.eachProductRightSide} >
                          <Text style={styles.eachProductName} numberOfLines={1} > {product.name} </Text>
                          <Text style={styles.eachProductLocation} > {product.location} </Text>
                          <Text style={styles.eachProductPrice} > {product.price} </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                }
              </ScrollView>
              :
              <View style={styles.noProductWrapper} >
                <Text style={styles.noProductText} >Du hast nun keine Anzeige, gib jetzt eine Anzeige auf!</Text>
                <TouchableOpacity style={styles.createNewProductButton} onPress={() => {this.props.navigation.push('new', {"user": this.state.user})}} >
                  <Text style={styles.createNewProductButtonText} >Anzeige Aufgeben</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
        <NavBar navigation={this.props.navigation} pageName="user"></NavBar>
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
  eachProductWrapper: {
    flexDirection: "row",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5, borderColor: "rgb(236, 235, 235)", borderWidth: 2,
    backgroundColor: "white"
  },
  eachProductLeftSide: {
    justifyContent: "center", alignItems: "center",
    padding: 10
  },
  eachProductImage: {
    height: 100, width: 100,
    borderRadius: 5
  },
  eachProductRightSide: {
    flex: 1,
    paddingTop: 10, paddingBottom: 10
  },
  eachProductName: {
    fontSize: 18, color: "rgb(112, 112, 112)", fontWeight: "800"
  },
  eachProductLocation: {
    fontSize: 14, color: "rgb(112, 112, 112)", fontWeight: "300",
    marginTop: 3
  },
  eachProductPrice: {
    alignSelf: "flex-end", marginTop: "auto",
    fontSize: 25, color: "rgb(255, 67, 148)", fontWeight: "700"
  },
  contentTitle: {
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 28,
    marginBottom: 10
  },
  contentInfo: {
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 16,
    marginBottom: 10
  },
  noProductWrapper: {
    flex: 1,
    justifyContent: "center", alignItems: "center",
    padding: 20
  },
  noProductText: {
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 18, textAlign: "center",
    marginBottom: 10
  },
  createNewProductButton: {
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255, 108, 128, 0.3)",
    borderColor: "rgba(255, 61, 148, 0.4)", borderWidth: 2, borderRadius: 5,
    padding: 10
  },
  createNewProductButtonText: {
    fontSize: 18, color: "rgb(255, 61, 148)", fontWeight: "700"
  }
});


AppRegistry.registerComponent('SellDashboard', () => SellDashboard);
