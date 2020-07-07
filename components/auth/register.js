import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { View, Text, TextInput, StyleSheet, Platform, Keyboard, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGraduationCap, faKey, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const apiRequest = require('../../utils/apiRequest');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight

export default class Register extends Component {
  static navigationOptions = {
    header: null
  };
  
  constructor (props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      school: "",
      school_name: "",
      password: "",
      error: "",
      school_open: false,
      original_schools: [],
      schools: []
    };
  };

  engName = word => {
    return word.toLocaleLowerCase().split('ş').join('s').split('ı').join('i').split('ö').join('o').split('ç').join('c').split('ü').join('u').split('ğ').join('g');
  }

  addUserToAsyncStorage = async (email, password, callback) => {
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      callback();
    } catch (error) {
      alert("Hesabınız kaydedilemedi, lütfen daha sonra tekrar deneyin.");
    }
  };

  registerPostController = () => {
    Keyboard.dismiss();

    if (!this.state.email || !this.state.password || !this.state.name || !this.state.original_schools.filter(school => school._id == this.state.school).length)
      return this.setState({ error: "Lütfen tüm bilgileri girin." });

    if (this.state.password.length < 6)
      return this.setState({ error: "Şifreniz 6 haneden uzun olmalıdır." });

    apiRequest({
      method: "POST",
      url: "/auth/register",
      body: {
        email: this.state.email,
        name: this.state.name,
        school: this.state.school,
        password: this.state.password
      }
    }, (err, data) => {
      if (err) return this.setState({ error: "Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin." });

      if (data.error && data.error == 'bad request')
        return this.setState({ error: "Lütfen tüm bilgileri girin." });

      if (data.error && data.error == 'email is not valid')
        return this.setState({ error: "Lütfen geçerli bir e-posta adresi girin." });

      if (data.error && data.error == 'email is taken')
        return this.setState({ error: "Bu e-posta adresi zaten kullanımda." });

      this.addUserToAsyncStorage(this.state.email, this.state.password, () => {
        this.props.navigation.navigate('Index', { id: data.user._id });
      });
    });
  }

  getSchools = () => {
    apiRequest({
      method: 'GET',
      url: '/schools'
    }, (err, data) => {
      if (err || data.error) return this.props.navigation.navigate('Landing');

      this.setState({
        original_schools: data.schools,
        schools: data.schools
      });
    });
  }

  componentDidMount() {
    this.getSchools();
  }


  render() {
    return (
      <View style={styles.main_wrapper} >
        <Text style={styles.title} >Kaydol</Text>
        <View style={styles.each_input_wrapper} >
          <FontAwesomeIcon icon={faEnvelope} size={17} color="rgb(0, 0, 0)" />
          <TextInput
            placeholder="E-Posta"
            style={styles.each_input}
            onChangeText={text => {this.setState({ email: text })}}
          >{this.state.email}</TextInput>
        </View>
        <View style={{zIndex: 5, height: 50, marginTop: 20, overflow: "visible", width: "90%", alignSelf: "center"}} >
          <TouchableOpacity onPress={() => {this.setState({ school_open: !this.state.school_open })}} style={[styles.each_input_select_wrapper, {zIndex: 5, borderBottomLeftRadius: this.state.school_open ? 0 : 30, borderBottomRightRadius: this.state.school_open ? 0 : 30, borderBottomWidth: this.state.school_open ? 0 : 2}]} >
            <FontAwesomeIcon icon={faGraduationCap} size={21} color="rgb(0, 0, 0)" />
            <TextInput
              placeholder="Lise/Üniversite"
              style={styles.each_input}
              onChangeText={text => {
                  if (text.length)
                    this.setState(state => {
                      const schools = state.original_schools.filter(school => this.engName(school.name).includes(this.engName(text)));
                      schools.sort((a, b) => {
                        return this.engName(a.name).includes(this.engName(text)) < this.engName(b.name).includes(this.engName(text))
                      });

                      return { schools };
                    });
                  else
                    this.setState({
                      schools: this.state.original_schools
                    });
              }}
              onFocus={() => this.setState({ school_open: !this.state.school_open })}
            >{this.state.school_name}</TextInput>
          </TouchableOpacity>
          <ScrollView style={[styles.input_select_wrapper, {display: this.state.school_open ? "flex" : "none"}]} >
            {this.state.schools.filter((school, key) => key < 100).map((school, key) => {
              return (
                <TouchableOpacity key={key} style={styles.filter_each_chose} onPress={() => {
                  this.setState({
                    school: school._id,
                    school_name: school.name,
                    school_open: false
                  })
                }} >
                  <Text style={styles.filter_each_chose_text} >{school.name}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
        <View style={styles.each_input_wrapper} >
          <FontAwesomeIcon icon={faUser} size={20} color="rgb(0, 0, 0)" />
          <TextInput
            placeholder="Ad Soyad"
            style={styles.each_input}
            onChangeText={text => {this.setState({ name: text })}}
          >{this.state.name}</TextInput>
        </View>
        <View style={styles.each_input_wrapper} >
          <FontAwesomeIcon icon={faKey} size={17} color="rgb(0, 0, 0)" />
          <TextInput
            placeholder="Şifre"
            secureTextEntry={true}
            style={styles.each_input}
            onChangeText={text => {this.setState({ password: text })}}
          >{this.state.password}</TextInput>
        </View>
        <Text style={styles.error_text} >{this.state.error}</Text>
        <TouchableOpacity style={styles.register} onPress={() => {this.registerPostController()}} >
          <Text style={styles.register_text} >Kaydol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.login}
          onPress={() => {this.props.navigation.navigate('Login')}}
        >
          <Text style={styles.login_text} >Zaten üye misin? Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1, paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: "rgb(253, 252, 252)"
  },
  title: {
    marginTop: 10, color: "rgb(15, 15, 15)", fontWeight: "700",
    width: "90%", alignSelf: "center", fontSize: 30
  },
  each_input_wrapper: {
    flexDirection: "row", alignItems: "center",
    marginTop: 20, width: "90%", alignSelf: "center",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2,
    backgroundColor: "rgb(248, 248, 248)", paddingLeft: 15, paddingRight: 15, height: 50, borderRadius: 30
  },
  each_input: {
    color: "rgb(15, 15, 15)", fontSize: 17, fontWeight: "500",
    marginLeft: 10, flex: 1
  },
  each_input_select_wrapper: {
    flexDirection: "row", alignItems: "center",
    borderColor: "rgb(236, 236, 236)", borderWidth: 2,
    backgroundColor: "rgb(248, 248, 248)", paddingLeft: 15, paddingRight: 15, height: 50, borderRadius: 30
  },
  each_input: {
    color: "rgb(15, 15, 15)", fontSize: 17, fontWeight: "500",
    marginLeft: 10, flex: 1
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
    fontSize: 15, fontWeight: "300", color: "rgb(112, 112, 112)", textAlign: "center"
  },
  error_text: {
    marginTop: "auto", width: "90%", textAlign: "center",
    fontSize: 16, color: "red", fontWeight: "500", alignSelf: "center"
  },
  register: {
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgb(88, 0, 232)", borderRadius: 20,
    padding: 15, shadowColor: "rgb(0, 0, 0)", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5,
    width: "90%", marginBottom: 15, marginTop: 15,
    alignSelf: "center"
  },
  register_text: {
    color: "rgb(255, 255, 255)", fontSize: 22, fontWeight: "600"
  },
  login: {
    marginBottom: 60, alignSelf: "center"
  },
  login_text: {
    color: "rgb(0, 0, 0)", fontSize: 17, fontWeight: "500",
  }
});

AppRegistry.registerComponent('Register', () => Register);
