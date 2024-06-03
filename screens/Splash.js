import { View, StyleSheet, StatusBar, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import COLORS from '../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_AUTH_URL, BASE_ONBOARD_URL } from '../utils/APIConstants';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { UserContext } from '../context/userContext'

export default function Splash({ navigation }) {

    const toast = useToast();
    const context = useContext(UserContext);
    let token;
    const { saveUserData, saveUserDashboardinfo, user } = context;

    const verifyToken = async () => {
        token = await AsyncStorage.getItem('token');
        if (!token) {
            navigation.replace('Login');
            console.log('redirected to Login!')
        }
        else {
            let url = `${BASE_AUTH_URL}/validate-token`;
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': token
                }
            };

            axios.request(config)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status.statusCode !== 1) {
                        navigation.replace('Login');
                        toast.show("You have been logged out", {
                            type: "warning",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                    }
                    else {
                        saveUserData(response.data.data);
                        console.log("user info saved at splash");
                        console.log('token verified');
                        //TODO add a check here if onboarded then go to sectionSelection otherwise go to dashboard
                        if (response.data.data.onboardingStatus) {
                            navigation.replace('SectionSelection');
                        }
                        else {
                            fetchUserDashboard();
                            console.log('redirected to Dashboard!');
                        }

                    }

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const fetchUserDashboard = () => {
        let url = `${BASE_ONBOARD_URL}/landing`;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': token
            }
        };

        axios.request(config)
            .then((response) => {
                if (response.data.status.statusCode === 1) {
                    console.log("dashboard info at splash page fetched :", JSON.stringify(response.data.data));
                    saveUserDashboardinfo(response.data.data);
                    navigation.replace('Dashboard');
                    // navigation.replace('SectionSelection');
                }
                else {
                    console.log(JSON.stringify(response.data));
                    toast.show("Please try again (SPLASH)!", {
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
                console.log("Error fetching user dashboard data at splash page", error);
            });
    }

    useEffect(() => {
        setTimeout(() => {
            verifyToken();
        }, 2500);
    }, [])

    return (
        <View style={styles.container}><StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            <Image style={{
                width: 100,
                height: 100,
            }} source={require('../assets/New.gif')}>
            </Image>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    logoImage: {

    }
})