import { View } from 'react-native'
import React from 'react'
import MapComponent from '../Components/MapComponent'

export default function MapScreen({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <MapComponent navigation={navigation} />
        </View>
    )
}