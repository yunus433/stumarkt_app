import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { ActivityIndicator, View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, Linking, StatusBar, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faChevronDown, faCamera, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';

const apiRequest = require('../../utils/apiRequest');
const getCityTowns = require('../../utils/getCityTowns');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

export default class New extends Component {
  static navigationOptions = {
    header: null
  };
  
  constructor (props) {
    super(props);

    this.state = {
      photo_select_display: false,
      photo_uploading: false,
      can_upload_photo: true,
      id: this.props.navigation.getParam('id', null),
      selected_button: "products",
      input_select_wrapper: "none",
      price_checked: false, 
      photo_array: [],
      name: "",
      description: "",
      price: "",
      category: null,
      category_name: null,
      subcategory: null,
      city: null,
      town: null,
      filePath: "",
      clickable: true,
      categories: [
        {  name: "Kitap",  id: "book" },
        {  name: "Kırtasiye",  id: "stationery" },
        {  name: "Elektronik",  id: "electronic" },
        {  name: "Bağış",  id: "donation" },
        {  name: "Ortak Üyelik/Hesap",  id: "account" },
        {  name: "Eğlence, Hobi",  id: "hobby" },
        {  name: "Moda, Giyim",  id: "fashion" },
        {  name: "Ders, Kurs",  id: "lesson" },
        {  name: "Ev Eşyası",  id: "home" },
        {  name: "Bilet",  id: "home" },
        {  name: "Hediye, Takas",  id: "exchange" },
        {  name: "Diğer",  id: "other" }
      ],
      subcategories: {
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
      towns: []
    };
  };

  createProductController = () => {
    if (!this.state.name.trim().length || !this.state.description.trim().length || !this.state.price.trim().length || !this.state.category || !this.state.subcategory || !this.state.city || !this.state.town)
      return alert("Lütfen ürün eklemeden önce gereken tüm bilgileri doldurun.");

    this.setState({ clickable: false });

    apiRequest({
      method: 'POST',
      url: '/newProduct',
      body: {
        category: this.state.category,
        subcategory: this.state.subcategory,
        productPhotoArray: this.state.photo_array,
        name: this.state.name.trim(),
        description: this.state.description.trim(),
        city: this.state.city,
        town: this.state.town,
        price: this.state.price,
        userId: this.state.id
      }
    }, (err, data) => {
      this.setState({ clickable: true });

      if (err || data.error) return alert("Bilinmeyen bir hata oluştu, lütfen tekrar deneyin.");

      return this.props.navigation.navigate('Profile', { id: this.state.id, profile_id: this.state.id });
    });
  }

  pickPhotoController = async () => {
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (newPermission.status === 'granted') {
          ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images"
          })
          .then(res => {
            if (res.cancelled) return;
    
            ImageManipulator.manipulateAsync(
              res.uri, 
              [],
              { compress: 0.4 }
            )
            .then(manipulatedRes => {
              const formData = new FormData();
              formData.append('photo', {
                "uri": manipulatedRes.uri,
                "name": `photo.${manipulatedRes.uri.split('.').pop()}`,
                "type": `image/${manipulatedRes.uri.split('.').pop()}`
              });

              apiRequest({
                method: 'POST',
                url: '/newProductImage',
                is_form_data: true,
                body: formData
              }, (err, data) => {
                if (err)
                  return alert("Err: " + err);

                if (data && data.error)
                  return alert("Err: " + data.error);
      
                if (!data || !data.url)
                  return alert("Err: Bir hata oluştu, lütfen tekrar deneyin.");
                  
                this.setState(state => {
                  const photo_array = state.photo_array.concat(data.url);
    
                  return {
                    photo_array
                  };
                });
              });
            });
          })
          .catch(err => {
            return alert("Err: " + err);
          });
        }
    } else {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images"
      })
      .then(res => {
        if (res.cancelled) return;

        ImageManipulator.manipulateAsync(
          res.uri, 
          [],
          { compress: 0.4 }
        )
        .then(manipulatedRes => {
          const formData = new FormData();
          formData.append('photo', {
            "uri": manipulatedRes.uri,
            "name": `photo.${manipulatedRes.uri.split('.').pop()}`,
            "type": `image/${manipulatedRes.uri.split('.').pop()}`
          });
  
          apiRequest({
            method: 'POST',
            url: '/newProductImage',
            is_form_data: true,
            body: formData
          }, (err, data) => {
            if (err)
              return alert("Err: " + err);
              
            if (data && data.error)
              return alert("Err: " + data.error);
  
            if (!data || !data.url)
              return alert("Err: Bir hata oluştu, lütfen tekrar deneyin.");
              
            this.setState(state => {
              const photo_array =  state.photo_array.concat(data.url);

              return {
                photo_array
              };
            });
          })

        })
        .catch(err => {
          return alert("Err: " + err);
        });
      })
      .catch(err => {
        return alert("Err: " + err);
      });
    }
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
        <ScrollView >
          <View style={styles.content_wrapper} >
            <Text style={styles.content_title} >Yeni Ürün Ekle</Text>
            <ScrollView horizontal={true} style={styles.photo_wrapper} >
              { 
                this.state.photo_array.map((photo, key) => {
                  return (
                    <Image style={styles.each_product_image} source={{uri: photo}} key={key} ></Image>
                  )
                })
              }
              { this.state.photo_uploading ?
                <View style={styles.uploading_wrapper} >
                  <ActivityIndicator size={20} color="rgb(112, 112, 112)" ></ActivityIndicator>
                </View>
                :
                <View></View>
              }
              { this.state.can_upload_photo ?
                <TouchableOpacity style={styles.add_new_photo_button} onPress={() => {this.pickPhotoController()}} >
                  <FontAwesomeIcon icon={faPlus} color="rgb(88, 0, 232)" size={25} />
                </TouchableOpacity>
                :
                <View></View>
              }
            </ScrollView>
            <TextInput
              style={[styles.each_input, {}]} placeholder="Ürün İsmi"
              onChangeText={(name) => { this.setState({ name })}}
            >{this.state.name}</TextInput>
            <TextInput
              style={[styles.each_input, {height: 125, paddingTop: 15}]} placeholder="Ürün Açıklaması" multiline={true}
              onChangeText={(description) => { this.setState({ description })}}
            >{this.state.description}</TextInput>
            <TextInput
              style={[styles.each_input, {}]} placeholder="Fiyat (₺)" keyboardType="numeric"
              onChangeText={(price) => { this.setState({ price, price_checked: false })}}
            >{this.state.price}</TextInput>
            <TouchableOpacity
              style={styles.input_checkbox}
              onPress={() => {this.setState({ price_checked: !this.state.price_checked, price: this.state.price_checked ? "" : 0 })}}
            >
              <View style={[styles.checkbox, {backgroundColor: this.state.price_checked ? "rgb(88, 0, 232)" : "rgb(254, 254, 254)", borderWidth: this.state.price_checked ? 0 : 2}]} >
                { this.state.price_checked ? 
                  <FontAwesomeIcon icon={faCheck} color="rgb(254, 254, 254)" size={11} />
                  :
                  <View></View>
                }
              </View>
              <Text style={styles.input_checkbox_text} >Ücretsiz Ürün</Text>
            </TouchableOpacity>
            <View style={{zIndex: 8, height: 50, marginTop: 20, overflow: "visible"}} >
              <TouchableOpacity onPress={() => {this.setState({ input_select_wrapper: this.state.input_select_wrapper == "category" ? null : "category" })}} style={[styles.input_select_outer_wrapper, {zIndex: 8, borderBottomLeftRadius: this.state.input_select_wrapper == "category" ? 0 : 15, borderBottomRightRadius: this.state.input_select_wrapper == "category" ? 0 : 15, borderBottomWidth: this.state.input_select_wrapper == "category" ? 0 : 2}]} >
                <View style={{flexDirection: "row"}} >
                  <Text style={styles.input_select_title} >{this.state.category ? this.state.category_name : "Kategori"}</Text>
                  <FontAwesomeIcon icon={faChevronDown} style={{margin: 15, marginLeft: 0}} size={20} color="rgba(28, 28, 28, 0.3)" />
                </View>
              </TouchableOpacity>
              <ScrollView style={[styles.input_select_wrapper, {display: this.state.input_select_wrapper == "category" ? "flex" : "none"}]} >
                {this.state.categories.map((category, key) => {
                  return (
                    <TouchableOpacity key={key} style={styles.filter_each_chose} onPress={() => {
                      this.setState({
                        category: category.id,
                        category_name: category.name,
                        subcategory: this.state.subcategories[category.id][0],
                        input_select_wrapper: "none"
                      })
                    }} >
                      <Text style={styles.filter_each_chose_text} >{category.name}</Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
            <View style={{zIndex: 7, height: 50, marginTop: 20, overflow: "visible"}} >
              <TouchableOpacity onPress={() => {this.setState({ input_select_wrapper: this.state.input_select_wrapper == "subcategory" ? null : "subcategory" })}} style={[styles.input_select_outer_wrapper, {zIndex: 7, borderBottomLeftRadius: this.state.input_select_wrapper == "subcategory" ? 0 : 15, borderBottomRightRadius: this.state.input_select_wrapper == "subcategory" ? 0 : 15, borderBottomWidth: this.state.input_select_wrapper == "subcategory" ? 0 : 2}]} >
                <View style={{flexDirection: "row"}} >
                  <Text style={styles.input_select_title} >{this.state.subcategory ? this.state.subcategory : "Alt Kategori"}</Text>
                  <FontAwesomeIcon icon={faChevronDown} style={{margin: 15, marginLeft: 0}} size={20} color="rgba(28, 28, 28, 0.3)" />
                </View>
              </TouchableOpacity>
              <ScrollView style={[styles.input_select_wrapper, {display: this.state.input_select_wrapper == "subcategory" ? "flex" : "none"}]} >
                { this.state.category ?
                  <View>
                    {this.state.subcategories[this.state.category].map((sub, key) => {
                      return (
                        <TouchableOpacity key={key} style={styles.filter_each_chose} onPress={() => {
                          this.setState({
                            subcategory: sub,
                            input_select_wrapper: "none"
                          })
                        }} >
                          <Text style={styles.filter_each_chose_text} >{sub}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                  :
                  <View></View>
                }
              </ScrollView>
            </View>
            <View style={{zIndex: 6, height: 50, marginTop: 20, overflow: "visible"}} >
              <TouchableOpacity onPress={() => {this.setState({ input_select_wrapper: this.state.input_select_wrapper == "city" ? null : "city" })}} style={[styles.input_select_outer_wrapper, {zIndex: 6, borderBottomLeftRadius: this.state.input_select_wrapper == "city" ? 0 : 15, borderBottomRightRadius: this.state.input_select_wrapper == "city" ? 0 : 15, borderBottomWidth: this.state.input_select_wrapper == "city" ? 0 : 2}]} >
                <View style={{flexDirection: "row"}} >
                  <Text style={styles.input_select_title} >{this.state.city ? this.state.city : "Şehir"}</Text>
                  <FontAwesomeIcon icon={faChevronDown} style={{margin: 15, marginLeft: 0}} size={20} color="rgba(28, 28, 28, 0.3)" />
                </View>
              </TouchableOpacity>
              <ScrollView style={[styles.input_select_wrapper, {display: this.state.input_select_wrapper == "city" ? "flex" : "none"}]} >
              {this.state.cities.map((city, key) => {
                return (
                  <TouchableOpacity key={key} style={styles.filter_each_chose} onPress={() => {
                    this.setState({
                      city,
                      towns: getCityTowns(city),
                      town: null,
                      input_select_wrapper: "none"
                    })
                  }} >
                    <Text style={styles.filter_each_chose_text} >{city}</Text>
                  </TouchableOpacity>
                )
              })}
              </ScrollView>
            </View>
            <View style={{zIndex: 5, height: 50, marginTop: 20, overflow: "visible"}} >
              <TouchableOpacity onPress={() => {this.setState({ input_select_wrapper: this.state.input_select_wrapper == "town" ? null : "town" })}} style={[styles.input_select_outer_wrapper, {zIndex: 5, borderBottomLeftRadius: this.state.input_select_wrapper == "town" ? 0 : 15, borderBottomRightRadius: this.state.input_select_wrapper == "town" ? 0 : 15, borderBottomWidth: this.state.input_select_wrapper == "town" ? 0 : 2}]} >
                <View style={{flexDirection: "row"}} >
                  <Text style={styles.input_select_title} >{this.state.town ? this.state.town : "İlçe"}</Text>
                  <FontAwesomeIcon icon={faChevronDown} style={{margin: 15, marginLeft: 0}} size={20} color="rgba(28, 28, 28, 0.3)" />
                </View>
              </TouchableOpacity>
              <ScrollView style={[styles.input_select_wrapper, {display: this.state.input_select_wrapper == "town" ? "flex" : "none"}]} >
                {this.state.towns.map((town, key) => {
                  return (
                    <TouchableOpacity key={key} style={styles.filter_each_chose} onPress={() => {
                      this.setState({
                        town,
                        input_select_wrapper: "none"
                      })
                    }} >
                      <Text style={styles.filter_each_chose_text} >{town}</Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
            <View style={{marginTop: 20}} >
              <Text style={styles.agreement_text} >Bu ürünü ekleyerek aşağıdaki antlaşmaları okuduğumu ve onayladığımı kabul ediyorum: </Text>
              <TouchableOpacity onPress={() => { Linking.openURL('https://stumarkt.com/auth/agreement/one') }}>
                <Text style={styles.agreement_link} >Hizmet Koşulları</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Linking.openURL('https://stumarkt.com/auth/agreement/two') }}>
                <Text style={styles.agreement_link} >Gizlilik Sözleşmesi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={[styles.photo_background_hotspot, {display: this.state.photo_select_display ? "flex" : "none"}]} ></TouchableOpacity>
        <View style={[styles.new_photo_chose_wrapper, {display: this.state.photo_select_display ? "flex" : "none"}]} >
          <TouchableOpacity style={styles.new_photo_button} >
            <FontAwesomeIcon icon={faImage} color="rgb(254, 254, 254)" size={23} />
            <Text style={styles.new_photo_text} >Fotoğraf Seç</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.new_photo_button} >
            <FontAwesomeIcon icon={faCamera} color="rgb(254, 254, 254)" size={23} />
            <Text style={styles.new_photo_text} >Fotoğraf Çek</Text>
          </TouchableOpacity>
        </View>
        { this.state.clickable ?
          <TouchableOpacity style={styles.send_button} onPress={() => {this.createProductController()}} >
            <Text style={styles.send_button_text} >Ürün Ekle!</Text>
          </TouchableOpacity>
          :
          <ActivityIndicator style={{position: "absolute", bottom: 50, alignSelf: "center"}} size="large" color="rgb(88, 0, 232)" ></ActivityIndicator>
        }
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
    flex: 1, padding: 20, zIndex: 5, paddingBottom: 200
  },
  content_title: {
    fontSize: 20, color: "rgb(28, 28, 28)", fontWeight: "700", marginBottom: 20
  },
  photo_wrapper: {
    height: 150, borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 20
  },
  each_product_image: {
    height: 120, width: 120, resizeMode: "contain",
    borderRadius: 20, marginLeft: 20, alignSelf: "center"
  },
  uploading_wrapper: {
    width: 120, height: 120, alignSelf: "center",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    marginLeft: 20, marginRight: 20, backgroundColor: "rgb(254, 254, 254)"
  },
  add_new_photo_button: {
    width: 120, height: 120, alignSelf: "center",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    marginLeft: 20, marginRight: 20, backgroundColor: "rgb(254, 254, 254)"
  },
  each_input: {
    textAlignVertical: "top", backgroundColor: "rgb(248, 248, 248)",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 20,
    marginTop: 20, padding: 15, fontSize: 16, color: "rgb(28, 28, 28)"
  },
  input_select_outer_wrapper: {
    height: 50, backgroundColor: "rgb(248, 248, 248)",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 20
  },
  input_select_title: {
    color: "rgb(28, 28, 28)", fontSize: 16, fontWeight: "600", margin: 15, marginRight: 5
  },
  input_select_wrapper: {
    height: 150, minHeight: 150, backgroundColor: "rgb(248, 248, 248)",
    width: "100%", borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderTopWidth: 0,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20
  },
  filter_each_chose: {
    borderTopWidth: 1, borderTopColor: "rgb(210, 210, 210)", width: "100%",
    justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 10
  },
  filter_each_chose_text: {
    fontSize: 15, fontWeight: "300", color: "rgb(112, 112, 112)"
  },
  input_checkbox: {
    flexDirection: "row", marginTop: 15, alignItems: "center", marginBottom: 10
  },
  checkbox: {
    height: 20, width: 20, borderColor: "rgb(236, 236, 236)", borderRadius: 5,
    justifyContent: "center", alignItems: "center"
  },
  input_checkbox_text: {
    fontSize: 16, fontWeight: "600", color: "rgb(28, 28, 28)", marginLeft: 5
  },
  agreement_text: {
    fontSize: 16, fontWeight: "600", color: "rgb(28, 28, 28)"
  },
  agreement_link: {
    fontSize: 16, fontWeight: "600", color: "rgb(88, 0, 232)", marginTop: 5
  },
  send_button: {
    position: "absolute", backgroundColor: "rgb(88, 0, 232)",
    width: "95%", height: 60, bottom: 50, alignSelf: "center",
    borderRadius: 40, alignItems: "center", justifyContent: "center"
  },
  send_button_text: {
    color: "rgb(254, 254, 254)", fontSize: 19, fontWeight: "700"
  },
  photo_background_hotspot: {
    position: "absolute", height: 1000, width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)", left: 0, top: 0
  },
  new_photo_chose_wrapper: {
    backgroundColor: "rgb(254, 254, 254)",
    bottom: 50, width: "90%", alignSelf: "center",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 20, borderRadius: 15
  },
  new_photo_button: {
    backgroundColor: "rgb(88, 0, 232)", width: "45%", height: 90,
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 15,
    alignItems: "center", justifyContent: "center"
  },
  new_photo_text: {
    color: "rgb(254, 254, 254)", fontSize: 17, fontWeight: "600",
    marginTop: 5
  }
});

AppRegistry.registerComponent('New', () => New);
