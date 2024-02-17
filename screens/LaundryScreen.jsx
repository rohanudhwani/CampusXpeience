import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux';

const LaundryScreen = ({ laundry }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (laundry !== null) {
      setIsLoaded(true); // Data is loaded

    }
  }, [laundry]);

  const navigation = useNavigation()

  const handleExitPress = () => {
    signOut(auth).then(() => {
      navigation.replace("Login")
    }).catch((error) => {
      console.log(error.message)
    })
  }

  // Render loader if data is not loaded yet
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="30" color="#94F074" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
      <ScrollView>
        <View style={{ backgroundColor: "#94F074" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600", marginLeft: 25 }}>Laundry</Text>
            <TouchableOpacity onPress={() => handleExitPress()}>
              <Ionicons name="exit-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 50, gap: 30, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
          {
            Object.keys(laundry).map((laundryName, index) => (
              <View key={index} style={{}}>
                <TouchableOpacity onPress={() => navigation.navigate("LaundryDetails", { laundryName: laundryName, laundryDetails: laundry[laundryName] })} style={{ flexDirection: 'row', backgroundColor: "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                  <Image source={{ uri: laundry[laundryName].mainImage }} style={{ width: 150, height: '100%', borderRadius: 15 }} resizeMode="cover" />
                  <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginRight: 10 }}>{laundryName}</Text>
                    <Text style={{ fontSize: 15, fontWeight: "400", textAlign: "center", marginTop: 14 }}>{laundry[laundryName].timings}</Text>
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
  laundry: state.laundry
});

export default connect(mapStateToProps)(LaundryScreen)

const styles = StyleSheet.create({})