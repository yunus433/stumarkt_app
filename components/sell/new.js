import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView} from 'react-native';
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
      address3: ''
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
      fetch("https://www.stumarkt.com/api/newProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x_auth": API_KEY
        },
        body: JSON.stringify({
          "category": this.state.category,
          "name": this.state.name,
          "description": this.state.description,
          "price": this.state.price,
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
      return alert("Please fill all the necessary information before create a new product");
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
      
              fetch("https://www.stumarkt.com/api/newProductImage", {
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
  
          fetch("https://www.stumarkt.com/api/newProductImage", {
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

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation} ></Header>
        <View style={styles.content} >
          <ScrollView style={styles.innnerContent} >
            <View style={styles.sellWrapper} >
              <Text style={styles.contentTitle} >Kategorie<Text style={styles.requiredItemSymbol} >* </Text> </Text>
              <View style={styles.categoryWrapper} > 
                <TouchableOpacity onPress={() => this.categoryInput("rented")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "rented" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Mietwohnung, Nachmiete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("hobby")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "hobby" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Freizeit, Hobby</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("home")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "home" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Hausmöbel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("fashion")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "fashion" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Mode, Kleidung</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("electronic")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "electronic" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Elektronik</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("fun")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "fun" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Musik, Filme, Bücher</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("tickets")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "tickets" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Eintrittskarten, Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("exchange")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "exchange" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Zu Verschenken, Tauschen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("lesson")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "lesson" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Unterricht, Kurse</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.categoryInput("other")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.category == "other" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} >Sonstige</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.contentTitle} >Anzeigendetails <Text style={styles.requiredItemSymbol} >* </Text> </Text>
              <TextInput 
                placeholder="Titel" 
                onChangeText={(name) => { this.setState({name: name})}} 
                style={styles.nameInput} >
              </TextInput>
              <TextInput 
                placeholder="Beschreibung" 
                onChangeText={(description) => { this.setState({description: description})}}
                style={styles.descriptionInput} 
                multiline={true} >
              </TextInput>
              <Text style={styles.contentTitle} >Bilder</Text>
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
              <Text style={styles.contentTitle} >Preis<Text style={styles.requiredItemSymbol} >* </Text> </Text>
              <View style={styles.priceWrapper} >
                <TouchableOpacity onPress={() => this.priceInput(this.state.otherPrice)} style={styles.eachCategoryWrapper} >
                    <View style={ this.state.price != "free" && this.state.otherPrice ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                    <TextInput 
                      placeholder="Preis €" 
                      onChangeText={(price) => {this.priceInput(price)}} 
                      style={styles.priceInput} >
                    {this.state.otherPrice}
                    </TextInput>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.priceInput("free")} style={styles.eachCategoryWrapper} >
                  <View style={ this.state.price == "free" ? styles.activatedRadioInput : styles.eachRadioInput} ></View>
                  <Text style={styles.eachCategoryText} > Zu Verschenken </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.contentTitle} >Ort</Text>
              <View style={styles.addressLine} >
                <TextInput
                  placeholder="PLZ" 
                  onChangeText={(address1) => { this.setState({address1: address1})}}
                  style={styles.addressInputOne} >
                </TextInput>
                <Text style={styles.requiredItemSymbol} >* </Text>
                <TextInput
                  placeholder="Ort" 
                  onChangeText={(address2) => { this.setState({address2: address2})}}
                  style={styles.addressInputTwo} >
                </TextInput>
                <Text style={styles.requiredItemSymbol} >* </Text>
              </View>
              <TextInput
                  placeholder="Straße/Nummer (freiwillige Eingabe)" 
                  onChangeText={(address3) => { this.setState({address3: address3})}}
                  style={styles.addressInputThree} >
              </TextInput>
              <Text style={styles.contentTitle} >Veröffentliche deine Anzeige<Text style={styles.requiredItemSymbol} >* </Text> </Text>
              <View style={styles.agreementWrapper} >
                <Text style={styles.agreementText} >Ich bin mit den Folgenden einverstanden: </Text>
                <TouchableOpacity>
                  <Text style={styles.agreementLink} >Nutzungsbedingungen</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.agreementLink} >Datenschutzerklärung</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.sendButton} onPress={() => {this.sendNewProductButton()}} >
                <Text style={styles.sendButtonText} >Anzeige Aufgeben</Text>
              </ TouchableOpacity>
            </View>
          </ScrollView>
        </View> 
        <NavBar navigation={this.props.navigation} ></NavBar>
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
    color: "rgb(112, 112, 112)", fontWeight: "300", fontSize: 20
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
