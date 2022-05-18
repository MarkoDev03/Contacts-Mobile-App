import React, { useState, useEffect } from 'react';
import {View, StyleSheet, TextInput, ScrollView, Text, TouchableNativeFeedback, Image, Dimensions, StatusBar as StatusBarProperty, Appearance} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AntDesign from "react-native-vector-icons/AntDesign"
import * as NavigationBar from 'expo-navigation-bar';

const Search = ({ navigation, route }) => {

    const { contacts } = route.params;
    const [results, setResults] = useState([])
    const [numeric, setNumeric] = useState(false)

    let theme = Appearance.getColorScheme();

    let bgColor = theme == "light" ? "#fff" : "#191919"
    let txtColor = theme == "dark" ? "#fff" : "#000"
    let searchColor = theme == "light" ? "#eff4fb" : "#303238";
    let borderColor = theme == "light" ? "#d6d6d6" : "#525151";
    let iconColor = theme == "light" ? "#444" : "#9e9e9e"

    useEffect(() => {
        (async () => {
            await NavigationBar.setBackgroundColorAsync(bgColor);
        })()
    }, []);

    function getRelevancy(value, searchTerm) {
        if (value === searchTerm) {
          return 2;
        } else if (value.startsWith(searchTerm)) {
          return 1;
        } else if (value.includes(searchTerm)) {
          return 0;
        } else return -1;
      }

    const searchContacts = (e) => {
       let numbers = new RegExp( /\d/)

       if (numbers.test(e)) {
           setNumeric(true)
       } else {
           setNumeric(false)
       }

       let value = e;

       if (numeric == false) {
       if (value && value.trim().length > 0) {
         value = value.trim().toLowerCase();
         setResults(
            contacts
             .filter((person) => {
               return person.name.trim().toLowerCase().includes(value);
             })
             .sort((personA, personB) => {
               return (
                getRelevancy(personB.name.trim().toLowerCase(), value) -
                getRelevancy(personA.name.trim().toLowerCase(), value)
               );
             })
         );
       }
    } else if (numeric == true) {
        if (value && value.trim().length > 0) {
            value = value.trim();
            setResults(
              contacts
                .filter((person) => {
                 let number = person.phoneNumbers ? person : {phoneNumbers: [{number: ""}]};
                 var chars = { "-": "", "+" : "" };
                 var setNumber = number.phoneNumbers[0].number.replace(/-\s/g, (m) => chars[m]);
                 let term = ((value.replace(/\s/g, "")).replace(/-/g, ""))
                 let getTerm = term.replace('+', '')
                 let getNumber = ((setNumber.replace(/-/g, "")).replace(/\s/g, ""))
                 let get =  getNumber.replace('+', '')
                 console.log(get);
                  return get.includes(getTerm);
                })
                .sort((personA, personB) => {
                  return (
                    getRelevancy(personB.phoneNumber != undefined ? personB.phoneNumbers[0].number : "", value) -
                    getRelevancy(personA.phoneNumber != undefined ? personA.phoneNumbers[0].number : "", value)
                  );
                })
            );
          }
    }

       if (e.length == 0) {
           setResults([])
       }
    }

    const Contact = ({ data }) => {
        const colors = ["#FB8C00", "#FFE047", "#1EA362", "#DD4B3E", "#E01E5A", "#0F9D58", "#4285F4", "#ECB22E", "#4A154B", "#1BAFD0", "#36C5F0", "#6967CE"];
        let color = colors[Math.floor(Math.random() * colors.length)]

        return (
            <View style={[styles.wrapper, { backgroundColor: bgColor }]}> 
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)} onPress={() => {navigation.navigate("Contact", {
                data: data,
                color: color
            })}}>
              <View style={styles.contact}>
              {
                  data.imageAvailable ? (
                      <Image source={{uri: data.image.uri}} style={styles.relImg} />
                  ) : (
                                <View style={[styles.image, { backgroundColor:color}]}>
                    <Text adjustsFontSizeToFit style={styles.firstLetter}>{data.firstName.charAt(0).toUpperCase()}</Text>
                 </View>
    
                  )
              }
                <View style={[styles.borderView]}>
                <Text adjustsFontSizeToFit style={[styles.title, { color: txtColor }]}>{data.name}</Text>
                {numeric && ( <Text adjustsFontSizeToFit style={[styles.title, { color: "#6D7F86" }]}>{data.phoneNumbers != undefined ? data.phoneNumbers[0].number : "no number"}</Text>)}
              </View>
              </View>
            </TouchableNativeFeedback>
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
           <React.Fragment>
            <StatusBar style='auto' />
           <View style={[styles.header, { backgroundColor: searchColor, borderBottomColor:borderColor }]}>
                <AntDesign name="arrowleft" size={32} color={iconColor} onPress={() => {navigation.navigate("HomeScreen")}} />
                <TextInput placeholder='Search contacts' style={[styles.bar, { color:iconColor }]} placeholderTextColor={iconColor} onChangeText={searchContacts} />
            </View>
           </React.Fragment>
            <ScrollView  style={{
                backgroundColor:bgColor
            }}>
                {
                    results.length > 0 ? results.map((result) => (
                        <Contact data={result} key={result.id} />
                    )) : <></>
                }
            </ScrollView>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#fff"
    },
    header: {
        width:"100%",
        paddingVertical:17,
        justifyContent:"flex-start",
        alignItems:"center",
        flexDirection:"row",
        paddingHorizontal:15,
        borderBottomWidth:1,
        paddingTop:22,
        paddingTop: StatusBarProperty.currentHeight + 19
    },
    bar: {
        width: "90%",
        marginLeft:10,
        fontSize:20,
    },
    wrapper: {
        width:"100%",
        justifyContent:"flex-start",
        alignItems:"center",
        flexDirection:"row",
        margin:0,
        padding:1
    },
    image: {
        // backgroundColor:"#3700B3",
        width:50,
        height:50,
        borderRadius:50,
        justifyContent:"center",
        alignItems:"center",
        marginRight:5,
        marginLeft:5
    },
    borderView: {
        height: 65,
        width:(Dimensions.get("screen").width - 95),
        justifyContent:"center",
        alignItems: "flex-start",
        padding:0,
        margin:0,
        marginRight:20
    }, 
    number: {
      fontSize:15,
      marginTop:3,
      color:"#1490D4"
    },
    relImg: {
        width:50,
        height:50,
        borderRadius:50,
        marginRight:5,
        marginLeft:5
    },
    firstLetter: {
        color:"white",
        fontSize:23,
    },
    title: {
        fontWeight:"800",
        fontSize:17,
    },
    contact: {
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:"row",
        color:"#1490D4",
        height:65,
        padding:0,
        margin:0
    }
})

export default Search;
