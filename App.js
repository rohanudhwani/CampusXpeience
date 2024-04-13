import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MenuScreen, SignUpScreen, LoginScreen, EditMenuScreen, RestaurantsScreen, RestaurantDetailsScreen, LaundryScreen, LaundryDetailsScreen, FTPScreen, ServicesScreen, UserScreen, BusScreen, AboutMeScreen, StudentBazaarScreen, StudentBazaarDetailsScreen, AddBazaarScreen, FortinetLoginScreen } from './screens'
import BottomTab from './component/BottomTab';
import { ref, onValue, set } from 'firebase/database';
import { auth, db } from './firebase';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign, Ionicons, FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

const userRefMenu = ref(db, '/menu');
const userRefDishes = ref(db, '/dishes');
const userRefUpdates = ref(db, '/updates');
const userRefRestaurants = ref(db, '/restaurants');
const userRefLaundry = ref(db, '/laundry');
const userRefServices = ref(db, '/services');
const userRefBus = ref(db, '/bustimetable');

const MyComponent = ({ setActiveScreen }) => {
  const navigation = useNavigation()



  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const currentScreen = navigation.getCurrentRoute().name
      setActiveScreen(currentScreen)
    });

    return () => { unsubscribe() }
  }, [navigation, setActiveScreen])
}

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 20 }}>
        <Image source={require('./assets/icon.png')} style={{ width: 80, height: 80 }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>CampusXperience</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};


const Root = () => (
  <Drawer.Navigator screenOptions={{ headerShown: true, headerTransparent: true, headerTitle: "" }} drawerContent={(props) => <CustomDrawerContent {...props} />} >
    <Drawer.Screen
      name="Menu"
      component={MenuScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Ionicons name="restaurant" size={size} color={focused ? "blue" : "black"} />
        ),
        drawerLabelStyle: { marginLeft: -15 }, // Adjust the margin here
      }}
    />
    <Drawer.Screen
      name="Bus"
      component={BusScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <FontAwesome5 name="bus-alt" size={size} color={focused ? "blue" : "black"} />
        ),
        drawerLabelStyle: { marginLeft: -15 }, // Adjust the margin here
      }}
    />
    <Drawer.Screen
      name="Student Bazaar"
      component={StudentBazaarScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <MaterialIcons name="sell" size={size} color={focused ? "blue" : "black"} />
        ),
        drawerLabelStyle: { marginLeft: -15 }, // Adjust the margin here
      }}
    />
    <Drawer.Screen
      name="Student Bazaar Details"
      component={StudentBazaarDetailsScreen}
      options={{
        drawerItemStyle: { display: 'none' }
      }}
    />
    <Drawer.Screen
      name="Add Bazaar"
      component={AddBazaarScreen}
      options={{
        drawerItemStyle: { display: 'none' }
      }}
    />
    <Drawer.Screen
      name="User"
      component={UserScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <FontAwesome style={{ marginLeft: 3 }} name="user" size={size} color={focused ? "blue" : "black"} />
        ),
        drawerLabelStyle: { marginLeft: -10 }, // Adjust the margin here
      }}
    />
    <Drawer.Screen
      name="About Developer"
      component={AboutMeScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <AntDesign name="codesquare" size={size} color={focused ? "blue" : "black"} />
        ),
        drawerLabelStyle: { marginLeft: -15 }, // Adjust the margin here
      }}
    />
    <Drawer.Screen
      name="Fortinet Login"
      component={FortinetLoginScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <AntDesign name="codesquare" size={size} color={focused ? "blue" : "black"} />
        ),
        drawerLabelStyle: { marginLeft: -15 }, // Adjust the margin here
      }}
    />
  </Drawer.Navigator>
);




export default function App() {
  const [activeScreen, setActiveScreen] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const screensWithoutBottomTab = ["SignUp", "Login", "RestaurantDetails", "LaundryDetails", "Root"];

  const [isSignedIn, setIsSignedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_700Bold,
  });

  useEffect(() => {
    setIsLoading(true);
    try {
      onValue(userRefMenu, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_MENU', payload: data })
      })
      onValue(userRefDishes, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_DISHES', payload: data })
      })
      onValue(userRefUpdates, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_UPDATES', payload: data })
      })
      onValue(userRefRestaurants, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_RESTAURANTS', payload: data })
      })
      onValue(userRefLaundry, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_LAUNDRY', payload: data })
      })
      onValue(userRefServices, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_SERVICES', payload: data })
      })
      onValue(userRefBus, (snapshot) => {
        const data = snapshot.val();
        store.dispatch({ type: 'SET_BUSES', payload: data })
      })
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, activeScreen]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true)
      } else {
        setIsSignedIn(false)
      }
    })
    setAuthLoading(false)
    return unsubscribe
  }, [])

  if (authLoading) {
    // You can show a loading indicator here if needed
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7DBD3F" />
      </View>
    );
  }

  if (isLoading) {
    // You can show a loading indicator here if needed
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7DBD3F" />
      </View>
    );
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyComponent setActiveScreen={setActiveScreen} />
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true, }}>
          {!isSignedIn && !isLoading && (
            <>
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          )}

          {/* {isSignedIn && !isLoading && ( 
            <> */}
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="EditMenu" component={EditMenuScreen} />
          <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
          <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
          <Stack.Screen name="Laundry" component={LaundryScreen} />
          <Stack.Screen name="LaundryDetails" component={LaundryDetailsScreen} />
          <Stack.Screen name="FTP" component={FTPScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          {/* </>
          )} */}


        </Stack.Navigator>

        {screensWithoutBottomTab.includes(activeScreen) ? (
          null
        ) : (
          <BottomTab activeScreen={activeScreen} />
        )}


      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
