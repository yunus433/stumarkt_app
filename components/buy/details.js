import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView} from 'react-native';
import Swiper from 'react-native-swiper'
import { API_KEY } from 'react-native-dotenv'

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class BuyDetails extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', undefined),
      productId: this.props.navigation.getParam('id', undefined),
      search: undefined,
      product: {},
      latestProducts: [],
      message: ""
    };
  };

  getProductDetails = () => {
    if (!this.state.productId)
      return this.props.navigation.push('main', {"user": this.state.user});

    fetch(`https://stumarkt.herokuapp.com/api/products?id=${this.state.productId}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(result => result.json())
      .then(data => {
        if (data.error) 
          return alert(data.error);
  
        this.setState({
          "product": data.product
        });

        this.getLatestProducts(data.product);
      })
      .catch(err => {
        alert("Error: " + err)
      });
  };

  getLatestProducts = (product) => {
    fetch(`https://stumarkt.herokuapp.com/api/products?limit=5&category=${product.category}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(result => result.json())
      .then(data => {
        if (data.error) 
          return alert(data.error);

        this.setState({
          "latestProducts": data.products
        });
      })
      .catch(err => {
        alert("Error: " + err)
      });
  };

  sendMessage = () => {
    fetch('https://stumarkt.herokuapp.com/api/users?id=' + this.state.product.owner, {
      headers: {
        "x_auth": API_KEY
      }
    })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error) return alert("Err: " + data.error);

        fetch(`https://stumarkt.herokuapp.com/api/newMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x_auth": API_KEY
          },
          body: JSON.stringify({
            "buyer": this.state.user._id,
            "owner": data.user._id,
            "product": this.state.product._id,
            "content": this.state.message
          })
        })
          .then(response => {return response.json()})
          .then(data => {
            if (data.error)
              return alert(data.error);

            this.props.navigation.push('messageDetails', {
              "user": this.state.user,
              "id": data.id
            });
          })
          .catch(err => {
            alert("Err: " + err);
          });
      })
      .catch((err) => {
        return alert("Err: " + err);
      });
  };

  componentDidMount = () => {
    this.getProductDetails();
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

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <ScrollView style={styles.innerContent} ref="_innerContentScrollView">
            <View style={styles.productWrapper} >
              {
                (this.state.product.productPhotoArray) ?
                <Swiper 
                  style={styles.imageWrapper} 
                  showsButtons={true} 
                  dotStyle={styles.imageWrapperDotStyle} 
                  activeDotStyle={styles.imageWrapperActiveDotStyle}
                  showsButtons={false} >
                  {this.state.product.productPhotoArray.map((src, key) => {
                    return (
                      <View style={styles.eachImageWrapper} key={key} >
                        <Image style={styles.eachImage} source={{uri: src}} ></Image>
                      </View>
                    )
                  })}
                </Swiper>
                : 
                null
              }
              <Text style={styles.productName} >{this.state.product.name}</Text>
              <Text style={styles.productCreatedAt} >{this.state.product.createdAt} tarihinde eklendi.</Text>
              <View style={styles.productLocationWrapper} >
                <Image source={require('./../../assets/location-logo.png')} style={styles.productLocationLogo} ></Image>
                <Text style={styles.productLocation} >{this.state.product.city_name}, {this.state.product.town}</Text>
              </View>
              <Text style={styles.productDescription} >{this.state.product.description}</Text>
              <View style={styles.addToFavoriteWrapper} >
                <TouchableOpacity onPress={() => {this.addToFavorites(this.state.product._id)}} style={{marginRight: 5}} >
                  { this.state.user.favorites.includes(this.state.product._id) ? 
                    <Image source={require('./../../assets/favorites-page-nav-icon-selected.png')} style={styles.addToFavoriteButton} ></Image>
                    :
                    <Image source={require('./../../assets/favorites-page-nav-icon.png')} style={styles.addToFavoriteButton} ></Image>
                  }
                </TouchableOpacity>
                <Text style={styles.eachProductPrice} > {this.state.product.price} </Text>
              </View>
            </View>
            <View style={styles.messagesWrapper} >
              <Text style={styles.messagesTitle} >Mesaj Gönder</Text>
              <TextInput style={styles.messagesInput} placeholder="Nachricht" multiline={true} onChangeText={(message) => {this.setState({message})}} ></TextInput>
              <TouchableOpacity style={styles.messageSendButton} onPress={() => {this.sendMessage()}} >
                <Text style={styles.messageSendButtonText} >Yolla</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.latestProductsWrapper}  >
              <Text style={styles.latestProductsTitle} >Benzer Ürünler</Text>
              {
                this.state.latestProducts.map((product, key) => {
                  return (
                    <TouchableOpacity key={key} style={styles.eachProductWrapper} onPress={() => {this.props.navigation.push('buyDetails', {"user": this.state.user, "id": product._id})}} > 
                      <View style={styles.eachProductLeftSide} >
                        <Image source={{uri: product.productPhotoArray[0]}} style={styles.eachProductImage} ></Image>
                      </View>
                      <View style={styles.eachProductRightSide} >
                        <Text style={styles.eachProductName} numberOfLines={1} > {product.name} </Text>
                        <Text style={styles.eachProductLocation} >{product.city_name}, {product.town}</Text>
                        <Text style={styles.eachProductPrice} > {product.price} </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              }
            </View>
          </ScrollView>
        </View>
        <NavBar navigation={this.props.navigation} pageName="main" buyPage={true} ></NavBar>
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
  innerContent: {
    padding: 20,
    flex: 1
  },
  productWrapper: {
    backgroundColor: "white",
    flex: 1,
    borderColor: "rgb(236, 235, 235)",
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    paddingTop: 0
  },
  imageWrapper: {
    height: 300,
    paddingTop: 5,
    paddingBottom: 5
  },
  imageWrapperDotStyle: {
    backgroundColor: "rgb(112, 112, 112)"
  },
  imageWrapperActiveDotStyle: {
    backgroundColor: "rgb(255, 67, 148)"
  },
  eachImageWrapper: {
    flex: 1
  },
  eachImage: {
    height: 300,
    resizeMode: "contain"
  },
  productName: {
    color: "rgb(112, 112, 112)",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5
  },
  productCreatedAt: {
    color: "rgb(112, 112, 112)",
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 15
  },
  productLocationWrapper: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center"
  },
  productLocationLogo: {
    height: 15,
    marginLeft: -5,
    resizeMode: "contain"
  },
  productLocation: {
    color: "rgb(112, 112, 112)",
    fontSize: 16,
    fontWeight: "300"
  },
  productDescription: {
    fontSize: 18,
    color: "rgb(112, 112, 112)",
    fontWeight: "500",
    marginBottom: 20
  },
  addToFavoriteWrapper: {
    flexDirection: "row", justifyContent: "flex-end", alignItems: "center", 
    width: "100%", marginTop: "auto"
  },
  addToFavoriteButton: {
    height: 25, width: 25, resizeMode: "contain"
  },
  productPrice: {
    color: "rgb(255, 67, 148)",
    fontSize: 28,
    fontWeight: "800",
    marginLeft: "auto"
  },
  messagesWrapper: {
    padding: 20, 
    backgroundColor: "white",
    borderColor: "rgb(236, 235, 235)",
    borderWidth: 2,
    marginTop: 20,
    borderRadius: 15
  },
  messagesTitle: {
    color: "rgb(112, 112, 112)",
    fontWeight: "200",
    fontSize: 27,
    marginBottom: 10
  },
  messagesInput: {
    color: "rgb(112, 112, 112)",  fontSize: 20, textAlignVertical: "top",
    padding: 10,
    borderColor: "rgb(236, 235, 235)",
    borderWidth: 2,
    fontWeight: "300",
    borderRadius: 15,
    height: 150,
    marginBottom: 20,
    backgroundColor: "rgb(248, 248, 248)"
  },
  messageSendButton: {
    marginLeft: "auto",
    padding: 10,
    borderColor: "rgba(255, 61, 148, 0.34)",
    backgroundColor: "rgba(255, 108, 128, 0.3)",
    borderWidth: 2,
    borderRadius: 10
  },
  messageSendButtonText: {
    color: "rgb(255, 61, 148)",
    fontSize: 18,
    fontWeight: "800"
  },
  latestProductsWrapper: {
    marginTop: 20,
    marginBottom: 60
  },
  latestProductsTitle: {
    color: "rgb(112, 112, 112)",
    fontWeight: "200",
    fontSize: 27,
    marginBottom: 10
  },
  eachProductWrapper: {
    padding: 5,
    backgroundColor: "white",
    marginBottom: 10,
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "rgb(236, 235, 235)",
    borderWidth: 2
  },
  eachProductLeftSide: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  eachProductImage: {
    height: 100,
    width: 100,
    borderRadius: 5
  },
  eachProductRightSide: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  eachProductName: {
    fontSize: 18,
    color: "rgb(112, 112, 112)",
    fontWeight: "800"
  },
  eachProductLocation: {
    fontSize: 14,
    color: "rgb(112, 112, 112)",
    fontWeight: "300",
    marginTop: 3
  },
  eachProductPrice: {
    alignSelf: "flex-end",
    marginTop: "auto",
    fontSize: 25,
    color: "rgb(255, 67, 148)",
    fontWeight: "700"
  }
})

AppRegistry.registerComponent('BuyDetails', () => BuyDetails);
