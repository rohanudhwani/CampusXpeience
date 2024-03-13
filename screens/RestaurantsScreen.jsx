import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux';

const RestaurantsScreen = ({ restaurants }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (restaurants !== null) {
      setIsLoaded(true); // Data is loaded

    }
  }, [restaurants]);

  const navigation = useNavigation()


  // Render loader if data is not loaded yet
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="30" color="#94F074" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
      <ScrollView>
        <View style={{ backgroundColor: "#94F074" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600", marginLeft: 25 }}>Restaurants</Text>
            <TouchableOpacity onPress={() => navigation.navigate("User")}>
              <Feather name="user" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 30, gap: 20, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
          {
            Object.keys(restaurants).map((restaurantName, index) => (
              <View key={index} style={{}}>
                <TouchableOpacity onPress={() => navigation.navigate("RestaurantDetails", { restaurantName: restaurantName, restaurantDetails: restaurants[restaurantName] })} style={{ flexDirection: 'row', backgroundColor: "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                  <Image source={{ uri: restaurants[restaurantName].mainImage }} style={{ width: 150, height: '100%', borderRadius: 15 }} resizeMode="cover" />
                  <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginRight: 10 }}>{restaurantName}</Text>
                    <Text style={{ fontSize: 15, fontWeight: "400", textAlign: "center", marginTop: 14 }}>{restaurants[restaurantName].type}</Text>
                    <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", marginTop: 5 }}>{restaurants[restaurantName].price} for one</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const mapStateToProps = state => ({
  restaurants: state.restaurants
});

export default connect(mapStateToProps)(RestaurantsScreen)

const styles = StyleSheet.create({})