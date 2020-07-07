import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Animated, View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, StatusBar, TextInput, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHandsHelping, faUserPlus, faShoppingCart, faHeart as faHeartFill, faMobileAlt, faPen, faGift, faBookOpen, faGlobe, faTimes, faSearch, faHome, faMapMarkerAlt, faPuzzlePiece, faTshirt, faGraduationCap, faTicketAlt  } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;
const DYNAMIC_HEADER_HEIGHT = 180;
const STATIC_HEADER_HEIGHT = 100;

const apiRequest = require('../../utils/apiRequest');

export default class Index extends Component {
  static navigationOptions = {
    header: null
  };
  
  constructor(props) {
    super(props);

    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        DYNAMIC_HEADER_HEIGHT - STATUS_BAR_HEIGHT,
      ),
      id: this.props.navigation.getParam('id', null),
      user: {},
      products: [],
      filter: this.props.navigation.getParam('filter', {
        page: 0,
        limit: 10,
        category: 'all',
        subcategory: 'Tümü',
        keywords: null,
        city: 'Tümü',
        town: 'Tümü',
        price: 'Tümü'
      }),
      categories: [
        { name: "Tüm Ürünler", id: "all", icon: faShoppingCart },
        {  name: "Kitap",  id: "book",  icon: faBookOpen },
        {  name: "Kırtasiye",  id: "stationery",  icon: faPen },
        {  name: "Elektronik",  id: "electronic",  icon: faMobileAlt },
        {  name: "Bağış",  id: "donation",  icon: faHandsHelping },
        {  name: "Ortak Üyelik/Hesap",  id: "account",  icon: faUserPlus },
        {  name: "Eğlence, Hobi",  id: "hobby",  icon: faPuzzlePiece },
        {  name: "Moda, Giyim",  id: "fashion",  icon: faTshirt },
        {  name: "Ders, Kurs",  id: "lesson",  icon: faGraduationCap },
        {  name: "Ev Eşyası",  id: "home",  icon: faHome },
        {  name: "Bilet",  id: "ticket",  icon: faTicketAlt },
        {  name: "Hediye, Takas",  id: "exchange",  icon: faGift },
        {  name: "Diğer",  id: "other",  icon: faGlobe }
      ],
    };
  }

  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;
  refreshing = false;

  getUser = () => {
    apiRequest({
      method: 'GET',
      url: '/users',
      query: {
        id: this.state.id
      }
    }, (err, data) => {
      if (err || !data || data.error) this.props.navigation.navigate('Landing');

      this.setState({
        user: data.user
      });
    });
  }

  getProducts = (filter) => {
    apiRequest({
      url: '/products',
      method: 'POST',
      body: {
        docsToSkip: filter.page * filter.limit,
        limit: filter.limit,
        category: filter.category,
        subcategory: filter.subcategory,
        city: filter.city,
        town: filter.town,
        price: filter.price,
        keywords: filter.keywords
      }
    }, (err, data) => {
      if (err) return alert("Bir hata oluştu, lütfen tekrar deneyin.");

      this.refreshing = false;

      this.setState(state => {
        return { products: state.products.concat(data.products) }
      });
    });
  }

  reached_end = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height;
  };

  reached_end_controller = () => {
    if (!this.refreshing) {
      this.refreshing = true;

      this.setState((state) => {
        const filter = state.filter;
        filter.page = state.filter.page + 1;
        this.getProducts(filter);
        return { filter };
      });
    }
  }

  componentDidMount() {
    this.getProducts(this.state.filter);
    this.getUser();

    if (!this.state.id)
      return this.props.navigation.navigate('Landing');

    this.state.scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        DYNAMIC_HEADER_HEIGHT - STATUS_BAR_HEIGHT,
      );
    });

    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue = this._scrollValue > DYNAMIC_HEADER_HEIGHT &&
      this._clampedScrollValue > (DYNAMIC_HEADER_HEIGHT - STATUS_BAR_HEIGHT) / 2
      ? this._offsetValue + DYNAMIC_HEADER_HEIGHT
      : this._offsetValue - DYNAMIC_HEADER_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  categoryChoseButtonController = (category) => {
    const filter = this.state.filter;
    filter[category] = category;

    this.props.navigation.push('Index', {
      id: this.state.id,
      filter
    });
  }

  searchProductsController = () => {
    this.props.navigation.push('Index', {
      id: this.state.id,
      filter: this.state.filter
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

  render() {
    const { clampedScroll } = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, DYNAMIC_HEADER_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(DYNAMIC_HEADER_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });

    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, DYNAMIC_HEADER_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.main_wrapper}>
        <View style={styles.static_header} >
          <TouchableOpacity onPress={() => {this.props.navigation.navigate('Filter', { id: this.state.id })}} >
            <Image source={require('./../../assets/filter.png')} style={styles.static_header_logo} ></Image>
          </TouchableOpacity>
          <Animated.View style={[styles.header_external_wrapper, { opacity: navbarOpacity, transform: [{ translateY: navbarTranslate }]  }]} >
            <Text style={styles.header_logo_title} >stumarkt</Text>
          </Animated.View>
          <View style={[styles.header_upper_search_input_wrapper]} >
            <FontAwesomeIcon icon={faSearch} size={15} color="rgb(112, 112, 112)" />
            <TextInput
              style={styles.header_search_input}
              placeholder="İstediğin ürünü anında bul"
              onChangeText={search => {this.setState(state => {
                const filter = state.filter;
                filter.keywords = search;
                return filter;
              })}}
              onSubmitEditing={() => {this.searchProductsController()}} ></TextInput>
          </View>
          <TouchableOpacity style={styles.static_header_profile_wrapper} onPress={() => {this.props.navigation.navigate('Profile', { id: this.state.id, profile_id: this.state.id })}} >
            <Image source={{uri: this.state.user.profilePhoto}} style={styles.static_header_profile} ></Image>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.dynamic_header, { transform: [{ translateY: navbarTranslate }] }]}>
          <View style={styles.header_search_wrapper} >
            <View style={styles.header_search_input_wrapper} >
              <FontAwesomeIcon icon={faSearch} size={15} color="rgb(112, 112, 112)" />
              <TextInput 
                style={styles.header_search_input}
                placeholder="İstediğin ürünü anında bul"
                onChangeText={(search) => {this.setState(state => {
                  const filter = state.filter;
                  filter.keywords = search;
                  return filter;
                })}}
                onSubmitEditing={() => {this.searchProductsController()}} ></TextInput>
            </View>
          </View>
          <Animated.ScrollView
            style={[styles.dynamic_header_content, { opacity: navbarOpacity }]}
            horizontal={true}
          >
            { 
              this.state.categories.map((category, key) => {
                return (
                  <TouchableOpacity style={styles.each_header_item} key={key} onPress={() => {this.categoryChoseButtonController(category.id)}} >
                    <View style={styles.each_header_inner_wrapper} >
                      { this.state.filter.category == category.id ?
                        <FontAwesomeIcon icon={category.icon} size={20} color="rgb(88, 0, 232)"/>
                        :
                        <FontAwesomeIcon icon={category.icon} size={20} color="rgb(111, 214, 175)"/>
                      }
                    </View>
                    <Text style={styles.each_header_item_text} >{category.name}</Text>
                  </TouchableOpacity>
                );
              })
            }
          </Animated.ScrollView>
          <View style={styles.header_title_wrapper} >
            <Text style={styles.header_title} >{this.state.categories.find(category => category.id == this.state.filter.category).name}</Text>
          </View>
        </Animated.View>
        <Animated.ScrollView
          style={styles.products_wrapper}
          scrollEventThrottle={1}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
            {
              useNativeDriver: true,
              listener: event => {
                const offsetY = event.nativeEvent.contentOffset.y

                if (this.reached_end(event.nativeEvent))
                  this.reached_end_controller();
              }
            }
          )}
        >
          { 
            this.state.products.map((product, key) => {
              return (
                <TouchableOpacity
                  style={styles.each_product} key={key}
                  onPress={() => {this.props.navigation.navigate('Details', { id: this.state.id, product_id: product._id.toString() })}}
                >
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
          <View style={styles.empty_product} ></View>
        </Animated.ScrollView>
        <TouchableOpacity style={styles.new_product_button} onPress={() => {this.props.navigation.navigate('New', { id: this.state.id })}} >
          <Text style={styles.new_product_button_text} >İlan Ver!</Text>
        </TouchableOpacity>
        <View style={styles.navigation_bar} >
          <TouchableOpacity style={styles.each_navigation_buton} onPress={() => {this.props.navigation.push('Favorites', {id: this.state.id})}} >
            <FontAwesomeIcon icon={faHeart} size={28} color="rgb(112, 112, 112)" />
            <Text style={styles.each_navigation_buton_text} >Favoriler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.each_navigation_buton} onPress={() => {this.props.navigation.push('Index', {id: this.state.id})}}>
            <FontAwesomeIcon icon={faHome} size={28} color="rgb(88, 0, 232)" />
            <Text style={styles.each_navigation_buton_text} >Ana Sayfa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.each_navigation_buton} onPress={() => {this.props.navigation.push('Chat', {id: this.state.id})}}>
            <FontAwesomeIcon icon={faComment} size={28} color="rgb(112, 112, 112)" />
            <Text style={styles.each_navigation_buton_text} >Mesajlar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1, backgroundColor: "rgb(248, 248, 248)"
  },
  static_header: {
    height: STATIC_HEADER_HEIGHT, backgroundColor: "rgb(254, 254, 254)", zIndex: 3,
    paddingTop: STATUS_BAR_HEIGHT, flexDirection: "row",
    paddingLeft: 20, paddingRight: 20, alignItems: "center"
  },
  static_header_logo: {
    width: 30, height: 30, resizeMode: "contain",
    marginLeft: -5
  },
  header_external_wrapper: {
    height: 39, position: "absolute",
    backgroundColor: "rgb(254, 254, 254)", zIndex: 5,
    top: STATUS_BAR_HEIGHT + 10, left: 50, right: 70, paddingLeft: 20,
    justifyContent: "center", alignItems: "center"
  },
  header_logo_title: {
    color: "rgb(88, 0, 232)", fontWeight: "700", fontSize: 20
  },
  static_header_profile_wrapper: {
    flexDirection: "row", alignItems: "center"
  },
  static_header_profile: {
    width: 50, height: 50, resizeMode: "contain",
    borderRadius: 25
  },
  dynamic_header: {
    position: 'absolute', zIndex: 2,
    top: STATIC_HEADER_HEIGHT, left: 0, right: 0,
    height: DYNAMIC_HEADER_HEIGHT + 10, paddingBottom: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgb(254, 254, 254)',
    borderBottomColor: 'rgb(236, 236, 236)', borderBottomWidth: 2
  },
  dynamic_header_content: {
    width: "100%", flex: 1,
    flexDirection: "row",
    paddingLeft: 20
  },
  each_header_item: {
    justifyContent: "center", alignItems: "center", marginRight: 20
  },
  each_header_inner_wrapper: {
    borderWidth: 2, borderColor: "rgb(236, 236, 236)", borderRadius: 25,
    height: 50, width: 50, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgb(254, 254, 254)",
    shadowOffset: {
      height: 2, width: 1
    }, shadowColor: "rgb(236, 236, 236)", shadowOpacity: 0.7
  },
  each_header_item_text: {
    fontSize: 12, color: "rgb(64, 64, 64)", fontWeight: "300", marginTop: 10
  },
  header_search_wrapper: {
    backgroundColor: "rgb(254, 254, 254)", justifyContent: "center",
    width: "100%", height: 42, marginTop: 10,
  },
  header_search_input_wrapper: {
    marginLeft: 20, marginRight: 20, flex: 1,
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
    paddingLeft: 10, paddingRight: 15, height: 34, borderRadius: 10,
    fontSize: 15, marginBottom: 6,
    borderColor: "rgb(236, 236, 236)", borderWidth: 1
  },
  header_upper_search_input_wrapper: {
    marginLeft: 10, marginRight: 10, flex: 1,
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
    paddingLeft: 10, paddingRight: 15, height: 34, borderRadius: 10,
    fontSize: 15, borderColor: "rgb(236, 236, 236)", borderWidth: 1
  },
  header_search_input: {
    marginLeft: 5, flex: 1
  },
  header_title_wrapper: {
    backgroundColor: "rgb(254, 254, 254)", justifyContent: "center",
    width: "100%", height: 39, paddingLeft: 20, paddingRight: 20
  },
  header_title: {
    fontSize: 22, color: "rgb(28, 28, 28)", fontWeight: "700", marginTop: "auto"
  },
  products_wrapper: {
    paddingTop: DYNAMIC_HEADER_HEIGHT + 10, paddingLeft: 20, paddingRight: 20
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
    fontSize: 14, color: "rgba(28, 28, 28, 0.7)", fontWeight: "300",
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
  new_product_button: {
    position: "absolute", alignSelf: "center", bottom: 105,
    width: 150, paddingTop: 10, paddingBottom: 10,
    backgroundColor: "rgb(88, 0, 232)",
    borderRadius: 25, justifyContent: "center", alignItems: "center"
  },
  new_product_button_text: {
    color: "rgb(254, 254, 254)", fontWeight: "700", fontSize: 17
  },
  navigation_bar: {
    height: 90, width: "100%", backgroundColor: "rgb(254, 254, 254)",
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingLeft: 60, paddingRight: 60, paddingBottom: 15,
    borderTopColor: "rgb(236, 236, 236)", borderTopWidth: 2
  },
  each_navigation_buton: {
    alignItems: "center"
  },
  each_navigation_buton_text: {
    fontSize: 13, fontWeight: "300", color: "rgb(112, 112, 112)",
    marginTop: 5
  }
});


AppRegistry.registerComponent('Index', () => Index);
