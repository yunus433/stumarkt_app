import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEraser, faCheck, faHandsHelping, faUserPlus, faShoppingCart, faMobileAlt, faPen, faGift, faBookOpen, faGlobe, faTimes, faHome, faPuzzlePiece, faTshirt, faGraduationCap, faTicketAlt  } from '@fortawesome/free-solid-svg-icons';

const getCityTowns = require('../../utils/getCityTowns');

export default class Filter extends Component {
  static navigationOptions = {
    header: null
  };
  
  constructor(props) {
    super(props);

    this.state = {
      filterButtonClicked: false,
      filterButtonType: null,
      filterButtonMarginTop: 175,
      id: this.props.navigation.getParam('id', null),
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
      filter_price_options: [
        "Tümü", "0-20₺", "20-50₺", "50-100₺", "100-200₺", "200-1000₺", "1000+₺"
      ]
    };
  }
  
  filterCloseButton = () => {
    this.props.navigation.goBack();
  }

  filterApplyButton = () => {
    this.props.navigation.push("Index", {
      id: this.state.id,
      filter: this.state.filter
    });
  }

  categoryChoseButtonController = (category) => {
    this.props.navigation.push('Index', {
      id: this.state.id,
      filter: {
        category: category
      }
    })
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1, backgroundColor: "rgb(248, 248, 248)"
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
    borderTopWidth: 1, borderTopColor: "rgb(210, 210, 210)", width: "100%",
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


AppRegistry.registerComponent('Filter', () => Filter);
