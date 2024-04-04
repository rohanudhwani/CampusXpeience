import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { fireDb } from '../firebase';
import { collection, getDocs } from '@firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

const StudentBazaarScreen = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const categories = ['All', 'Electronics', 'Sports & Games', 'Furniture', 'Collectibles & Antiques', 'Study Materials', 'Others'];
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    const navigation = useNavigation();
    const isFocused = useIsFocused();


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(fireDb, "bazaar"));
                const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort itemsData based on createdAt field in descending order
                itemsData.sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)));
                setItems(itemsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setLoading(false);
            }
        };

        fetchItems();
    }, [isFocused]);

    useEffect(() => {
        let filtered = items;
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }
        if (searchQuery !== '') {
            filtered = filtered.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setFilteredItems(filtered);
    }, [searchQuery, selectedCategory, items]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#7DBD3F" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <ScrollView>
                <View style={{ backgroundColor: "#94F074" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text onPress={() => console.log("Text pressed")} style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Student Bazaar</Text>
                    </View>
                </View>
                <TextInput value={searchQuery} onChangeText={setSearchQuery} style={{ borderColor: "#C8F7B1", padding: 10, borderRadius: 10, borderWidth: 2, marginLeft: 20, marginRight: 20, marginTop: 10 }} placeholder="Search for items" />
                <View style={{ marginTop: 10, marginRight: 20, marginLeft: 20, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, backgroundColor: '#7DBD3F' }}>
                    <Picker selectedValue={selectedCategory} mode={'dropdown'} onValueChange={setSelectedCategory}>
                        {categories.map((category, index) => (
                            <Picker.Item key={index} label={category} value={category} style={{ fontSize: 15, color: "white", backgroundColor: '#7DBD3F' }} />
                        ))}
                    </Picker>
                </View>
                <View style={{ marginTop: 20, gap: 20, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
                    {filteredItems.map(item => (
                        <TouchableOpacity onPress={() => navigation.navigate("Student Bazaar Details", { item: item })} key={item.id} style={{ flexDirection: 'row', backgroundColor: "#C8F7B1", borderRadius: 15, height: 160, alignItems: "center" }}>
                            <Image source={{ uri: item.mainImage }} style={{ width: 150, height: '100%', borderRadius: 15 }} resizeMode="cover" />
                            <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start", marginBottom: 16, paddingTop: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{item.title}</Text>
                                <Text style={{ fontSize: 15, fontWeight: "400", textAlign: "center", marginTop: 25 }}>Condition: {item.condition}</Text>
                                <Text style={{ fontSize: 17, fontWeight: "400", textAlign: "center", marginTop: 5 }}>Price: ₹{item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity style={{ position: 'absolute', bottom: 80, right: 20, backgroundColor: "white", borderRadius: 50 }} onPress={() => navigation.navigate("Add Bazaar")} >
                <Ionicons name="add-circle-outline" size={60} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default StudentBazaarScreen;

const styles = StyleSheet.create({});
