import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, StatusBar} from 'react-native';

export default class Header extends Component { 

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false),
      search: undefined
    };
  };

  searchProductsWithKeywords = () => {
    if (this.state.search)
      this.props.navigation.push('main', {
        "user": this.state.user, 
        "category": this.props.navigation.getParam('category', 'all'), 
        "search": this.state.search.replace(/\s+/g, '+').replace(/[^a-zA-Z0-9+]/g, "").toLowerCase().split("+") 
      });
  }

  navigatePageController (category, categoryName) {
    this.props.navigation.push('main', {
      "user": this.state.user,
      category,
      categoryName
    });
  }

  render() {
    return (
      <View style={styles.header} >
        <StatusBar backgroundColor="white" ></StatusBar>
        <View style={styles.headerTopLine} >
          <TouchableOpacity
            onPress={() => {this.props.navigation.push('main', {"user": this.state.user})}} 
          >
            <Image source={require('./../../assets/main-icon.png')} style={styles.logo} ></Image>
          </TouchableOpacity>
          <View style={styles.searchWrapper} >
            <Image source={require('./../../assets/search-button.png')} style={styles.searchButton} ></Image>
            <TextInput
              style={styles.searchInput}
              placeholder="Ara"
              onChangeText={(search) => {this.setState({search: search})}}
              onSubmitEditing={() => {this.searchProductsWithKeywords()}}
            >
            </TextInput>
            <TouchableOpacity onPress={() => {this.props.navigation.push("category", {"user": this.state.user})}} >
              <Image source={require('./../../assets/filters-button.png')} style={styles.filterButton} ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerCategoryWrapper} >
          <ScrollView horizontal={true} >
            <TouchableOpacity style={[styles.eachCategoryWrapper, {marginLeft: 0}]} onPress={() => {this.navigatePageController('all', 'Tüm Ürünler')}} >
              <Text style={styles.eachCategoryText} >Tüm Ürünler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('book', 'Kitap')}} >
              <Text style={styles.eachCategoryText} >Kitap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('stationery', 'Kırtasiye')}} >
              <Text style={styles.eachCategoryText} >Kırtasiye</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('electronic', 'Elektronik')}} >
              <Text style={styles.eachCategoryText} >Elektronik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('hobby', 'Eğlence, Hobi')}} >
              <Text style={styles.eachCategoryText} >Eğlence, Hobi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('fashion', 'Moda, Giyim')}} >
              <Text style={styles.eachCategoryText} >Moda, Giyim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('lesson', 'Ders, Kurs')}} >
              <Text style={styles.eachCategoryText} >Ders, Kurs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('exchange', 'Hediye, Takas')}} >
              <Text style={styles.eachCategoryText} >Hediye, Takas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('fun', 'Müzik, Film')}} >
              <Text style={styles.eachCategoryText} >Müzik, Film</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('donation', 'Bağış')}} >
              <Text style={styles.eachCategoryText} >Bağış</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('rented', 'Kiralık Ev')}} >
              <Text style={styles.eachCategoryText} >Kiralık Ev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.eachCategoryWrapper} onPress={() => {this.navigatePageController('other', 'Diğer')}} >
              <Text style={styles.eachCategoryText} >Diğer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1.5,
    backgroundColor: "white",
    paddingTop: 30
  },
  headerTopLine: {
    flex: 2,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingLeft: 25, paddingRight: 15
  },
  logo: {
    height: 45, width: 70,
    resizeMode: "contain"
  },
  searchWrapper: {
    flex: 1, height: 40, 
    flexDirection: "row", alignItems: "center",
    marginLeft: 10, marginRight: 10,
    backgroundColor: "rgb(248, 248, 248)",
    borderWidth: 2, borderColor: "rgb(236, 235, 235)", borderRadius: 10,
  },
  searchButton: {
    height: 20,
    marginRight: 3, marginLeft: 5,
    opacity: 0.7
  },
  searchInput: {
    flex: 1, height: 40,
    fontSize: 15, color: "rgb(112, 112, 112)"
  },
  filterButton: {
    height: 20,
    marginRight: 5, marginLeft: 3
  },
  headerCategoryWrapper: {
    padding: 5, paddingRight: 20, paddingLeft: 20,
    backgroundColor: "rgb(236, 236, 236)", borderColor: "rgb(112, 112, 112)", borderTopWidth: 1, borderBottomWidth: 1
  },
  eachCategoryWrapper: {
    height: 20, marginLeft: 15,
    flexDirection: "row", justifyContent: "center", alignItems: "center"
  },
  eachCategoryText: {
    color: "rgb(112, 112, 112)", fontWeight: "600", fontSize: 16
  }
});

AppRegistry.registerComponent('Header', () => Header);
