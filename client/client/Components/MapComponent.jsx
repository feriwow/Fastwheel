import { View, Text, StyleSheet, Button, Touchable } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import React, { useEffect, useRef, useState } from 'react'
import { GOOGLE_KEY } from '../key';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { getCurrentLocation, locationPermission } from '../helper/helper';
import * as Location from "expo-location"
import { initializeApp } from 'firebase/app' // utk mulainya
import { getFirestore, addDoc, updateDoc, collection, doc, setDoc, deleteDoc } from "firebase/firestore" // utk fire store databasenya
import mark from '../icons/iconmark.png'
import mobil from '../icons/garageicon.png'

const LOCATION_DISTANCE_THRESHOLD = 1

const MapComponent = ({ navigation }) => {
    const mapRef = useRef()
    // -6.260477061550357, 106.78171522427996
    const [mapReady, setMapReady] = useState(false)
    const [location, setLocation] = useState({
        pickupCords: {
            latitude: -6.260477061550357,
            longitude: 106.78171522427996
        },
        dropLocationCors: {
            latitude: -6.260477061550357,
            longitude: 106.78171522427996
        }
    })

    useEffect(() => {
        let subscription

        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                Alert.alert("ditolak")
                return
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: LOCATION_DISTANCE_THRESHOLD
                },
                (location) => {
                    const { coords } = location
                    const { latitude, longitude } = coords
                    console.log('Latitude>>>>>>>>>>>>>>r', latitude)
                    console.log('Longitude>>>>>>>>>>>>>', longitude)
                    //   setUserLong(longitude)
                    //   setUserLat(latitude)
                    // latitude = latitude.replace(".", ","),
                    //     longitude = longitude.replace(".", ",")

                    setTimeout(() => {
                        setLocation({
                            dropLocationCors: {
                                latitude: -6.260477061550357,
                                longitude: 106.78171522427996
                            },
                            pickupCords: {
                                latitude: latitude,
                                longitude: longitude
                            }
                        })
                    }, 5000) // Set timeout 5 detik (5000 milidetik)
                }
            )
        })()

        return () => {
            if (subscription) {
                subscription.remove()
            }
        }
    }, [])


    // const getLiveLocation = async () => {
    //     const locPermissionDenied = await locationPermission()
    //     if(locPermissionDenied){
    //         const res = await getCurrentLocation()
    //         console.log(res,">>>>>>>>>")
    //     }
    // }


    const { pickupCords, dropLocationCors } = location

    const onPressLocation = () => {
        navigation.navigate('input')
    }

    const fetchValues = (data) => {
        setLocation({
            ...data, dropLocationCors: {
                latitude: -6.260477061550357,
                longitude: 106.78171522427996
            }
        })
    }

    //////////////////////////////// ini firebase //////////////////////////////////
    const firebaseConfig = {
        apiKey: "AIzaSyA3a63q1F5cOBFF_GF4ssElkOu-Ix2-7vY",
        authDomain: "bengkel-kuy-final-project.firebaseapp.com",
        projectId: "bengkel-kuy-final-project",
        storageBucket: "bengkel-kuy-final-project.appspot.com",
        messagingSenderId: "558920179990",
        appId: "1:558920179990:web:cfce73cb86f6bbb8933037"
    };


    // driver idnya di hardcoded dulu

    const idDriver = "01827373"
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const connection = collection(db, "final-phase-bengkel")

    async function toFirestore() {
        try {
            const response = await setDoc(doc(connection, idDriver), {
                name: "try firestore",
                latitude: location.pickupCords.latitude,
                longitude: location.pickupCords.longitude
            });
            console.log(response, "ini dari response");
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        console.log(location, "<----");
        toFirestore();
    }, [location])


    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={pickupCords}
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker style={{
                        transform: [{ scale: 0.2 }],
                    }} image={mobil} coordinate={location.pickupCords} />
                    <Marker image={mark} style={{ transform: [{ scale: 1.5 }] }} coordinate={dropLocationCors} />
                    {/* <Marker coordinate={dropLocationCors} /> */}
                    <MapViewDirections
                        resetOnChange={false}
                        origin={location.pickupCords}
                        destination={dropLocationCors}
                        apikey={GOOGLE_KEY}
                        strokeWidth={3}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onReady={result => {
                            if (!mapReady) {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: 30,
                                        bottom: 300,
                                        left: 30,
                                        top: 100
                                    }
                                })
                                setMapReady(true)
                            }
                        }}
                        onError={(errorMessage) => {
                            console.log(errorMessage)
                        }}
                    />
                </MapView>
                <View style={styles.bottomCard}>
                    {/* <Text>Where your location...</Text> */}
                    <TouchableOpacity style={styles.inputStyle} onPress={onPressLocation}>
                        <Text>Arrived</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View>
                <Touchable>
                    <Text>
                        Input Product
                    </Text>
                </Touchable>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        top: 750,
        backgroundColor: 'white',
        width: '100%',
        height: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    }
});


export default MapComponent