import React, {useEffect, useState}  from 'react';
import {View, StyleSheet, Text, TouchableNativeFeedback, Image, Dimensions, Appearance} from 'react-native';

const Contact = ({ data, navigation, index, length }) => {

    let theme = Appearance.getColorScheme()
    let bgColor = theme == "light" ? "#fff" : "#1d1f1d";
    let txtColor = theme == "light" ? "#000" : "#fff";
    let borderColor = theme == "light" ? "#d4d4d4" : "#525151";
    
    const colors = ["#FB8C00", "#FFE047", "#1EA362", "#DD4B3E", "#E01E5A", "#0F9D58", "#4285F4", "#ECB22E", "#4A154B", "#1BAFD0", "#36C5F0", "#6967CE"];
    const [color, setColor] = useState(colors[0])  

    useEffect(() => {
        setColor(colors[Math.floor(Math.random() * colors.length)])
    }, [])

    return (
        <View style={[styles.wrapper, { 
            borderTopLeftRadius:index == 0 ? 30 : 0, 
            borderTopRightRadius: index == 0 ? 30 : 0,
            borderBottomRightRadius: index == length ? 30 : 0,
            borderBottomLeftRadius: index == length ? 30 : 0,
            backgroundColor:bgColor
             }]} > 
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)} onPress={() => {navigation.navigate("Contact", {
            data: data,
            color: color
        })}}>
          <View style={[styles.contact, { backgroundColor: bgColor }]}>
          {
              data.imageAvailable ? (
                  <Image source={{uri: data.image.uri}} style={styles.relImg} />
              ) : (
                            <View style={[styles.image, { backgroundColor:color}]}>
                <Text adjustsFontSizeToFit style={styles.firstLetter}>{data.firstName.charAt(0).toUpperCase()}</Text>
             </View>

              )
          }

             <View style={[styles.borderView, {
                         borderBottomWidth: index != length ? .7 : 0,
                         borderBottomColor:borderColor
             }]}>
               <Text adjustsFontSizeToFit style={[styles.title, { color: txtColor }]}>{data.name}</Text>
             </View>

          </View>
        </TouchableNativeFeedback>
        </View>
    );
}
//191919 - dark
const styles = StyleSheet.create({
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
        height:65,
        padding:0,
        margin:0
    }
})

export default Contact;
