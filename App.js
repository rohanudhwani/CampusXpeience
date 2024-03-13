import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MenuScreen, SignUpScreen, LoginScreen, EditMenuScreen, RestaurantsScreen, RestaurantDetailsScreen, LaundryScreen, LaundryDetailsScreen, FTPScreen, ServicesScreen, ServicesDetailsScreen, UserScreen } from './screens'
import BottomTab from './component/BottomTab';
import { ref, onValue } from 'firebase/database';
import { auth, db } from './firebase';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator()

const userRefMenu = ref(db, '/menu');
const userRefDishes = ref(db, '/dishes');
const userRefUpdates = ref(db, '/updates');
const userRefRestaurants = ref(db, '/restaurants');
const userRefLaundry = ref(db, '/laundry');
const userRefServices = ref(db, '/services');

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

export default function App() {
  const [activeScreen, setActiveScreen] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const screensWithoutBottomTab = ["SignUp", "Login", "RestaurantDetails", "LaundryDetails"];

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
        setIsLoading(false);
        onValue(userRefServices, (snapshot) => {
          const data = snapshot.val();
          store.dispatch({ type: 'SET_SERVICES', payload: data })
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
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Laundry" component={LaundryScreen} />
          <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
          <Stack.Screen name="LaundryDetails" component={LaundryDetailsScreen} />
          <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
          <Stack.Screen name="FTP" component={FTPScreen} />
          <Stack.Screen name="EditMenu" component={EditMenuScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="ServicesDetails" component={ServicesDetailsScreen} />
          <Stack.Screen name="User" component={UserScreen} />


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
