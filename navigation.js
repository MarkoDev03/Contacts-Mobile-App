import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Home from "./screens/Home"
import ContactScreen from "./screens/ContactScreen"
import Footer from "./components/Footer"
import Search from "./screens/Search"
import EditScreen from "./screens/EditScreen"

import { Appearance } from "react-native"

const RootNavigation = () => {
  const Stack = createStackNavigator()
  const Tab = createBottomTabNavigator()

  let theme = Appearance.getColorScheme()
  let backColor = theme == "light" ? "#fff" : "#191919"

  const BottomTabNavigation = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown:false,
          bottomTab: false,
          tabBarStyle: {
            display:"none"
          }
        }}
        tabBar={({ navigation }) => <Footer navigation={navigation} />}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={Home} />
      </Tab.Navigator>
    )
  }

  const screenOptions = {
      headerShown: false,
      headerMode:"none",
      mode:"modal",
      // cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
      gestureEnabled: true
  }

  const MyTheme = {
    colors: {
      background: backColor
    },
  };

  return (
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={screenOptions} initialRouteName="HomeScreen" >
           <Stack.Screen name="HomeScreen" component={BottomTabNavigation} />
           <Stack.Screen name="Contact" component={ContactScreen} />
           <Stack.Screen name="Edit" component={EditScreen} />
           <Stack.Screen name="Search" component={Search} options={{cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid}} />
        </Stack.Navigator>
      </NavigationContainer>
  )
}

export default RootNavigation