import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { fireDb } from '../firebase';
import { collection, getDocs } from '@firebase/firestore';

const AddBazaarScreen = () => {
    const navigation = useNavigation();


    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <ScrollView>
                <View style={{ backgroundColor: "#94F074" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text onPress={() => console.log("Text pressed")} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Add to Bazaar</Text>
                    </View>
                </View>


                <TextInput value={title} onChangeText={(text) => setTitle(text)} style={{ marginTop: 40, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Ad Title" />
                <TextInput value={description} onChangeText={(text) => setDescription(text)} multiline={true} numberOfLines={10} style={{ marginTop: 30, marginLeft: 20, marginRight: 20, height: 150, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Description" />

                <Text style={{ marginTop: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20 }}>SET A PRICE</Text>
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, flexDirection: "row", alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, color: "gray" }}>₹</Text>
                    <View style={{ width: 1, height: '80%', backgroundColor: '#7DBD3F', marginHorizontal: 10 }} />
                    <TextInput value={price} onChangeText={(text) => setPrice(text)} keyboardType="numeric" style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 18, color: "gray" }} placeholder="Price" />
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default AddBazaarScreen