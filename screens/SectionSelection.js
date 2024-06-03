import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '../context/userContext';
// import { UserContext } from '../../context/userContext';
// import { useContext } from 'react';

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

    const loadProfileSection = () => {
        navigation.navigate('Profile');
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 18, paddingTop: 18, backgroundColor: '#fff' }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 22, fontWeight: '400' }}>Hello <Text style={{ fontWeight: '500', color: '#6237a0', fontSize: 30 }}>{(user.firstName).charAt(0).toUpperCase() + user.firstName.substring(1)}!</Text></Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image source={{ uri: user?.profile }} style={{ width: 35, height: 35 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ marginTop: 10, color: 'gray' }}>Please select from the choices below and dive in further!</Text>
            <ScrollView style={{}}>
                <TouchableOpacity onPress={loadProjectSection} style={{ backgroundColor: '#330066', paddingVertical: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginTop: 12 }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Projects</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={loadTimeSheetSection} style={{ backgroundColor: '#6237a0', paddingVertical: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginTop: 12 }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Timesheet</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})