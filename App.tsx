import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    // <View style={styles.container}>
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'red' }}></View>
      <View style={{ flex: 1, backgroundColor: 'blue' }}></View>
      <View style={{ flex: 1, backgroundColor: 'green' }}></View>
      {/* <Text style={styles.text}>Hello World</Text>
      <Text>새롭게 시작하는 React-native</Text> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});
