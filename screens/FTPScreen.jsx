import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, Text, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';

const FTPScreen = () => {
    const webViewRef = useRef(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const url = 'http://192.168.77.84/FileRun'

    const handleBackPress = () => {
        if (webViewRef.current) {
            webViewRef.current.goBack();
            return true;
        }
        return false;
    };

    const [connectionType, setConnectionType] = useState('');
    const [isUrlReachable, setIsUrlReachable] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConnectionType(state.type);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isFocused && webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.location = '${url}'`);
        }
    }, [isFocused]);

    useEffect(() => {
        if (connectionType === 'wifi') {
            fetch(url)
                .then(response => setIsUrlReachable(true))
                .catch(error => setIsUrlReachable(false));
        }
    }, [connectionType]);



    useEffect(() => {
        // Set up back button handler
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            // Remove back button handler
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []);

    const autoLoginScript = `
    var usernameField = document.querySelector('input[name="username"]');
    var passwordField = document.querySelector('input[name="password"]');
    var signInButton = document.querySelector('.fr-btn-primary');

    if (usernameField && passwordField && signInButton) {
      usernameField.value = 'crispr';
      passwordField.value = 'crispr';
      signInButton.click();
    }
  `;


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            {connectionType === 'wifi' && isUrlReachable ? <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={{ flex: 1 }}
                injectedJavaScript={autoLoginScript}
                javaScriptEnabled={true}
                allowsFullscreenVideo={true}
                domStorageEnabled={true}
            />
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/no_connection.png')} style={{ width: 200, height: 200 }} resizeMode="cover" />
                    <Text style={{ fontSize: 20, textAlign: 'center', paddingHorizontal: 10 }}>
                        Please connect to the IIITN Institute Wi-Fi network to continue using the FTP Feature of the app.
                    </Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', paddingHorizontal: 10 }}>
                        Ensure you are connected to the correct network for seamless access to all features.
                    </Text>
                </View>
            }

        </SafeAreaView>
    );
};

export default FTPScreen;

const styles = StyleSheet.create({});
