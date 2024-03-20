import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutMeScreen = () => {
    // Define your information
    const name = 'Rohan Udhwani';
    const description = 'Passionate Mobile Developer, 3rd year student at IIIT Nagpur';
    const linkedinLink = 'https://www.linkedin.com/in/rohanudhwani/';
    const instagramLink = 'https://www.instagram.com/rohanudhwanii/';
    const coffeeLink = 'https://paypal.me/rohanudhwani?country.x=IN&locale.x=en_GB';
    const avatarImage = 'https://media.licdn.com/dms/image/D5603AQFmHxz6YUhoUA/profile-displayphoto-shrink_800_800/0/1703168954891?e=1716422400&v=beta&t=nthQO99woNSpOE_NQRkEQ4A8Sg35wUPjjL4-jqc4fl0';

    // Function to open a link in the browser
    const openLink = (url) => {
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Image source={{ uri: avatarImage }} style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 40 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{name}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 20, gap: 10 }}>
                <TouchableOpacity onPress={() => openLink(linkedinLink)}>
                    <Entypo name="linkedin" size={24} color="blue" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink(instagramLink)}>
                    <Entypo name="instagram" size={24} color="blue" />
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', marginLeft: 10, marginRight: 10 }}>{description}</Text>
            <TouchableOpacity onPress={() => openLink(coffeeLink)} style={{flexDirection:"row", alignItems:"baseline", gap:5}}>
                <Entypo name="paypal" size={24} color="orange" />
                <Text style={{ fontSize: 16, color: 'orange', textDecorationLine: 'underline', marginBottom: 60 }}>Buy Me a Coffee</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default AboutMeScreen;
