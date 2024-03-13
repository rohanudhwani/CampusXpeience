import { ActivityIndicator, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { auth, fireDb } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import { doc, getDoc } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';

const MenuScreen = ({ menu, dishes, updates }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [activeOption, setActiveOption] = useState("Today")

    const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    const today = new Date();

    const formattedTime = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
    const timeParts = formattedTime.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1].slice(0, 2);
    const period = timeParts[1].slice(2);
    const formattedTimeString = `${hours}:${minutes}${period.toUpperCase()}`;
    const current24hrTime = `${hours}:${minutes}`;

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

    const [breakfastTimings, setBreakfastTimings] = useState([])
    const [lunchTimings, setLunchTimings] = useState([])
    const [snacksTimings, setSnacksTimings] = useState([])
    const [dinnerTimings, setDinnerTimings] = useState([])

    const [breakfastMenu, setBreakfastMenu] = useState([])
    const [lunchMenu, setLunchMenu] = useState([])
    const [snacksMenu, setSnacksMenu] = useState([])
    const [dinnerMenu, setDinnerMenu] = useState([])

    const [tempMealMenu, setTempMealMenu] = useState([])


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

            setBreakfastTimings([menu[selectedDay].timings.Breakfast[0], menu[selectedDay].timings.Breakfast[1]]);
            setLunchTimings([menu[selectedDay].timings.Lunch[0], menu[selectedDay].timings.Lunch[1]]);
            setSnacksTimings([menu[selectedDay].timings.Snacks[0], menu[selectedDay].timings.Snacks[1]]);
            setDinnerTimings([menu[selectedDay].timings.Dinner[0], menu[selectedDay].timings.Dinner[1]]);


            //is mapped  with dates and not day
            // const updateMenu = (meal) => {
            //     setTempMealMenu(menu[selectedDay][meal]);
            //     if (updates && updates[selectedDay] && updates[selectedDay][meal]) {
            //         const { remove, add } = updates[selectedDay][meal];
    
            //         console.log('Remove:', remove);
                    
            //         if (remove) {
            //             setTempMealMenu(tempMealMenu.filter(item => !remove.includes(item)))
            //         }
            //         if (add) {
            //             setTempMealMenu(tempMealMenu.concat(add))
            //         }
            //     }
            //     if(meal==='Breakfast'){
            //         setBreakfastMenu(tempMealMenu)
            //     } else if(meal==='Lunch'){
            //         setLunchMenu(tempMealMenu)
            //     } else if(meal==='Snacks'){
            //         setSnacksMenu(tempMealMenu)
            //     } else if(meal==='Dinner'){
            //         setDinnerMenu(tempMealMenu)
            //     }
            // }
            // updateMenu('Breakfast');
            // console.log('Breakfast menu:', breakfastMenu);

        }
    }, [menu, dishes, updates]);


    useEffect(() => {
        if (breakfastTimings.length === 0 || lunchTimings.length === 0 || snacksTimings.length === 0 || dinnerTimings.length === 0) return;

        if (current24hrTime < convertTo24HourFormat(breakfastTimings[1])) {
            setIsBreakfastOpen(true);
            setIsLunchOpen(false);
            setIsSnacksOpen(false);
            setIsDinnerOpen(false);
            console.log("Breakfast is open")
            return;
        } else if (current24hrTime < convertTo24HourFormat(lunchTimings[1])) {
            setIsBreakfastOpen(false);
            setIsLunchOpen(true);
            setIsSnacksOpen(false);
            setIsDinnerOpen(false);
            console.log("Lunch is open")
            return;
        } else if (current24hrTime < convertTo24HourFormat(snacksTimings[1])) {
            setIsBreakfastOpen(false);
            setIsLunchOpen(false);
            setIsSnacksOpen(true);
            setIsDinnerOpen(false);
            console.log("Snacks is open")
            return;
        } else if (current24hrTime < convertTo24HourFormat(dinnerTimings[1])) {
            setIsBreakfastOpen(false);
            setIsLunchOpen(false);
            setIsSnacksOpen(false);
            setIsDinnerOpen(true);
            console.log("Dinner is open")
            return;
        } else if (current24hrTime > convertTo24HourFormat(dinnerTimings[1])) {
            setIsBreakfastOpen(true);
            setIsLunchOpen(false);
            setIsSnacksOpen(false);
            setIsDinnerOpen(false);
            forwardDay(1);
            console.log("Mess closed")
            return;
        }
        console.log("All closed", formattedTimeString)
    }, [breakfastTimings, lunchTimings, snacksTimings, dinnerTimings, current24hrTime])

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



    const superscript = (number) => {
        if (number > 3 && number < 21) {
            return "th"
        } else if (number % 10 === 1) {
            return "st"
        } else if (number % 10 === 2) {
            return "nd"
        } else if (number % 10 === 3) {
            return "rd"
        } else {
            return "th"
        }
    }

    const menuItemClicked = (meal, item) => {
        console.log("pressed")
        if (!isAdmin) {
            return;
        }
        const dateBeingChecked = (String(selectedDate).padStart(2, '0') + "-" + String(monthNames.indexOf(selectedMonth) + 1).padStart(2, '0') + "-" + year);
        navigation.navigate("EditMenu", { date: dateBeingChecked, meal: meal, item: item, dishes: dishes, updates: updates });
    }

    const checkUpdates = (item, meal) => {
        if (updates === null) {
            return item;
        } else {
            const dateBeingChecked = (String(selectedDate).padStart(2, '0') + "-" + String(monthNames.indexOf(selectedMonth) + 1).padStart(2, '0') + "-" + year);
            if (Object.keys(updates).includes(dateBeingChecked)) {
                if (Object.keys(updates[dateBeingChecked]).includes(meal)) {
                    if (Object.keys(updates[dateBeingChecked][meal]).includes(item)) {
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
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <ScrollView>
                <View style={{ backgroundColor: "#94F074" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20 }}>
                        <Text onPress={() => console.log(isAdmin)} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600", marginLeft: 25 }}>Menu</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("User")}>
                            <Feather name="user" size={28} color="black" />
                        </TouchableOpacity>
                    </View>



                    <View style={{ marginTop: 20, marginBottom: 10, justifyContent: "space-evenly", flexDirection: "row", gap: 10 }}>
                        <TouchableOpacity style={{backgroundColor: activeOption === "Today" ? "rgba(235,235,235,1)" : "rgba(235,235,235,0.5)", borderRadius:5, padding:10, paddingLeft:50, paddingRight:50}} onPress={() => { setActiveOption("Today"); changeDay(dayNames[day]) }}><Text style={{ fontSize: 15, fontWeight: activeOption === "Today" ? 500 : "normal" }}   >Today</Text></TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: activeOption === "Week" ? "rgba(235,235,235,1)" : "rgba(235,235,235,0.5)", borderRadius:5, padding:10, paddingLeft:50, paddingRight:50}} onPress={() => setActiveOption("Week")} ><Text style={{ fontSize: 15, fontWeight: activeOption === "Week" ? 500 : "normal" }}>Week</Text></TouchableOpacity>
                    </View>
                </View>

                <View style={{ backgroundColor: "white", borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 }}>
                    {activeOption === "Week" ? <>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "gray", fontSize: 15 }}>Month of</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{monthNames[month].toUpperCase()}</Text>
                        </View>

                        {week.map((option, index) => (
                            <TouchableOpacity onPress={() => changeDay(option)} key={index} style={{ justifyContent: "space-between", backgroundColor: "#C8F7B1", marginTop: 18, padding: 20, borderRadius: 15 }}>
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




                        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }} >
                            <TouchableWithoutFeedback onPress={toggleBreakfastDropdown} style={{ marginTop: 20 }}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 20, marginRight: 10 }}>
                                        <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Breakfast</Text>
                                        <Text style={{ marginRight: 2, fontSize: 16, fontWeight: "300", marginLeft: 2 }}>{breakfastTimings[0]} - {breakfastTimings[1]}</Text>
                                        <AntDesign name={isBreakfastOpen ? 'up' : 'down'} size={20} color="gray" />
                                    </View>
                                    <Animated.View style={{ transform: [{ translateY }], marginTop: 8 }}>
                                        {isBreakfastOpen && (
                                            <View style={{ padding: 10 }}>
                                                {[...Array(Math.ceil(menu[selectedDay].Breakfast.length / 2))].map((_, rowIndex) => (
                                                    <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                        {menu[selectedDay].Breakfast.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                            <TouchableOpacity onPress={() => menuItemClicked('Breakfast', option)} key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 160, alignItems: "center" }}>
                                                                <Image source={{ uri: dishes[checkUpdates(option, 'Breakfast')] }} style={{ width: '100%', height: 130, borderRadius: 15 }} resizeMode="cover" />
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
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 15, marginRight: 10 }}>
                                        <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Lunch</Text>
                                        <Text style={{ marginRight: 2, fontSize: 16, fontWeight: "300", marginLeft: 22 }}>{lunchTimings[0]} - {lunchTimings[1]}</Text>
                                        <AntDesign name={isLunchOpen ? 'up' : 'down'} size={20} color="gray" />
                                    </View>
                                    <Animated.View style={{ transform: [{ translateY }], marginTop: 8 }}>
                                        {isLunchOpen && (
                                            <View style={{ padding: 10 }}>
                                                {[...Array(Math.ceil(menu[selectedDay].Lunch.length / 2))].map((_, rowIndex) => (
                                                    <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                        {menu[selectedDay].Lunch.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                            <TouchableOpacity onPress={() => menuItemClicked('Lunch', option)} key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 160, alignItems: "center" }}>
                                                                <Image source={{ uri: dishes[checkUpdates(option, 'Lunch')] }} style={{ width: '100%', height: 130, borderRadius: 15 }} resizeMode="cover" />
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
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 15, marginRight: 10 }}>
                                        <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Snacks</Text>
                                        <Text style={{ marginRight: 2, fontSize: 16, fontWeight: "300", marginLeft: 19 }}>{snacksTimings[0]} - {snacksTimings[1]}</Text>
                                        <AntDesign name={isSnacksOpen ? 'up' : 'down'} size={20} color="gray" />
                                    </View>
                                    <Animated.View style={{ transform: [{ translateY }], marginTop: 8 }}>
                                        {isSnacksOpen && (
                                            <View style={{ padding: 10 }}>
                                                {[...Array(Math.ceil(menu[selectedDay].Snacks.length / 2))].map((_, rowIndex) => (
                                                    <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                        {menu[selectedDay].Snacks.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                            <TouchableOpacity onPress={() => menuItemClicked('Snacks', option)} key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 160, alignItems: "center" }}>
                                                                <Image source={{ uri: dishes[checkUpdates(option, 'Snacks')] }} style={{ width: '100%', height: 130, borderRadius: 15 }} resizeMode="cover" />
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
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 15, marginRight: 10 }}>
                                        <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "500" }}>Dinner</Text>
                                        <Text style={{ marginRight: 2, fontSize: 16, fontWeight: "300", marginLeft: 22 }}>{dinnerTimings[0]} - {dinnerTimings[1]}</Text>
                                        <AntDesign name={isDinnerOpen ? 'up' : 'down'} size={20} color="gray" />
                                    </View>
                                    <Animated.View style={{ transform: [{ translateY }], paddingBottom: 40, marginTop: 8 }}>
                                        {isDinnerOpen && (
                                            <View style={{ padding: 10 }}>
                                                {[...Array(Math.ceil(menu[selectedDay].Dinner.length / 2))].map((_, rowIndex) => (
                                                    <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                                        {menu[selectedDay].Dinner.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                                            <TouchableOpacity onPress={() => menuItemClicked('Dinner', option)} key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', height: 160, alignItems: "center" }}>
                                                                <Image source={{ uri: dishes[checkUpdates(option, 'Dinner')] }} style={{ width: '100%', height: 130, borderRadius: 15 }} resizeMode="cover" />
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
            </ScrollView>
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