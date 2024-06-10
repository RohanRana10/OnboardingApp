import { Button, Image, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { BASE_ONBOARD_URL } from '../../utils/APIConstants';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast, { useToast } from "react-native-toast-notifications";


export default function Profile() {
    const navigation = useNavigation();
    const context = useContext(UserContext);
    const toast = useToast();
    const { user, updateRole } = context;
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

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
                    setLoading(false);
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
                    setLoading(false);
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
                setLoading(false);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: wp(20),
                    height: wp(20),
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: hp(10), backgroundColor: '#fff' }}>
                    <TouchableOpacity style={{ marginHorizontal: wp(2.6) }} onPress={() => navigation.goBack()}>
                        <AntDesign name="back" size={hp(2.8)} color="#6237a0" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>My Profile</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: hp(40), backgroundColor: '#fff', backgroundColor: '#fff' }}>
                    <View style={{
                        elevation: hp(1.5), shadowColor: 'black', height: wp(30),
                        width: wp(30),
                        borderRadius: hp(50),
                        marginBottom: hp(1), alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Image source={{ uri: user?.profile }} style={styles.profileImage} />
                    </View>
                    <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
                    <Text style={styles.profileDesignation}>{user.designation}</Text>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: wp(4), height: hp(15), backgroundColor: 'gray' }}>
                    <View style={{ ...styles.shadowContainer, alignItems: 'center', paddingVertical: hp(2), width: wp(40) }}>
                        <Text style={{ color: '#6237A0', fontWeight: 'bold', fontSize: hp(2) }}>150</Text>
                        <View >
                            <Text style={{ color: 'gray', fontWeight: 300, fontSize: hp(1.8) }}>Completed Tasks</Text>
                        </View>
                    </View>
                    <View style={{ ...styles.shadowContainer, alignItems: 'center', paddingVertical: hp(2), width: wp(40) }}>
                        <Text style={{ color: '#6237A0', fontWeight: 'bold', fontSize: hp(2) }}>26</Text>
                        <Text style={{ color: 'gray', fontWeight: 300, fontSize: hp(1.8) }}>Ongoing Tasks</Text>
                    </View>
                </View> */}
                <View style={{ width: wp(100), backgroundColor: '#f2e6ff', height: hp(50), borderTopRightRadius: hp(8), borderTopLeftRadius: hp(8), justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: hp(2), justifyContent: 'center' }}>
                        <View style={styles.squareButton} >
                            <FontAwesome5 name="user-edit" size={hp(2.8)} color="#6237a0" />
                            <Text style={{ marginTop: hp(1), color: '#3d3d5c', fontSize: hp(1.6), fontWeight: 'bold' }}>Edit Profile</Text>
                        </View>

                        <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('TeamList')}>
                            <FontAwesome name="group"  size={hp(2.8)} color="#6237a0" />
                            <Text style={{ marginTop: hp(1), color: '#3d3d5c', fontSize: hp(1.6), fontWeight: 'bold' }}>My Team</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.squareButton} onPress={handleLogout}>
                            <AntDesign name="logout"  size={hp(2.8)} color="#6237a0" />
                            <Text style={{ marginTop: hp(1), color: '#3d3d5c', fontSize: hp(1.6), fontWeight: 'bold' }}>Logout</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: wp(100), marginBottom: hp(7) }}>
                        <Text style={{ color: "#6237a0", fontSize: hp(1.4), marginRight: wp(3) }}>All Rights Reserved © </Text>
                        <Image resizeMode='contain' source={require('../../assets/Images/ResotechLogoBlack.png')} style={{ height: wp(15), width: wp(30) }} />
                    </View>
                </View>
            </View>)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: hp(2),
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: hp(3),
        fontWeight: 'bold',
        width: wp(75)
    },
    profileImage: {
        height: wp(30),
        width: wp(30),
        borderRadius: hp(50),
    },
    profileName: {
        fontSize: hp(3.2),
        fontWeight: '500',
        color: '#330066',
        marginBottom: hp(0.5),
    },
    profileDesignation: {
        color: 'gray',
        fontWeight: '400',
        fontSize: hp(1.7)
    },
    shadowContainer: {
        shadowColor: "black",
        shadowOffset: {
            width: wp(4),
            height: wp(4)
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
        margin: wp(3),
        borderRadius: 8,
    },
    squareButton: {
        width: wp(25),
        height: wp(25),
        backgroundColor: '#fff', margin: wp(3),
        borderRadius: hp(50),
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(2),
        elevation: hp(1),
        shadowColor: "black",
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    }
})