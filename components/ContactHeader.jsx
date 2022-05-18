import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback, Appearance, StatusBar as StatusBarProperty} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import { StatusBar } from 'expo-status-bar';

const ContactHeader = ({ navigation }) => {

  let theme = Appearance.getColorScheme()
  let bgColor = theme == "light" ? "#fff" : "#191919"
  let iconColor = theme == "light" ?  "#000" : "#fff";
  
    return (
      <>
      <StatusBar style='auto' />
        <View style={[styles.header, { backgroundColor:bgColor }]}>
             <AntDesign name="arrowleft" size={32} color={iconColor} onPress={() => {navigation.goBack()}} />  
          <View style={styles.icons}>
                <View style={{borderRadius:50, width:40, height:40, justifyContent:"center", alignItems:"center"}}>
                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                     <View style={{width:40, height:40, borderRadius:50, justifyContent:"center", alignItems:"center"}}>
                       <AntDesign name="staro" size={28} color={iconColor} />
                    </View>
                   </TouchableNativeFeedback>
                 </View>
                 <View style={{borderRadius:50, width:40, height:40, justifyContent:"center", alignItems:"center", marginLeft:15}}>
                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                     <View style={{width:40, height:40, borderRadius:50, justifyContent:"center", alignItems:"center"}}>
                       <Entypo name="dots-three-vertical" size={28} color={iconColor}  />
                       </View>
                   </TouchableNativeFeedback>
                 </View>
          </View>
      </View>
      </>
    );
}
//f0f0f0
const styles = StyleSheet.create({
    header: {
            width:"100%",
            paddingVertical:9,
            paddingHorizontal:10,
            justifyContent:"space-between",
            alignItems:"center",
            paddingHorizontal:10,
            flexDirection:"row",
            paddingTop: StatusBarProperty.currentHeight + 10
      },
      icons: {
          flexDirection:"row",
          justifyContent:"center",
          alignItems:"center"   
      }
})

export default ContactHeader;
