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
      cityUniversityList: {
        Aachen: ["Rheinisch-Westfälische Technische Hochschule Aachen"],
        Augsburg: ["Universität Augsburg"],
        Babelsberg: ["Filmuniversität Babelsberg Konrad Wolf"],
        Bamberg: ["Otto-Friedrich-Universität Bamberg"],
        Bayreuth: ["Universität Bayreuth"],
        Berlin: ["Bard College Berlin, A Liberal Arts University", "Charité - Universitätsmedizin Berlin", "CODE University of Applied Sciences", "ESCP Europe Wirtschaftsschule", "European School of Management and Technology", "Freie Universität Berlin", "Hertie School of Governance", "Humboldt-Universität zu Berlin", "International Psychoanalytic University Berlin", "Psychologische Hochschule Berlin", "Steinbeis-Hochschule Berlin", "Technische Universität Berlin", "Universität der Künste Berlin"],
        Bochum: ["Ruhr-Universität Bochum"],
        Bonn: ["Rheinische Friedrich-Wilhelms-Universität Bonn"],
        Braunschweig: ["Technische Universität Carolo-Wilhelmina zu Braunschweig"],
        Bremen: ["Jacobs University Bremen", "Universität Bremen"],
        Chemnitz: ["Technische Universität Chemnitz"],
        Clausthal: ["Technische Universität Clausthal"],
        Cottbus: ["Brandenburgische Technische Universität Cottbus-Senftenberg"],
        Darmstadt: ["Technische Universität Darmstadt"],
        Dortmund: ["Technische Universität Dortmund"],
        Dresden: ["Dresden International University", "Technische Universität Dresden"],
        Duisburg: ["Universität Duisburg-Essen"],
        Düsseldorf: ["Heinrich-Heine-Universität Düsseldorf"],
        Erfurt: ["Universität Erfurt"],
        Essen: ["Folkwang Universität der Künste"],
        Flensburg: ["Europa-Universität Flensburg"],
        Frankfurt: ["Europa-Universität Viadrina Frankfurt (Oder)", "Frankfurt School of Finance & Management", "Johann Wolfgang Goethe-Universität Frankfurt am Mai"],
        Freiberg: ["Technische Universität Bergakademie Freiberg"],
        Freiburg: ["Albert-Ludwigs-Universität Freiburg", "Pädagogische Hochschule Freiburg"],
        Friedrichshafen: ["Zeppelin Universität"],
        Gießen: ["Justus-Liebig-Universität Gießen"],
        Göttingen: ["Georg-August-Universität Göttingen"],
        Greifswald: ["Universität Greifswald"],
        Hagen: ["FernUniversität in Hagen"],
        Halle: ["Martin-Luther-Universität Halle-Wittenberg"],
        Hamburg: ["Bucerius Law School", "HafenCity Universität Hamburg", "Helmut-Schmidt-Universität – Universität der Bundeswehr Hamburg", "Kühne Logistics University - Wissenschaftliche Hochschule für Logistik und Unternehmensführung", "MSH Medical School Hamburg", "Technische Universität Hamburg", "Universität Hamburg"],
        Hannover: ["Leibniz Universität Hannover", "Medizinische Hochschule Hannover", "Stiftung Tierärztliche Hochschule Hannover"],
        Heidelberg: ["Pädagogische Hochschule Heidelberg", "Ruprecht-Karls-Universität Heidelberg"],
        Hildesheim: ["Stiftung Universität Hildesheim"],
        Hohenheim: ["Universität Hohenheim"],
        Ilmenau: ["Technische Universität Ilmenau"],
        Ingolstadt: ["Katholische Universität Eichstätt-Ingolstadt"],
        Jena: ["Friedrich-Schiller-Universität Jena"],
        Kaiserslautern: ["Technische Universität Kaiserslautern"],
        Karlsruhe: ["Karlsruher Institut für Technologie", "Pädagogische Hochschule Karlsruhe"],
        Kassel: ["Universität Kassel"],
        Kiel: ["Christian-Albrechts-Universität zu Kiel"],
        Konstanz: ["Universität Konstanz"],
        Köln: ["Deutsche Sporthochschule Köln", "Universität zu Köln"],
        Landau: ["Universität Koblenz-Landau"],
        Landshut: ["Hochschule Landshut"],
        Leipzig: ["Leipzig Graduate School of Management", "Universität Leipzig"],
        Ludwigsburg: ["Pädagogische Hochschule Ludwigsburg"],
        Lübeck: ["Universität zu Lübeck"],
        Lüneburg: ["Leuphana Universität Lüneburg"],
        Magdeburg: ["Otto von Guericke-Universität Magdeburg"],
        Mainz: ["Johannes-Gutenberg-Universität Mainz"],
        Mannheim: ["Universität Mannheim"],
        Marburg: ["Philipps-Universität Marburg"],
        München: ["HDBW München", "Hochschule für Philosophie München", "Hochschule für Politik München – Bavarian School of Public Policy", "Ludwig-Maximilians-Universität München (LMU)", "Technische Universität München (TUM)", "Universität der Bundeswehr München"],
        Münster: ["Westfälische Wilhelms-Universität Münster"],
        Neuruppin: ["Medizinische Hochschule Brandenburg Theodor Fontane"],
        Nürnberg: ["Friedrich-Alexander-Universität Erlangen-Nürnberg"],
        OestrichWinkel: ["EBS Universität für Wirtschaft und Recht"],
        Oldenburg: ["Carl von Ossietzky Universität Oldenburg"],
        Osnabrück: ["Universität Osnabrück"],
        Paderborn: ["Universität Paderborn"],
        Passau: ["Universität Passau"],
        Potsdam: ["Universität Potsdam"],
        Regensburg: ["Universität Regensburg"],
        Rostock: ["Universität Rostock"],
        Saarbrücken: ["Universität des Saarlandes"],
        SchwäbischGmünd: ["Pädagogische Hochschule Schwäbisch Gmünd"],
        Siegen: ["Universität Siegen"],
        Speyer: ["Deutsche Universität für Verwaltungswissenschaften Speyer"],
        Stuttgart: ["Freie Hochschule Stuttgart – Seminar für Waldorfpädagogik", "Universität Stuttgart"],
        Trier: ["Universität Trier"],
        Tübingen: ["Eberhard Karls Universität Tübingen"],
        Ulm: ["Universität Ulm"],
        Vallendar: ["WHU - Otto Beisheim School of Management"],
        Vechta: ["Universität Vechta"],
        Weimar: ["Bauhaus-Universität Weimar"],
        Weingarten: ["Pädagogische Hochschule Weingarten"],
        Witten: ["Universität Witten/Herdecke"],
        Wuppertal: ["Bergische Universität Wuppertal"],
        Würzburg: ["Julius-Maximilians-Universität Würzburg"]
      },
      selectedUniversities: []
    };
  };

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
      const universities = [];
      this.state.selectedCities.forEach(city => {
        this.state.cityUniversityList[city].forEach(uni => {
          universities.push(uni);
        });
      });
  
      this.props.navigation.push('main', {
        'user': this.state.user,
        universities,
        cities: this.state.selectedCities
      });
    } else {
      this.props.navigation.push('main', {
        'user': this.state.user,
      });
    }
  };

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Header navigation={this.props.navigation}></Header>
        <View style={styles.content} >
          <View style={{padding: 20, flex: 1}} >
            <Text style={styles.contentTitle} >Filter nach Stadt</Text>
            <Text style={styles.contentInfo} >Wähle die Stadt aus, die du filtern möchtest.</Text>
            <View style={styles.universityWrapper} >
              <ScrollView>
                <TouchableOpacity onPress={() => {this.addCityToList("Aachen")}} style={this.state.selectedCities.includes("Aachen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Aachen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Augsburg")}} style={this.state.selectedCities.includes("Augsburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Augsburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Babelsberg")}} style={this.state.selectedCities.includes("Babelsberg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Babelsberg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Bamberg")}} style={this.state.selectedCities.includes("Bamberg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Bamberg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Bayreuth")}} style={this.state.selectedCities.includes("Bayreuth") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Bayreuth</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Berlin")}} style={this.state.selectedCities.includes("Berlin") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Berlin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Bochum")}} style={this.state.selectedCities.includes("Bochum") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Bochum</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Bonn")}} style={this.state.selectedCities.includes("Bonn") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Bonn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Braunschweig")}} style={this.state.selectedCities.includes("Braunschweig") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Braunschweig</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Bremen")}} style={this.state.selectedCities.includes("Bremen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Bremen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Chemnitz")}} style={this.state.selectedCities.includes("Chemnitz") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Chemnitz</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Clausthal")}} style={this.state.selectedCities.includes("Clausthal") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Clausthal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Cottbus")}} style={this.state.selectedCities.includes("Cottbus") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Cottbus</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Darmstadt")}} style={this.state.selectedCities.includes("Darmstadt") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Darmstadt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Dortmund")}} style={this.state.selectedCities.includes("Dortmund") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Dortmund</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Dresden")}} style={this.state.selectedCities.includes("Dresden") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Dresden</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Duisburg")}} style={this.state.selectedCities.includes("Duisburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Duisburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Düsseldorf")}} style={this.state.selectedCities.includes("Düsseldorf") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Düsseldorf</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Erfurt")}} style={this.state.selectedCities.includes("Erfurt") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Erfurt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Essen")}} style={this.state.selectedCities.includes("Essen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Essen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Flensburg")}} style={this.state.selectedCities.includes("Flensburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Flensburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Frankfurt")}} style={this.state.selectedCities.includes("Frankfurt") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Frankfurt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Freiberg")}} style={this.state.selectedCities.includes("Freiberg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Freiberg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Freiburg")}} style={this.state.selectedCities.includes("Freiburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Freiburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Friedrichshafen")}} style={this.state.selectedCities.includes("Friedrichshafen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Friedrichshafen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Gießen")}} style={this.state.selectedCities.includes("Gießen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Gießen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Göttingen")}} style={this.state.selectedCities.includes("Göttingen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Göttingen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Greifswald")}} style={this.state.selectedCities.includes("Greifswald") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Greifswald</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Hagen")}} style={this.state.selectedCities.includes("Hagen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Hagen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Halle")}} style={this.state.selectedCities.includes("Halle") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Halle</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Hamburg")}} style={this.state.selectedCities.includes("Hamburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Hamburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Hannover")}} style={this.state.selectedCities.includes("Hannover") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Hannover</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Heidelberg")}} style={this.state.selectedCities.includes("Heidelberg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Heidelberg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Hildesheim")}} style={this.state.selectedCities.includes("Hildesheim") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Hildesheim</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Hohenheim")}} style={this.state.selectedCities.includes("Hohenheim") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Hohenheim</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Ilmenau")}} style={this.state.selectedCities.includes("Ilmenau") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Ilmenau</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Jena")}} style={this.state.selectedCities.includes("Jena") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Jena</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Kaiserslautern")}} style={this.state.selectedCities.includes("Kaiserslautern") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Kaiserslautern</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Karlsruhe")}} style={this.state.selectedCities.includes("Karlsruhe") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Karlsruhe</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Kassel")}} style={this.state.selectedCities.includes("Kassel") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Kassel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Kiel")}} style={this.state.selectedCities.includes("Kiel") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Kiel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Konstanz")}} style={this.state.selectedCities.includes("Konstanz") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Konstanz</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Köln")}} style={this.state.selectedCities.includes("Köln") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Köln</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Landau")}} style={this.state.selectedCities.includes("Landau") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Landau</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Landshut")}} style={this.state.selectedCities.includes("Landshut") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Landshut</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Leipzig")}} style={this.state.selectedCities.includes("Leipzig") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Leipzig</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Ludwigsburg")}} style={this.state.selectedCities.includes("Ludwigsburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Ludwigsburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Lübeck")}} style={this.state.selectedCities.includes("Lübeck") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Lübeck</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Lüneburg")}} style={this.state.selectedCities.includes("Lüneburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Lüneburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Magdeburg")}} style={this.state.selectedCities.includes("Magdeburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Magdeburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Mainz")}} style={this.state.selectedCities.includes("Mainz") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Mainz</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Mannheim")}} style={this.state.selectedCities.includes("Mannheim") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Mannheim</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Marburg")}} style={this.state.selectedCities.includes("Marburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Marburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("München")}} style={this.state.selectedCities.includes("München") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >München</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Münster")}} style={this.state.selectedCities.includes("Münster") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Münster</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Neuruppin")}} style={this.state.selectedCities.includes("Neuruppin") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Neuruppin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Nürnberg")}} style={this.state.selectedCities.includes("Nürnberg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Nürnberg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("OestrichWinkel")}} style={this.state.selectedCities.includes("OestrichWinkel") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >OestrichWinkel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Oldenburg")}} style={this.state.selectedCities.includes("Oldenburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Oldenburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Osnabrück")}} style={this.state.selectedCities.includes("Osnabrück") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Osnabrück</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Paderborn")}} style={this.state.selectedCities.includes("Paderborn") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Paderborn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Passau")}} style={this.state.selectedCities.includes("Passau") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Passau</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Potsdam")}} style={this.state.selectedCities.includes("Potsdam") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Potsdam</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Regensburg")}} style={this.state.selectedCities.includes("Regensburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Regensburg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Rostock")}} style={this.state.selectedCities.includes("Rostock") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Rostock</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Saarbrücken")}} style={this.state.selectedCities.includes("Saarbrücken") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Saarbrücken</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("SchwäbischGmünd")}} style={this.state.selectedCities.includes("SchwäbischGmünd") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >SchwäbischGmünd</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Siegen")}} style={this.state.selectedCities.includes("Siegen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Siegen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Speyer")}} style={this.state.selectedCities.includes("Speyer") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Speyer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Stuttgart")}} style={this.state.selectedCities.includes("Stuttgart") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Stuttgart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Trier")}} style={this.state.selectedCities.includes("Trier") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Trier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Tübingen")}} style={this.state.selectedCities.includes("Tübingen") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Tübingen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Ulm")}} style={this.state.selectedCities.includes("Ulm") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Ulm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Vallendar")}} style={this.state.selectedCities.includes("Vallendar") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Vallendar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Vechta")}} style={this.state.selectedCities.includes("Vechta") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Vechta</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Weimar")}} style={this.state.selectedCities.includes("Weimar") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Weimar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Weingarten")}} style={this.state.selectedCities.includes("Weingarten") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Weingarten</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Witten")}} style={this.state.selectedCities.includes("Witten") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Witten</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Wuppertal")}} style={this.state.selectedCities.includes("Wuppertal") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Wuppertal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.addCityToList("Würzburg")}} style={this.state.selectedCities.includes("Würzburg") ? styles.eachUniActive : styles.eachUni} >
                  <Text style={styles.eachUniText} >Würzburg</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <ScrollView style={{marginBottom: 10}}>
              <Text style={styles.selectedUniNamesTitle} >Ausgewählte Städte: </Text>
              <Text style={styles.selectedUniNames} >{this.state.selectedCities.length ? this.state.selectedCities.join(", ") : "Keine Stadt ist ausgewählt"}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.applyFiltersButton} onPress={() => {this.applyFilter()}} >
              <Text  style={styles.applyFiltersButtonText} >Filtern</Text>
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
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
  },
  content: {
    flex: 8, paddingBottom: 100
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
    flex: 1, marginBottom: 10
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
