import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import restaurants from '../restaurants.json'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const RestaurantsScreen = () => {

  const navigation = useNavigation()

  const handleExitPress = () => {
    signOut(auth).then(() => {
      navigation.replace("Login")
    }).catch((error) => {
      console.log(error.message)
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
      <ScrollView>
        <View style={{ backgroundColor: "#94F074" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
            <Text onPress={() => console.log(isAdmin)} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600", marginLeft: 25 }}>Restaurants</Text>
            <TouchableOpacity onPress={() => handleExitPress()}>
              <Ionicons name="exit-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: "600", margin: 20 }}>Restaurants</Text>

        {
          Object.keys(restaurants).map((restaurantName, index) => (
            <View key={index} style={{ padding: 20 }}>
              <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: "#C8F7B1", borderRadius: 15, height: 140, alignItems: "center" }}>
                <Image source={{ uri: restaurants[restaurantName].mainImage }} style={{ width: 150, height: '100%', borderRadius: 15 }} resizeMode="cover" />
                <View style={{ marginLeft: 10, alignItems: "flex-start", marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{restaurantName}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "400", textAlign: "center", marginTop: 14 }}>{restaurants[restaurantName].type}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", marginTop: 5 }}>{restaurants[restaurantName].price} for one</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default RestaurantsScreen

const styles = StyleSheet.create({})