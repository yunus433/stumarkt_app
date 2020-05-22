import React, {Component} from 'react';
import { ActivityIndicator, AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { API_KEY } from 'react-native-dotenv';

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class New extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);

    this.state = {
      user: this.props.navigation.getParam('user', false),
      category: '',
      name: '',
      productPhotoArray: [],
      productPhotoNameArray: [],
      description: '',
      price: '',
      otherPrice: '',
      address1: '',
      address2: '',
      address3: '',
      completed: false
    };
  }

  categoryInput(categoryValue) {
    this.setState({
      "category": categoryValue
    });
  }

  priceInput(priceValue) {
    if (priceValue != "free")
      this.setState({
        "price": priceValue,
        "otherPrice": priceValue
      });
    else
      this.setState({
        "price": priceValue
      });
  }

  sendNewProductButton = () => {
    if (this.state.category && this.state.name && this.state.description && this.state.price && this.state.address1 && this.state.address2) {
      fetch("https://stumarkt.herokuapp.com/api/newProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x_auth": API_KEY
        },
        body: JSON.stringify({
          "category": this.state.category,
          "name": this.state.name,
          "description": this.state.description,
          "price": this.state.price + "₺",
          "address1": this.state.address1,
          "address2": this.state.address2,
          "address3": this.state.address3,
          "userId": this.state.user._id.toString(),
          "university": this.state.user.university,
          "productPhotoNameArray": this.state.productPhotoNameArray
        })
      })
      .then(response => {response.json()})
      .then(data => {
        if (data && data.error)
          return alert("Err: " + data.error);

        this.props.navigation.push('sellDashboard', {"user": this.state.user});
      })
      .catch(err => {
        return alert("Err: " + err);
      });
    } else {
      return alert("Lütfen gerekli tüm bilgileri girin.");
    }
  }

  sendImageToServerButton = async () => {
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
      
              fetch("https://stumarkt.herokuapp.com/api/newProductImage", {
                method: "POST",
                body: formData,
                headers: {
                  Accept: 'application/json',
                  'x_auth': API_KEY,
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then(response => {return response.json()})
              .then(data => {
                if (data && data.error)
                  return alert("Err: " + data.error);
      
                if (!data || !data.fileName)
                  return alert("Err: Bir hata oluştu, lütfen tekrar deneyin.");
                  
                this.setState(state => {
                  const productPhotoArray =  state.productPhotoArray.concat(manipulatedRes.uri);
                  const productPhotoNameArray =  state.productPhotoNameArray.concat(data.fileName);
    
                  return {
                    productPhotoArray,
                    productPhotoNameArray
                  };
                });
              })
              .catch(err => {
                return alert("Err: " + err);
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
  
          fetch("https://stumarkt.herokuapp.com/api/newProductImage", {
            method: "POST",
            body: formData,
            headers: {
              Accept: 'application/json',
              'x_auth': API_KEY,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {return response.json()})
          .then(data => {
            if (data && data.error)
              return alert("Err: " + data.error);
  
            if (!data || !data.fileName)
              return alert("Err: Unknown error occured, please try again");
              
            this.setState(state => {
              const productPhotoArray =  state.productPhotoArray.concat(manipulatedRes.uri);
              const productPhotoNameArray =  state.productPhotoNameArray.concat(data.fileName);

              return {
                productPhotoArray,
                productPhotoNameArray
              };
            });
          })
          .catch(err => {
            return alert("Err: " + err);
          });
        });
      })
      .catch(err => {
        return alert("Err: " + err);
      });
    }
  }

  optionButtonController = async (option) => {
    if (option == "library") {
      const permission = await Permissions.getAsync(Permissions.CAMERA);
      const permission2 = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (permission.status !== 'granted' || permission2.status !== 'granted') {
          const newPermission = await Permissions.askAsync(Permissions.CAMERA);
          const newPermission2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (newPermission.status === 'granted' && newPermission2.status === 'granted') {
            ImagePicker.launchImageLibraryAsync({
              mediaTypes: "Images"
            })
            .then(res => {
              if (res.cancelled) return this.props.navigation.push('main', {"user": this.state.user});
      
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
        
                fetch("https://stumarkt.herokuapp.com/api/newProductImage", {
                  method: "POST",
                  body: formData,
                  headers: {
                    Accept: 'application/json',
                    'x_auth': API_KEY,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => {return response.json()})
                .then(data => {
                  if (data && data.error) {
                    return this.props.navigation.push('main', {"user": this.state.user});
                  }
        
                  if (!data || !data.fileName) {
                    return this.props.navigation.push('main', {"user": this.state.user});
                  }
                  
                  this.setState(state => {
                    const productPhotoArray =  state.productPhotoArray.concat(manipulatedRes.uri);
                    const productPhotoNameArray =  state.productPhotoNameArray.concat(data.fileName);
      
                    return {
                      productPhotoArray,
                      productPhotoNameArray,
                      "completed": true
                    };
                  });
                })
                .catch(err => {
                  alert(err);
                  return this.props.navigation.push('main', {"user": this.state.user});
                });
              });
            })
            .catch(err => {
              alert(err);
              return this.props.navigation.push('main', {"user": this.state.user});
            });
          } else {
            return this.props.navigation.push('main', {"user": this.state.user});
          }
      } else {
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images"
        })
        .then(res => {
          if (res.cancelled) return this.props.navigation.push('main', {"user": this.state.user});

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
    
            fetch("https://stumarkt.herokuapp.com/api/newProductImage", {
              method: "POST",
              body: formData,
              headers: {
                Accept: 'application/json',
                'x_auth': API_KEY,
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(response => {return response.json()})
            .then(data => {
              if (data && data.error)
                return this.props.navigation.push('main', {"user": this.state.user});
    
              if (!data || !data.fileName)
                return this.props.navigation.push('main', {"user": this.state.user});
                
              this.setState(state => {
                const productPhotoArray =  state.productPhotoArray.concat(manipulatedRes.uri);
                const productPhotoNameArray =  state.productPhotoNameArray.concat(data.fileName);
      
                return {
                  productPhotoArray,
                  productPhotoNameArray,
                  "completed": true
                };
              });
            })
            .catch(err => {
              alert(err);
              return this.props.navigation.push('main', {"user": this.state.user});
            });
          });
        })
        .catch(err => {
          alert(err);
          return this.props.navigation.push('main', {"user": this.state.user});
        });
      }
    } else {
      const permission = await Permissions.getAsync(Permissions.CAMERA);
      const permission2 = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (permission.status !== 'granted' || permission2.status !== 'granted') {
          const newPermission = await Permissions.askAsync(Permissions.CAMERA);
          const newPermission2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (newPermission.status === 'granted' && newPermission2.status === 'granted') {
            ImagePicker.launchCameraAsync({
              mediaTypes: "Images"
            })
            .then(res => {
              if (res.cancelled) return this.props.navigation.push('main', {"user": this.state.user});
      
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
        
                fetch("https://stumarkt.herokuapp.com/api/newProductImage", {
                  method: "POST",
                  body: formData,
                  headers: {
                    Accept: 'application/json',
                    'x_auth': API_KEY,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => {return response.json()})
                .then(data => {
                  if (data && data.error) {
                    return this.props.navigation.push('main', {"user": this.state.user});
                  }
        
                  if (!data || !data.fileName) {
                    return this.props.navigation.push('main', {"user": this.state.user});
                  }
                  
                  this.setState(state => {
                    const productPhotoArray =  state.productPhotoArray.concat(manipulatedRes.uri);
                    const productPhotoNameArray =  state.productPhotoNameArray.concat(data.fileName);
      
                    return {
                      productPhotoArray,
                      productPhotoNameArray,
                      "completed": true
                    };
                  });
                })
                .catch(err => {
                  alert(err);
                  return this.props.navigation.push('main', {"user": this.state.user});
                });
              });
            })
            .catch(err => {
              alert(err);
              return this.props.navigation.push('main', {"user": this.state.user});
            });
          } else {
            return this.props.navigation.push('main', {"user": this.state.user});
          }
      } else {
        ImagePicker.launchCameraAsync({
          mediaTypes: "Images"
        })
        .then(res => {
          if (res.cancelled) return this.props.navigation.push('main', {"user": this.state.user});
  
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
    
            fetch("https://stumarkt.herokuapp.com/api/newProductImage", {
              method: "POST",
              body: formData,
              headers: {
                Accept: 'application/json',
                'x_auth': API_KEY,
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(response => {return response.json()})
            .then(data => {
              if (data && data.error)
                return this.props.navigation.push('main', {"user": this.state.user});
    
              if (!data || !data.fileName)
                return this.props.navigation.push('main', {"user": this.state.user});
                
              this.setState(state => {
                const productPhotoArray =  state.productPhotoArray.concat(manipulatedRes.uri);
                const productPhotoNameArray =  state.productPhotoNameArray.concat(data.fileName);
      
                return {
                  productPhotoArray,
                  productPhotoNameArray,
                  "completed": true
                };
              });
            })
            .catch(err => {
              alert(err);
              return this.props.navigation.push('main', {"user": this.state.user});
            });
          });
        })
        .catch(err => {
          alert(err);
          return this.props.navigation.push('main', {"user": this.state.user});
        });
      }
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        {
          this.state.completed ?
            <View style={{flex: 1}} >
              <Header navigation={this.props.navigation} ></Header>
              <View style={styles.content} >
                <ScrollView style={styles.innnerContent} >
                  <View style={styles.sellWrapper} >
                    <Text style={styles.contentTitle} >Kategoriler:<Text style={styles.requiredItemSymbol} >* </Text> </Text>
                    <View style={styles.categoryWrapper} > 
                      <TouchableOpacity onPress={() => this.categoryInput("rented")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "rented" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Kiralık, Ev</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("hobby")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "hobby" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Eğlence, Hobi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("home")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "home" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Ev Eşyası, Mobilya</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("fashion")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "fashion" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Moda, Giyim</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("electronic")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "electronic" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Elektronik</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("fun")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "fun" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Müzik, Film, Kitap</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("tickets")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "tickets" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Bilet, Giriş Kartları</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("exchange")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "exchange" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Hediye, Takas</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("lesson")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "lesson" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Ders, Kurs</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.categoryInput("other")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.category == "other" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Diğer</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.contentTitle} >Ürün Detayları<Text style={styles.requiredItemSymbol} >* </Text> </Text>
                    <TextInput 
                      placeholder="Ürün İsmi" 
                      onChangeText={(name) => { this.setState({name: name})}} 
                      style={styles.nameInput} >
                    </TextInput>
                    <TextInput 
                      placeholder="Ürün Detayları" 
                      onChangeText={(description) => { this.setState({description: description})}}
                      style={styles.descriptionInput} 
                      multiline={true} >
                    </TextInput>
                    <Text style={styles.contentTitle} >Fotoğrafları</Text>
                    <View style={styles.imagesWrapper} >
                      <ScrollView horizontal={true} >
                        { this.state.productPhotoArray.map((photo, key) => {
                            return (
                              <Image key={key} source={{uri: photo}} style={styles.eachProductImage} ></Image>
                            )
                          })
                        }
                        {
                          this.state.productPhotoArray.length < 5 ?
                          <TouchableOpacity style={styles.openImageButton} onPress={() => {this.sendImageToServerButton()}} >
                            <Text style={styles.openImageButtonText} >+</Text>
                          </TouchableOpacity>
                          :
                          <View></View>
                        }
                      </ScrollView>
                    </View>
                    <Text style={styles.contentTitle} >Fiyat<Text style={styles.requiredItemSymbol} >* </Text> </Text>
                    <View style={styles.priceWrapper} >
                      <TouchableOpacity onPress={() => this.priceInput(this.state.otherPrice)} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.price != "free" && this.state.otherPrice ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <TextInput 
                          placeholder="Fiyat (₺)" 
                          onChangeText={(price) => {this.priceInput(price)}} 
                          style={styles.priceInput} 
                          keyboardType='numeric'>
                        {this.state.otherPrice}
                        </TextInput>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.priceInput("free")} style={styles.eachCategoryWrapper} >
                        <View style={ this.state.price == "free" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                        <Text style={styles.eachCategoryText} >Hediye Et (ücretsiz)</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.contentTitle} >Adres</Text>
                    <View style={styles.addressLine} >
                      <TextInput
                        placeholder="İlçe" 
                        onChangeText={(address1) => { this.setState({address1: address1})}}
                        style={styles.addressInputOne} >
                      </TextInput>
                      <Text style={styles.requiredItemSymbol} >* </Text>
                      <TextInput
                        placeholder="Şehir" 
                        onChangeText={(address2) => { this.setState({address2: address2})}}
                        style={styles.addressInputTwo} >
                      </TextInput>
                      <Text style={styles.requiredItemSymbol} >* </Text>
                    </View>
                    <TextInput
                        placeholder="Posta Kodu" 
                        onChangeText={(address3) => { this.setState({address3: address3})}}
                        style={styles.addressInputThree} >
                    </TextInput>
                    <Text style={styles.contentTitle} >Gizlilik Antlaşmaları:<Text style={styles.requiredItemSymbol} >* </Text> </Text>
                    <View style={styles.agreementWrapper} >
                      <Text style={styles.agreementText} >Bu ürünü oluşturarak aşağıdaki antlaşmaları kabul etmiş olursun: </Text>
                      <TouchableOpacity onPress={() => { Linking.openURL('https://stumarkt.com/auth/agreement/one') }}>
                        <Text style={styles.agreementLink} >Hizmet Koşulları</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { Linking.openURL('https://stumarkt.com/auth/agreement/two') }}>
                        <Text style={styles.agreementLink} >Gizlilik Sözleşmesi</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={() => {this.sendNewProductButton()}} >
                      <Text style={styles.sendButtonText} >Ekle</Text>
                    </ TouchableOpacity>
                  </View>
                </ScrollView>
              </View> 
              <NavBar navigation={this.props.navigation} ></NavBar>
            </View>
          :
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}} >
            <ActivityIndicator size="large" color="rgb(255, 67, 148)" />
            <View style={styles.photoOptionsWrapper} >
              <Text style={styles.optionsTitle} >Fotoğraf Yükle</Text>
              <View style={styles.buttonWrapper} >
                <TouchableOpacity style={[styles.optionButtons, {marginRight: 5}]} onPress={() => {this.optionButtonController("library")}} >
                  <Text style={styles.optionButtonsText} >Fotoğraflarından Seç</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionButtons, {marginLeft: 5}]} onPress={() => {this.optionButtonController("camera")}}>
                  <Text style={styles.optionButtonsText} >Fotoğraf Çek</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
  },
  photoOptionsWrapper: {
    position: "absolute", backgroundColor: "white",
    padding: 25, width: "90%",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 15
  },
  optionsTitle: {
    color: "rgb(255, 67, 148)", fontSize: 18, fontWeight: "600"
  },
  buttonWrapper: {
    flexDirection: "row", marginTop: 20
  },
  optionButtons: {
    padding: 10, flex: 1,
    borderColor: "rgb(236, 236, 236)", borderWidth: 2, borderRadius: 15
  },
  optionButtonsText: {
    color: "rgb(112, 112, 112)", fontSize: 16, fontWeight: "600",
    textAlign: "center"
  },
  content: {
    flex: 8
  },
  innnerContent: {
    flex: 1,
    padding: 20
  },
  sellWrapper: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15, borderColor: "rgb(236, 235, 235)", borderWidth: 2,
    padding: 15,
    marginBottom: 40
  },
  contentTitle: {
    color: "rgb(112, 112, 112)", fontSize: 25, fontWeight: "300",
    marginBottom: 10
  },
  requiredItemSymbol: {
    color: "rgb(255, 61, 148)", fontSize: 27
  },
  categoryWrapper: {
    paddingLeft: 20,
    marginBottom: 20
  },
  eachCategoryWrapper: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 5,
    paddingTop: 2, paddingBottom: 2
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
  eachCategoryText: {
    color: "rgb(112, 112, 112)", fontSize: 17, fontWeight: "300"
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
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 20, textAlignVertical: "top"
  },
  imagesWrapper: {
    flexDirection: "row", alignItems: "center", marginBottom: 20
  },
  eachProductImage: {
    height: 100, width: 100,
    resizeMode: "contain", borderRadius: 5, marginRight: 5
  },
  openImageButton: {
    height: 100, width: 100,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255, 108, 128, 0.3)", borderRadius: 5
  },
  openImageButtonText: {
    color: "rgb(112, 112, 112)", fontSize: 40, fontWeight: "600"
  },
  priceWrapper: {
    paddingLeft: 20,
    marginBottom: 20
  },
  priceInput: {
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
    color: "rgb(112, 112, 112)", fontSize: 20, fontWeight: "300",
    padding: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    marginLeft: 3,
  },
  addressLine: {
    flexDirection: "row"
  },
  addressInputOne: {
    flex: 1,
    color: "rgb(112, 112, 112)", fontSize: 20, fontWeight: "300",
    padding: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    backgroundColor: "rgb(248, 248, 248)"
  },
  addressInputTwo: {
    flex: 2,
    color: "rgb(112, 112, 112)", fontSize: 20, fontWeight: "300",
    padding: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 15,
    marginLeft: 3,
    backgroundColor: "rgb(248, 248, 248)"
  },
  addressInputThree: {
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
})

AppRegistry.registerComponent('New', () => New);
