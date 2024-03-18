import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux';

const BusScreen = ({ buses }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (buses !== null) {
      setIsLoaded(true); // Data is loaded

    }
  }, [buses]);

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
            <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Bus</Text>
          </View>
        </View>

        <View style={{ marginTop: 30, gap: 20, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
          {
            Object.keys(buses).map((bus, index) => (
              <View key={index} style={{}}>
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                  <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 4, alignContent:"center", justifyContent:"center", alignItems:"center" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginRight: 10 }}>{buses[bus]["Timings"][0]} - {buses[bus]["Timings"][1]}</Text>
                    <Text style={{ fontSize: 15, fontWeight: "600", textAlign: "center", marginTop: 22 }}>{buses[bus]["Departure Station"]}  ------------------------->  {buses[bus]["Arrival Station"]}</Text>
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
  buses: state.buses
});

export default connect(mapStateToProps)(BusScreen)

const styles = StyleSheet.create({})