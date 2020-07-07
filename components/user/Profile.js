import React, { Component } from 'react';
import { AppRegistry, TouchableNativeFeedbackComponent } from 'react-native';
import { AsyncStorage, View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHeart as faHeartFill, faEdit, faMapMarkerAlt, faStore, fCamera, faCamera } from '@fortawesome/free-solid-svg-icons';
import { faClock, faHeart } from '@fortawesome/free-regular-svg-icons';

const apiRequest = require('../../utils/apiRequest');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

export default class Profile extends Component {
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);

    this.state = {
      user: {},
      id: this.props.navigation.getParam('id', null),
      profile_id: this.props.navigation.getParam('profile_id', null),
      selected_button: "products",
      products: []
    };
  };

  getUser = () => {
    apiRequest({
      url: '/users',
      method: 'GET',
      query: { id: this.state.profile_id }
    }, (err, data) => {
      if (err || !data || data.error) this.props.navigation.navigate('Landing');
      data.user.school = data.school_name;
      this.setState({
        user: data.user
      });
    });
  }

  getProducts = () => {
    apiRequest({
      method: 'GET',
      url: '/products',
      query: {
        owner: this.state.profile_id
      }
    }, (err, data) => {
      if (err || data.error) return this.props.navigation.navigate('Index', { id: this.state.id });

      this.setState({
        products: data.products
      });
    });
  }

  addToFavorites = (id) => {
    apiRequest({
      url: "/addToFavorite",
      method: "POST",
      query: {
        id: this.state.id
      },
      body: {
        productId: id
      }
    }, (err, data) => {
      if (err || data.error) return alert("Bilinmeyen bir hata oluştu, lütfen tekrar deneyin.");

      this.setState({
        "user": data.user
      });
    });
  }

  sendMessageController = (product) => {
    apiRequest({
      method: 'POST',
      url: '/newMessage',
      body: {
        buyer: this.state.id,
        owner: product.owner,
        product: product._id,
        content: "Merhaba!"
      }
    }, (err, data) => {
      if (err) return alert("Bilinmeyen bir hata oluştu, lütfen tekrar deneyin!");

      if (data.error && data.error == 'chat duplicate')
        return this.props.navigation.navigate('Message', { id: this.state.id, chat_id: data.chat_id });

      if (data.error) return alert("Bilinmeyen bir hata oluştu, lütfen tekrar deneyin!");

      return this.props.navigation.navigate('Message', { id: this.state.id, chat_id: data.id });
    });
  }

  componentDidMount() {
    this.getUser();
    this.getProducts();
  }

  render() {
    return (
      <View style={styles.main_wrapper} >
        <View style={styles.static_header} >
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} >
            <FontAwesomeIcon icon={faArrowLeft} color="rgb(28, 28, 28)" size={23} />
          </TouchableOpacity>
          <Image source={require('../../assets/logo.png')} style={styles.header_logo} ></Image>
        </View>
        <View style={styles.content_wrapper} >
          <View style={{justifyContent: "center", alignItems: "center", marginBottom: 20}} >
            {/* { this.state.id == this.state.profile_id ? 
              <FontAwesomeIcon icon={faCamera} size={80} color="rgba(112, 112, 112, 0.2)" style={styles.image_change_icon} />
              :
              <View></View>
            } */}
            <Image source={{uri: this.state.user.profilePhoto}} style={styles.user_profile_photo} ></Image>
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}} >
            <Text style={styles.user_name} >{this.state.user.name}</Text>
            {/* { this.state.id == this.state.profile_id ?
            <TouchableOpacity onPress={() => {this.props.navigation.navigate('User', { id: this.state.id })}} >
              <FontAwesomeIcon icon={faEdit} color="rgb(88, 0, 232)" size={20} />
            </TouchableOpacity>
            :
            <View></View>
            } */}
          </View>
          <Text style={styles.user_school} >{this.state.user.school}</Text>
        </View>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 15}} >
          <TouchableOpacity style={{alignItems: "center", marginRight: 50}} onPress={() => {this.setState({selected_button: "products"})}} >
            <View style={styles.products_button} >
              <FontAwesomeIcon icon={faStore} color={this.state.selected_button == "products" ? "rgb(88, 0, 232)" : "rgb(111, 214, 175)"} size={22} />
            </View>
            <Text style={styles.products_button_text} >Satıştakiler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: "center", marginLeft: 50}} onPress={() => {this.setState({selected_button: "old_products"})}} >
            <View style={styles.products_button} >
              <FontAwesomeIcon icon={faClock} color={this.state.selected_button == "old_products" ? "rgb(88, 0, 232)" : "rgb(111, 214, 175)"} size={22} />
            </View>
            <Text style={styles.products_button_text} >Satılan Ürünler</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.products_wrapper}>
          { this.state.selected_button == "products" ?
            <View>
            { 
              this.state.products.filter(product => product.price_number != -1).map((product, key) => {
                return (
                  <TouchableOpacity style={styles.each_product} key={key} >
                    <Image source={{uri: product.productPhotoArray[0]}} style={styles.each_product_image} ></Image>
                    <View style={{flex: 2, marginLeft: 10}} >
                      <Text style={styles.each_product_name} numberOfLines={2} ellipsizeMode="tail" >{product.name}</Text>
                      <View style={{flexDirection: "row", alignItems: "center", marginTop: 5}} >
                        <FontAwesomeIcon icon={ faMapMarkerAlt } size={14} color="rgba(15, 15, 15, 0.5)" />
                        <Text style={styles.each_product_city} numberOfLines={1} ellipsizeMode="tail" >{product.city}, {product.town}</Text>
                      </View>
                      <Text style={styles.each_product_description} numberOfLines={1} ellipsizeMode="tail" >{product.description}</Text>
                      <Text style={styles.each_product_price} >{product.price}</Text>
                      { product.owner != this.state.id ?
                        <View style={styles.each_product_bottom} >
                          <TouchableOpacity style={styles.each_product_message_buton} onPress={() => {this.sendMessageController(product)}} >
                            <Text style={styles.each_product_message_buton_text} >Mesaj At!</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {this.addToFavorites(product._id)}} >
                            { this.state.user.favorites && this.state.user.favorites.includes(product._id) ?
                              <FontAwesomeIcon icon={ faHeartFill } size={25} color="rgb(111, 214, 175)" />
                              :
                              <FontAwesomeIcon icon={ faHeart } size={25} color="rgb(112, 112, 112)" />
                            }
                          </TouchableOpacity>
                        </View>
                        :
                        <View></View>
                      }
                    </View>
                  </TouchableOpacity>
                );
              })
            }
            </View>
            :
            <View>
            { 
              this.state.products.filter(product => product.price_number == -1).map((product, key) => {
                return (
                  <TouchableOpacity style={styles.each_product} key={key} >
                    <Image source={{uri: product.productPhotoArray[0]}} style={styles.each_product_image} ></Image>
                    <View style={{flex: 2, marginLeft: 10}} >
                      <Text style={styles.each_product_name} numberOfLines={2} ellipsizeMode="tail" >{product.name}</Text>
                      <View style={{flexDirection: "row", alignItems: "center", marginTop: 5}} >
                        <FontAwesomeIcon icon={ faMapMarkerAlt } size={14} color="rgba(15, 15, 15, 0.5)" />
                        <Text style={styles.each_product_city} numberOfLines={1} ellipsizeMode="tail" >{product.city}, {product.town}</Text>
                      </View>
                      <Text style={styles.each_product_description} numberOfLines={1} ellipsizeMode="tail" >{product.description}</Text>
                      <Text style={styles.each_product_price} >{product.price}</Text>
                      { product.owner != this.state.id ?
                        <View style={styles.each_product_bottom} >
                          <TouchableOpacity style={styles.each_product_message_buton} onPress={() => {this.sendMessageController(product)}} >
                            <Text style={styles.each_product_message_buton_text} >Mesaj At!</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {this.addToFavorites(product._id)}} >
                            { this.state.user.favorites && this.state.user.favorites.includes(product._id) ?
                              <FontAwesomeIcon icon={ faHeartFill } size={25} color="rgb(111, 214, 175)" />
                              :
                              <FontAwesomeIcon icon={ faHeart } size={25} color="rgb(112, 112, 112)" />
                            }
                          </TouchableOpacity>
                        </View>
                        :
                        <View></View>
                      }
                    </View>
                  </TouchableOpacity>
                );
              })
            }
            </View>
          }
          <View style={styles.empty_product} ></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1, backgroundColor: "rgb(254, 254, 254)"
  },
  static_header: {
    height: 100, paddingTop: STATUSBAR_HEIGHT, backgroundColor: "rgb(254, 254, 254)",
    paddingLeft: 20, paddingRight: 20,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center"
  },
  header_logo: {
    width: 70, height: 40, resizeMode: "contain"
  },
  content_wrapper: {
    alignItems: "center", marginBottom: 30
  },
  user_profile_photo: {
    width: 150, height: 150, resizeMode: "contain",
    borderRadius: 75,
  },
  image_change_icon: {
    position: "absolute", zIndex: 2
  },
  user_name: {
    fontSize: 20, fontWeight: "700", color: "rgb(28, 28, 28)",
    marginRight: 10
  },
  user_school: {
    fontSize: 15, color: "rgba(28, 28, 28, 0.7)", fontWeight: "300",
    marginTop: 10
  },
  products_button: {
    height: 70, width: 70, borderRadius: 35,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgb(248, 248, 248)",
    borderWidth: 2, borderColor: "rgb(236, 236, 236)"
  },
  products_button_text: {
    fontSize: 13, fontWeight: "600", color: "rgb(112, 112, 112)",
    marginTop: 8
  },
  products_wrapper: {
    paddingLeft: 20, paddingRight: 20
  },
  each_product: {
    height: 220,  marginTop: 20,
    backgroundColor: "rgb(254, 254, 254)",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 25,
    shadowOffset: {
      height: 6, width: 4
    }, shadowColor: "rgb(236, 236, 236)", shadowOpacity: 0.9,
    flexDirection: "row", padding: 20
  },
  each_product_image: {
    resizeMode: "contain", flex: 1,
    marginRight: 10
  },
  each_product_name: {
    fontSize: 19, color: "rgb(28, 28, 28)", fontWeight: "600"
  },
  each_product_city: {
    fontSize: 14, color: "rgba(15, 15, 15, 0.7)", fontWeight: "300",
    marginLeft: 3
  },
  each_product_description: {
    fontSize: 13, fontWeight: "300", color: "rgb(28, 28, 28)",
    marginTop: 7
  },
  each_product_bottom: {
    flexDirection: "row", marginTop: "auto",
    justifyContent: "flex-end", alignItems: "center"
  },
  each_product_price: {
    fontSize: 24, color: "rgb(28, 28, 28)", fontWeight: "600",
    marginLeft: "auto", marginTop: 10
  },
  each_product_message_buton: {
    backgroundColor: "rgb(111, 214, 175)", borderRadius: 10,
    paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, marginRight: 10,
    shadowOffset: {
      width: 0,
      height: 2
    }, shadowColor: "rgb(111, 214, 175)", shadowOpacity: 0.35
  },
  each_product_message_buton_text: {
    color: "rgb(254, 254, 254)", fontWeight: "700", fontSize: 15
  },
  empty_product: {
    width: "100%", height: 200
  },
});

AppRegistry.registerComponent('Profile', () => Profile);
