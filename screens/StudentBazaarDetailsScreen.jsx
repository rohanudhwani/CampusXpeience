import React, { useState } from 'react';
import { Image, View, Dimensions, Text, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusBar } from 'expo-status-bar';
import { fireDb } from '../firebase';
import { collection, getDocs, getDoc, doc } from '@firebase/firestore';

const StudentBazaarDetailsScreen = ({ route }) => {
    const item = route.params.item;

    const images = item.images;
    const [currentPage, setCurrentPage] = useState(0);
    const [showImageZoom, setShowImageZoom] = useState(false); // State for controlling image zoom viewer

    const [description, setDescription] = useState(item.description.substring(0, 150))
    const [readState, setReadState] = useState("Read More")

    const handleReadMoreLess = () => {
        if (readState === "Read More") {
            setDescription(item.description)
            setReadState("Read Less")
        } else {
            setDescription(item.description.substring(0, 150))
            setReadState("Read More")
        }
    }

    const renderImages = () => {
        return images.map((image, index) => ({
            url: image,
            props: {
                style: { width: "100%", height: 550 },
            },
        }));
    };

    const handleEmailPress = async (userID) => {
        console.log('UUID:', userID);
        try {
            const userDocRef = doc(fireDb, "users", userID);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const userEmail = userData.email;
                console.log('User email:', userEmail);
                return userEmail;
            } else {
                console.log("User document does not exist");
                return null;
            }
        } catch (error) {
            // Handle any errors that occur during the retrieval
            console.error('Error fetching user email:', error);
            return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <View style={{ backgroundColor: "#94F074" }}>
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20, paddingHorizontal: 20, marginBottom: 16 }}>
                    <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "600" }}>{item.title}</Text>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "400", marginTop: 4 }}>{item.price}</Text>
                </View>
            </View>

            <ScrollView>
                {/* Image Zoom Viewer */}
                <View style={{ width: Dimensions.get('window').width, height: 500 }}>
                    <ImageViewer
                        imageUrls={renderImages()}
                        enableSwipeDown
                        onSwipeDown={() => setShowImageZoom(false)}
                        index={currentPage}
                        isVisible={showImageZoom}
                    />
                </View>

                <Text style={{ marginTop: 20 }}>{description}
                    <Text onPress={handleReadMoreLess} style={{ color: "#5552E9" }}> {readState} ...</Text>
                </Text>


                <View style={{ padding: 12, marginTop: 25, marginLeft: 20, marginRight: 20, marginBottom: 90, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 5, borderWidth: 4, borderColor: "#6CAB3C" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 100 }} source={{ uri: "https://icons.veryicon.com/png/o/object/material-design-icons/face-2.png" }} resizeMode='cover' />
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, fontWeight: "700", marginLeft: 10 }}>Rohan</Text>
                    </View>

                    <TouchableOpacity onPress={() => handleEmailPress(item.userID)} style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", marginRight: 10 }}>
                        <MaterialIcons name="email" size={32} color="black" style={{ justifyContent: 'center', alignItems: 'center' }} />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StudentBazaarDetailsScreen