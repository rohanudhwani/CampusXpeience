import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { fireDb } from '../firebase';
import { collection, getDocs } from '@firebase/firestore';



const StudentBazaarScreen = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // const bazaarCollection = fireDb.collection('bazaar');
                const snapshot = await getDocs(collection(fireDb, "bazaar"));
                const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setItems(itemsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setLoading(false);
            }
        };

        fetchItems();
    }, [items]);

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


                <View style={{ marginTop: 30, gap: 20, marginLeft: 20, marginRight: 20, marginBottom: 100 }}>
                    {items.map(item => (
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

            <TouchableOpacity style={{position: 'absolute', bottom: 80, right: 20, backgroundColor: "white", borderRadius: 50}} onPress={() => navigation.navigate("Add Bazaar")} >
                <Ionicons name="add-circle-outline" size={60} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default StudentBazaarScreen;

const styles = StyleSheet.create({});
