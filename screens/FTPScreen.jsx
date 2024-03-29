import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, Text } from 'react-native';
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
            {connectionType === 'wifi' ? <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={{ flex: 1 }}
                injectedJavaScript={autoLoginScript}
                javaScriptEnabled={true}
                allowsFullscreenVideo={true}
                domStorageEnabled={true}
            /> 
            : 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize:20}}>Connect to the Institute Network</Text>
            </View>}
            
        </SafeAreaView>
    );
};

export default FTPScreen;

const styles = StyleSheet.create({});
