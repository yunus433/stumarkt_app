import React, {Component} from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity} from 'react-native';
import { API_KEY } from 'react-native-dotenv'

export default class Register extends Component {
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props);
    this.state = {
      onUniversity: false,
      name: '',
      email: '',
      password: '',
      university: '',
      passwordConfirm: '',
      error: '',
      universityList: [
        "Albert-Ludwigs-Universität Freiburg",
        "Bard College Berlin, A Liberal Arts University",
        "Bauhaus-Universität Weimar",
        "Bergische Universität Wuppertal",
        "Brandenburgische Technische Universität Cottbus-Senftenberg",
        "Bucerius Law School",
        "Carl von Ossietzky Universität Oldenburg",
        "Charité - Universitätsmedizin Berlin",
        "Christian-Albrechts-Universität zu Kiel",
        "CODE University of Applied Sciences",
        "Deutsche Sporthochschule Köln",
        "Deutsche Universität für Verwaltungswissenschaften Speyer",
        "Dresden International University",
        "Eberhard Karls Universität Tübingen",
        "EBS Universität für Wirtschaft und Recht",
        "ESCP Europe Wirtschaftsschule",
        "Europa-Universität Flensburg",
        "Europa-Universität Viadrina Frankfurt (Oder)",
        "European School of Management and Technology",
        "FernUniversität in Hagen",
        "Filmuniversität Babelsberg Konrad Wolf",
        "Folkwang Universität der Künste",
        "Frankfurt School of Finance & Management",
        "Freie Hochschule Stuttgart – Seminar für Waldorfpädagogik",
        "Freie Universität Berlin",
        "Friedrich-Alexander-Universität Erlangen-Nürnberg",
        "Friedrich-Schiller-Universität Jena",
        "Georg-August-Universität Göttingen",
        "HafenCity Universität Hamburg",
        "HDBW München",
        "Heinrich-Heine-Universität Düsseldorf",
        "Helmut-Schmidt-Universität – Universität der Bundeswehr Hamburg",
        "Hertie School of Governance",
        "Hochschule für Philosophie München",
        "Hochschule für Politik München – Bavarian School of Public Policy",
        "Hochschule Landshut",
        "Humboldt-Universität zu Berlin",
        "International Psychoanalytic University Berlin",
        "Jacobs University Bremen",
        "Johann Wolfgang Goethe-Universität Frankfurt am Mai",
        "Johannes-Gutenberg-Universität Mainz",
        "Julius-Maximilians-Universität Würzburg",
        "Justus-Liebig-Universität Gießen",
        "Karlsruher Institut für Technologie",
        "Katholische Universität Eichstätt-Ingolstadt",
        "Kühne Logistics University - Wissenschaftliche Hochschule für Logistik und Unternehmensführung",
        "Leibniz Universität Hannover",
        "Leipzig Graduate School of Management",
        "Leuphana Universität Lüneburg",
        "Ludwig-Maximilians-Universität München (LMU)",
        "Martin-Luther-Universität Halle-Wittenberg",
        "Medizinische Hochschule Brandenburg Theodor Fontane",
        "Medizinische Hochschule Hannover",
        "MSH Medical School Hamburg",
        "Otto von Guericke-Universität Magdeburg",
        "Otto-Friedrich-Universität Bamberg",
        "Pädagogische Hochschule Freiburg",
        "Pädagogische Hochschule Heidelberg",
        "Pädagogische Hochschule Karlsruhe",
        "Pädagogische Hochschule Ludwigsburg",
        "Pädagogische Hochschule Schwäbisch Gmünd",
        "Pädagogische Hochschule Weingarten",
        "Philipps-Universität Marburg",
        "Psychologische Hochschule Berlin",
        "Rheinisch-Westfälische Technische Hochschule Aachen",
        "Rheinische Friedrich-Wilhelms-Universität Bonn",
        "Ruhr-Universität Bochum",
        "Ruprecht-Karls-Universität Heidelberg",
        "Steinbeis-Hochschule Berlin",
        "Stiftung Tierärztliche Hochschule Hannover",
        "Stiftung Universität Hildesheim",
        "Technische Universität Bergakademie Freiberg",
        "Technische Universität Berlin",
        "Technische Universität Carolo-Wilhelmina zu Braunschweig",
        "Technische Universität Chemnitz",
        "Technische Universität Clausthal",
        "Technische Universität Darmstadt",
        "Technische Universität Dortmund",
        "Technische Universität Dresden",
        "Technische Universität Hamburg",
        "Technische Universität Ilmenau",
        "Technische Universität Kaiserslautern",
        "Technische Universität München (TUM)",
        "Universität Augsburg",
        "Universität Bayreuth",
        "Universität Bremen",
        "Universität der Bundeswehr München",
        "Universität der Künste Berlin",
        "Universität des Saarlandes",
        "Universität Duisburg-Essen",
        "Universität Erfurt",
        "Universität Greifswald",
        "Universität Hamburg",
        "Universität Hohenheim",
        "Universität Kassel",
        "Universität Koblenz-Landau",
        "Universität Konstanz",
        "Universität Leipzig",
        "Universität Mannheim",
        "Universität Osnabrück",
        "Universität Paderborn",
        "Universität Passau",
        "Universität Potsdam",
        "Universität Regensburg",
        "Universität Rostock",
        "Universität Siegen",
        "Universität Stuttgart",
        "Universität Trier",
        "Universität Ulm",
        "Universität Vechta",
        "Universität Witten/Herdecke",
        "Universität zu Köln",
        "Universität zu Lübeck",
        "Westfälische Wilhelms-Universität Münster",
        "WHU - Otto Beisheim School of Management",
        "Zeppelin Universität"
      ],
      originalUniversityList: [
        "Albert-Ludwigs-Universität Freiburg",
        "Bard College Berlin, A Liberal Arts University",
        "Bauhaus-Universität Weimar",
        "Bergische Universität Wuppertal",
        "Brandenburgische Technische Universität Cottbus-Senftenberg",
        "Bucerius Law School",
        "Carl von Ossietzky Universität Oldenburg",
        "Charité - Universitätsmedizin Berlin",
        "Christian-Albrechts-Universität zu Kiel",
        "CODE University of Applied Sciences",
        "Deutsche Sporthochschule Köln",
        "Deutsche Universität für Verwaltungswissenschaften Speyer",
        "Dresden International University",
        "Eberhard Karls Universität Tübingen",
        "EBS Universität für Wirtschaft und Recht",
        "ESCP Europe Wirtschaftsschule",
        "Europa-Universität Flensburg",
        "Europa-Universität Viadrina Frankfurt (Oder)",
        "European School of Management and Technology",
        "FernUniversität in Hagen",
        "Filmuniversität Babelsberg Konrad Wolf",
        "Folkwang Universität der Künste",
        "Frankfurt School of Finance & Management",
        "Freie Hochschule Stuttgart – Seminar für Waldorfpädagogik",
        "Freie Universität Berlin",
        "Friedrich-Alexander-Universität Erlangen-Nürnberg",
        "Friedrich-Schiller-Universität Jena",
        "Georg-August-Universität Göttingen",
        "HafenCity Universität Hamburg",
        "HDBW München",
        "Heinrich-Heine-Universität Düsseldorf",
        "Helmut-Schmidt-Universität – Universität der Bundeswehr Hamburg",
        "Hertie School of Governance",
        "Hochschule für Philosophie München",
        "Hochschule für Politik München – Bavarian School of Public Policy",
        "Hochschule Landshut",
        "Humboldt-Universität zu Berlin",
        "International Psychoanalytic University Berlin",
        "Jacobs University Bremen",
        "Johann Wolfgang Goethe-Universität Frankfurt am Mai",
        "Johannes-Gutenberg-Universität Mainz",
        "Julius-Maximilians-Universität Würzburg",
        "Justus-Liebig-Universität Gießen",
        "Karlsruher Institut für Technologie",
        "Katholische Universität Eichstätt-Ingolstadt",
        "Kühne Logistics University - Wissenschaftliche Hochschule für Logistik und Unternehmensführung",
        "Leibniz Universität Hannover",
        "Leipzig Graduate School of Management",
        "Leuphana Universität Lüneburg",
        "Ludwig-Maximilians-Universität München (LMU)",
        "Martin-Luther-Universität Halle-Wittenberg",
        "Medizinische Hochschule Brandenburg Theodor Fontane",
        "Medizinische Hochschule Hannover",
        "MSH Medical School Hamburg",
        "Otto von Guericke-Universität Magdeburg",
        "Otto-Friedrich-Universität Bamberg",
        "Pädagogische Hochschule Freiburg",
        "Pädagogische Hochschule Heidelberg",
        "Pädagogische Hochschule Karlsruhe",
        "Pädagogische Hochschule Ludwigsburg",
        "Pädagogische Hochschule Schwäbisch Gmünd",
        "Pädagogische Hochschule Weingarten",
        "Philipps-Universität Marburg",
        "Psychologische Hochschule Berlin",
        "Rheinisch-Westfälische Technische Hochschule Aachen",
        "Rheinische Friedrich-Wilhelms-Universität Bonn",
        "Ruhr-Universität Bochum",
        "Ruprecht-Karls-Universität Heidelberg",
        "Steinbeis-Hochschule Berlin",
        "Stiftung Tierärztliche Hochschule Hannover",
        "Stiftung Universität Hildesheim",
        "Technische Universität Bergakademie Freiberg",
        "Technische Universität Berlin",
        "Technische Universität Carolo-Wilhelmina zu Braunschweig",
        "Technische Universität Chemnitz",
        "Technische Universität Clausthal",
        "Technische Universität Darmstadt",
        "Technische Universität Dortmund",
        "Technische Universität Dresden",
        "Technische Universität Hamburg",
        "Technische Universität Ilmenau",
        "Technische Universität Kaiserslautern",
        "Technische Universität München (TUM)",
        "Universität Augsburg",
        "Universität Bayreuth",
        "Universität Bremen",
        "Universität der Bundeswehr München",
        "Universität der Künste Berlin",
        "Universität des Saarlandes",
        "Universität Duisburg-Essen",
        "Universität Erfurt",
        "Universität Greifswald",
        "Universität Hamburg",
        "Universität Hohenheim",
        "Universität Kassel",
        "Universität Koblenz-Landau",
        "Universität Konstanz",
        "Universität Leipzig",
        "Universität Mannheim",
        "Universität Osnabrück",
        "Universität Paderborn",
        "Universität Passau",
        "Universität Potsdam",
        "Universität Regensburg",
        "Universität Rostock",
        "Universität Siegen",
        "Universität Stuttgart",
        "Universität Trier",
        "Universität Ulm",
        "Universität Vechta",
        "Universität Witten/Herdecke",
        "Universität zu Köln",
        "Universität zu Lübeck",
        "Westfälische Wilhelms-Universität Münster",
        "WHU - Otto Beisheim School of Management",
        "Zeppelin Universität"
      ]
    };
  }

  nextButtonController = () => {
    if (this.state.name && this.state.email && this.state.password && this.state.passwordConfirm) {
      if (this.state.password.length >= 6) {
        if (this.state.password == this.state.passwordConfirm) {
          this.setState({
            "onUniversity": true,
            "error": ""
          });
        } else {
          this.setState({
            "error": "Bitte bestätige dein Passwort!"
          });
        }
      } else {
        this.setState({
          "error": "Dein Passwort muss mindestens 6-stellig sein!"
        });
      }
    } else {
      this.setState({
        "error": "Please write all the necessary information"
      });
    }
  }

  registerButtonController = () => {
    if (this.state.university.length) {
      fetch(`https://www.stumarkt.com/api/register?email=${this.state.email}&name=${this.state.name}&password=${this.state.password}&university=${this.state.university}` , {
        headers: {
          "x_auth": API_KEY
        }
      })
      .then(response => {return response.json()})
      .then(data => {
        if (data.error && data.error == 'Email is not valid') {
          this.setState({
            "onUniversity": false,
            "error": "Diese E-mail ist nicht verfügbar"
          })
        } else if (data.error && data.error == 'Email is taken') {
          this.setState({
            "onUniversity": false,
            "error": "Diese E-mail ist bereits registriert"
          })
        } else if (data.error) {
          alert("Err: " + data.error);
        } else {
          this.props.navigation.push('main', {"user": data.user});
        }
      })
      .catch(err => {
        alert("Err: " + err);u
      })
    } else {
      this.setState({
        "error": "Please select a university"
      });
    }
  }

  searchUniversityController = (text) => {
    this.setState((state) => {
      if (text.length > 0) {
        const uniArray = state.originalUniversityList.filter(uni => {
          return uni.toLowerCase().indexOf(text.trim().toLowerCase()) !== -1
        });
  
        return {
          "universityList": uniArray
        };
      } else {
        return {
          "universityList": state.originalUniversityList
        };
      }
    });
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <View style={styles.innerWrapper} >
          { !this.state.onUniversity ?
            <View style={styles.formWrapper}>
              <View style={styles.header} >
                <Text style={styles.title} >
                  Registrieren
                </Text>
              </View>
              <TextInput 
                style={styles.formInput}
                placeholder="Name"
                onChangeText={(name) => { this.setState({name: name})}}
              >
              </TextInput>
              <TextInput 
                style={styles.formInput}
                placeholder="Email"
                onChangeText={(email) => {this.setState({email: email})}}
              >
              </TextInput>
              <TextInput 
                style={styles.formInput}
                placeholder="Passwort"
                onChangeText={(password) => {this.setState({password: password})}}
              >
              </TextInput>
              <TextInput 
                style={styles.formInput}
                placeholder="Passwort wiederholen"
                onChangeText={(password) => {this.setState({passwordConfirm: password})}}
              >
              </TextInput>
              <TouchableOpacity style={styles.sendButton} onPress={() => {this.nextButtonController()}} >
                <Text style={styles.sendButtonText} > Next </Text>
              </ TouchableOpacity>
              <View style={styles.errorLineWrapper} >
                <Text style={styles.errorLine} >{this.state.error}</Text>
              </View>
            </View>
            :
            <View style={styles.formWrapper} >
              <View style={styles.header} >
                <Text style={styles.title} >
                  Select University
                </Text>
              </View>
              <View style={styles.universitySearchWrapper} >
              <Image source={require('./../../assets/search-icon.png')} style={styles.universitySearchLogo} ></Image>
                <TextInput style={styles.universitySearchInput} placeholder="Search" onChangeText={(text) => {this.searchUniversityController(text)}} ></TextInput>
              </View>
              <ScrollView style={styles.universityWrapper} >
                { this.state.universityList.length ?
                  this.state.universityList.map((uni, key) => {
                    return (
                      <TouchableOpacity key={key} style={ this.state.university == uni ? styles.activeUniversityButton : styles.eachUniversityButton} onPress={() => {this.setState({"university": uni})}} >
                        <Text style={styles.eachUniversityText} >{uni}</Text>
                      </TouchableOpacity>
                    )
                  })
                  :
                  <Text style={styles.uniNoResult} >No result</Text>
                }
              </ScrollView>
              <View style={styles.agreementWrapper} >
                <Text style={styles.agreementText} >Ich bin mit den Folgenden einverstanden: </Text>
                <TouchableOpacity>
                  <Text style={styles.agreementLink} >Nutzungsbedingungen</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.agreementLink} >Datenschutzerklärung</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.sendButton} onPress={() => {this.registerButtonController()}} >
                <Text style={styles.sendButtonText} > Registrieren </Text>
              </ TouchableOpacity>
              <View style={styles.errorLineWrapper} >
                <Text style={styles.errorLine} >{this.state.error}</Text>
              </View>
            </View>
          }
          <View style={styles.bottomLink} >
            <Text style={styles.bottomLinkInfo} > Schon registriert? </Text>
            <TouchableOpacity
              onPress={() => {this.props.navigation.navigate('login')}} 
            >
              <Text style={styles.bottomLinkButton} > Einloggen </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    backgroundColor: "rgb(248, 248, 248)",
    padding: 25
  },
  innerWrapper: {
    flex: 1
  },
  formWrapper: {
    backgroundColor: "white",
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderColor: "rgb(236, 236, 235)", borderWidth: 2, borderRadius: 5
  },
  header: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 25, color: "rgb(112, 112, 112)", fontWeight: "200",
    flex: 3
  },
  formInput: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10,
    borderColor: "rgb(236, 236, 235)", borderWidth: 2, borderRadius: 5,
    color: "rgb(112, 112, 122)", fontSize: 16,
    marginBottom: 15
  },
  universityWrapper: {
    height: 200,
    marginBottom: 15, paddingBottom: 20, paddingLeft: 10, paddingRight: 10
  },
  universitySearchWrapper: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 15
  },
  universitySearchInput: {
    color: "rgb(112, 112, 112)", fontSize: 16
  },
  universitySearchLogo: {
    height: 15, width: 15, resizeMode: "contain",
    marginRight: 5
  },
  uniNoResult: {
    color: "rgb(112, 112, 112)", fontSize: 15, fontWeight: "300", textAlign: "center",
    marginTop: 25
  },
  eachUniversityButton: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10, marginBottom: 10,
    borderColor: "rgb(236, 235, 235)", borderWidth: 2, borderRadius: 5
  },
  activeUniversityButton: {
    backgroundColor: "rgb(248, 248, 248)",
    padding: 10, marginBottom: 10,
    borderColor: "rgb(255, 61, 148)", borderWidth: 2, borderRadius: 5
  },
  eachUniversityText:{
    color: "rgb(112, 112, 112)", fontSize: 14, fontWeight: "600", textAlign: "center"
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
    backgroundColor: "rgba(255, 108, 128, 0.3)",
    justifyContent: "center", alignItems: "center",
    borderColor: "rgba(255, 61, 148, 0.4)", borderWidth: 2, borderRadius: 5,
    padding: 10
  },
  sendButtonText: {
    color: "rgb(255, 61, 148)", fontWeight: "700", fontSize: 16
  },
  errorLineWrapper: {
    flexDirection: "row",
    marginTop: 10
  },
  errorLine: {
    flex: 1,
    fontSize: 13, color: "rgb(255, 61, 148)", textAlign: "center"
  },
  bottomLink: {
    paddingLeft: 20, marginTop: 10
  },
  bottomLinkInfo: {
    color: "rgb(112, 112, 112)", fontSize: 18,
    marginBottom: 5
  },
  bottomLinkButton: {
    color: "rgb(255, 61, 148)", fontSize: 18, fontWeight: "700"
  }
});

AppRegistry.registerComponent('Register', () => Register);
