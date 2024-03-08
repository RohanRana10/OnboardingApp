import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard, Login, Welcome } from './screens/index';
import Splash from './screens/Splash';
import { ToastProvider } from 'react-native-toast-notifications';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import { UserProvider } from './context/userContext';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <ToastProvider>
      <PaperProvider>
      <NavigationContainer>
        <UserProvider>
          <Stack.Navigator initialRouteName='Splash'>
            <Stack.Screen name='Welcome' component={Welcome} options={{
              headerShown: false
            }} />
            <Stack.Screen name='Login' component={Login} options={{
              headerShown: false
            }} />
            <Stack.Screen name='Dashboard' component={Dashboard} options={{
              headerShown: false
            }} />
            <Stack.Screen name='Splash' component={Splash} options={{
              headerShown: false
            }} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} options={{
              headerShown: false
            }} />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{
              headerShown: false
            }} />
          </Stack.Navigator>
        </UserProvider>
      </NavigationContainer></PaperProvider></ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
