import React, {Component} from 'react';
import {AppRegistry, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

import Header from './../partials/header';
import NavBar from './../partials/navBar';

export default class Index extends Component{
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', false),
      search: this.props.navigation.getParam('search', ''),
      products: [],
      totalProductNumber: 0,
      page: this.props.navigation.getParam('page', 0),
      universities: this.props.navigation.getParam('universities', undefined),
      cities: this.props.navigation.getParam('cities', undefined),
      productNumberPerPage: 10,
      category: this.props.navigation.getParam('category', "all"),
      categoryName: this.props.navigation.getParam('categoryName', "Alle Categorien"),
      productFetchComplete: false
    };
  };

  arrayToString = (array) => {
    let str = "";
    array.forEach((item, i) => {
      if (i < array.length-1)
        str += `"${item}", `;
      else
        str += `"${item}"`;
    });

    return str;
  }

  getLatestProducts = (page) => {
    if (page < 0)
      page = this.state.page;

    if (this.state.universities) {
      fetch(`https://www.stumarkt.com/api/products?category=${this.state.category}&limit=${this.state.productNumberPerPage}&page=${page}&keywords=${this.state.search}&filter=${this.state.universities.join(',')}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(result => result.json())
      .then(data => {
        if (data.error) 
          return alert(data.error);
  
        this.setState({
          "products": data.products,
          "totalProductNumber": data.number,
          "productFetchComplete": true
        }, () => {
          this.refs._innerContentScrollView.scrollTo({x: 0, y: 0, animated: true});
        });
      })
      .catch(err => {
        alert("Error: " + err)
      });
    } else {
      fetch(`https://www.stumarkt.com/api/products?category=${this.state.category}&limit=${this.state.productNumberPerPage}&page=${page}&keywords=${this.state.search}`, {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(result => result.json())
      .then(data => {
        if (data.error) 
          return alert(data.error);
  
        this.setState({
          "products": data.products,
          "totalProductNumber": data.number,
          "productFetchComplete": true
        }, () => {
          this.refs._innerContentScrollView.scrollTo({x: 0, y: 0, animated: true});
        });
      })
      .catch(err => {
        alert("Error: " + err)
      });
    }
  };
  
  changePageController = async (pageChange) => {
    if (this.state.productFetchComplete) {
      if (pageChange == -1 && this.state.page > 0) {
        this.setState({
          "page": this.state.page + pageChange
        });

        this.getLatestProducts(this.state.page + pageChange);
      } else if (pageChange == 1 && this.state.totalProductNumber > ( this.state.page * this.state.productNumberPerPage )) {
        this.setState({
          "page": this.state.page + pageChange
        });

        this.getLatestProducts(this.state.page + pageChange);
      }
    }
  }

  eachProductOnPress = (productId) => {
    if (this.state.user && productId == this.state.user._id)
      this.props.navigation.push('sellDetails', {"user": this.state.user, "id": productId})
    else
      this.props.navigation.push('buyDetails', {"user": this.state.user, "id": productId})
  }

  componentDidMount() {
    if (this.state.user && !this.state.user.verified) {
      return this.props.navigation.navigate('verify', {"user": this.state.user})
    }
    
    this.getLatestProducts(this.state.page);
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation} ></Header>
        <View style={styles.content} >
          <Text style={styles.contentTitle} > {this.state.totalProductNumber} Produkte in dieser Kategorie verfügbar ({this.state.categoryName}){this.state.search ? ` with the keyword${this.state.search.length > 1 ? 's' : ''} '${this.state.search.join(' ')}'` : ''}{this.state.cities ? ` in the selected cit${this.state.cities.length > 1 ? 'ies' : 'y'}: ${this.state.cities.join(', ')}` : ""}. {this.state.productNumberPerPage} Anzeigen pro Seite </Text>
          <ScrollView style={styles.innerContent} ref="_innerContentScrollView" >
            {
              this.state.products.map((product, key) => {
                return (
                  <TouchableOpacity key={key} style={styles.eachProductWrapper} onPress={() => {this.eachProductOnPress(product._id)}} > 
                    <View style={styles.eachProductLeftSide} >
                      <Image source={{uri: product.productPhotoArray[0]}} style={styles.eachProductImage} ></Image>
                    </View>
                    <View style={styles.eachProductRightSide} >
                      <Text style={styles.eachProductName} numberOfLines={1} > {product.name} </Text>
                      <Text style={styles.eachProductLocation} > {product.location} </Text>
                      <Text style={styles.eachProductPrice} > {product.price} </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
            <View style={styles.contentHeader} >
              <TouchableOpacity onPress={ () => {
                this.changePageController(-1)
              }} >
                <Text style={styles.backButton} > {'<'} Vorherig </Text>
              </TouchableOpacity>
              <Text style={styles.pageNumber} > {this.state.page + 1} / {Math.floor(this.state.totalProductNumber / this.state.productNumberPerPage) + 2} </Text>
              <TouchableOpacity onPress={()=>{
                  this.changePageController(1);
              }} >
                <Text style={styles.nextButton} > Nächste {'>'} </Text>
              </TouchableOpacity>              
            </View>
          </ScrollView>
        </View>
        <NavBar navigation={this.props.navigation} pageName="main" ></NavBar>
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
  contentTitle: {
    padding: 20, paddingBottom: 10, paddingTop: 10,
    color: "rgb(112, 112, 112)", textAlign: "center"
  },
  contentHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, paddingBottom: 10, paddingTop: 10
  },
  nextButton: {
    width: 100,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 5,
    padding: 4,
    textAlign: "right", color: "rgb(255, 67, 148)", fontWeight: "600",
    backgroundColor: "white"
  },
  backButton: {    
    width: 100,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 5,
    padding: 4,
    color: "rgb(255, 67, 148)", fontWeight: "600",
    backgroundColor: "white"
  },
  pageNumber: {
    color: "rgb(112, 112, 112)", fontSize: 20
  },
  innerContent: {
    padding: 20, paddingBottom: 5, paddingTop: 0, marginBottom: 20
  },
  eachProductWrapper: {
    flexDirection: "row",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5, borderColor: "rgb(236, 235, 235)", borderWidth: 2,
    backgroundColor: "white"
  },
  eachProductLeftSide: {
    justifyContent: "center", alignItems: "center",
    padding: 10,
    resizeMode: "contain"
  },
  eachProductImage: {
    height: 100, width: 100,
    borderRadius: 5
  },
  eachProductRightSide: {
    flex: 1,
    paddingTop: 10, paddingBottom: 10
  },
  eachProductName: {
    fontSize: 18, color: "rgb(112, 112, 112)", fontWeight: "800"
  },
  eachProductLocation: {
    fontSize: 14, color: "rgb(112, 112, 112)", fontWeight: "300",
    marginTop: 3
  },
  eachProductPrice: {
    alignSelf: "flex-end", marginTop: "auto",
    fontSize: 25, color: "rgb(255, 67, 148)", fontWeight: "700"
  }
});


AppRegistry.registerComponent('Index', () => Index);
