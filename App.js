import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MenuScreen, SignUpScreen, LoginScreen, EditMenuScreen } from './screens'
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator()

const userRefMenu = ref(db, '/menu');
const userRefDishes = ref(db, '/dishes');
const userRefUpdates = ref(db, '/updates');

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
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setIsLoading(true);
      }
    };

    fetchData();
  }, []);

  

  if (isLoading) {
    // You can show a loading indicator here if needed
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7DBD3F" />
      </View>
    );
  }

  if (!fontsLoaded && !fontError) {
    console.log("Font not loaded")
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyComponent setActiveScreen={setActiveScreen} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="EditMenu" component={EditMenuScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
