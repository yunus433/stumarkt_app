import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView} from 'react-native';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faEdit, faMapMarkerAlt, faHeart as faHeartFill, faStore, fCamera, faCamera } from '@fortawesome/free-solid-svg-icons';
import { faClock, faHeart } from '@fortawesome/free-regular-svg-icons';

const apiRequest = require('../../utils/apiRequest');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

export default class Details extends Component{
  static navigationOptions = {
    header: null
  };
  
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);

    this.state = {
      id: this.props.navigation.getParam('id', null),
      product_id: this.props.navigation.getParam('product_id', null),
      user: {},
      product: {}
    };
  };

  getUser = () => {
    apiRequest({
      method: 'GET',
      url: '/users',
      query: {
        id: this.state.id
      }
    }, (err, data) => {
      if (err || !data || data.error) return this.props.navigation.navigate('Landing');

      this.setState({
        user: data.user
      });
    });
  }

  getProduct = () => {
    apiRequest({
      url: '/products',
      method: 'GET',
      query: {
        id: this.state.product_id
      }
    }, (err, data) => {
      if (err || data.error) return this.props.navigation.navigate('Index', { id: this.state.id });

      this.setState({
        product: data.product
      });
    });
  }

  addToFavorites = () => {
    apiRequest({
      url: "/addToFavorite",
      method: "POST",
      query: {
        id: this.state.id
      },
      body: {
        productId: this.state.product_id
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
    this.getProduct();
  }

  render() {
    return (
      <View style={styles.main_wrapper}>
        <View style={styles.static_header} >
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} >
            <FontAwesomeIcon icon={faArrowLeft} color="rgb(28, 28, 28)" size={23} />
          </TouchableOpacity>
          <Image source={require('../../assets/logo.png')} style={styles.header_logo} ></Image>
        </View>
        <ScrollView style={styles.content_wrapper} >
          { this.state.product._id ?
            <View style={{flex: 1, paddingLeft: 20, paddingRight: 20, paddingBottom: 50}} >
              <View style={styles.image_outer_wrapper} >
                <Swiper 
                  style={styles.imageWrapper} 
                  showsButtons={true} 
                  dotStyle={styles.image_dot_style} 
                  activeDotStyle={styles.image_active_dot_style}
                  showsButtons={false} >
                  {this.state.product.productPhotoArray.map((src, key) => {
                    return (
                      <View style={styles.each_image_wrapper} key={key} >
                        <Image style={styles.each_image} source={{uri: src}} ></Image>
                      </View>
                    )
                  })}
                </Swiper>
              </View>
              <Text style={styles.product_name} >{this.state.product.name}</Text>
              <Text style={styles.product_location} >{this.state.product.city}, {this.state.product.town}</Text>
              <Text style={styles.product_description} >{this.state.product.description}</Text>
              <Text style={styles.product_price} >{this.state.product.price}</Text>
              { this.state.product.owner != this.state.id ?
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}} >
                  <TouchableOpacity style={styles.product_favorite_button} onPress={() => {this.addToFavorites()}} >
                    { this.state.user.favorites && this.state.user.favorites.includes(this.state.product._id) ?
                      <FontAwesomeIcon icon={ faHeartFill } size={25} color="rgb(111, 214, 175)" />
                      :
                      <FontAwesomeIcon icon={ faHeart } size={25} color="rgb(111, 214, 175)" />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.product_message_button} onPress={() => {this.sendMessageController(this.state.product)}} >
                    <Text style={styles.product_message_text} >Mesaj At!</Text>
                  </TouchableOpacity>
                </View>
                :
                <View></View>
              }
            </View>
            :
            <View></View>
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1, backgroundColor: "rgb(248, 248, 248)"
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
    flex: 1
  },
  image_outer_wrapper: {
    width: 325, height: 375, marginTop: 20, alignSelf: "center"
  },
  image_dot_style: {
    backgroundColor: "rgb(112, 112, 112)"
  },
  image_active_dot_style: {
    backgroundColor: "rgb(88, 0, 232)"
  },
  each_image_wrapper: {
    backgroundColor: "rgb(254, 254, 254)", borderRadius: 15,
    width: 325, height: 325, overflow: "hidden",
    justifyContent: "center", alignItems: "center"
  },
  each_image: {
    height: 300, width: 300,
    resizeMode: "contain"
  },
  product_name: {
    fontSize: 20, color: "rgb(28, 28, 28)", fontWeight: "700",
    marginBottom: 5
  },
  product_location: {
    fontSize: 14, color: "rgb(28, 28, 28)", fontWeight: "300",
    marginBottom: 20
  },
  product_description: {
    fontSize: 15, color: "rgb(28, 28, 28)", fontWeight: "400",
    marginBottom: 20
  },
  product_price: {
    fontSize: 25, color: "rgb(88, 0, 232)", fontWeight: "700",
    marginLeft: "auto", marginBottom: 50
  },
  product_favorite_button: {
    width: 60, height: 60, marginRight: 5,
    borderColor: "rgb(111, 214, 175)", borderWidth: 2, borderRadius: 25,
    justifyContent: "center", alignItems: "center"
  },
  product_message_button: {
    flex: 1, height: 60, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgb(111, 214, 175)", borderRadius: 20
  },
  product_message_text: {
    color: "rgb(254, 254, 254)", fontSize: 20, fontWeight: "600"
  }
})

AppRegistry.registerComponent('Details', () => Details);
