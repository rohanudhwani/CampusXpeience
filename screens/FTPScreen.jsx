import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const FTPScreen = () => {
    const webViewRef = useRef(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const url = 'http://192.168.77.84/FileRun/#/HOME'

    const handleBackPress = () => {
        if (webViewRef.current) {
            webViewRef.current.goBack();
            return true;
        }
        return false;
    };

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
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={{ flex: 1 }}
                injectedJavaScript={autoLoginScript}
                javaScriptEnabled={true}
            />
        </SafeAreaView>
    );
};

export default FTPScreen;

const styles = StyleSheet.create({});
