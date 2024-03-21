import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux';
import BusTrips from '../component/BusTrips'
import Swiper from 'react-native-swiper';

const BusScreen = ({ buses }) => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeOption, setActiveOption] = useState("IIITN")

  useEffect(() => {
    if (buses !== null || buses !== undefined) {
      setIsLoaded(true); // Data is loaded
    }
  }, [buses]);

  const navigation = useNavigation()

  const handleChangeOption = (option) => {
    // Set activeOption after a short delay for smoother transition
    setTimeout(() => {
      setActiveOption(option);
    }, 200); // Adjust the delay as needed

    // Manually set index for Swiper
    if (option === 'IIITN') {
      swiperRef.scrollBy(-1, true);
    } else {
      swiperRef.scrollBy(1, true);
    }
  };

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

          <View style={{ marginTop: 5, marginBottom: 10, justifyContent: "space-evenly", flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={{ backgroundColor: activeOption === "IIITN" ? "rgba(235,235,235,1)" : "rgba(235,235,235,0.5)", borderRadius: 5, padding: 10, paddingLeft: 50, paddingRight: 50 }} onPress={() => { setActiveOption("IIITN") }}><Text style={{ fontSize: 15, fontWeight: activeOption === "Today" ? 500 : "normal" }} >IIITN</Text></TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: activeOption === "NLU" ? "rgba(235,235,235,1)" : "rgba(235,235,235,0.5)", borderRadius: 5, padding: 10, paddingLeft: 50, paddingRight: 50 }} onPress={() => setActiveOption("NLU")} ><Text style={{ fontSize: 15, fontWeight: activeOption === "Week" ? 500 : "normal" }}>NLU</Text></TouchableOpacity>
          </View>
        </View>

        <Swiper loop={false} showsPagination={false} index={activeOption === "NLU" ? 1 : 0} onIndexChanged={(index) => setActiveOption(index===0 ? "IIITN" : "NLU")} ref={(ref) => { swiperRef = ref; }}>
          <BusTrips key="IIITN" buses={buses.iiitn} />
          <BusTrips key="NLU" buses={buses.mnlu} />
        </Swiper>

      </ScrollView>
    </SafeAreaView>
  )
}

const mapStateToProps = state => ({
  buses: state.buses
});

export default connect(mapStateToProps)(BusScreen)

const styles = StyleSheet.create({})