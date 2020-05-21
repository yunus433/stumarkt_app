import React, {Component} from 'react';
import {AppRegistry, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
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
      user: this.props.navigation.getParam('user', false),
      products: []
    };
  };

  componentDidMount() {
    if (!this.state.user.favorites.length)
      return ;

    fetch(`https://stumarkt.herokuapp.com/api/products?userFavorites=${this.state.user.favorites.join(',')}`, {
      headers: {
        "x_auth": API_KEY
      }
    })
    .then(result => result.json())
    .then(data => {
      if (data.error) 
        return alert(data.error);

      this.setState({ "products": data.products });
    })
    .catch(err => {
      alert("Error: " + err)
    });
  }

  addToFavorites = (id) => {
    fetch(`https://stumarkt.herokuapp.com/api/addToFavorite?id=${this.state.user._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x_auth": API_KEY
      },
      body: JSON.stringify({
        "productId": id,
      })
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);
        if (!data.user) return alert("Err: An unknown erro occured, please try again.");

        this.setState({
          "user": data.user
        });
      })
      .catch(err => {
        alert("Err: " + err);
      });
  }

  eachProductOnPress = (productId) => {
    if (this.state.user && productId == this.state.user._id)
      this.props.navigation.push('sellDetails', {"user": this.state.user, "id": productId})
    else
      this.props.navigation.push('buyDetails', {"user": this.state.user, "id": productId})
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation} ></Header>
        <View style={styles.content} >
          <ScrollView style={styles.innerContent} ref="_innerContentScrollView" >
            <Text style={styles.contentTitle} >Favoriler</Text>
            {
              this.state.products.length ?
              this.state.products.map((product, key) => {
                return (
                  <TouchableOpacity key={key} style={styles.eachProductWrapper} onPress={() => {this.eachProductOnPress(product._id)}} > 
                    <View style={styles.eachProductLeftSide} >
                      <Image source={{uri: product.productPhotoArray[0]}} style={styles.eachProductImage} ></Image>
                    </View>
                    <View style={styles.eachProductRightSide} >
                      <Text style={styles.eachProductName} numberOfLines={1} > {product.name} </Text>
                      <Text style={styles.eachProductLocation} > {product.location} </Text>
                      <View style={styles.addToFavoriteWrapper} >
                        <TouchableOpacity onPress={() => {this.addToFavorites(product._id)}} style={{marginRight: 5}} >
                          { this.state.user.favorites.includes(product._id) ? 
                            <Image source={require('./../../assets/favorites-page-nav-icon-selected.png')} style={styles.addToFavoriteButton} ></Image>
                            :
                            <Image source={require('./../../assets/favorites-page-nav-icon.png')} style={styles.addToFavoriteButton} ></Image>
                          }
                        </TouchableOpacity>
                        <Text style={styles.eachProductPrice} > {product.price} </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
              :
              <Text style={styles.contentInfo} >Hiçbir ürün seçilmedi.</Text>
            }
            <View style={{height: 60}} ></View>
          </ScrollView>
        </View>
        <NavBar navigation={this.props.navigation} pageName="favorite" ></NavBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1
  },
  contentTitle: {
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 28,
    marginBottom: 10
  },
  contentInfo: {
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 16,
    marginBottom: 10
  },
  content: {
    flex: 8,
    backgroundColor: "rgb(248, 248, 248)",
  },
  innerContent: {
    padding: 25
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
    padding: 10,
    resizeMode: "contain"
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
    fontSize: 15, color: "rgb(255, 176, 101)", fontWeight: "500",
    marginTop: 3
  },
  addToFavoriteWrapper: {
    flexDirection: "row", justifyContent: "flex-end", alignItems: "center", 
    width: "100%", marginTop: "auto"
  },
  addToFavoriteButton: {
    height: 25, width: 25, resizeMode: "contain"
  },
  eachProductPrice: {
    fontSize: 25, color: "rgb(255, 67, 148)", fontWeight: "700"
  }
});


AppRegistry.registerComponent('Index', () => Index);
