import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard, Login, Welcome } from './screens/index';
import Splash from './screens/Splash';
import { ToastProvider } from 'react-native-toast-notifications';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import { UserContext, UserProvider } from './context/userContext';
import { PaperProvider } from 'react-native-paper';
import SectionSelection from './screens/SectionSelection';
import Waiting from './screens/Waiting';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/ProjectManagement/Home';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AddProject from './screens/ProjectManagement/AddProject';
import PendingTasks from './screens/ProjectManagement/PendingTasks';
import Profile from './screens/ProjectManagement/Profile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Project from './screens/ProjectManagement/Project';
import Task from './screens/ProjectManagement/Task';
import TeamList from './screens/ProjectManagement/TeamList';
import EditProject from './screens/ProjectManagement/EditProject';
import { useContext } from 'react';
import EditSubtask from './screens/ProjectManagement/EditSubtask';
import EditTask from './screens/ProjectManagement/EditTask';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {



  const MainTabs = () => {
    const context = useContext(UserContext);
    const { totalPendingTasks, isAdmin } = context;
    return (
      <Tab.Navigator screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: '#6237a0',
        tabBarStyle: { paddingBottom: 10, height: 55 } // Add bottom padding here
      }}
      >
        <Tab.Screen name="Home" component={Home}
          options={{
            unmountOnBlur: true,
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-dashboard" size={20} color={color} />,
          }} />
        {isAdmin && <Tab.Screen name="AddProject" component={AddProject}
          options={{
            unmountOnBlur: true,
            tabBarLabel: 'New Project',
            tabBarIcon: ({ color }) => <FontAwesome6 name="add" size={20} color={color} />,
          }} />}
        <Tab.Screen name="PendingTasks" component={PendingTasks}
          options={{
            unmountOnBlur: true,
            tabBarLabel: 'Pending Tasks',
            tabBarIcon: ({ color }) => <MaterialIcons name="pending-actions" size={20} color={color} />,
            tabBarBadge: totalPendingTasks,
          }} />
        {/* <Tab.Screen name="Profile" component={Profile} options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />
        }} /> */}
      </Tab.Navigator>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <PaperProvider>
              <NavigationContainer>
                <UserProvider>
                  <Stack.Navigator initialRouteName='Splash'>
                    <Stack.Screen name='Welcome' component={Welcome} options={{
                      headerShown: false
                    }} />
                    <Stack.Screen name='SectionSelection' component={SectionSelection} options={{
                      headerShown: false
                    }} />
                    <Stack.Screen name='Waiting' component={Waiting} options={{
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
                    <Stack.Screen name='MainTabs' component={MainTabs} options={{ headerShown: false }} />

                    <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
                    <Stack.Screen name='Project' component={Project} options={{ headerShown: false }} />
                    <Stack.Screen name='Task' component={Task} options={{ headerShown: false }} />
                    <Stack.Screen name='TeamList' component={TeamList} options={{ headerShown: false }} />
                    <Stack.Screen name='EditProject' component={EditProject} options={{ headerShown: false }} />
                    <Stack.Screen name='EditSubtask' component={EditSubtask} options={{ headerShown: false }} />
                    <Stack.Screen name='EditTask' component={EditTask} options={{ headerShown: false }} />

                  </Stack.Navigator>
                </UserProvider>
              </NavigationContainer></PaperProvider></ToastProvider>
        </SafeAreaProvider>
      </MenuProvider>
    </GestureHandlerRootView>
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
