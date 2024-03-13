import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome, AntDesign, Feather, Ionicons,FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'



const BottomTab = ({ activeScreen }) => {

  const navigation = useNavigation()
  return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'transparent']}
          style={{
            width: '100%',
            paddingTop: 13,
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
            alignItems: 'center',
          }}
        >
          <View style={{width:'100%', backgroundColor:"white", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-around', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, alignItems:"center"
          }}>
            <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
              {activeScreen === "Menu" ? (
                <Ionicons name="restaurant" size={28} color="black" />
              ) : (
                <Ionicons name="restaurant-outline" size={28} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Restaurants")}>
              {activeScreen === "Restaurants" ? (
                <Ionicons name="fast-food" size={30} color="black" />
              ) : (
                <Ionicons name="fast-food-outline" size={30} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Laundry")}>
              {activeScreen === "Laundry" ? (
                <MaterialCommunityIcons name="washing-machine" size={30} color="black" />
              ) : (
                <MaterialCommunityIcons name="washing-machine" size={30} color="gray" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Services")}>
              {activeScreen === "Services" ? (
                <Ionicons name="storefront" size={30} color="black" />
              ) : (
                <Ionicons name="storefront-outline" size={30} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("FTP")}>
              {activeScreen === "FTP" ? (
                <FontAwesome name="file-text" size={25} color="black" />
              ) : (
                <FontAwesome name="file-text-o" size={25} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
  )
}

export default BottomTab

const styles = StyleSheet.create({})