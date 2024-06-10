import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { BASE_URL, BASE_ONBOARD_URL } from '../utils/APIConstants';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


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
        console.log("onboarding status:", user.onboardingStatus);
        if (user.onboardingStatus) {
            setData({ onboarded: true })
        }
    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            {!data.onboarded ?
                <View>
                    <View style={{ position: 'absolute', padding: wp(4), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp(100) }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.replace('Dashboard')}>
                            <AntDesign name="back" size={hp(2.8)} color="#6237a0" />
                            <Text style={{ marginLeft: wp(2), color: '#6237a0', fontSize: hp(2) }}>Edit Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={{ color: '#330066', fontSize: hp(2) }}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: hp(80) }}>
                        <Image source={require('../assets/Images/search.png')} style={{ width: wp(12), height: wp(12) }} />
                        <Text style={{ paddingHorizontal: wp(4), textAlign: 'center', color: 'gray', marginTop: hp(2.6), fontSize: hp(1.8) }}>Your information has been securely submitted. We will proceed with the next steps once our team has thoroughly reviewed and validated your details.</Text>
                    </View>
                </View> :

                <View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: hp(80) }}>
                        <Image source={require('../assets/Images/verified.png')} style={{ width: wp(15), height: wp(15) }} />
                        <Text style={{ paddingHorizontal: wp(2), textAlign: 'center', color: 'gray', marginTop: hp(2), fontSize: hp(1.8) }}>Your information has been successfully verified.</Text>

                        <TouchableOpacity onPress={() => navigation.replace('SectionSelection')} style={{ backgroundColor: '#330066', width: wp(80), padding: wp(3), alignItems: 'center', justifyContent: 'center', marginTop: hp(2), borderRadius: hp(1.4) }}>
                            <Text style={{ color: 'white', fontSize: hp(1.8) }}>Get Started</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            }
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: wp(100) }}>
                <Text style={{ color: "#6237a0", fontSize: hp(1.4), marginRight: wp(3) }}>All Rights Reserved © </Text>
                <Image resizeMode='contain' source={require('../assets/Images/ResotechLogoBlack.png')} style={{ height: hp(5), width: wp(30) }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})