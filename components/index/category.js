import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView} from 'react-native';

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class Category extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false),
      selectedCities: [],
      filterCities: [],
      cities: ["Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "K.maraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"]
    };
  };

  getCityEngName = (city) => {
    return city.toLocaleLowerCase().replace("ş", "s").replace("ı", "i").replace("ö", "o").replace("ç", "c").replace("ü", "u").replace("ğ", "g");
  }

  addCityToList = (cityName) => {
    if (!this.state.selectedCities.includes(cityName))
      this.setState(state => {
        const selectedCities = state.selectedCities.concat(cityName);

        return {
          selectedCities
        }
      });
    else
      this.setState(state => {
        const selectedCities = state.selectedCities;
        selectedCities.splice(state.selectedCities.indexOf(cityName), 1);

        return {
          selectedCities
        }
      });
  };

  applyFilter = () => {
    if (this.state.selectedCities.length) {
      const filterCities = [];
      this.state.selectedCities.forEach(city => {
        filterCities.push(this.getCityEngName(city));
      });
  
      this.props.navigation.push('main', {
        'user': this.state.user,
        filter: filterCities,
        cities: this.state.selectedCities
      });
    } else {
      this.props.navigation.push('main', {
        'user': this.state.user
      });
    }
  };

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <View style={{padding: 20, flex: 1}} >
            <Text style={styles.contentTitle} >Şehre göre Filtrele</Text>
            <Text style={styles.contentInfo} >Filtrelemek istediğiniz şehri seçin.</Text>
            <View style={styles.universityWrapper} >
              <ScrollView>
                { this.state.cities.map((city, key) => {
                  return (
                    <TouchableOpacity key={key} onPress={() => {this.addCityToList(city)}} style={this.state.selectedCities.includes(city) ? styles.eachUniActive : styles.eachUni} >
                      <Text style={styles.eachUniText} >{city}</Text>
                    </TouchableOpacity>
                  )
                }) }
              </ScrollView>
            </View>
            <ScrollView style={{marginBottom: 10}}>
              <Text style={styles.selectedUniNamesTitle} >Seçilen Şehirler: </Text>
              <Text style={styles.selectedUniNames} >{this.state.selectedCities.length ? this.state.selectedCities.join(", ") : "Hiçbir şehir seçilmedi."}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.applyFiltersButton} onPress={() => {this.applyFilter()}} >
              <Text  style={styles.applyFiltersButtonText} >Filtrele</Text>
            </TouchableOpacity>
          </View>
        </View>
        <NavBar navigation={this.props.navigation} pageName="main" ></NavBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1
  },
  content: {
    flex: 8, backgroundColor: "rgb(248, 248, 248)",
  },
  contentTitle: {
    fontSize: 25, color: "rgb(255, 67, 148)", fontWeight: "500",
    marginBottom: 15
  },
  contentInfo: {
    color: "rgb(112, 112, 112)", fontSize: 18, fontWeight: "300",
    marginBottom: 10
  },
  universityWrapper: {
    flex: 3, marginBottom: 10
  },
  eachUni: {
    padding: 10, marginBottom: 5, backgroundColor: "white",
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 5
  },
  eachUniText: {
    color: "rgb(112, 112, 112)", fontSize: 16, fontWeight: "600"
  },
  eachUniActive: {
    padding: 10, marginBottom: 5, backgroundColor: "white",
    borderColor: "rgb(255, 67, 148)", borderWidth: 2, borderRadius: 5
  },
  selectedUniNamesTitle: {
    marginBottom: 5,
    color: "rgb(255, 67, 148)", fontSize: 16, fontWeight: "600"
  },
  selectedUniNames: {
    color: "rgb(112, 112, 112)", fontSize: 16, fontWeight: "300",
    marginBottom: 25,
  },
  applyFiltersButton: {
    marginTop: "auto", padding: 10, width: "50%", alignSelf: "center",
    justifyContent: "center", alignItems: "center", backgroundColor: "white",
    borderColor: "rgb(255, 67, 148)", borderWidth: 2, borderRadius: 5
  },
  applyFiltersButtonText: {
    color: "rgb(255, 67, 148)", fontSize: 16
  }
});


AppRegistry.registerComponent('Category', () => Category);
