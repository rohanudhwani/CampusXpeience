import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const EditMenuScreen = ({ route }) => {
    const { date, meal, item, dishes, updates } = route.params;
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');

    const handleClick = (dishName) => {
        if (!updates[date]) {
            updates[date] = {};
        }
        if (!updates[date][meal]) {
            updates[date][meal] = {};
        }
        updates[date][meal][item] = dishName;

        update(ref(db, '/updates'), updates)
            .then(() => {
                console.log('Updates JSON successfully updated in the database');
            })
            .catch((error) => {
                console.error('Error updating updates JSON:', error);
            });

        navigation.replace('Root');
    }

    // Filter dishes based on search text
    const filteredDishes = Object.entries(dishes).filter(([dishName]) => {
        return dishName.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <SafeAreaView style={{ backgroundColor: "#94F074", flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20 }}>
                <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Edit Menu</Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 15, marginBottom: 10 }}>
                <Text style={{ fontSize: 16 }}>{date}</Text>
                <Text style={{ fontSize: 16 }}> {meal}-{item}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, backgroundColor: '#EFEFEF', borderRadius: 10, paddingHorizontal: 10 }}>
                <TextInput
                    style={{ flex: 1, paddingVertical: 10, fontSize: 16 }}
                    placeholder="Search Dishes"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <Ionicons name="search" size={24} color="black" style={{ marginRight: 10 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 150 }}>
                    {filteredDishes.map(([dishName, dishImageUri], index) => (
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
    );
};

export default EditMenuScreen;
