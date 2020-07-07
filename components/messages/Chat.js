import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Animated, View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, StatusBar, TextInput, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEraser, faCheck, faHandsHelping, faUserPlus, faShoppingCart, faMobileAlt, faPen, faGift, faBookOpen, faGlobe, faTimes, faSearch, faHome, faPuzzlePiece, faTshirt, faGraduationCap, faTicketAlt  } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';

const apiRequest = require('../../utils/apiRequest');
const getCityTowns = require('../../utils/getCityTowns');

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;
const STATIC_HEADER_HEIGHT = 100;

export default class Chat extends Component {
  static navigationOptions = {
    header: null
  };
  
  constructor(props) {
    super(props);

    const filterTranlateY = new Animated.Value(650);

    this.state = {
      filterTranlateY,
      filterDisplay: "none",
      filterButtonClicked: false,
      filterButtonType: null,
      filterButtonMarginTop: 175,
      id: this.props.navigation.getParam('id', null),
      user: {},
      chat_list: [],
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
      subcategories: {
        all: ["Tümü"],
        book: ["Okuma Kitabı", "TYT/AYT", "SAT/AP", "Abitur", "Yabancı Dil", "IB", "Matura", "Sözlük", "LGS", "KPSS", "DGS", "Diğer"],
        stationery: ["Hepsi"],
        electronic: ["Telefon", "Tablet", "Bilgisayar", "Kulaklık", "Oyun/Konsol", "Powerbank", "Kamera", "Elektrikli Ev Aletleri", "Aksesuar", "Diğer"],
        account: ["Hepsi"],
        hobby: ["Hepsi"],
        fashion: ["T-Shirt", "Sweatshirt", "Parfüm", "Aksesuar", "Diğer"],
        lesson: ["TYT/AYT", "Almanca", "İngilizce", "Fransızca", "Mentorluk", "Ders Notu", "Diğer"],
        home: ["Hepsi"],
        ticket: ["Hepsi"],
        exchange: ["Hepsi"],
        donation: ["Hepsi"],
        other: ["Hepsi"]
      },
      cities: [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
      ],
      filter_price_options: ["Tümü", "0-20₺", "20-50₺", "50-100₺", "100-200₺", "200-1000₺", "1000+₺"]
    };
  }

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

  getMessages = () => {
    apiRequest({
      method: 'GET',
      url: '/messages',
      query: {
        id: this.state.id
      }
    }, (err, data) => {
      if (err || data.error) return this.props.navigation.navigate('Index', { id: this.state.id });

      return this.setState({
        chat_list: data.chat_list
      });
    });
  }

  componentDidMount() {
    this.getUser();
    this.getMessages();
  }

  filterOpenButton = () => {
    Animated.spring(
      this.state.filterTranlateY,
      {
        toValue: 0,
        velocity: 100,
        tension: 5,
        friction: 10,
        useNativeDriver: false
      }
    ).start();
    this.setState({filterDisplay: "flex"});
  }

  filterCloseButton = () => {
    Animated.spring(
      this.state.filterTranlateY,
      {
        toValue: 650,
        velocity: 100,
        tension: 5,
        friction: 10,
        useNativeDriver: false
      }
    ).start();
    this.setState({filterDisplay: "none"});
  }

  filterEraseButton = () => {
    this.setState({
      filter: {
        category: "all",
        subcategory: "all",
        city: "Tümü",
        town: "Tümü",
        price: "Tümü"
      },
      filterButtonClicked: false,
      filterButtonType: null
    })
  }

  filterApplyButton = () => {
    this.props.navigation.push("Index", {
      id: this.state.id,
      filter: this.state.filter
    });
  }

  filterChoseButtonClick = (type) => {
    const types = ["subcategory", "city", "town", "price"];
    if (!this.state.filterButtonClicked) {
      this.setState({
        filterButtonClicked: true,
        filterButtonType: type,
        filterButtonMarginTop: 176 + (types.indexOf(type) * 77)
      });
    } else if (this.state.filterButtonType != type) {
      this.setState({
        filterButtonType: type,
          filterButtonMarginTop: 176 + (types.indexOf(type) * 77)
      });
    } else {
      this.setState({
        filterButtonClicked: false,
        filterButtonType: null
      });
    }
  }

  getFilterChoseWrapperContent = () => {
    if (this.state.filterButtonType == "subcategory") {
      return (
        <ScrollView style={{flex: 1, width: "90%"}} >
        {
          this.state.subcategories[this.state.filter.category].map((sub, key) => {
            return (
              <TouchableOpacity
                key={key}
                style={styles.filter_each_chose}
                onPress={() => {this.setState(state => {
                  state.filter.subcategory = this.state.subcategories[state.filter.category][key];

                  return {
                    filter: state.filter,
                    filterButtonClicked: false,
                    filterButtonType: null
                  }
                })}}
              >
                <Text style={styles.filter_each_chose_text} >{sub}</Text>
              </TouchableOpacity>
            );
          })
        }
        </ScrollView>
      );
    } else if (this.state.filterButtonType == "city") {
      return (
        <ScrollView style={{flex: 1, width: "90%"}} >
          <TouchableOpacity
            style={styles.filter_each_chose}
            onPress={() => {this.setState(state => {
              state.filter.city = "Tümü";
              state.filter.town = "Tümü";

              return {
                filter: state.filter,
                filterButtonClicked: false,
                filterButtonType: null
              }
            })}}
          >
            <Text style={styles.filter_each_chose_text} >Tümü</Text>
          </TouchableOpacity>
        {
          this.state.cities.map((city, key) => {
            return (
              <TouchableOpacity
                key={key}
                style={styles.filter_each_chose}
                onPress={() => {this.setState(state => {
                  state.filter.city = city;
                  state.filter.town = "Tümü";

                  return {
                    filter: state.filter,
                    filterButtonClicked: false,
                    filterButtonType: null
                  }
                })}}
              >
                <Text style={styles.filter_each_chose_text} >{city}</Text>
              </TouchableOpacity>
            );
          })
        }
        </ScrollView>
      );
    } else if (this.state.filterButtonType == "town") {
      return (
        <ScrollView style={{flex: 1, width: "90%"}} >
          <TouchableOpacity
            style={styles.filter_each_chose}
            onPress={() => {this.setState(state => {
              state.filter.town = "Tümü";

              return {
                filter: state.filter,
                filterButtonClicked: false,
                filterButtonType: null
              }
            })}}
          >
            <Text style={styles.filter_each_chose_text} >Tümü</Text>
          </TouchableOpacity>
        { getCityTowns(this.state.filter.city).map((city, key) => {
            return (
              <TouchableOpacity
                key={key}
                style={styles.filter_each_chose}
                onPress={() => {this.setState(state => {
                  state.filter.town = city;

                  return {
                    filter: state.filter,
                    filterButtonClicked: false,
                    filterButtonType: null
                  }
                })}}
              >
                <Text style={styles.filter_each_chose_text} >{city}</Text>
              </TouchableOpacity>
            );
          }) }
        </ScrollView>
      );
    } else if (this.state.filterButtonType == "price") {
      return (
        <ScrollView style={{flex: 1, width: "90%"}} >
        { this.state.filter_price_options.map((price, key) => {
            return (
              <TouchableOpacity
                key={key}
                style={styles.filter_each_chose}
                onPress={() => {this.setState(state => {
                  state.filter.price = price;

                  return {
                    filter: state.filter,
                    filterButtonClicked: false,
                    filterButtonType: null
                  }
                })}}
              >
                <Text style={styles.filter_each_chose_text} >{price}</Text>
              </TouchableOpacity>
            );
          }) }
        </ScrollView>
      );
    } else {
      return (<View></View>);
    }
  }

  render() {
    return (
      <View style={styles.main_wrapper}>
        <View style={styles.static_header} >
          <TouchableOpacity onPress={() => {this.filterOpenButton()}} >
            <Image source={require('./../../assets/filter.png')} style={styles.static_header_logo} ></Image>
          </TouchableOpacity>
          <View style={[styles.header_upper_search_input_wrapper]} >
            <FontAwesomeIcon icon={faSearch} size={15} color="rgb(112, 112, 112)" />
            <TextInput style={styles.header_search_input} placeholder="İstediğin ürünü anında bul" ></TextInput>
          </View>
          <TouchableOpacity style={styles.static_header_profile_wrapper} onPress={() => {this.props.navigation.navigate('Profile', { id: this.state.id, profile_id: this.state.id })}} >
            <Image source={{uri: this.state.user.profilePhoto}} style={styles.static_header_profile} ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.header_title_wrapper} >
          <Text style={styles.header_title} >Sohbetler</Text>
        </View>
        <ScrollView style={styles.chat_wrapper}>
          { this.state.chat_list.map((chat, key) => {
            return (
              <TouchableOpacity key={key} style={styles.each_chat} onPress={() => this.props.navigation.navigate('Message', { id: this.state.id, chat_id: chat._id })} >
                <Image style={styles.chat_product_image} source={{uri: chat.product.productPhotoArray[0]}} ></Image>
                <Image style={styles.chat_user_image} source={{uri: chat.buyer._id.toString() == this.state.user._id ? chat.owner.profilePhoto : chat.buyer.profilePhoto}} ></Image>
                <View style={styles.chat_content} >
                  <Text style={styles.chat_user_name} numberOfLines={1} ellipsizeMode="tail" >{chat.buyer._id.toString() == this.state.user._id ? chat.owner.name : chat.buyer.name}</Text>
                  <Text style={styles.chat_product_name} numberOfLines={1} ellipsizeMode="tail" >{chat.product.name}</Text>
                  { chat.messages[chat.messages.length-1].sendedBy == chat.owner._id.toString() ?
                    <View style={styles.last_message_wrapper} >
                      <View style={{flexDirection: "row", alignItems: "center"}} >
                        <FontAwesomeIcon icon={faCheck} color={chat.messages[chat.messages.length-1].read ? "rgb(111, 214, 175)" : "rgba(112, 112, 112, 0.6)"} size={11} style={{zIndex: 1}} />
                        <FontAwesomeIcon icon={faCheck} color={chat.messages[chat.messages.length-1].read ? "rgb(111, 214, 175)" : "rgba(112, 112, 112, 0.6)"}  size={11} style={{marginLeft: -5}} />
                      </View>
                      <Text style={styles.chat_last_message} numberOfLines={1} ellipsizeMode="tail" >{chat.messages[chat.messages.length-1].content}</Text>
                    </View>
                    :
                    <View style={styles.last_message_wrapper} >
                      <Text style={styles.chat_last_message} numberOfLines={1} ellipsizeMode="tail" >{chat.messages[chat.messages.length-1].content}</Text>
                    </View>
                  }
                  { chat.messages.filter(message => {
                      return message.sendedBy != this.state.user._id.toString() && !message.read
                    }).length ?
                    <View style={styles.not_read_message} >
                      <Text style={styles.not_read_message_text} numberOfLines={1} ellipsizeMode="tail" >{chat.messages.filter(message => {
                        return message.sendedBy != this.state.user._id.toString() && !message.read
                      }).length}</Text>
                    </View>
                    :
                    <View></View> }
                </View>
              </TouchableOpacity>
            );
          }) }
          <View style={{width: "100%", height: 100}} ></View>
        </ScrollView>
        <TouchableOpacity style={styles.new_product_button} onPress={() => {this.props.navigation.navigate('New', { id: this.state.id })}} >
          <Text style={styles.new_product_button_text} >İlan Ver!</Text>
        </TouchableOpacity>
        <View style={styles.navigation_bar} >
          <TouchableOpacity style={styles.each_navigation_buton} onPress={() => {this.props.navigation.push('Favorites', {id: this.state.id})}} >
            <FontAwesomeIcon icon={faHeart} size={28} color="rgb(112, 112, 112)" />
            <Text style={styles.each_navigation_buton_text} >Favoriler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.each_navigation_buton} onPress={() => {this.props.navigation.push('Index', {id: this.state.id})}}>
            <FontAwesomeIcon icon={faHome} size={28} color="rgb(112, 112, 112)" />
            <Text style={styles.each_navigation_buton_text} >Ana Sayfa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.each_navigation_buton} >
            <FontAwesomeIcon icon={faComment} size={28} color="rgb(88, 0, 232)" onPress={() => {this.props.navigation.push('Chat', {id: this.state.id})}}/>
            <Text style={styles.each_navigation_buton_text} >Mesajlar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {this.filterCloseButton()}} style={[styles.filter_all_wrapper, {display: this.state.filterDisplay}]} ></TouchableOpacity>
        <Animated.View style={[styles.filter_wrapper, { transform: [{ translateY: this.state.filterTranlateY }] }]} >
          <View style={styles.filter_category_wrapper_external} >
            <ScrollView style={styles.filter_category_wrapper} horizontal={true} >
              { 
                this.state.categories.map((category, key) => {
                  if (this.state.filter.category == category.id) {
                    return (
                      <TouchableOpacity style={styles.each_header_item} key={key} onPress={() => {this.setState((state => {
                        state.filter.category = category.id;
                        state.filter.subcategory = "Tümü";
                        return {
                          filter: state.filter,
                          filterButtonClicked: false,
                          filterButtonType: null
                        }
                      }))}} >
                        <View style={styles.each_header_inner_wrapper} >
                          <FontAwesomeIcon icon={category.icon} size={20} color="rgb(88, 0, 232)"
                          />
                        </View>
                        <Text style={styles.each_header_item_text} >{category.name}</Text>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <TouchableOpacity style={styles.each_header_item} key={key} onPress={() => {this.setState((state => {
                        state.filter.category = category.id;
                        state.filter.subcategory = "Tümü";
                        return {
                          filter: state.filter,
                          filterButtonClicked: false,
                          filterButtonType: null
                        }
                      }))}} >
                        <View style={styles.each_header_inner_wrapper} >
                          <FontAwesomeIcon icon={category.icon} size={20} color="rgb(111, 214, 175)"
                          />
                        </View>
                        <Text style={styles.each_header_item_text} >{category.name}</Text>
                      </TouchableOpacity>
                    );
                  }
                })
              }
              <View style={{height: 100, width: 30}} ></View>
            </ScrollView>
          </View>
          { 
            this.state.filterButtonClicked ?
            <View style={[styles.filter_chose_wrapper, {marginTop: this.state.filterButtonMarginTop}]} >
              { this.getFilterChoseWrapperContent() }
            </View>
            :
            <View></View>
          }
          <View style={styles.filter_each_line} >
            <Text style={styles.filter_each_text} >Alt Kategori</Text>
            <TouchableOpacity
              style={ this.state.filterButtonType == "subcategory" ? styles.filter_chose_button_selected : styles.filter_chose_button}
              onPress={() => {this.filterChoseButtonClick("subcategory")}} >
              <Text style={styles.filter_chose_button_text} >{this.state.filter.subcategory}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filter_each_line} >
            <Text style={styles.filter_each_text} >Şehir</Text>
            <TouchableOpacity
              style={ this.state.filterButtonType == "city" ? styles.filter_chose_button_selected : styles.filter_chose_button}
              onPress={() => {this.filterChoseButtonClick("city")}} >
              <Text style={styles.filter_chose_button_text} >{this.state.filter.city}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filter_each_line} >
            <Text style={styles.filter_each_text} >İlçe</Text>
            <TouchableOpacity
              style={ this.state.filterButtonType == "town" ? styles.filter_chose_button_selected : styles.filter_chose_button}
              onPress={() => {this.filterChoseButtonClick("town")}} >
              <Text style={styles.filter_chose_button_text} >{this.state.filter.town}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filter_each_line} >
            <Text style={styles.filter_each_text} >Fiyat</Text>
            <TouchableOpacity
              style={ this.state.filterButtonType == "price" ? styles.filter_chose_button_selected : styles.filter_chose_button}
              onPress={() => {this.filterChoseButtonClick("price")}} >
              <Text style={styles.filter_chose_button_text} >{this.state.filter.price}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filter_buttons_wrapper} >
            <TouchableOpacity style={styles.filter_delete_button} onPress={() => {this.filterCloseButton()}} >
              <FontAwesomeIcon icon={faTimes} size={22} color="rgb(254, 254, 254)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filter_erase_button} onPress={() => {this.filterEraseButton()}} >
              <FontAwesomeIcon icon={faEraser} size={22} color="rgb(254, 254, 254)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filter_apply_button} onPress={() => {this.filterApplyButton()}} >
              <FontAwesomeIcon icon={faCheck} size={22} color="rgb(254, 254, 254)" />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  static_header_profile_wrapper: {
    flexDirection: "row", alignItems: "center"
  },
  static_header_profile: {
    width: 50, height: 50, resizeMode: "contain",
    borderRadius: 25
  },
  header_search_wrapper: {
    backgroundColor: "rgb(254, 254, 254)", justifyContent: "center",
    width: "100%", height: 42, marginTop: 10,
  },
  header_search_input: {
    marginLeft: 5, flex: 1
  },
  header_upper_search_input_wrapper: {
    marginLeft: 10, marginRight: 10, flex: 1,
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
    paddingLeft: 10, paddingRight: 15, height: 34, borderRadius: 10,
    fontSize: 15, borderColor: "rgb(236, 236, 236)", borderWidth: 1
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
  header_title_wrapper: {
    backgroundColor: "rgb(254, 254, 254)", justifyContent: "center",
    width: "100%", height: 50, paddingLeft: 20, paddingRight: 20,
    borderBottomColor: "rgb(236, 236, 236)", borderBottomWidth: 2
  },
  header_title: {
    fontSize: 22, color: "rgb(28, 28, 28)", fontWeight: "700", marginTop: "auto",
    marginBottom: 10
  },
  chat_wrapper: {
    paddingLeft: 20, paddingRight: 20, paddingTop: 20
  },
  each_chat: {
    flex: 1, marginBottom: 15, backgroundColor: "rgb(254, 254, 254)", padding: 10,
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 25,
    flexDirection: "row", alignItems: "center"
  },
  chat_product_image: {
    height: 40, width: 40, borderRadius: 5, resizeMode: "contain"
  },
  chat_user_image: {
    height: 30, width: 30, borderRadius: 15,
    marginLeft: -15, marginTop: "auto", marginRight: 15
  },
  chat_content: {
    flex: 1
  },
  chat_user_name: {
    fontSize: 15, fontWeight: "700", color: "rgb(28, 28, 28)"
  },
  chat_product_name: {
    fontSize: 12, fontWeight: "300", color: "rgb(28, 28, 28)", marginTop: 5
  },
  last_message_wrapper: {
    flexDirection: "row", alignItems: "center", marginTop: 10
  },
  chat_last_message: {
    fontSize: 13, fontWeight: "300", color: "rgb(28, 28, 28)", marginLeft: 5,
    width: "80%"
  },
  not_read_message: {
    position: "absolute", right: 0, marginTop: 40,
    backgroundColor: "rgb(88, 0, 232)", height: 22, width: 22, borderRadius: 11,
    justifyContent: "center", alignItems: "center"
  },
  not_read_message_text: {
    color: "rgb(254, 254, 254)", fontWeight: "800", fontSize: 12
  },
  new_product_button: {
    position: "absolute", alignSelf: "center", bottom: 105,
    width: 150, paddingTop: 10, paddingBottom: 10,
    backgroundColor: "rgb(88, 0, 232)",
    // backgroundColor: "rgb(160, 3, 70)",
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
  },
  filter_all_wrapper: {
    width: "100%", height: "100%", position: "absolute", zIndex: 5,
    bottom: 0, left: 0, right: 0, top: 0, backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  filter_wrapper: {
    position: "absolute", height: 650, width: "100%", backgroundColor: "rgb(248, 248, 248)",
    borderTopLeftRadius: 25, borderTopRightRadius: 25, left: 0, right: 0, bottom: 0,  zIndex: 6,
    alignItems: "center", paddingTop: 10
  },
  filter_close_button: {
    marginTop: 15, marginLeft: "auto", marginRight: 20
  },
  filter_category_wrapper_external: {
    height: 90
  },
  filter_category_wrapper: {
    flexDirection: "row", height: 30, paddingLeft: 20, paddingRight: 20
  },
  filter_each_line: {
    paddingLeft: 20, paddingRight: 20, marginTop: 15,
    width: "100%"
  },
  filter_each_text: {
    fontSize: 14, fontWeight: "600", color: "rgb(88, 0, 232)", marginBottom: 5
  },
  filter_chose_button: {
    marginLeft: "auto", backgroundColor: "rgb(240, 240, 240)",
    borderColor: "rgb(220, 220, 220)", borderWidth: 2, borderRadius: 10,
    alignItems: "center", justifyContent: "center", width: "100%", height: 40
  },
  filter_chose_button_selected: {
    marginLeft: "auto", backgroundColor: "rgb(254, 254, 254)",
    borderColor: "rgb(220, 220, 220)", borderWidth: 2, borderRadius: 10,
    alignItems: "center", justifyContent: "center", width: "100%", height: 40,
    borderBottomWidth: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0
  },
  filter_chose_button_text: {
    fontSize: 16, fontWeight: "600", color: "rgb(112, 112, 112)"
  },
  filter_chose_wrapper: {
    position: "absolute", right: 20, left: 20, backgroundColor: "rgb(254, 254, 254)",
    alignSelf: "flex-start", zIndex: 10, alignItems: "center", maxHeight: 200,
    borderColor: "rgb(210, 210, 210)", borderWidth: 2, borderTopWidth: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10
  },
  filter_each_chose: {
    width: "90%", borderTopWidth: 1, borderTopColor: "rgb(210, 210, 210)", width: "100%",
    justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 10
  },
  filter_each_chose_text: {
    fontSize: 15, fontWeight: "300", color: "rgb(112, 112, 112)"
  },
  filter_buttons_wrapper: {
    marginTop: "auto", marginBottom: 40,
    flexDirection: "row", alignItems: "center", justifyContent: "center"
  },
  filter_delete_button: {
    backgroundColor: "rgb(200, 0, 0)",
    padding: 10, borderRadius: 20
  },
  filter_erase_button: {
    backgroundColor: "rgb(251, 236, 93)", marginRight: 20, marginLeft: 20,
    padding: 10, borderRadius: 20
  },
  filter_apply_button: {
    backgroundColor: "rgb(0, 200, 0)",
    padding: 10, borderRadius: 20
  }
});


AppRegistry.registerComponent('Chat', () => Chat);
