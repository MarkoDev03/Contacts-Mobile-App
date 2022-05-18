import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback, Text, Appearance } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import * as NavigationBar from "expo-navigation-bar"

import { useNavigationState } from "@react-navigation/native"

//home - Ionicons 
//home-outline - Ionicons

//settings - MaterialIcons
//setting - AntDesign

//staro - AntDesign
//star - AntDesign

const Footer = ({ navigation }) => {

    const routes = useNavigationState(state => state.routes);
    const currentRoute = routes[routes.length -1].name;

    let theme = Appearance.getColorScheme()

    let bgColor = theme == "light" ? "#eff4fb" : "#303238";

    if (currentRoute == "HomeScreen") {
        NavigationBar.setBackgroundColorAsync(bgColor);
    }
    
    const icons = [
        {active: <Ionicons name={currentRoute == "HomeScreen" ? "home" : "home-outline"} size={24} color="#6D7F86" />, text: "Home", route:"HomeScreen"},
        {active: <AntDesign name='staro' size={24} color="#6D7F86" />, text: "Favorites"},
        {active: <AntDesign name='setting' size={24} color="#6D7F86" />, text:"Settings"},
    ]
    return (
        <View style={[styles.footer, { backgroundColor:bgColor }]}>
            {
                icons.map((icon, index) => (
                    <View style={{borderRadius:50, width:"33%", height:50, justifyContent:"center", alignItems:"center"}} key={index}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#abd5f7", true)}>
                       <View style={{width:"100%", height:50, borderRadius:50, justifyContent:"center", alignItems:"center"}}>
                            <View style={[styles.tab, { backgroundColor: icon.route == currentRoute ? "#AADAFF" : "transparent"}]}>
                               {icon.active}
                            </View>
                            <Text style={{marginTop:3, color: "#6D7F86", fontSize:14}} adjustsFontSizeToFit>{icon.text}</Text>
                         </View>
                     </TouchableNativeFeedback>
                   </View>
                ))
            }
        </View>
    );
}
//eff4fb
const styles = StyleSheet.create({
    footer: {
        paddingHorizontal:1,
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%",
        paddingVertical:10,
        flexDirection:"row",
        borderTopColor:"#fff",
        borderTopWidth:0
    },
    tab: {
       paddingHorizontal:20,
       paddingVertical:5,
       borderRadius:30,
    }
})

export default Footer;
