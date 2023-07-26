import React from 'react';
import { Text, SafeAreaView, View, StyleSheet, ImageBackground, Dimensions, Pressable } from 'react-native';
import { TextInput, Button, IconButton, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const input = () => {
  const [problem, setProblem] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [carBrand, setCarBrand] = React.useState('');
  const [carType, setCarType] = React.useState('');
  const [license, setLicense] = React.useState('');

  const navigation = useNavigation();

  const handleFormSubmit = () => {
    console.log('Form submitted!');
  };

  const handleGoBack = () => {
    navigation.openDrawer()
  };

  const [orders, setOrders] = React.useState([
    { id: 1, item: 'Shell Helix HX3', qty: 0 },
    { id: 2, item: 'Michelin LTX A/T2', qty: 0 },
    { id: 3, item: 'Total Quartz 9000', qty: 0 },
    { id: 4, item: 'Aki GS Astra Calsium', qty: 0 },
    { id: 5, item: 'Aki GS Gold Shine', qty: 0 },
    { id: 6, item: 'Ban A T', qty: 0 },
    { id: 7, item: 'Ban Bulet', qty: 0 },
    { id: 8, item: 'Jasa Ganti Ban', qty: 0 },
    { id: 9, item: 'Jasa Ganti Oli', qty: 0 },
    { id: 10, item: 'Jasa Service', qty: 0 }
  ]);

  const handleIncreaseQty = (itemId) => {
    const updatedOrders = orders.map((el) => {
      if (el.id === itemId) {
        return { ...el, qty: el.qty + 1 };
      }
      return el;
    });
    setOrders(updatedOrders);
  };

  const handleDecreaseQty = (itemId) => {
    const updatedOrders = orders.map((el) => {
      if (el.id === itemId && el.qty > 0) {
        return { ...el, qty: el.qty - 1 };
      }
      return el;
    });
    setOrders(updatedOrders);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyYWdlfGVufDB8fDB8fHww&w=1000&q=80',
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* <IconButton
            icon="arrow-left"
            color="white"
            size={24}
            onPress={handleGoBack}
          /> */}
        </View>
        <View style={{ flex: 0.1, flexDirection: 'column', backgroundColor: 'white', borderRadius: 20, marginBottom: 20 }}>
          <Text
            style={{ fontWeight: 'bold', fontSize: 20, alignSelf: 'center', marginTop: 15 }}
          >
            ORDER ID : 1
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', borderRadius: 20, marginBottom: 20 }}>

          {/* --------------------------------------------- */}
          {orders.map((el) => (
            <React.Fragment key={el.id}>
              <View style={{ flex: 0.3, marginTop: 10, flexDirection: 'row' }}>
                <View style={{ backgroundColor: 'white', flex: 0.5, borderRadius: 10, marginLeft: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox.Android
                    status={el.qty > 0 ? 'checked' : 'unchecked'}
                    onPress={() => handleDecreaseQty(el.id)}
                  />
                </View>
                <View style={{ flex: 3, borderRadius: 10, backgroundColor: 'white', marginLeft: 10, justifyContent: 'center' }}>
                  <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                    {el.item}
                  </Text>
                </View>
                <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 10, marginLeft: 10, justifyContent: 'center', flexDirection: 'row' }}>
                  <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', flexDirection: 'row', alignSelf: 'center' }}>
                    <Pressable
                      onPress={() => handleIncreaseQty(el.id)}
                    >
                      <Svg style={{ height: 30, width: 30, alignSelf: 'center' }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="black"
                        className="w-4 h-4"
                      >
                        <Path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </Svg>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDecreaseQty(el.id)}
                    >
                      <Svg style={{ height: 30, width: 30, alignSelf: 'center' }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="black"
                        className="w-4 h-4"
                      >
                        <Path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </Svg>
                    </Pressable>
                  </View>
                  <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginRight: 10 }}>
                    {el.qty}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
          <View style={{ flex: 0.2, justifyContent: 'center' }}>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={handleFormSubmit}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Submit
        </Button>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    width: width,
    height: height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0d47a1',
  },
  buttonLabel: {
    color: '#fff',
  },
});

export default input;