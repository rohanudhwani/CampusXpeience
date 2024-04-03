import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { fireDb } from '../firebase';
import { collection, getDocs } from '@firebase/firestore';
import { auth } from '../firebase';

const AddBazaarScreen = () => {
    const navigation = useNavigation();


    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [condition, setCondition] = useState("New")
    const [instaID, setInstaID] = useState("")

    const userEmail = auth.currentUser ? auth.currentUser.email : null;

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <ScrollView>
                <View style={{ backgroundColor: "#94F074" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text onPress={() => console.log("Text pressed")} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Add to Bazaar</Text>
                    </View>
                </View>


                <TextInput value={title} onChangeText={(text) => setTitle(text)} style={{ marginTop: 30, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Ad Title" />
                <TextInput value={description} onChangeText={(text) => setDescription(text)} multiline={true} numberOfLines={10} style={{ marginTop: 20, marginLeft: 20, marginRight: 20, height: 150, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Description" />

                <Text style={{ marginTop: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20 }}>SET A PRICE</Text>
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, flexDirection: "row", alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, color: "gray" }}>₹</Text>
                    <View style={{ width: 1, height: '80%', backgroundColor: '#7DBD3F', marginHorizontal: 10 }} />
                    <TextInput value={price} onChangeText={(text) => setPrice(text)} keyboardType="numeric" style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 18, color: "gray" }} placeholder="Price" />
                </View>

                <View style={{ marginTop: 20, alignItems: 'center', justifyContent: "center", flexDirection: 'row', gap: 8, marginRight: 20, marginLeft: 20 }}>
                    <TouchableOpacity onPress={() => setCondition("New")} style={{ width: 80, height: 40, backgroundColor: condition === "New" ? "#7DBD3F" : "white", borderRadius: 10, justifyContent: "center", alignItems: "center", borderColor: "#7DBD3F", borderWidth: 2 }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: condition === "New" ? "white" : "black" }}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondition("As New")} style={{ width: 80, height: 40, backgroundColor: condition === "As New" ? "#7DBD3F" : "white", borderRadius: 10, justifyContent: "center", alignItems: "center", borderColor: "#7DBD3F", borderWidth: 2 }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: condition === "As New" ? "white" : "black" }}>As New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondition("Used")} style={{ width: 80, height: 40, backgroundColor: condition === "Used" ? "#7DBD3F" : "white", borderRadius: 10, justifyContent: "center", alignItems: "center", borderColor: "#7DBD3F", borderWidth: 2 }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: condition === "Used" ? "white" : "black" }}>Used</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondition("Very Used")} style={{ width: 90, height: 40, backgroundColor: condition === "Very Used" ? "#7DBD3F" : "white", borderRadius: 10, justifyContent: "center", alignItems: "center", borderColor: "#7DBD3F", borderWidth: 2 }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: condition === "Very Used" ? "white" : "black" }}>Very Used</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ marginTop: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20 }}>Contact Email: {userEmail}</Text>
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, flexDirection: "row", alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }}>@</Text>
                    <View style={{ width: 1, height: '80%', backgroundColor: '#7DBD3F', marginHorizontal: 10 }} />
                    <TextInput value={instaID} onChangeText={(text) => setInstaID(text)} style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Insta ID (Optional)" />
                </View>

                <TouchableOpacity style={{ width: 150, height: 40, backgroundColor: "#7DBD3F", borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "center", borderColor: "#7DBD3F", borderWidth: 2, marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, color: "white", fontWeight: "bold" }}>Add Images</Text>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    )
}

export default AddBazaarScreen