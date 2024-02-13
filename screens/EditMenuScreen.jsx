import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const EditMenuScreen = ({ route }) => {
    const { date, meal, item } = route.params;
    return (
        <SafeAreaView>
            <Text>{date} {meal} {item}</Text>
        </SafeAreaView>
    )
}

export default EditMenuScreen

const styles = StyleSheet.create({})