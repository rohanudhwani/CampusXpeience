import React, { useEffect, useState } from 'react';
import { Image, View, Dimensions, Text, Linking, TouchableOpacity, ScrollView, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusBar } from 'expo-status-bar';
import { auth, fireDb } from '../firebase';
import { collection, getDocs, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const StudentBazaarDetailsScreen = ({ route }) => {
    const item = route.params.item;

    const navigation = useNavigation();

    const images = item.images;
    // const [images, setImages] = useState(item.images);
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
        try {
            const userDocRef = doc(fireDb, "users", userID);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const userEmail = userData.email;
                const subject = `Regarding ${item.title}`;
                const body = `Hi, I saw your ad on CampusXperience of ${item.title}. I am interested in it. Let me know if it is still available. Thanks!`;
                const mailtoUrl = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                Linking.openURL(mailtoUrl)
                    .then((supported) => {
                        if (!supported) {
                            console.log("Email app is not available");
                        }
                    })
                    .catch((err) => console.error('Error opening email app:', err));
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


    const deleteAd = async () => {
        if (auth.currentUser.uid !== item.userid) {
            return;
        }

        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this ad?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            const adDocRef = doc(fireDb, 'bazaar', item.id);
                            await deleteDoc(adDocRef);
                            navigation.navigate('Student Bazaar');
                        } catch (error) {
                            console.error('Error deleting ad:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Handle the back button press
            // For example, navigate back to the StudentBazaarScreen
            navigation.navigate('Student Bazaar');
            // Return true to prevent default behavior (exit the app)
            return true;
        });

        // Clean up the event listener
        return () => backHandler.remove();
    }, [navigation]);

    useEffect(() => {
        // Update the description when the item prop changes
        setDescription(item.description.substring(0, 150));
        setCurrentPage(0);
        // setImages(item.images);

    }, [route]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <View style={{ backgroundColor: "#94F074" }}>
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20, paddingHorizontal: 20, marginBottom: 16 }}>
                    <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "600" }}>{item.title}</Text>
                </View>
            </View>

            <ScrollView>
                {/* Image Zoom Viewer */}
                <View style={{ width: Dimensions.get('window').width, height: 400 }}>
                    <ImageViewer
                        key={item.id}
                        imageUrls={renderImages()}
                        enableSwipeDown
                        onSwipeDown={() => setShowImageZoom(false)}
                        index={currentPage}
                        isVisible={showImageZoom}
                    />
                </View>

                <View style={{ marginLeft: 20, marginRight: 20, marginTop: 5 }}>
                    <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>{item.condition} for ₹{item.price}</Text>
                    <Text style={{ marginTop: 10 }}>{description}
                        <Text onPress={handleReadMoreLess} style={{ color: "#5552E9" }}> {readState} ...</Text>
                    </Text>
                </View>


                <View style={{ padding: 12, marginTop: 25, marginLeft: 20, marginRight: 20, marginBottom: 90, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 5, borderWidth: 4, borderColor: "#6CAB3C" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 100 }} source={{ uri: "https://icons.veryicon.com/png/o/object/material-design-icons/face-2.png" }} resizeMode='cover' />
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, fontWeight: "700", marginLeft: 10 }}>{item.postedBy}</Text>
                    </View>

                    <View style={{ flexDirection: "row", gap: 20, marginRight: 10 }}>
                        <TouchableOpacity onPress={() => handleEmailPress(item.userid)} style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                            <MaterialIcons name="email" size={32} color="black" style={{ justifyContent: 'center', alignItems: 'center' }} />
                        </TouchableOpacity>

                        {
                            item.instaID && (
                                <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${item.instaID}`)} style={{}}>
                                        <Entypo name="instagram" size={28} color="black" style={{ justifyContent: 'center', alignItems: 'center' }} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                </View>

                {
                    auth.currentUser.uid === item.userid && (
                        <View style={{ position: "absolute", bottom: 20, right: 20, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => deleteAd()} style={{ backgroundColor: "#6CAB3C", padding: 10, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons name="delete" size={24} color="white" />
                                <Text style={{ color: "white", marginLeft: 5 }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default StudentBazaarDetailsScreen