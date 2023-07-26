import { StyleSheet, Text, View, LogBox } from 'react-native';
import MapScreen from './Screens/MapScreen';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import input from './Screens/input';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs()
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={MapScreen} options={{headerShown:false}} />
        <Stack.Screen name='input' component={input} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
