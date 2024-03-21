import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = () => {


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

  const handleLogin = () => {
    if (email === "" || password === "") {
      Alert.alert(
        "Invalid Details",
        "Please fill all the fields",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential._tokenResponse.user;
      setEmail("")
      setPassword("")
    }).catch((error) => {
      Alert.alert(
        "Sign In Unsuccessful",
        "Wrong email or password",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return;
    });
  }

  const handleCallPress = () => {

    const phoneNumber = `tel:9324088967`;
    Linking.openURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          console.log("Phone number is not available");
        }
      })
      .catch((err) => console.error('Error opening phone dialer:', err));

  };



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
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 25, fontWeight: "bold" }}>Login to your Account</Text>
            <Text style={{ marginTop: 10, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }}>Please login to access your account</Text>
          </View>

          <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{ marginTop: 70, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Email Address" />
          <TextInput value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true} style={{ marginTop: 40, marginLeft: 20, marginRight: 20, height: 50, borderColor: '#7DBD3F', borderWidth: 2, borderRadius: 10, paddingLeft: 20, fontFamily: 'Inter_400Regular', fontSize: 15, color: "gray" }} placeholder="Enter Password" />

          <View style={{ marginTop: 20, justifyContent: "space-between", flexDirection: "row", marginRight: 20, marginLeft: 20 }}>
            <Text onPress={() => navigation.navigate("SignUp")} style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: "gray" }}>Sign Up?</Text>
            <Text onPress={() => handleCallPress()} style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: "gray" }}>Forgot Password?</Text>
          </View>

          <TouchableOpacity onPress={() => handleLogin()} style={{ marginTop: 30, marginLeft: 20, marginRight: 20, height: 50, backgroundColor: "#7DBD3F", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: "white", fontWeight: "bold" }}>Login</Text>
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

export default LoginScreen

const styles = StyleSheet.create({})