import { Button, Image, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { BASE_ONBOARD_URL, BASE_URL } from '../../utils/APIConstants';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
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

    // const handleLogout = () => {
    //     let url = `${BASE_URL}/logout`;
    //     let config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: url,
    //         headers: {
    //             'token': user.token
    //         }
    //     };
    //     axios.request(config)
    //         .then((response) => {
    //             if (response.data.status.statusCode === 1) {
    //                 console.log(JSON.stringify(response.data));
    //                 logout();
    //                 toast.show("Logged out!", {
    //                     type: "success",
    //                     placement: "bottom",
    //                     duration: 3000,
    //                     offset: 50,
    //                     animationType: "slide-in",
    //                     swipeEnabled: false
    //                 });
    //             }
    //             else {
    //                 console.log(JSON.stringify(response.data));
    //                 toast.show("Some error occured!", {
    //                     type: "normal",
    //                     placement: "bottom",
    //                     duration: 3000,
    //                     offset: 50,
    //                     animationType: "slide-in",
    //                     swipeEnabled: false
    //                 });
    //             }

    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             toast.show("Please try again!", {
    //                 type: "normal",
    //                 placement: "bottom",
    //                 duration: 3000,
    //                 offset: 50,
    //                 animationType: "slide-in",
    //                 swipeEnabled: false
    //             });
    //         });
    // }

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
                    width: 100,
                    height: 100,
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => navigation.goBack()}>
                        <AntDesign name="back" size={26} color="#6237a0" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>My Profile</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: 20, backgroundColor: '#fff' }}>
                    <View style={{
                        elevation: 4, shadowColor: 'black', height: 120,
                        width: 120,
                        borderRadius: 100,
                        marginBottom: 12,
                    }}>
                        <Image source={{uri: user?.profile}} style={styles.profileImage} />
                    </View>
                    <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
                    <Text style={styles.profileDesignation}>{user.designation}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 15, paddingHorizontal: 10 }}>
                    <View style={{ ...styles.shadowContainer, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 13, width: '41%' }}>
                        <Text style={{ color: '#6237A0', fontWeight: 'bold', fontSize: 14 }}>150</Text>
                        <View >
                            <Text style={{ color: 'gray', fontWeight: 300, fontSize: 14 }}>Completed Tasks</Text>
                        </View>
                    </View>
                    <View style={{ ...styles.shadowContainer, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 13, width: '41%' }}>
                        <Text style={{ color: '#6237A0', fontWeight: 'bold', fontSize: 14 }}>26</Text>
                        <Text style={{ color: 'gray', fontWeight: 300, fontSize: 14 }}>Ongoing Tasks</Text>
                    </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#f2e6ff', height: '55%', borderTopRightRadius: 50, borderTopLeftRadius: 50, marginTop: 15, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 15, justifyContent: 'center' }}>
                        <View style={styles.squareButton} >
                            <FontAwesome5 name="user-edit" size={22} color="#6237a0" />
                            <Text style={{ marginTop: 6, color: '#3d3d5c', fontSize: 13, fontWeight: 'bold' }}>Edit Profile</Text>
                        </View>

                        <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('TeamList')}>
                            <FontAwesome name="group" size={22} color="#6237a0" />
                            <Text style={{ marginTop: 6, color: '#3d3d5c', fontSize: 13, fontWeight: 'bold' }}>My Team</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.squareButton} onPress={handleLogout}>
                            <AntDesign name="logout" size={22} color="#6237a0" />
                            <Text style={{ marginTop: 6, color: '#3d3d5c', fontSize: 13, fontWeight: 'bold' }}>Logout</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ alignItems: 'center', marginBottom: 25, flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 15, width: '100%' }}>
                        <Text style={{ color: "#6237a0", fontSize: 12, marginRight: 10 }}>All Rights Reserved © </Text>
                        <Image resizeMode='contain' source={require('../../assets/Images/ResotechLogoBlack.png')} style={{ height: 40, width: 100 }} />
                    </View>
                </View>
            </View>)}
            {/* <Button title='Logout' onPress={handleLogout} /> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        // paddingHorizontal: 18,
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: 24,
        fontWeight: 'bold',
        // paddingHorizontal: 18,
        width: '75%'
    },
    profileImage: {
        height: 120,
        width: 120,
        borderRadius: 100,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '500',
        color: '#330066',
        marginBottom: 5,
    },
    profileDesignation: {
        color: 'gray',
        fontWeight: '400'
    },
    shadowContainer: {
        shadowColor: "black",
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 8,
    },
    squareButton: {
        width: 95,
        height: 95,
        backgroundColor: '#fff', margin: 10,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        elevation: 2,
        shadowColor: "black",
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    }
})