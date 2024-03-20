import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { connect } from 'react-redux';

const ServicesScreen = ({ services }) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (services !== null) {
            setIsLoaded(true); // Data is loaded

        }
    }, [services]);

    const navigation = useNavigation()


    const handleCallPress = (contactNumber) => {
        if (contactNumber) {
            const phoneNumber = `tel:${contactNumber}`;
            Linking.openURL(phoneNumber)
                .then((supported) => {
                    if (!supported) {
                        console.log("Phone number is not available");
                    }
                })
                .catch((err) => console.error('Error opening phone dialer:', err));
        } else {
            console.log("Contact number is not available");
        }
    };

    const handlePayPress = (upiLink) => {
        if (upiLink) {
            Linking.openURL(upiLink)
                .then((supported) => {
                    if (!supported) {
                        console.log("UPI Payment is not supported");
                    }
                })
                .catch((err) => console.error('Error opening UPI App:', err));
        } else {
            console.log("UPI ID is not available");
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
        <SafeAreaView>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <ScrollView>
                <View style={{ backgroundColor: "#94F074" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Services</Text>
                    </View>
                </View>

                <View style={{ marginTop: 50, gap: 30, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
                    {
                        Object.keys(services).map((servicesName, index) => (
                            <View key={index} style={{}}>
                                <View style={{ flexDirection: 'row', backgroundColor: "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                                    <Image source={{ uri: services[servicesName].mainImage }} style={{ width: 150, height: '100%', borderRadius: 15 }} resizeMode="cover" />
                                    <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 4 }}>
                                        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginRight: 10, marginTop: 10 }}>{servicesName}</Text>
                                        <Text style={{ fontSize: 15, fontWeight: "400", textAlign: "center", marginTop: 14 }}>{services[servicesName].timings}</Text>

                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 15 }}>
                                            <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                                <TouchableOpacity onPress={() => handleCallPress(services[servicesName].contactNumber)} style={{ borderWidth: 4, borderColor: "#6CAB3C", borderRadius: 200, padding: 8 }}>
                                                    <Ionicons name="call-outline" size={25} color="black" style={{ justifyContent: 'center', alignItems: 'center' }} />
                                                </TouchableOpacity>
                                            </View>
                                            {services[servicesName].upi && (
                                                <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                                    <TouchableOpacity onPress={() => handlePayPress(services[servicesName].upi)} style={{ borderWidth: 4, borderColor: "#6CAB3C", borderRadius: 200, padding: 8 }}>
                                                        <Image source={require('../assets/upi_black.png')} style={{ width: 65, height: 20 }} />
                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }

                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const mapStateToProps = state => ({
    services: state.services
});

export default connect(mapStateToProps)(ServicesScreen)

const styles = StyleSheet.create({})