import React, { useEffect, useRef, useState } from 'react';
import {View, StyleSheet, StatusBar, Text, TouchableNativeFeedback, Image, Dimensions, ScrollView, Linking, Animated, Appearance} from 'react-native';
import ContactHeader from '../components/ContactHeader';
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import * as Contacts from "expo-contacts"
import * as NavigationBar from "expo-navigation-bar"
import Ionicons from "react-native-vector-icons/Ionicons"

const ContactScreen = ({ navigation, route }) => {

    const [image, setImage] = React.useState("")
    const [emails, setEmails] = React.useState([])
    const [address, setAddress] = React.useState([])
    const [dates, setDates] = React.useState([])
    const [top, setTop] = React.useState(0)

    const [phoneNumbers, setPhoneNumbers] = React.useState([])

    let theme = Appearance.getColorScheme()
    let backColor = theme == "light" ? "#fff" : "#191919"
    let txtColor = theme == "light" ? "#000" : "#fff"
    let searchColor = theme == "light" ? "#eff4fb" : "#2e3135";
    let borderColor = theme == "light" ? "#d4d4d4" : "#525151";
    let iconColor = theme == "light" ? "#444" : "#9e9e9e"

    let scrollImg = useRef(new Animated.Value(0)).current

    useEffect(() => {
        (async () => {
           let id = route.params.data.id
            await Contacts.getContactByIdAsync(id, [
                Contacts.Fields.RawImage, 
                Contacts.Fields.Emails,
                Contacts.Fields.Addresses,
                Contacts.Fields.Birthday,
            ]).then((data) => {
                if (route.params.data.imageAvailable) {
                    setImage(data.image.uri)
                }

                if (data.emails !== undefined) {
                    setEmails(data.emails)
                }
                
                if (data.rawDates != undefined) {
                    setDates(data.rawDates)
                }

                if (data.addresses != undefined) {
                    setAddress(data.addresses)
                }
                
                let nums = []
                if (route.params.data.phoneNumbers != undefined) {
                    nums = route.params.data.phoneNumbers
    //                 nums = route.params.data.phoneNumbers.filter((number) =>{
    //                     let newNumber = number;
    //                     if (number.number.includes("+381")) {
    //                         newNumber.number = number.number.replace("+381","")
    //                     }
    // console.log(newNumber.number);
    //                     return newNumber
    //                 })
                     nums = nums.filter(
                        (thing, index, self) =>
                          index ===
                          self.findIndex(
                            (t) => t.number.replace(/\s/g, "").replace(/-/g, "") === thing.number.replace(/\s/g, "").replace(/-/g, "")
                          )
                      );
                      setPhoneNumbers(nums)
                }

            
            }).catch((error) => {
                console.log(error);
            })
           
       })()
    }, []);

    useEffect(() => {
        (async () => {
            await NavigationBar.setBackgroundColorAsync(backColor);
        })()
    }, []);
    

    const Call = () => {
        Linking.canOpenURL(`tel:${phoneNumbers[0].number}`)
        .then(supported => {
          if (!supported) {
            Alert.alert('Phone number is not available');
          } else {
            return Linking.openURL(`tel:${phoneNumbers[0].number}`);
          }
        })
        .catch(err => console.log(err));
    }

    const Avatar = () => {
        return (
            <View style={[styles.wrapperAvatar, { paddingVertical: route.params.data.imageAvailable ? 0 : 40, backgroundColor:backColor, }]}>
                {route.params.data.imageAvailable == true ? 
                  image != "" && (
                    <Animated.Image source={{uri: image}} style={styles.image(scrollImg)} />
                  )
                : 
                (
                    <View style={[styles.avatar, { backgroundColor: route.params.color }]}>
                    <Text adjustsFontSizeToFit style={styles.letter}>{route.params.data.name.charAt(0).toUpperCase()}</Text>
                </View>
                )}
            </View>
        )
    }

    const Name = () => {
        return (
           <View style={[styles.nameWrapper, { backgroundColor:backColor }]}   onLayout={event => {
            const layout = event.nativeEvent.layout;
           
            if (top == 0 && route.params.data.imageAvailable == true && layout.y > 0) {
              
                setTop(layout.y - layout.height - 15)
             
            } else  if ( route.params.data.imageAvailable == false){
                setTop(140)
            }
          }}>
               <Text adjustsFontSizeToFit style={[styles.name, { color: txtColor }]}>{route.params.data.name}</Text>
           </View>
        )
    }

    const Void = () => {
        console.log("object");
    }

    const Options = () => {
        const options = [
        {name:"Call", icon:<AntDesign name="phone" size={26} color="#0a57cf" style={{height:26}} />, shown: true, function: Call},
        {name:"Text", icon:<MaterialCommunityIcons name="message-processing-outline" size={26} color="#0a57cf" style={{height:26}} />, shown: true, function:Void},
        {name:"Video", icon:<MaterialCommunityIcons name="video-outline" size={26} color="#0a57cf" style={{height:26}} />, shown: true, function:Void},
        {name:"Gmail", icon:<MaterialCommunityIcons name="gmail" size={26} color="#0a57cf" style={{height:26}} />, shown: emails.length > 0 ? true : false, function:Void},
        {name:"Address", icon:<MaterialCommunityIcons name="directions" size={26} color="#0a57cf" style={{height:26}} />, shown: address.length > 0 ? true : false, function:Void},
    ]
        return (
            <View style={[styles.wrapperOptions, { backgroundColor:searchColor, borderTopColor:borderColor, borderBottomColor:borderColor }]} >
                 {
                     options.map((option) => (
                        <View style={[styles.option, { display: option.shown ? "flex" : "none" }]} key={option.name} >
                         <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                            <View style={styles.wrpData}>
                                {option.icon}
                                <Text  style={styles.optionName}>{option.name}</Text>
                            </View>
                          </TouchableNativeFeedback>
                       </View>
                     ))
                 }
            </View>
        )
    }

    const SocialMedias = () => {
        const items = [
            {image: require("../assets/images/viberfreecall.png"), text: "Free call", visible: phoneNumbers.length < 2 ? true : false},
            {image: require("../assets/images/viberoutcall.png"), text: "Viber Out call", visible: phoneNumbers.length < 2 ? true : false},
            {image: require("../assets/images/vibermessages.webp"), text: "Free message", visible: phoneNumbers.length < 2 ? true : false},
            {image: require("../assets/images/skype.png"), text: "Skype to Phone", visible: phoneNumbers.length < 2 ? true : false},
        ]

        const Number = ({ label, index, image }) => {
            return (
                <View style={{borderBottomWidth: index == phoneNumbers.length - 1 ? 0 : 0, borderRadius: 0, width:"100%", margin:0, padding:0, borderBottomColor:borderColor}}>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c")} style={{padding:0, width:"100%"}}>
                <View style={{flex:1, justifyContent:"space-between", flexDirection:"row", paddingHorizontal:0, paddingVertical:10}}>
                <View style={{paddingHorizontal:15}}>
                    {index == 0? (
                       <Image source={image} style={{width: 25, height:25}} /> 
                    ): (
                        <View style={{width:25, height:25}}></View>
                    )}
                </View>
                <View style={[styles.optionNumber, { width:"100%" }]}>
                   <Text style={[styles.number, { color: txtColor }]}>{label}</Text>
               </View>
               </View>
               </TouchableNativeFeedback>
            </View>
            )
        }

        return (
            <View style={[{backgroundColor:backColor, marginTop:-.5}]}>
                {
                    phoneNumbers.length < 2 ? (
                        
                            items.map((item, index) => (
                             <View style={[styles.single,  {borderBottomColor:borderColor,
                             borderBottomWidth: index == items.length - 1 ? 1 : 0}]} key={item.text}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                                <View style={styles.singleData} >
                                <Image source={item.image} style={styles.socialLogo} />
                                    <View style={[styles.boderView, { height:55, borderBottomWidth: index == items.length - 1 ? 0 : 1, borderBottomColor:borderColor }]}>
                                       <Text adjustsFontSizeToFit style={[styles.number, { color: txtColor }]}>{item.text}  ({phoneNumbers[0].number})</Text>
                                  </View>
                            </View>
                            </TouchableNativeFeedback>
                             </View>
                            ))) : (
                                <View style={{width:"100%", justifyContent:"space-between", alignItems:"flex-start"}}>
              <View style={[styles.single, {backgroundColor:backColor,  justifyContent:"flex-start", alignItems:"flex-start", width:"100%"}]}>
                       <View style={[styles.multipleWrp, { width:"100%" }]}>
                             {phoneNumbers.length > 0 ? (
                                phoneNumbers.map((number, index) => (
                                   <Number image={require("../assets/images/viberoutcall.png")} label={`Viber out call (${number.number})`} key={number.id} index={index} />
                       ))
                   ) : (
                       <Number label="No number" number="No number" key={0}/>
                   )}
                </View>
            </View>
                <View style={{width:"100%", height:1,flexDirection:"row", justifyContent:"flex-end", alignItems:"flex-end", padding:1}}>
                    <View style={{width:"90%", height:1, borderBottomColor:borderColor, borderBottomWidth:.7}}></View>    
                </View>

            <View style={[styles.single, {backgroundColor:backColor,  justifyContent:"flex-start", alignItems:"flex-start", width:"100%"}]}>
                       <View style={[styles.multipleWrp, { width:"100%" }]}>
                             {phoneNumbers.length > 0 ? (
                                phoneNumbers.map((number, index) => (
                                   <Number image={require("../assets/images/skype.png")}  label={`Skype to Phone ${number.number}`} key={number.id} index={index} />
                       ))
                   ) : (
                       <Number label="No number" number="No number" key={0}/>
                   )}
                </View>
            </View>
            <View style={{width:"100%", height:1,flexDirection:"row", justifyContent:"flex-end", alignItems:"flex-end", padding:1}}>
                    <View style={{width:"100%", height:1, borderBottomColor:borderColor, borderBottomWidth:.7}}></View>    
                </View>
                                </View>
                            )
                    
                }
            </View>
        )
    }

    const Phone = () => {

        const Number = ({ number, label, index }) => {
            return (
                <View style={{borderBottomWidth: index == phoneNumbers.length - 1 ? 0 : 0, borderRadius: 0, width:"100%", margin:0, padding:0, borderBottomColor:borderColor, marginBottom: -1}}>
<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c")} style={{padding:0, width:"100%"}}>
<View style={{flex:1, justifyContent:"space-between", flexDirection:"row", paddingHorizontal:0, paddingVertical:10}}>
<View style={{paddingVertical:5}}>
    {index == 0? (
         <AntDesign name="phone" size={26} color={iconColor} style={{height:26, marginLeft:15}} /> 
    ): (
        <View style={{width:30, height:30}}></View>
    )}
</View>
<View style={ { flexDirection:"row", justifyContent:"space-between", paddingHorizontal:10, width:"87%"}}>
<View style={{justifyContent:"flex-start", alignItems:"flex-start", width:"80%"}}>
                   <Text style={[styles.number, { color: txtColor }]}>{number}</Text>
                   <Text style={styles.mobile}>{label.charAt(0).toUpperCase() + label.substring(1)}</Text>
               </View>

               <View style={{padding:0}}>
               <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                  <View style={{padding:10}}>
                     <MaterialCommunityIcons name="message-processing-outline" size={26} color="#0a57cf" style={{height:26}} />
                  </View>
               </TouchableNativeFeedback>
               </View>
</View>
</View>
</TouchableNativeFeedback>
</View>
            )
        }

        return (
            <View style={[ {backgroundColor:backColor,  justifyContent:"flex-start", alignItems:"flex-start", width:"100%"}]}>
                <View style={{width:"100%", justifyContent:"flex-start", alignItems:"flex-start"}}>
                   {phoneNumbers.length > 0 ? (
                       phoneNumbers.map((number, index) => (
                           <Number number={number.number} label={number.label} key={number.id} index={index} />
                       ))
                   ) : (
                       <Number label="No number" number="No number" key={0}/>
                   )}
                </View>
                <View style={{width:"100%", height:1,flexDirection:"row", justifyContent:"flex-end", alignItems:"flex-end", padding:1}}>
                    <View style={{width:"90%", height:1, borderBottomColor:borderColor, borderBottomWidth:1 }}></View>    
                </View>
            </View>
        )
    }

    const Addresses = () => {

        const Address = ({ address, label, index }) => {
            return (
                <View style={{borderBottomWidth: index == phoneNumbers.length - 1 ? 0 : 0, borderRadius: 0, width:"100%", margin:0, padding:0, borderBottomColor:borderColor}}>
<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c")} style={{padding:0, width:"100%"}}>
<View style={{flex:1, justifyContent:"space-between", flexDirection:"row", paddingHorizontal:0, paddingVertical:10}}>
<View style={{paddingVertical:5}}>
    {index == 0? (
         <Ionicons name="location" size={26} color={iconColor} style={{height:26, marginLeft:15}} /> 
    ): (
        <View style={{width:30, height:30}}></View>
    )}
</View>
<View style={ { flexDirection:"row", justifyContent:"space-between", paddingHorizontal:10, width:"87%", alignItems:"center"}}>
<View style={{justifyContent:"flex-start", alignItems:"flex-start", width:"80%"}}>
                   <Text style={{fontSize:17, color: txtColor}} adjustsFontSizeToFit>{address}</Text>
                   <Text style={styles.mobile}>{label.charAt(0).toUpperCase() + label.substring(1)}</Text>
               </View>

               <View style={{padding:0}}>
               <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                  <View style={{padding:10}}>
                     <MaterialCommunityIcons name="directions" size={26} color="#0a57cf" style={{height:26}} />
                  </View>
               </TouchableNativeFeedback>
               </View>
</View>
</View>
</TouchableNativeFeedback>
</View>
            )
        }

        return (
            <View style={[ {backgroundColor:backColor,  justifyContent:"flex-start", alignItems:"flex-start", width:"100%"}]}>
                <View style={{width:"100%", justifyContent:"flex-start", alignItems:"flex-start"}}>
                   {address.length > 0 ? (
                       address.map((adress, index) => (
                           <Address address={adress.formattedAddress} label={adress.label} key={adress.id} index={index} />
                       ))
                   ) : (
                       <Address label="No address" number="No address" key={0}/>
                   )}
                </View>
                <View style={{width:"100%", height:1,flexDirection:"row", justifyContent:"flex-end", alignItems:"flex-end", padding:1}}>
                    <View style={{width:"90%", height:1, borderBottomColor:borderColor, borderBottomWidth:.7}}></View>    
                </View>
            </View>
        )
    }

    const Email = () => {
     
        const Number = ({ number, label, index }) => {
            return (
                <View style={{borderBottomWidth: index == phoneNumbers.length - 1 ? 0 : 0, borderRadius: 0, width:"100%", margin:0, padding:0, borderBottomColor:borderColor}}>
<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c")} style={{padding:0, width:"100%"}}>
<View style={{flex:1, justifyContent:"space-between", flexDirection:"row", paddingHorizontal:0, paddingVertical:10}}>
<View style={{paddingVertical:5}}>
    {index == 0? (
          <MaterialCommunityIcons name="gmail" size={26} color={iconColor} style={{height:26, marginLeft:15}} />
    ): (
        <View style={{width:30, height:30}}></View>
    )}
</View>
<View style={ { flexDirection:"row", justifyContent:"space-between", paddingHorizontal:10, width:"87%"}}>
<View style={{justifyContent:"flex-start", alignItems:"flex-start", width:"80%"}}>
                   <Text style={[styles.number, { color: txtColor }]}>{number}</Text>
                   <Text style={styles.mobile}>{label.charAt(0).toUpperCase() + label.substring(1)}</Text>
               </View>

</View>
</View>
</TouchableNativeFeedback>
</View>
            )
        }

        return (
            <View style={[ {backgroundColor:backColor,  justifyContent:"flex-start", alignItems:"flex-start", width:"100%"}]}>
                <View style={{width:"100%", justifyContent:"flex-start", alignItems:"flex-start"}}>
                   {emails.length > 0 ? (
                       emails.map((email, index) => (
                           <Number number={email.email} label={email.label} key={email.id} index={index} />
                       ))
                   ) : (
                       <Number label="No email" number="No email" key={0} index={0}/>
                   )}
                </View>
                <View style={{width:"100%", height:1,flexDirection:"row", justifyContent:"flex-end", alignItems:"flex-end", padding:1}}>
                    <View style={{width:"90%", height:1, borderBottomColor:borderColor, borderBottomWidth:1 }}></View>    
                </View>
            </View>
        )
    }

    const About = () => {
        const Component = ({ data, index  }) => {
            let date = data.value.split("-");
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            let year = date[0] 
            let month = months[Number(date[1]) - 1]
            let day = date[2]
            
            return (
                <View style={[styles.single, { backgroundColor:backColor}]}>
                {index == 0 ? (
                    <MaterialCommunityIcons name="calendar" size={26} color={iconColor} style={{height:26, marginLeft:15}} />
                ): (
                    <View style={{width:30, height:30}}></View>
                )}
                 <View style={[styles.boderView, { paddingVertical: 5, borderTopWidth: index == 0 ? 1 : 0, borderTopColor:borderColor, borderBottomWidth:0  }]}>
                 <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}>
                 <View style={styles.optionNumber}>
                    <Text adjustsFontSizeToFit style={[styles.number, { color:txtColor }]}>{day} {month} {year}</Text>
                    <Text style={styles.mobile}>{data.type.charAt(0).toUpperCase() + data.type.substring(1)}</Text>
                </View>
                </TouchableNativeFeedback>            
                 </View>
            </View>
            )
        }

        return (
            <View style={{width:"100%", justifyContent:"flex-start", alignItems:"flex-start", paddingVertical:10, borderBottomColor:borderColor, borderBottomWidth:1, paddingBottom:0,
            display: dates.length > 0 ? "flex" : "none", backgroundColor:backColor}}>
                <Text style={{color:txtColor, marginLeft:15, marginVertical:5}}>About {route.params.data.name}</Text>
                <View style={{width:"100%", marginTop:10, justifyContent:"flex-start", alignItems:"flex-start", paddingVertical:0}}>
                    {
                        dates.length > 0 && (
                            dates.map((date, index) => (
                                <Component data={date} key={index} index={index} />
                            ))
                        )
                    }
                </View>
            </View>
        )
    }
    

    //old status bar color #016160

    return (
        <View style={[styles.container, { backgroundColor:backColor }]}>
            {/* <StatusBar barStyle={theme == "light" ? "dark-content" : "light-content"} backgroundColor={backColor} /> */}
            <ContactHeader navigation={navigation} />
            <Animated.ScrollView showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[2]}
             style={{backgroundColor:backColor}}
            onScroll={
                Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollImg}}}], {useNativeDriver: true}
                )
            }
            >
            <Avatar />
             <Name />
        
             <Options />
            {
                phoneNumbers.length > 0 && (
                 
                         <Phone />
                  
                )
            }        
               <Email />
               {
                 address.length > 0 && (
                     <Addresses />
                 )
             }
             {
                phoneNumbers.length > 0 && (
                    <SocialMedias />
                )
            }
            <About />
            <View style={{width:"100%", height: phoneNumbers.length > 4 ? 120 : top, backgroundColor:backColor}}></View>
            </Animated.ScrollView>
             <View style={styles.editView}>
             <View style={styles.edit} onStartShouldSetResponder={() => {
                 navigation.navigate("Edit", {
                    data: route.params.data,
                    emails: emails,
                    image: image,
                    address: address,
                    dates: dates,
                    backColor: backColor, 
                    txtColor: txtColor,
                    searchColor: searchColor, 
                    borderColor: borderColor, 
                    iconColor: iconColor,
                    phoneNumber: phoneNumbers,
                    color: route.params.color
                 })
             }}>
            <MaterialCommunityIcons name="account-edit-outline" size={32} color="#eee" />
            </View>
             </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:"flex-start",

    },
    avatar: {
        width: 120,
        height:120,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:100,
    },
    letter: {
        fontSize:70,
        color:"#eee",
        textAlign:"center",
    },
    wrapperAvatar: {
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
    },
    nameWrapper: {
        width:"100%",
        justifyContent:"flex-start",
        paddingHorizontal:15,
        paddingVertical:15
    },
    name: {
        fontSize:25,
        marginBottom:-1
    },
    optionName: {
        color:"#0a57cf",
        fontSize:15,
        marginTop:3,
        fontWeight:"900",
    },
    option: {
        justifyContent:"center",
        alignItems:"center",
    },
    wrapperOptions: {
        justifyContent:"space-around",
        alignItems:"center",
        flexDirection:"row",
        paddingHorizontal:15,
        borderTopWidth:1,
        borderBottomWidth:1,
        paddingVertical:8
    },
    wrpData: {
        justifyContent:"center",
        alignItems:"center",
        padding:6
    },
    single: {
        width:"100%",
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:"row",
    },
    singleData: {
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:"row",
        height:55,
        width:"100%",
        paddingLeft:15
    },
    boderView: {
        width:"90%",
        borderBottomWidth:1,
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:10,
        flexDirection:"row"
    },
    multipleWrp: {
        width:"100%",
        justifyContent:"flex-start",
        alignItems:"flex-start"
    },
    number: {
        fontSize:17,
    },
    mobile: {
        fontSize:16,
        color:"#8a8a8a",
        marginTop:0
    },
    optionNumber: {
        justifyContent:"flex-start",
        alignItems:"flex-start",
        padding:5
    },
    image: scrollImg => ({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").width,
        transform: [{
            translateY: scrollImg.interpolate({
                inputRange: [-Dimensions.get("screen").width, 0,  Dimensions.get("screen").width,  Dimensions.get("screen").width + 1],
                outputRange: [ Dimensions.get("screen").width / 2, 0, Dimensions.get("screen").width * 0.75, Dimensions.get("screen").width * 0.75],
                extrapolate: 'clamp',
            })
        },{
            scale: scrollImg.interpolate({
                inputRange: [- Dimensions.get("screen").width, 0,  Dimensions.get("screen").width,  Dimensions.get("screen").width + 1],
                outputRange: [2, 1, 2, 2],
                extrapolate: 'clamp',
            })
        }]
    }),
    socialLogo: {
        width: 20,
        height:20,
        borderRadius:16
    },
    edit : {
        backgroundColor:"#0a57cf",
        padding:15,
        borderRadius:15,
        justifyContent:"center",
        alignContent:"center",
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity:  0.4,
        elevation: 8,
    },
    editView: {
        width:"100%",
        position:"absolute",
        bottom:20,
        paddingRight:20,
        justifyContent:"flex-end",
        alignItems:"flex-end"
    }
})

export default ContactScreen;
