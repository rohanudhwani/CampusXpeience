import { ActivityIndicator, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { auth, fireDb } from '../firebase';
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import { doc, getDoc } from "firebase/firestore";

const MenuScreen = ({ menu, dishes, updates }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

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

    const [isBreakfastOpen, setIsBreakfastOpen] = useState(true);
    const [isLunchOpen, setIsLunchOpen] = useState(false);
    const [isSnacksOpen, setIsSnacksOpen] = useState(false);
    const [isDinnerOpen, setIsDinnerOpen] = useState(false);

    const [selectedDay, setSelectedDay] = useState(dayNames[day])
    const [selectedDate, setSelectedDate] = useState(date)
    const [selectedMonth, setSelectedMonth] = useState(monthNames[month])


    useEffect(() => {
        async function fetchUserData() {
            const snap = await getDoc(doc(fireDb, 'users', auth.currentUser.uid));
            if (snap.exists()) {
                const userData = snap.data();
                setIsAdmin(userData.isAdmin || false);
            } else {
                setIsAdmin(false);
            }
        }
    
        fetchUserData();
    
        // No need to return anything from useEffect
    }, []);

    
    useEffect(() => {
        if (menu !== null && dishes !== null && updates !== null) {
            setIsLoaded(true); // Data is loaded
        }
    }, [menu, dishes, updates]);

    const translateY = useRef(new Animated.Value(0)).current;

    const toggleBreakfastDropdown = () => {
        setIsBreakfastOpen(!isBreakfastOpen);
        setIsLunchOpen(false);
        setIsSnacksOpen(false);
        setIsDinnerOpen(false);
        Animated.timing(translateY, {
            toValue: isBreakfastOpen ? -8 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };
    const toggleLunchDropdown = () => {
        setIsBreakfastOpen(false);
        setIsLunchOpen(!isLunchOpen);
        setIsSnacksOpen(false);
        setIsDinnerOpen(false);
        Animated.timing(translateY, {
            toValue: isLunchOpen ? -8 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };
    const toggleSnacksDropdown = () => {
        setIsBreakfastOpen(false);
        setIsLunchOpen(false);
        setIsSnacksOpen(!isSnacksOpen);
        setIsDinnerOpen(false);
        Animated.timing(translateY, {
            toValue: isSnacksOpen ? -8 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };
    const toggleDinnerDropdown = () => {
        setIsBreakfastOpen(false);
        setIsLunchOpen(false);
        setIsSnacksOpen(false);
        setIsDinnerOpen(!isDinnerOpen);
        Animated.timing(translateY, {
            toValue: isDinnerOpen ? -8 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    const changeDay = (dayChosen) => {
        setSelectedDay(dayChosen)
        const dayIndex = dayNames.indexOf(dayChosen);
        const daysToAdd = dayIndex - day >= 0 ? dayIndex - day : 7 - (day - dayIndex);
        const newDate = new Date();
        newDate.setDate(today.getDate() + daysToAdd);
        setSelectedDate(newDate.getDate());
        setSelectedMonth(monthNames[newDate.getMonth()]);
        setActiveOption("Today")
    }

    const forwardDay = (days) => {
        if (days === -1 && selectedDate === date && selectedMonth === monthNames[month] && selectedDay === dayNames[day]) return;
        const newDate = new Date();
        newDate.setDate(selectedDate + days);
        setSelectedDay(dayNames[newDate.getDay()]);
        setSelectedDate(newDate.getDate());
        setSelectedMonth(monthNames[newDate.getMonth()]);
    }

    const navigation = useNavigation()

    const handleExitPress = () => {
        signOut(auth).then(() => {
            navigation.replace("Login")
        }).catch((error) => {
            console.log(error.message)
        })
    }

    const superscript = (number) => {
        if (number > 3 && number < 21) {
            return "th"
        } else if (number%10 === 1) {
            return "st"
        } else if (number%10 === 2) {
            return "nd"
        } else if (number%10 === 3) {
            return "rd"
        } else {
            return "th"
        }
    }

    const menuItemClicked = (meal, item) => () => {
        if (!isAdmin) {
            return;
        }
        const dateBeingChecked = (String(selectedDate).padStart(2, '0')+"-"+String(monthNames.indexOf(selectedMonth)+1).padStart(2, '0')+"-"+year);
        navigation.navigate("EditMenu", { date: dateBeingChecked, meal: meal, item: item });
    }

    const checkUpdates = (item, meal) => {
        if(updates === null) {
            return item;
        } else {
            const dateBeingChecked = (String(selectedDate).padStart(2, '0')+"-"+String(monthNames.indexOf(selectedMonth)+1).padStart(2, '0')+"-"+year);
            if(Object.keys(updates).includes(dateBeingChecked)){
                if(Object.keys(updates[dateBeingChecked]).includes(meal)){
                    if(Object.keys(updates[dateBeingChecked][meal]).includes(item)){
                        return updates[dateBeingChecked][meal][item];
                    } else {
                        return item;
                    }
                } else {
                    return item;
                }
            } else {
                return item;
            }
        }
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
        <SafeAreaView style={{ backgroundColor: "#94F074" }}>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20 }}>
                <Text onPress={() => console.log(isAdmin)} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600", marginLeft: 25 }}>Menu</Text>
                <TouchableOpacity onPress={() => handleExitPress()}>
                    <Ionicons name="exit-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>



            <View style={{ marginTop: 20, marginBottom: 20, justifyContent: "space-evenly", flexDirection: "row", gap: 30 }}>
                <Text style={{ fontSize: 15, fontWeight: activeOption === "Today" ? 500 : "normal" }} onPress={() => { setActiveOption("Today"); changeDay(dayNames[day]) }}>Today</Text>
                <Text style={{ fontSize: 15, fontWeight: activeOption === "Week" ? 500 : "normal" }} onPress={() => setActiveOption("Week")}>Week</Text>
            </View>

            <View style={{ backgroundColor: "white", borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 }}>
                {activeOption === "Week" ? <>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "gray", fontSize: 15 }}>Month of</Text>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{monthNames[month].toUpperCase()}</Text>
                    </View>

                    {week.map((option, index) => (
                        <TouchableOpacity onPress={() => changeDay(option)} key={index} style={{ justifyContent: "space-between", backgroundColor: "#C8F7B1", marginTop: 15, padding: 20, borderRadius: 15 }}>
                            <Text style={{ fontSize: 15, fontWeight: "500" }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </> : <>
                    <View style={{ alignItems: "center", flexDirection: "row" }}>
                        <View style={{ justifyContent: "center" }}>
                            <AntDesign onPress={() => forwardDay(-1)} name="left" size={22} color="gray" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>{selectedDay === dayNames[day] && selectedMonth === monthNames[month] && selectedDate === date ? "TODAY" : selectedDay}</Text>
                            <Text style={{ color: "gray", fontSize: 15, textAlign: "center" }}>{selectedDate}{superscript(selectedDate)} {selectedMonth}, {selectedDay}</Text>
                        </View>
                        <View style={{ justifyContent: "center" }}>
                            <AntDesign onPress={() => forwardDay(1)} name="right" size={22} color="gray" />
                        </View>
                    </View>




                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 0 }}>
                        <TouchableWithoutFeedback onPress={toggleBreakfastDropdown} style={{ marginTop: 20 }}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 15, marginRight: 10 }}>
                                    <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Breakfast</Text>
                                    <AntDesign name={isBreakfastOpen ? 'up' : 'down'} size={20} color="gray" />
                                </View>
                                <Animated.View style={{ transform: [{ translateY }] }}>
                                    {isBreakfastOpen && (
                                        <View style={{ padding: 10 }}>
                                            {[...Array(Math.ceil(menu[selectedDay].Breakfast.length / 2))].map((_, rowIndex) => (
                                                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                    {menu[selectedDay].Breakfast.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                        <TouchableOpacity onPress={menuItemClicked('Breakfast', option)} key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 140, alignItems: "center" }}>
                                                            <Image source={{ uri: dishes[checkUpdates(option, 'Breakfast')] }} style={{ width: '100%', height: 110, borderRadius: 15 }} resizeMode="cover" />
                                                            <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", marginTop: 2 }}>{checkUpdates(option, 'Breakfast')}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={toggleLunchDropdown}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 10, marginRight: 10 }}>
                                    <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Lunch</Text>
                                    <AntDesign name={isLunchOpen ? 'up' : 'down'} size={20} color="gray" />
                                </View>
                                <Animated.View style={{ transform: [{ translateY }] }}>
                                    {isLunchOpen && (
                                        <View style={{ padding: 10 }}>
                                            {[...Array(Math.ceil(menu[selectedDay].Lunch.length / 2))].map((_, rowIndex) => (
                                                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                    {menu[selectedDay].Lunch.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                        <TouchableOpacity key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 140, alignItems: "center" }}>
                                                            <Image source={{ uri: dishes[checkUpdates(option, 'Lunch')] }} style={{ width: '100%', height: 110, borderRadius: 15 }} resizeMode="cover" />
                                                            <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", marginTop: 2 }}>{checkUpdates(option, 'Lunch')}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={toggleSnacksDropdown}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 10, marginRight: 10 }}>
                                    <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Snacks</Text>
                                    <AntDesign name={isSnacksOpen ? 'up' : 'down'} size={20} color="gray" />
                                </View>
                                <Animated.View style={{ transform: [{ translateY }] }}>
                                    {isSnacksOpen && (
                                        <View style={{ padding: 10 }}>
                                            {[...Array(Math.ceil(menu[selectedDay].Snacks.length / 2))].map((_, rowIndex) => (
                                                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                    {menu[selectedDay].Snacks.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                        <TouchableOpacity key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 140, alignItems: "center" }}>
                                                            <Image source={{ uri: dishes[checkUpdates(option, 'Snacks')] }} style={{ width: '100%', height: 110, borderRadius: 15 }} resizeMode="cover" />
                                                            <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", marginTop: 2 }}>{checkUpdates(option, 'Snacks')}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={toggleDinnerDropdown}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 10, marginRight: 10 }}>
                                    <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Dinner</Text>
                                    <AntDesign name={isDinnerOpen ? 'up' : 'down'} size={20} color="gray" />
                                </View>
                                <Animated.View style={{ transform: [{ translateY }] }}>
                                    {isDinnerOpen && (
                                        <View style={{ padding: 10 }}>
                                            {[...Array(Math.ceil(menu[selectedDay].Dinner.length / 2))].map((_, rowIndex) => (
                                                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                    {menu[selectedDay].Dinner.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                        <TouchableOpacity key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 140, alignItems: "center" }}>
                                                            <Image source={{ uri: dishes[checkUpdates(option, 'Dinner')] }} style={{ width: '100%', height: 110, borderRadius: 15 }} resizeMode="cover" />
                                                            <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", marginTop: 2 }}>{checkUpdates(option, 'Dinner')}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>

                    </ScrollView>


                </>}
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = state => ({
    menu: state.menu,
    dishes: state.dishes,
    updates: state.updates
});

export default connect(mapStateToProps)(MenuScreen);

const styles = StyleSheet.create({})