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

  const [currentTrip, setCurrentTrip] = useState(0)

  const [updatedBus, setUpdatedBus] = useState(parseInt(Object.keys(buses)))


  const today = new Date();

  const formattedTime = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
  const timeParts = formattedTime.split(':');
  const hours = timeParts[0];
  const minutes = timeParts[1].slice(0, 2);
  const period = timeParts[1].slice(2);
  const formattedTimeString = `${hours}:${minutes}${period.toUpperCase()}`;
  const current24hrTime = `${hours}:${minutes}`;

  useEffect(() => {
    if (buses !== null) {
      setIsLoaded(true); // Data is loaded
    }
  }, [buses]);

  useEffect(() => {
    const trips = Object.keys(buses);

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      const nextTrip = trips[i + 1] === undefined  ? trips[0] : trips[i + 1];
      const arrivalTime = convertTo24HourFormat(buses[trip]["Timings"][0]);
      const departureTime = convertTo24HourFormat(buses[trip]["Timings"][1]);
      const nextBusArrivalTime = convertTo24HourFormat(buses[nextTrip]["Timings"][0]);

      if (arrivalTime < current24hrTime && departureTime > current24hrTime) {
        setCurrentTrip(parseInt(trip));
        break;
      }

      if(departureTime < current24hrTime && nextBusArrivalTime > current24hrTime) {
        setCurrentTrip(parseInt(nextTrip));
        break;
      }


    }
    console.log("The current bus trip is", currentTrip);

    console.log(updatedBus)



    
  }, [current24hrTime]);



  const convertTo24HourFormat = (timeString) => {
    const [time, period] = timeString.split(/(?=[AP]M)/);
    let [hours, minutes] = time.split(':').map(str => parseInt(str, 10));
    // Adjust hours for PM period
    if (period.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }

    // Format hours and minutes with leading zeros if necessary
    const formattedHours = hours.toString().padStart(2, "0");

    // Return the time in 24-hour format
    return `${formattedHours}:${minutes}`;
  }

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
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: currentTrip === parseInt(bus) ? "#FFF33E" : "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                  <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 4, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
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