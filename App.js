import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MenuScreen } from './screens'
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import { Provider } from 'react-redux';
import store from './redux/store';

const Stack = createNativeStackNavigator()

const userRefMenu = ref(db, '/menu');
const userRefDishes = ref(db, '/dishes');

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
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setIsLoading(true);
      }
    };

    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyComponent setActiveScreen={setActiveScreen} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Menu" component={MenuScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
