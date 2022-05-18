import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  Appearance,
  Text,
  Image,
  TextInput,
  Dimensions,
  Animated,
  Easing,
  StatusBar as StatusBarProperty
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from 'expo-status-bar';

const EditScreen = ({ navigation, route }) => {
  let {
    data,
    emails,
    image,
    address,
    dates,
    backColor,
    txtColor,
    searchColor,
    borderColor,
    iconColor,
    phoneNumber,
    color,
  } = route.params;

  let theme = Appearance.getColorScheme();
  let bgColor = theme == "light" ? "#fff" : "#191919";
  let iconColor2 = theme == "light" ? "#000" : "#fff";

  const [phoneNumbers, setPhoneNumbers] = useState(phoneNumber)
  const [emailAddresses, setEmailAdresses] = useState(emails)
  const [addresses, setAddresses] = useState(address)
  const [showMore, setShowMore] = useState(false)


  let scrollAnimation = useRef(new Animated.Value(0)).current
  let avatarAnimated = useRef(new Animated.Value(0)).current

  useEffect(() => {
    try {
      setPhoneNumbers([...phoneNumbers, { number: "", label:"" }])
      setEmailAdresses([...emailAddresses, { email: "", label:"" }])
    } catch(error) {
      console.log(error)
    }

    Animated.timing(
      avatarAnimated, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300,
      }
    ).start()
  }, [])

  const Header = () => {
    return (
      <>
       <StatusBar barStyle={theme == "light" ? "dark-content" : "light-content"}  style="auto"   />
      <Animated.View style={[styles.header, { backgroundColor: scrollAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [bgColor, searchColor]
      }), paddingTop: StatusBarProperty.currentHeight + 17 }]}>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AntDesign
            name="arrowleft"
            size={32}
            color={iconColor2}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={{ fontSize: 20, color: iconColor2, marginLeft: 7 }}>
            Edit Contact
          </Text>
        </View>
        <View style={styles.icons}>
          <View
            style={{
              borderRadius: 50,
              padding: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 7,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "#0a57cf",
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
            </View>
          </View>
          <View
            style={{
              borderRadius: 50,
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple("#5c5e5c", true)}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo
                  name="dots-three-vertical"
                  size={25}
                  color={iconColor2}
                />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Animated.View>
      </>
    );
  };

  const ImageComponent = () => {
    return (
      <View style={[styles.wrapperAvatar, { backgroundColor: backColor }]}>
        {data.imageAvailable == true ? (
          image != "" && <Animated.Image source={{ uri: image }} style={[styles.image, {
            transform: [
              {scale: avatarAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })}
            ]
          }]} />
        ) : (
          <Animated.View style={[styles.image, { backgroundColor: color, transform: [
            {scale: avatarAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })}
          ] }]}>
            <Text adjustsFontSizeToFit style={styles.letter}>
              {data.name.charAt(0).toUpperCase()}
            </Text>
          </Animated.View>
        )}
        <Text style={{color: txtColor, fontSize: 20, marginTop:10}}>{data.name}</Text>
      </View>
    );
  };

  const Field = ({ placeholder, value, icon, showIcon, closeShown }) => {
    const [text, setText] = React.useState(value ? value : "");
    const [color, setColor] = React.useState(borderColor);
    const [border, setBorder] = React.useState(2);

    let textAnimation = useRef(new Animated.Value(0)).current

    useEffect(() => {
      if (text.length < 1) {
        setColor(borderColor);
        setBorder(2);
        Animated.timing(
          textAnimation, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250
          }
        ).start()
      } else {
        Animated.timing(
          textAnimation, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250
          }
        ).start()
      }
    }, [text]);

    const Active = () => {
      setColor("#abd5f7");
    };

    return (
      <View style={styles.field}>
        <View
          style={{
            width: 50,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showIcon ? icon : <></>}
        </View>
        <Animated.Text style={{color: theme == "light" ? "#0a57cf" : "#abd5f7", position:"absolute", left: 75, top:textAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, -13]
          }), backgroundColor: bgColor, padding:3, zIndex:1, fontSize: textAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 15]
          })}}>{placeholder}</Animated.Text>
        <TextInput
          onChangeText={(text) => {
            setText(text);
            text.length > 0 ? Active() : setColor(borderColor);
          }}
          style={[
            styles.input,
            { borderColor: color, color: iconColor2, borderWidth: border },
          ]}
          placeholderTextColor={iconColor}
          value={text}
        />
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(
            closeShown ? "#5c5e5c" : "transparent",
            true
          )}
        >
          <View
            style={{
              width: 50,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {closeShown && (
              <MaterialCommunityIcons
                name="window-close"
                size={25}
                color="#DB4437"
              />
            )}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };

  const PhonesAndLabels = ({
    placeholder,
    value,
    icon,
    showIcon,
    closeShown,
    labels,
    labelValue,
    index,
    setFunction,
    array,
    type
  }) => {
    const [text, setText] = React.useState(value ? value : "");
    const [text2, setText2] = React.useState(labelValue ? labelValue : "");
    const [color2, setColor2] = React.useState(borderColor);
    const [color, setColor] = React.useState(borderColor);
    const [border, setBorder] = React.useState(2);
    const [isOpen, setIsOpen] = React.useState(0);

    let textAnimation = useRef(new Animated.Value(0)).current;
    let animate = useRef(new Animated.Value(0)).current;
    let animateHeight = useRef(new Animated.Value(0)).current;
    let animateHeightDeleting = useRef(new Animated.Value(0)).current;

    let getHeight = (labels.length * 48) 

    useEffect(() => {
      if (text.length < 1) {
        setColor(borderColor);
        setBorder(2);
        Animated.timing(
          textAnimation, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250
          }
        ).start()
      } else {
        Animated.timing(
          textAnimation, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250
          }
        ).start()
      }
    }, [text]);

    const Active = () => {
      setColor("#abd5f7");
    };

    const openBox = () => {
      setIsOpen(1)
      Animated.timing(animate, {
        duration: 200,
        delay: 20,
        useNativeDriver: false,
        toValue: 1,
        easing: Easing.linear
      }).start();

      Animated.timing(animateHeight, {
        duration: 200,
        useNativeDriver: false,
        toValue: getHeight,
        easing: Easing.linear
      }).start();
    };

    const closebox = () => {

      Animated.timing(animate, {
        duration: 200,
        useNativeDriver: false,
        toValue: 0,
      }).start();

      Animated.timing(animateHeight, {
        duration: 200,
        useNativeDriver: false,
        toValue: 0,
      }).start();

      setTimeout(() => {
        setIsOpen(0)
      }, 200);
    };

    const closeText = () => {
      setColor2("#abd5f7"); 
      closebox();
    }

   const  deleteHandler = () => {
     try { 
       Animated.timing(
        animateHeightDeleting, {
          useNativeDriver: true,
          toValue: 1,
          duration: 250,
          easing: Easing.linear
        }
       ).start()

       setTimeout(() => {
        let phoneNumbers_ = array.splice(index - 1, index)
        setFunction(phoneNumbers_)
       }, 250);
     } catch(error) {
       console.log(error)
     }
   }

   const inputHandler = () => {
        try {
        let data = [...array]
       

        if (type == "address") {
          data[index].formattedAddress = text2;
          data[index].number = text;
        } if (type == "email") {
          data[index].label = text2;
          data[index].email = text;
        }  else {
          data[index].label = text2;
          data[index].number = text;
      
        }

        } catch(error) {
          console.log(error)
        }
       // setPhoneNumbers(numbers)
   }


    return (
      <Animated.View style={[styles.wrapper, { position:"relative", zIndex:index, 
      transform: [
        {
          scale: animateHeightDeleting.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
           }) 
        },
      ]}]}>
        <View style={styles.field}>
          <View
            style={{
              width: 50,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {showIcon ? icon : <></>}
          </View>
          <Animated.Text style={{color: theme == "light" ? "#0a57cf" : "#abd5f7", position:"absolute", left: 75, top:textAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, -13]
          }), backgroundColor: bgColor, padding:3, zIndex:99, fontSize: textAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 15]
          })}}>{placeholder}</Animated.Text>
          <TextInput
            onChangeText={(text) => {
              setText(text);
              inputHandler()
              text.length > 0 ? Active() : setColor(borderColor);
            }}
           
            style={[
              styles.input,
              { borderColor: color, color: iconColor2, borderWidth: border },
            ]}
            placeholderTextColor={iconColor}
            value={text}
           
          />
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              closeShown ? "#5c5e5c" : "transparent",
              true
            )}
            onPress={() => {
             if (closeShown) {
              deleteHandler()
             }
            }}
          >
            <View
              style={{
                width: 50,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              
               {closeShown && (
                  <MaterialCommunityIcons
                  name="window-close"
                  size={25}
                  color="#DB4437"
                  
                />
               )}
             
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={{ width: 180, marginLeft: 60, marginTop: 15 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{position:"absolute", top:-10, left: 15, color: txtColor, padding:3, backgroundColor: bgColor, fontSize:15, zIndex:99}}>Label</Text>
            <TextInput
              onChangeText={(text) => {
                setText2(text);
                inputHandler();
                text.length > 0 ? closeText() : setColor2(borderColor);
              }}
              placeholder={placeholder}
              style={[
                styles.input,
                {
                  borderColor: color2,
                  color: iconColor2,
                  borderWidth: border,
                  width: "100%",
                },
              ]}
              placeholderTextColor={iconColor}
              value={text2}
             
            />
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(
               "#5c5e5c",
                true
              )}
              onPress={() => {
                    if (isOpen == 1) {
                        closebox()
                    } else {
                        openBox();
                    }
            }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft:10
                }}
              >
                <MaterialCommunityIcons
                  name={isOpen == 1 ? "chevron-up" : "chevron-down"}
                  size={35}
                  color={iconColor2}
                />
              </View>
            </TouchableNativeFeedback>
          </View>
          <Animated.View
            style={[
              styles.lista,
              {
                color: iconColor2,
                borderWidth: 0,
                width: "100%",
                backgroundColor: searchColor,
               height:  animate.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getHeight],
              }),
                marginTop: animate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
                transform: [
                  {
                    translateX: animate.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-65, 0],
                    })
                  },
                  {
                    scale: animate.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }
                ],
                opacity: animate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ]}
          >
            {labels.map((label, index) => (
              <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(
               "#5c5e5c",
                false
              )}
              onPress={() => {
                closebox();
                setText2(label)
              }}
              key={index}
            >
              <View style={styles.listLabel}>
                <Text style={[styles.label, { color: theme == "light" ? "#0a57cf" : txtColor }]}>{label}</Text>
              </View>
              </TouchableNativeFeedback>
            ))}
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const NameFields = () => {
    return (
      <View style={styles.fieldWrp}>
        <Field
          showIcon={true}
          icon={<AntDesign name="user" size={25} color={iconColor2} />}
          placeholder="First name"
          value={data.name}
          key={0}
        />
        <Field showIcon={false} placeholder="Surename" value="" key={1} />
        {
         showMore && (
          <>
          <Field showIcon={false} placeholder="Middle name" value="" key={2} />
           <Field showIcon={false} placeholder="Name prefix" value="" key={3} />
           <Field showIcon={false} placeholder="Name suffix" value="" key={4} />
       </>
         )
        }
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
             "#5c5e5c" 
            )}
            onPress={() => {
             if (showMore == true) {
              setShowMore(false)
             } else {
              setShowMore(true)
             }
            }}
          >
       <View style={{ paddingVertical: 10, paddingHorizontal:5, width:200, justifyContent:"flex-start", alignItems:"flex-start", marginLeft: -60,}}>
         <Text style={{color: theme == "light" ? "#0a57cf" : "#abd5f7", fontSize: 20}} >{showMore == true ? "- Hide fields" : "+ Show more fields"}</Text>
       </View>
       </TouchableNativeFeedback>
      </View>
    );
  };

  const labels = ["No Label", "Home", "Work", "Other", "Custom", "Mobile", "Pager"];

  return (
    <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]} style={[styles.container ]} onScroll={(e) => {
        if (e.nativeEvent.contentOffset.y > 20) {
          Animated.timing(
            scrollAnimation, {
              duration: 180,
              toValue: 1,
              useNativeDriver: false,
            }
          ).start()
        } else {
          Animated.timing(
            scrollAnimation, {
              duration: 180,
              toValue: 0,
              useNativeDriver: false,
            }
          ).start()
        }
    }}>
     
      <Header />
      <View style={[styles.saveLocation, { backgroundColor: searchColor }]}>
        <MaterialCommunityIcons name="content-save" color="#0a57cf" size={25} style={{marginRight: 5}} />
         <Text style={{fontSize: 15, color: txtColor}}>Saved to device storage and SIM card</Text>
      </View>
      <ImageComponent />
      <NameFields />
      <Field
        showIcon={true}
        icon={
          <MaterialCommunityIcons
            name="office-building"
            size={25}
            color={iconColor2}
          />
        }
        placeholder="Company"
        value=""
        key={4}
        closeShown={true}
      />
      {
        phoneNumbers.length > 0 && (
          phoneNumbers.map((number, index) => (
            <PhonesAndLabels setFunction={setPhoneNumbers} array={phoneNumbers} showIcon={index == 0 ? true : false} labelValue={number.label} icon={<MaterialCommunityIcons name="phone" size={25} color={iconColor2} /> } placeholder="Phone" index={index} value={number.number} key={index} closeShown={true} labels={labels}/>
          ))
        )
      }
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
             "#5c5e5c" , false
            )}
            onPress={() => {
              try {
                setPhoneNumbers([...phoneNumbers, { number: "", label:"" }])
              } catch(error) {
                console.log(error)
              }
            }}
          >
       <View style={{marginLeft: 60, paddingVertical: 10, paddingHorizontal:5, maxWidth:250 }}>
         <Text style={{color: theme == "light" ? "#0a57cf" : "#abd5f7", fontSize: 20}} > + Add new phone number</Text>
       </View>
       </TouchableNativeFeedback>

       {
        emailAddresses.length > 0 && (
          emailAddresses.map((email, index) => (
            <PhonesAndLabels type="email" setFunction={setEmailAdresses} array={emailAddresses} showIcon={index == 0 ? true : false} labelValue={email.label} icon={<MaterialCommunityIcons name="email" size={25} color={iconColor2} /> } placeholder="Email" index={index} value={email.email} key={index} closeShown={true} labels={labels}/>
          ))
        )
      }

<TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
             "#5c5e5c" 
            )}
            onPress={() => {
             try {
              setEmailAdresses([...emailAddresses, { email: "", label:"" }])
             } catch(error) {
              setEmailAdresses([...emailAddresses, { email: "", label:"" }])
             }
            }}
          >      
       <View style={{marginLeft: 60, paddingVertical: 10, paddingHorizontal:5, maxWidth:250}}>
         <Text style={{color: theme == "light" ? "#0a57cf" : "#abd5f7", fontSize: 20}} > + Add new email address</Text>
       </View>
       </TouchableNativeFeedback>

       {
        addresses.length > 0 && (
          addresses.map((address, index) => (
            <PhonesAndLabels type="address" more={true}  setFunction={setEmailAdresses} array={addresses} showIcon={index == 0 ? true : false} labelValue={address.label} icon={<Entypo name="location-pin" size={25} color={iconColor2} /> } placeholder="Address" index={index} value={address.formattedAddress} key={index} closeShown={index  > 0 ? true : false} labels={labels}/>
          ))
        )
      }

<TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
             "#5c5e5c" 
            )}
            onPress={() => {
             try {
              setAddresses([...addresses, { formattedAddress: "", label:"" }])
             } catch(error) {
              setAddresses([...addresses, { formattedAddress: "", label:"" }])
             }
            }}
          >      
       <View style={{marginLeft: 60, paddingVertical: 10, paddingHorizontal:5, width:200}}>
         <Text style={{color: theme == "light" ? "#0a57cf" : "#abd5f7", fontSize: 20}} > + Add new address</Text>
       </View>
       </TouchableNativeFeedback>

     <View style={{width:"100%", justifyContent:"center", alignItems:"center", padding:2}}>
     <View style={{backgroundColor:"#DB4437", borderRadius: 25, width: 170, height: 55,marginVertical:20, justifyContent:"center", alignItems:"center", marginTop: 40}}>
         <Text style={{color: txtColor, fontSize: 25, lineHeight: 55, textAlign:"center"}}>Delete</Text>
      </View>
     </View>
      <View style={{ width: 1, height: 50 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    paddingVertical:17,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapperAvatar: {
    width: "100%",
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  letter: {
    fontSize: 50,
    color: "#eee",
    textAlign: "center",
  },
  fieldWrp: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    width: Dimensions.get("screen").width - 120,
    paddingVertical: 13,
    paddingHorizontal: 13,
    fontSize: 16,
    borderRadius: 5,
  },
  field: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 6,
  },
  wrapper: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 19,
    lineHeight: 48,
    textAlign:"center"
  },
  listLabel: {
    width: "100%",
    height:48,
    paddingHorizontal: 8,
    justifyContent:"flex-start",
    alignItems:"flex-start"
  },
  lista: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
    borderRadius:6
  },
  saveLocation: {
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:14,
    flexDirection:"row"
  }
});

export default EditScreen;
