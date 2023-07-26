// import { showMessage } from "react-native-flash-message"
// import { PermissionsAndroid, Platform } from "react-native";
// import GeoLocation from "react-native-geolocation-service";

// export const getCurrentLocation = () =>
//     new Promise((resolve, reject) => {
//         GeoLocation.getCurrentPosition(
//             position => {
//                 const cords = {
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude,
//                     heading: position?.coords?.heading,
//                 };
//                 console
//                 resolve(cords);
//             },
//             error => {
//                 reject(error.message);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
//         )
//     })

// export const locationPermission = () => new Promise(async (resolve, reject) => {
//     if (Platform.OS === 'ios') {
//         try {
//             const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
//             if (permissionStatus === 'granted') {
//                 return resolve("granted");
//             }
//             reject('Permission not granted');
//         } catch (error) {
//             return reject(error);
//         }
//     }
//     PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     ).then((granted) => {
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             resolve("granted");
//         }
//         return reject('Location Permission denied');
//     }).catch((error) => {
//         console.log('Ask Location permission error: ', error);
//         return reject(error);
//     });
// });

// // const showError = (message) => {
// //     showMessage({
// //         message,
// //         type: 'danger',
// //         icon: 'danger'
// //     })
// // }

// // const showSuccess = (message) => {
// //     showMessage({
// //         message,
// //         type: 'success',
// //         icon: 'success'
// //     })
// // }

// // export {
// //     showError,
// //     showSuccess
// // }

// import { StatusBar } from 'expo-status-bar';
// import { Alert, StyleSheet, Text, View } from 'react-native';
// import * as Location from "expo-location"
// import { useEffect, useState } from 'react';

// const LOCATION_DISTANCE_THRESHOLD = 1

// export default function App() {
//   const [errmsg, setErrMsg] = useState("")
//   const [userLat, setUserLat] = useState()
//   const [userLong, setUserLong] = useState()

//   useEffect(() => {
//     let subscription = null

//       (async () => {
//         const { status } = await Location.requestForegroundPermissionsAsync()
//         if (status !== "granted") {
//           Alert.alert("ditolak")
//           return
//         }

//         subscription = await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             distanceInterval: LOCATION_DISTANCE_THRESHOLD
//           },
//           (location) => {
//             const { coords } = location
//             const {latitude,longitude} = coords
//             console.log('Latitude',latitude)
//             console.log('Longitude',longitude)
//             setUserLong(longitude)
//             setUserLat(latitude)
//           }
//         )
//       })()

//       return () =>{
//         if(subscription){
//           subscription.remove()
//         }
//       }
//   },[])
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });