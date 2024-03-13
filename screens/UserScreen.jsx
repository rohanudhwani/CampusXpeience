import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const UserScreen = () => {

    const user = auth.currentUser;
    const navigation = useNavigation()

    const handleSignOut = async () => {
        signOut(auth).then(() => {
            navigation.replace("Login")
        }).catch((error) => {
            console.log(error.message)
        })
    };

    const handleRateApp = () => {
        const playStoreLink = 'https://play.google.com/store/apps/details?id=com.rohanudhwani.CampusXperience';
        Linking.openURL(playStoreLink);
    };


    return (
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <StatusBar backgroundColor="#1D7C38" barStyle="dark-content" />
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 60, marginTop: 30 }}>User Details</Text>
            <View>
                <Text style={{ fontSize: 16, marginBottom: 30 }}>Email: {auth.currentUser.email}</Text>
            </View>
            <TouchableOpacity onPress={() => handleSignOut()} style={{ marginTop: 30, marginLeft: 20, marginRight: 20, height: 50, backgroundColor: "#1D7C38", borderRadius: 10, justifyContent: "center", alignItems: "center", width: 200 }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "white", fontWeight: "bold" }}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRateApp()} style={{ marginTop: 50, marginLeft: 20, marginRight: 20, height: 50, backgroundColor: "#1D7C38", borderRadius: 10, justifyContent: "center", alignItems: "center", width: 200 }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "white", fontWeight: "bold" }}>Rate My App</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default UserScreen

const styles = StyleSheet.create({})