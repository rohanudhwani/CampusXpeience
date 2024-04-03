import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { fireDb, auth, storageRef, storage } from '../firebase';
import { collection, getDocs } from '@firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytes } from 'firebase/storage';


const AddBazaarScreen = () => {
    const navigation = useNavigation();


    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [condition, setCondition] = useState("New")
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
            console.log("hello", Array.isArray(images_to_upload))
            const uploadTasks = images_to_upload.map(async (imageUri, index) => {
                const timestamp = Date.now(); // Get current timestamp
                const imageName = `image_${timestamp}_${index}`;

                const response = await fetch(imageUri);
                const blob = await response.blob();
                const imageRef = storageRef(storage, `bazaar/image_${imageName}`);

                return uploadBytes(imageRef, blob).then((snapshot) => {
                    return getDownloadURL(snapshot.ref).then((downloadURL) => {
                        console.log("Image uploaded. Download URL:", downloadURL);
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
    
            console.log('Ad added to Bazaar with ID:', docRef.id);
            return docRef.id; // Return the ID of the newly added document
        } catch (error) {
            console.error('Error adding ad to Bazaar:', error);
            return null; // Return null in case of error
        }

    }

    useEffect(() => {
        if (title !== "" && description !== "" && price !== "" && selectedImages.length !== 0) {
            setAllowToPost(true)
        }
    }, [title, description, price, selectedImages])



    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
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

                <Text style={{ marginTop: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20, marginRight: 20 }}>Contact Email: {userEmail}</Text>
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 40, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, flexDirection: "row", alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }}>@</Text>
                    <View style={{ width: 1, height: '80%', backgroundColor: '#7DBD3F', marginHorizontal: 10 }} />
                    <TextInput value={instaID} onChangeText={(text) => setInstaID(text)} style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Insta ID (Optional)" />
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

                <TouchableOpacity onPress={() => postAd()} style={{ width: 150, height: 40, backgroundColor: allowToPost === true ? "#7DBD3F" : "gray", borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "center", borderColor: "#7DBD3F", borderWidth: 2, marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 100 }}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, color: "white", fontWeight: "bold" }}>Post AD</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

export default AddBazaarScreen