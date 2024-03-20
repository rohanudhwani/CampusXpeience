import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const BusTrips = ({ buses }) => {

    const [currentTrip, setCurrentTrip] = useState(0)

    const [updatedBus, setUpdatedBus] = useState(Object.keys(buses).map(key => parseInt(key)));


    const today = new Date();

    const formattedTime = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
    const timeParts = formattedTime.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1].slice(0, 2);
    const period = timeParts[1].slice(2);
    const formattedTimeString = `${hours}:${minutes}${period.toUpperCase()}`;
    const current24hrTime = `${hours}:${minutes}`;

    useEffect(() => {
        const trips = Object.keys(buses);

        setUpdatedBus(Object.keys(buses).map(key => parseInt(key)));

        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i];
            const nextTrip = trips[i + 1] === undefined ? trips[0] : trips[i + 1];
            const arrivalTime = buses?.[trip]?.Timings?.[0];
            const departureTime = buses?.[trip]?.Timings?.[1];
            const nextBusArrivalTime = buses?.[nextTrip]?.Timings?.[0];


            if (arrivalTime < current24hrTime && departureTime > current24hrTime) {
                setCurrentTrip(parseInt(trip));
                break;
            }

            if (departureTime < current24hrTime && nextBusArrivalTime > current24hrTime) {
                setCurrentTrip(parseInt(nextTrip));
                break;
            }
        }

        setUpdatedBus(prevBus => prevBus.slice(currentTrip).concat(prevBus.slice(0, currentTrip)));

    }, [current24hrTime, buses, currentTrip]);

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


    return (
        <View style={{ marginTop: 30, gap: 20, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
            {
                updatedBus.map((bus, index) => (
                    <View key={index} style={{}}>
                        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: currentTrip === parseInt(bus) ? "#FFF33E" : currentTrip > parseInt(bus) ? "#FF411B" : "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                            <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 4, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginRight: 10 }}>{buses[bus]["Timings"][0]} - {buses[bus]["Timings"][1]}</Text>
                                <Text style={{ fontSize: 15, fontWeight: "600", textAlign: "center", marginTop: 22 }}>{buses[bus]["Departure Station"]}  ------------------------->  {buses[bus]["Arrival Station"]}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </View>
    )
}

export default BusTrips

const styles = StyleSheet.create({})