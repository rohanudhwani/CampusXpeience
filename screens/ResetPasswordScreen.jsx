import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendPasswordResetEmail  } from 'firebase/auth';
import { auth } from '../firebase';

const ResetPasswordScreen = () => {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigation = useNavigation()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoading(false)
      }
      if (user) {
        navigation.replace("Root")
      }
    })
    return unsubscribe
  }, [])

  const onResetPassword = () => {
    if (email === "") {
      Alert.alert(
        "Error",
        "Please enter an email",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return;
    }
    
  
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent successfully to:", email);
        // You can display a success message to the user
        Alert.alert(
          "Check your email!",
          "Password reset email sent",
          [
            { text: "OK", onPress: () => navigation.navigate("Login") }
          ]
        );
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        // Handle specific error cases
        if (error.code === 'auth/invalid-email') {
          console.log("The email address is invalid.");
          Alert.alert(
            "Error",
            "The email address is invalid.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        } else if (error.code === 'auth/user-not-found') {
          console.log("There is no user corresponding to the provided email.");
          Alert.alert(
            "Error",
            "There is no user corresponding to the provided email.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        } else {
          console.log("An unknown error occurred.");
          Alert.alert(
            "Error",
            "An unknown error occurred.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        }
      });
  }





  return (
    <SafeAreaView style={{ backgroundColor: "#EEF3F6" }}>
      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", flex: 1 }}>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" color="#7DBD3F" />
        </View>
      ) : (
        <KeyboardAvoidingView>
          <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 25, color: "#5A7587", fontWeight: "bold" }}>CampusXperience</Text>
          </View>

          <View style={{ marginTop: 60, marginLeft: 20 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 25, fontWeight: "bold" }}>Reset your Password</Text>
            <Text style={{ marginTop: 10, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }}>Please enter your registered email</Text>
          </View>

          <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{ marginTop: 70, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Email Address" />

          <View style={{ marginTop: 20, justifyContent: "space-between", flexDirection: "row", marginRight: 20, marginLeft: 20 }}>
            <Text onPress={() => navigation.navigate("SignUp")} style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: "gray" }}>Sign Up?</Text>
          </View>

          <TouchableOpacity onPress={() => onResetPassword()} style={{ marginTop: 30, marginLeft: 20, marginRight: 20, height: 50, backgroundColor: "#7DBD3F", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "white", fontWeight: "bold" }}>Send Reset Password Link on Email</Text>
          </TouchableOpacity>

          {/* <View style={{ marginTop: 25, justifyContent: "center", alignItems: "center" }}>
            <Text>Or Login with</Text>
          </View>


          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: 25, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#94F074', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Email Address">
            <Image source={require('../assets/google.png')} style={{ width: 30, height: 30, marginLeft: 40 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 20 }}>Login using Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: 25, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#94F074', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Email Address">
            <Image source={require('../assets/facebook.png')} style={{ width: 16, height: 30, marginLeft: 45 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray", marginLeft: 29 }}>Login using Facebook</Text>
          </TouchableOpacity> */}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({})