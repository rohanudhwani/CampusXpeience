import { Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import WifiManager from "react-native-wifi-reborn";
import { PermissionsAndroid, SafeAreaView } from 'react-native';

const FortinetLoginScreen = () => {
    const [granted, setGranted] = useState();

    const handlePress = async () => {
        try {
            WifiManager.setEnabled(false);
            console.log("Wifi off ");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location permission is required for WiFi connections',
                        message:
                            'This app needs location permission as this is required ' +
                            'to scan for wifi networks.',
                        buttonNegative: 'DENY',
                        buttonPositive: 'ALLOW',
                    },
                );
                setGranted(result);
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permission granted');
                    // Now you can initiate WiFi connection logic here
                } else {
                    console.log('Permission denied');
                }
            } catch (error) {
                console.error('Error requesting location permission:', error);
            }
        };

        if (!granted) {
            requestLocationPermission();
        }
    }, [granted]);

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={handlePress} style={{ margin: 100 }}>
                <Text>Press me</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FortinetLoginScreen;
