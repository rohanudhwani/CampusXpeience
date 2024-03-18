import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MenuScreen, SignUpScreen, LoginScreen, EditMenuScreen, RestaurantsScreen, RestaurantDetailsScreen, LaundryScreen, LaundryDetailsScreen, FTPScreen, ServicesScreen, ServicesDetailsScreen, UserScreen, BusScreen } from './screens'
import BottomTab from './component/BottomTab';
import { ref, onValue } from 'firebase/database';
import { auth, db } from './firebase';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { createDrawerNavigator } from '@react-navigation/drawer';


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


function Root() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true, headerTransparent:true, headerTitle:""}}>
      <Drawer.Screen name="Menu" component={MenuScreen} />
      <Drawer.Screen name="User" component={UserScreen} />
      <Drawer.Screen name="Bus" component={BusScreen} />
      <Drawer.Screen name="Laundry" component={LaundryScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="Restaurants" component={RestaurantsScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="LaundryDetails" component={LaundryDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="FTP" component={FTPScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="EditMenu" component={EditMenuScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="Services" component={ServicesScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="ServicesDetails" component={ServicesDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
    </Drawer.Navigator>
  );
}

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
    const fetchData = async () => {
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
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setIsLoading(true);
      }
    };

    fetchData();
  }, []);

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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isSignedIn && (
            <>
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          )}
          <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />


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
