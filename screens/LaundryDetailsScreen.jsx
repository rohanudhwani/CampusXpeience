import React, { useRef, useState } from 'react';
import { Image, View, Dimensions, FlatList, Text, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusBar } from 'expo-status-bar';

const LaundryDetailsScreen = ({ route }) => {
    const { laundryName, laundryDetails } = route.params;

    const ratecardImages = laundryDetails.ratecard;
    const [currentPage, setCurrentPage] = useState(0);
    const [showImageZoom, setShowImageZoom] = useState(false); // State for controlling image zoom viewer
    const flatListRef = useRef();

    const handlePageChange = (event) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / Dimensions.get('window').width);
        setCurrentPage(index);
    };

    const handleCallPress = () => {
        const contactNumber = laundryDetails.contactNumber;

        if (contactNumber) {
            const phoneNumber = `tel:${contactNumber}`;
            Linking.openURL(phoneNumber)
                .then((supported) => {
                    if (!supported) {
                        console.log("Phone number is not available");
                    }
                })
                .catch((err) => console.error('Error opening phone dialer:', err));
        } else {
            console.log("Contact number is not available");
        }
    };

    const renderratecardImages = () => {
        return ratecardImages.map((image, index) => ({
            url: image,
            props: {
                style: { width: "100%", height: 550 },
            },
        }));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#94F074" barStyle="dark-content" />
            <View style={{ backgroundColor: "#94F074" }}>
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20, paddingHorizontal: 20, marginBottom: 16 }}>
                    <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "600" }}>{laundryName}</Text>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "400", marginTop: 4 }}>{laundryDetails.timings}</Text>
                </View>
            </View>
            {/* <FlatList
                ref={flatListRef}
                data={ratecardImages}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setShowImageZoom(true)}>
                        <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                    </TouchableOpacity>
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handlePageChange}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {ratecardImages.map((_, index) => (
                    <View key={index} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: index === currentPage ? '#000' : 'rgba(0, 0, 0, 0.4)', marginHorizontal: 5 }} />
                ))}
            </View> */}

            {/* Image Zoom Viewer */}
            <View style={{ width: Dimensions.get('window').width, height: 550 }}>
                <ImageViewer
                    imageUrls={renderratecardImages()}
                    enableSwipeDown
                    onSwipeDown={() => setShowImageZoom(false)}
                    index={currentPage}
                    isVisible={showImageZoom}
                />
            </View>


            <View style={{ padding: 12, marginTop: 25, marginLeft: 20, marginRight: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 5, borderWidth: 4, borderColor: "#6CAB3C" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image style={{ width: 50, height: 50, borderRadius: 100 }} source={{ uri: "https://icons.veryicon.com/png/o/object/material-design-icons/face-2.png" }} resizeMode='cover' />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 18, fontWeight: "700", marginLeft: 10 }}>{laundryDetails.owner}</Text>
                </View>

                <View style={{flexDirection:"row", gap:10}}>
                    <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                        <TouchableOpacity onPress={handleCallPress} style={{ borderWidth: 4, borderColor: "#6CAB3C", borderRadius: 200, padding: 8 }}>
                            <Ionicons name="call-outline" size={25} color="black" style={{ justifyContent: 'center', alignItems: 'center' }} />
                        </TouchableOpacity>
                    </View>

                    {
                        laundryDetails.gmaps && (
                            <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                <TouchableOpacity onPress={() => Linking.openURL(laundryDetails.gmaps)} style={{ borderWidth: 4, borderColor: "#6CAB3C", borderRadius: 200, padding: 8 }}>
                                    <Entypo name="location" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>

            </View>
        </SafeAreaView>
    );
};

export default LaundryDetailsScreen;
