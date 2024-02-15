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
                <FontAwesome5 name="utensils" size={25} color="black" />
              ) : (
                <FontAwesome5 name="utensils" size={25} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Restaurants")}>
              {activeScreen === "Restaurants" ? (
                <MaterialCommunityIcons name="food-fork-drink" size={32} color="black" />
              ) : (
                <MaterialCommunityIcons name="food-fork-drink" size={32} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
  )
}

export default BottomTab

const styles = StyleSheet.create({})