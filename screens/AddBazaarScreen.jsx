import { ActivityIndicator, BackHandler, Button, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { fireDb, auth, storageRef, storage } from '../firebase';
import { addDoc, collection, doc, getDocs, setDoc, updateDoc } from '@firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { Picker } from '@react-native-picker/picker';


const AddBazaarScreen = () => {
    const navigation = useNavigation();

    const categories = ['Electronics', 'Sports & Games', 'Furniture', 'Collectibles & Antiques', 'Study Materials', 'Others'];

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [condition, setCondition] = useState("New")
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [name, setName] = useState("")
    const [instaID, setInstaID] = useState("")

    const [selectedImages, setSelectedImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [allowToPost, setAllowToPost] = useState(false)

    const userEmail = auth.currentUser ? auth.currentUser.email : null;

    const selectImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            multiple: true, // Allow selecting multiple images
        });
        if (!result.canceled) {
            setSelectedImages(selectImages => [...selectImages, result.assets[0].uri]);
        }
    };

    const uploadImagesToStorage = async (images_to_upload) => {
        try {
            // Create a reference to the storage location
            let downloadURLs = [];
            const uploadTasks = images_to_upload.map(async (imageUri, index) => {
                const timestamp = Date.now(); // Get current timestamp
                const imageName = `image_${timestamp}_${index}`;

                const response = await fetch(imageUri);
                const blob = await response.blob();
                const imageRef = storageRef(storage, `bazaar/image_${imageName}`);

                return uploadBytes(imageRef, blob).then((snapshot) => {
                    return getDownloadURL(snapshot.ref).then((downloadURL) => {
                        return downloadURL;
                    });
                });
            });

            // Wait for all upload tasks to complete
            const results = await Promise.all(uploadTasks);
            downloadURLs = results.filter(url => url !== undefined); // Filter out any undefined URLs
            return downloadURLs; // Return an array of download URLs
        } catch (error) {
            console.error("Error uploading images:", error);
            return []; // Return an empty array in case of error
        }
    };


    const postAd = async () => {
        if (title === "") {
            alert("Please add an Ad Title")
            return
        }
        if (description === "") {
            alert("Please enter a description")
            return
        }
        if (price === "") {
            alert("Please enter price")
            return
        }
        if (name === "") {
            alert("Please enter your name")
            return
        }
        if (selectedImages.length === 0) {
            alert("Please select images")
            return
        }

        const uploadedImages = await uploadImagesToStorage(selectedImages)


        const adData = {
            title: title,
            description: description,
            price: price,
            condition: condition,
            category: selectedCategory,
            postedBy: name,
            instaID: instaID,
            userid: auth.currentUser.uid,
            images: uploadedImages,
            mainImage: uploadedImages[mainImageIndex],
            createdAt: new Date().toISOString()
        }

        try {
            // Reference to the 'bazaar' collection
            const bazaarCollection = collection(fireDb, 'bazaar');

            // Add a new document with auto-generated ID
            const docRef = await addDoc(bazaarCollection, adData);
        } catch (error) {
            console.error('Error adding ad to Bazaar:', error);
            alert("Error posting ad. Please try again later.")
            return null; // Return null in case of error
        }

        try {
            const uid = auth.currentUser ? auth.currentUser.uid : null;
            const userDataRef = doc(fireDb, 'users', uid);

            const userData = {
                displayName: name,
            };
            if (instaID !== null) {
                userData.instaID = instaID;
            }

            // Set the user data in Firestore
            await updateDoc(userDataRef, userData);
        } catch (error) {
            console.error('Error adding user data to Firestore:', error);
        }

        alert("Ad posted successfully!")
        navigation.navigate('Student Bazaar');

    }

    useEffect(() => {
        if (title !== "" && description !== "" && price !== "" && name !== "" && selectedImages.length !== 0) {
            setAllowToPost(true)
        }
    }, [title, description, price, selectedImages])

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


    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ backgroundColor: "#94F074" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, marginBottom: 20 }}>
                            <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}>Add to Bazaar</Text>
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

                    <Text style={{ marginTop: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20 }}>Select Category</Text>
                    <View style={{ marginTop: 10, marginRight: 20, marginLeft: 20, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, backgroundColor: '#7DBD3F' }}>
                        <Picker selectedValue={selectedCategory} mode={'dropdown'} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={{}} >
                            {categories.map((category, index) => (
                                <Picker.Item key={index} label={category} value={category} style={{ fontSize: 15, color: "white", backgroundColor: '#7DBD3F' }} />
                            ))}
                        </Picker>
                    </View>

                    <TextInput value={name} onChangeText={(text) => setName(text)} style={{ marginTop: 20, marginLeft: 20, marginRight: 20, height: 40, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Contact Name" />
                    <Text style={{ marginTop: 10, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20 }}>Contact Email: {userEmail}</Text>
                    <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 40, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, flexDirection: "row", alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }}>@</Text>
                        <View style={{ width: 1, height: '80%', backgroundColor: '#7DBD3F', marginHorizontal: 10 }} />
                        <TextInput autoCapitalize='none' value={instaID} onChangeText={(text) => setInstaID(text)} style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Insta ID (Optional)" />
                    </View>

                    <TouchableOpacity onPress={() => selectImages()} style={{ width: 150, height: 40, backgroundColor: "#7DBD3F", borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "center", borderColor: "#7DBD3F", borderWidth: 2, marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, color: "white", fontWeight: "bold" }}>Add Images</Text>
                    </TouchableOpacity>



                    {selectedImages.length > 0 && (
                        <View style={{ marginTop: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20, marginBottom: 10 }}>Set Main Image:</Text>
                            {selectedImages.map((imageUri, index) => (
                                (index % 3 === 0) ? (
                                    <View key={index} style={{ flexDirection: 'row', marginBottom: 15 }}>
                                        <TouchableOpacity onPress={() => setMainImageIndex(index)}>
                                            <Image source={{ uri: selectedImages[index] }} style={{ width: 110, height: 110, marginRight: 10, backgroundColor: "gray", borderColor: mainImageIndex === index ? '#7DBD3F' : 'transparent', borderWidth: 5 }} resizeMode='contain' />
                                        </TouchableOpacity>
                                        {(index + 1 < selectedImages.length) && (
                                            <TouchableOpacity onPress={() => setMainImageIndex(index + 1)}>
                                                <Image source={{ uri: selectedImages[index + 1] }} style={{ width: 110, height: 110, marginRight: 10, backgroundColor: "gray", borderColor: mainImageIndex === index + 1 ? '#7DBD3F' : 'transparent', borderWidth: 5 }} resizeMode='contain' />
                                            </TouchableOpacity>
                                        )}
                                        {(index + 2 < selectedImages.length) && (
                                            <TouchableOpacity onPress={() => setMainImageIndex(index + 2)}>
                                                <Image source={{ uri: selectedImages[index + 2] }} style={{ width: 110, height: 110, backgroundColor: "gray", borderColor: mainImageIndex === index + 2 ? '#7DBD3F' : 'transparent', borderWidth: 5 }} resizeMode='contain' />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : null
                            ))}
                        </View>
                    )}

                    <TouchableOpacity onPress={() => postAd()} style={{ width: 180, height: 60, backgroundColor: allowToPost === true ? "#7DBD3F" : "gray", borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "center", borderColor: "#7DBD3F", borderWidth: 2, marginLeft: 20, marginRight: 20, marginTop: 40, marginBottom: 100 }}>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize:22, color: "white", fontWeight: "bold" }}>Post AD</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddBazaarScreen