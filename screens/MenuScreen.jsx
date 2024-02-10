import { Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

const MenuScreen = () => {

    const [activeOption, setActiveOption] = useState("Today")

    const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const today = new Date();

    // Extract year, month, and day
    const year = today.getFullYear();
    const month = today.getMonth(); // Months are zero-based
    const date = today.getDate();
    const day = today.getDay();

    const [isOpen, setIsOpen] = useState(false);
    const translateY = useRef(new Animated.Value(2000)).current;

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        Animated.timing(translateY, {
            toValue: isOpen ? -4 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };


    return (
        <SafeAreaView style={{ backgroundColor: "#94F074" }}>

            <Text style={{ marginTop: 20, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Menu</Text>

            <View style={{ marginTop: 20, marginBottom: 20, justifyContent: "space-evenly", flexDirection: "row", gap: 30 }}>
                <Text style={{ fontSize: 15, fontWeight: activeOption === "Today" ? 500 : "normal" }} onPress={() => setActiveOption("Today")}>Today</Text>
                <Text style={{ fontSize: 15, fontWeight: activeOption === "Week" ? 500 : "normal" }} onPress={() => setActiveOption("Week")}>Week</Text>
            </View>

            <View style={{ backgroundColor: "white", borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 }}>
                {activeOption === "Week" ? <>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "gray", fontSize: 15 }}>Month of</Text>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{monthNames[month].toUpperCase()}</Text>
                    </View>

                    {week.map((option, index) => (
                        <TouchableOpacity key={index} style={{ justifyContent: "space-between", backgroundColor: "#C8F7B1", marginTop: 15, padding: 20, borderRadius: 15 }}>
                            <Text style={{ fontSize: 15, fontWeight: "500" }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </> : <>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>TODAY</Text>
                        <Text style={{ color: "gray", fontSize: 15 }}>{date}th {monthNames[month]}, {dayNames[today.getDay()]}</Text>
                    </View>


                    <TouchableWithoutFeedback onPress={toggleDropdown}>
                        <View style={{ flexDirection: 'row', alignItems: 'center',  justifyContent: "space-between", marginTop: 15 }}>
                            <Text style={{ marginRight: 10, fontSize: 16, fontWeight:"600" }}>Breakfast</Text>
                            <AntDesign name={isOpen ? 'up' : 'down'} size={24} color="gray" />
                        </View>
                    </TouchableWithoutFeedback>

                    <Animated.View style={{ transform: [{ translateY }] }}>
                        {isOpen && (
                            <View style={{ backgroundColor: '#fff', padding: 10 }}>
                                <Text>Menu item 1</Text>
                                <Text>Menu item 2</Text>
                                <Text>Menu item 3</Text>
                            </View>
                        )}
                    </Animated.View>


                </>}
            </View>
        </SafeAreaView>
    )
}

export default MenuScreen

const styles = StyleSheet.create({})