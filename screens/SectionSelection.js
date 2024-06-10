import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { StatusBar } from 'react-native';
import { UserContext } from '../context/userContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function SectionSelection({ navigation }) {


    const toast = useToast();
    const context = useContext(UserContext);
    const { user, updateRole } = context;


    useEffect(() => {
        console.log("Section selection Loaded");
        if (user.roles.includes("admin")) {
            console.log("Admin found!")
            updateRole(true);
        }
        console.log(user.roles, "found");
    }, [])


    const loadProjectSection = () => {
        navigation.navigate('MainTabs');
    }

    const loadTimeSheetSection = () => {
        console.log("TODO: Open Timesheet Section")
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: wp(4), backgroundColor: '#fff' }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: hp(2.7), fontWeight: '400' }}>Hello <Text style={{ fontWeight: '500', color: '#6237a0', fontSize: hp(3.8) }}>{(user.firstName).charAt(0).toUpperCase() + user.firstName.substring(1)}!</Text></Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image source={{ uri: user?.profile }} style={{ width: wp(12), height: wp(12) }} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ marginTop: hp(1.5), color: 'gray',fontSize: hp(1.8) }}>Please select from the choices below and dive in further!</Text>
            <ScrollView style={{}}>
                <TouchableOpacity onPress={loadProjectSection} style={{ backgroundColor: '#330066', paddingVertical: hp(5), justifyContent: 'center', alignItems: 'center', borderRadius: hp(1.4), marginTop: hp(1.5) }}>
                    <Text style={{ color: '#fff', fontSize: hp(2) }}>Projects</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={loadTimeSheetSection} style={{ backgroundColor: '#6237a0', paddingVertical: hp(5), justifyContent: 'center', alignItems: 'center', borderRadius: hp(1.4), marginTop: hp(1.5) }}>
                    <Text style={{ color: '#fff', fontSize: hp(2) }}>Timesheet</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})