import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const EditMenuScreen = ({ route }) => {
    const { date, meal, item, dishes, updates } = route.params;

    const navigation = useNavigation();

    const handleClick = (dishName) => {
        if (!updates[date]) {
            updates[date] = {};
        }

        if (!updates[date][meal]) {
            updates[date][meal] = {};
        }
    
        // Update the dishName for the specified item
        updates[date][meal][item] = dishName;

        update(ref(db, '/updates'), updates)
        .then(() => {
            console.log('Updates JSON successfully updated in the database');
        })
        .catch((error) => {
            console.error('Error updating updates JSON:', error);
        });

        navigation.replace('Menu');
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#94F074" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20 }}>
                <Text onPress={() => console.log(isAdmin)} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Edit Menu</Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 15, gap: 5 }}>
                <Text style={{ fontSize: 16 }}>{date}</Text>
                <Text style={{ fontSize: 16 }}> {meal}-{item}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 150 }}>
                    {Object.entries(dishes).map(([dishName, dishImageUri], index) => (
                        <TouchableOpacity onPress={() => handleClick(dishName)} key={index} style={{ backgroundColor: "#C8F7B1", borderRadius: 15, width: '48%', marginBottom: 15 }}>
                            <Image source={{ uri: dishImageUri }} style={{ width: '100%', height: 110, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} resizeMode="cover" />
                            <View style={{ padding: 8 }}>
                                <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", marginTop: 2 }}>{dishName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}


export default EditMenuScreen

const styles = StyleSheet.create({})