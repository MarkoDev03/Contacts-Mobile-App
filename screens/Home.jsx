import React, { useState, useLayoutEffect } from "react"
import { View, Text, StatusBar as StatusBarProperty, ScrollView, StyleSheet, Alert, LogBox, TouchableOpacity, Appearance } from "react-native"
import * as Contacts from "expo-contacts"
import Contact from "../components/Contact"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';


LogBox.ignoreLogs(["A VirtualizedList contains a cell which itself contains more than one VirtualizedList of the same orientation as the parent list. You must pass a unique listKey prop to each sibling list.", "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method."])

export default function Home({ navigation }) {
  const [contacts, setContacts] = useState([])
  const [letters, setLetters] = useState([])

  let theme = Appearance.getColorScheme()
  let bgColor = theme == "light" ? "#f0f0f0" : "#000"
  let letterComponent = theme == "light" ? "#fff" : "#1d1f1d"
  let searchColor = theme == "light" ? "#eff4fb" : "#303238";
  let borderColor = theme == "light" ? "#d4d4d4" : "#525151";
  let bgColorBar = theme == "light" ? "#eff4fb" : "#303238";

  useLayoutEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.RawImage],
        });   
        if (data.length > 0) {
          setContacts(data);
          let array = []
          data.forEach((contact) => {
            array.push(contact.name.charAt(0).toUpperCase())
          })
           array = [...new Set(array)];
           setLetters(array)
        } else {
          Alert.alert("Error", "Failed to read contacts!")
        }
      }
    })();

    return () => {
      setContacts([])
      setLetters([])
    }
  }, []);

  useLayoutEffect(() => {
    (async () => {
        await NavigationBar.setBackgroundColorAsync(bgColorBar);
    })()
}, []);

  const LetterComponent = (letter) => {
    let data = []
    contacts.forEach((item) => {
      if (item.name.charAt(0).toUpperCase() == letter.letter.toUpperCase()) {
        data.push(item)
      }
    })

    return (
      <View style={[styles.letterData, { backgroundColor: bgColor }]}  key={letter + "key"}>
         <Text style={[styles.letterHeadline, { backgroundColor: bgColor }]}>{letter.letter.toUpperCase()}</Text>
         {
          data.length > 0 && (
            <View style={[styles.list, {     
              borderWidth:0,
              borderColor:"#d4d4d4", 
              borderTopLeftRadius:30, 
              borderTopRightRadius:30,
              borderBottomRightRadius:30,
              borderBottomLeftRadius:30,
              padding:0,
              backgroundColor:letterComponent,
              paddingBottom:0
              }]}>
            {
              data.map((dataItem, index) => (
               <Contact data={dataItem} key={dataItem.name} navigation={navigation} length={data.length - 1} index={index} />
              ))
            }
       </View>
          )
        }
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>

      <>
      <StatusBar style="auto" />
      <View style={[styles.header, { backgroundColor:letterComponent }]}>
      <TouchableOpacity style={[styles.quickSearch, { backgroundColor:searchColor }]} onPress={() => {
                 navigation.navigate("Search", {
                   contacts:contacts
                 })
               }}>
                  <AntDesign name="search1" size={21} color="#6D7F86" style={{marginTop:2}} />
                  <Text style={styles.searchText}>Search contacts</Text>
              </TouchableOpacity>
      </View>
      </>
      {letters.length > 0 && (
       <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>  
           <View style={[styles.all, { backgroundColor: bgColor, borderBottomColor:borderColor }]}>
                  <AntDesign name="team" size={21} color="#706e6e" style={{marginLeft:5}} />
                  <Text style={{
                    color:"#706e6e"
                  }}>All contacts</Text>
                  <View style={{
                    width:4,
                    height:4,
                    borderRadius:50,
                    backgroundColor:"#706e6e",
                    marginHorizontal:6
                  }}></View>
                   <Text style={{
                     color:"#706e6e"
                   }}>{contacts.length}</Text>
              </View>
          {
            letters.map((letter) => (
              <LetterComponent letter={letter} key={letter} />
            ))
          }
          <View style={{width:1, height:40}}></View>
       </ScrollView>
      )}
       <View style={styles.editView}>
             <View style={styles.edit}>
            <MaterialCommunityIcons name="account-plus" size={30} color="#eee" />
            </View>
             </View> 
    </View>
  );
}

 //018786 green

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    headline: {
      color:"#000",
      fontSize:23,
      fontWeight:"700"
    },
    header: {
      width:"100%",
      paddingVertical:12,
      paddingHorizontal:15,
      paddingTop: StatusBarProperty.currentHeight + 13
    },
    list: {
      width:"100%",
    },
    letterData: {
      width:"100%",
      justifyContent:"flex-start",
      alignItems:"flex-start",
      flexDirection:"column",
    },
    listView: {
      width:"100%",
    },
    letterHeadline: {
      fontWeight:"bold",
      fontSize:20,
      width:"100%",
      padding:5,
      marginLeft:20,
      paddingVertical:12,
      color:"#0a57cf"
    },  
    edit : {
        backgroundColor:"#0a57cf",
        padding:20,
        borderRadius:50,
        justifyContent:"center",
        alignContent:"center",
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity:  0.4,
        elevation: 5,
    },
    editView: {
        width:"100%",
        position:"absolute",
        bottom:15,
        paddingRight:10,
        justifyContent:"flex-end",
        alignItems:"flex-end"
    },
    search: {
        width:"100%",
        padding:12,
        justifyContent:"center",
        alignItems:"center",
    },
    searchText: {
        color:"#6D7F86",
        fontSize:18,
        marginLeft:6
    },
    quickSearch: {
        backgroundColor:"#eff4fb",
        width:"100%",
        paddingVertical:12,
        borderRadius:25,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignContent:"center",
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity:  0.4,
        elevation: 0,
        marginTop:5,
        paddingLeft:15
    },
    headerStyle: {
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center"
    },
    all: {
      width:"100%",
      justifyContent:"flex-start",
      alignItems:"center",
      flexDirection:"row",
      borderBottomWidth:1,
      padding:12,
      paddingTop:12,
    }
})
