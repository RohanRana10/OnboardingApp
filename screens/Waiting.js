import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { BASE_URL, BASE_ONBOARD_URL } from '../utils/APIConstants';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';

export default function Waiting({ navigation }) {
    const toast = useToast();
    const [data, setData] = useState({
        //TODO make false again below
        onboarded: true
    })

    const context = useContext(UserContext);
    const { user, updateRole } = context;

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            console.log('Logged out!');
        } catch (error) {
            console.log("error while removing token", error);
        }
        navigation.replace('Login');
    }

    const handleLogout = () => {
        let url = `${BASE_ONBOARD_URL}/logout`;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.userToken
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status.statusCode === 1) {
                    console.log(JSON.stringify(response.data));
                    updateRole(false);
                    logout();
                    toast.show("Logged out!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                }
                else {
                    console.log(JSON.stringify(response.data));
                    toast.show("Some error occured!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                }

            })
            .catch((error) => {
                console.log(error);
                toast.show("Please try again!", {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
            });
    }

    useEffect(() => {
        console.log("onboarding status:",user.onboardingStatus);
        if (user.onboardingStatus) {
            setData({onboarded: true})
        }
        // if(user.roles.includes("admin")){
        //     console.log("Admin found!")
        // }
    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            {!data.onboarded ?
                <View>
                    <View style={{ position: 'absolute', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.replace('Dashboard')}>
                            <AntDesign name="back" size={24} color="#6237a0" />
                            <Text style={{ marginLeft: 10, color: '#6237a0', fontSize: 16 }}>Edit Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={{ color: '#330066' }}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: '90%' }}>
                        <Image source={require('../assets/Images/search.png')} style={{ width: 60, height: 60 }} />
                        <Text style={{ paddingHorizontal: 10, textAlign: 'center', color: 'gray', marginTop: 20 }}>Your information has been securely submitted. We will proceed with the next steps once our team has thoroughly reviewed and validated your details.</Text>
                    </View>
                </View> :

                <View>
                    {/* <View style={{ position: 'absolute', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.replace('Dashboard')}>
                            <AntDesign name="back" size={24} color="#6237a0" />
                            <Text style={{ marginLeft: 10, color: '#6237a0', fontSize: 16 }}>Edit Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={{ color: '#330066' }}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: '90%' }}>
                        <Image source={require('../assets/Images/verified.png')} style={{ width: 60, height: 60 }} />
                        <Text style={{ paddingHorizontal: 10, textAlign: 'center', color: 'gray', marginTop: 20 }}>Your information has been successfully verified.</Text>

                        <TouchableOpacity onPress={() => navigation.replace('SectionSelection')} style={{ backgroundColor: '#330066', width: '90%', padding: 15, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderRadius: 12 }}>
                            <Text style={{ color: 'white' }}>Get Started</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            }
            <View style={{ alignItems: 'center', marginBottom: 25, flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
                <Text style={{ color: "#6237a0", fontSize: 12, marginRight: 10 }}>All Rights Reserved © </Text>
                <Image resizeMode='contain' source={require('../assets/Images/ResotechLogoBlack.png')} style={{ height: 40, width: 100 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})