import { View, Text, StyleSheet, Image, Keyboard, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import COLORS from '../constants/colors'
import Button from './Button'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../context/userContext'
import { BASE_ONBOARD_URL, BASE_URL } from '../utils/APIConstants'
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications'
import { TextInput } from 'react-native-paper'


export default function ResetPassword({ navigation }) {
    const toast = useToast();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const context = useContext(UserContext);
    const { user, removeUserData } = context;

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('New:', newPassword, "Conf:", confirmPassword);
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
            fetchAPI();
        }
        Keyboard.dismiss();
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            removeUserData();
            console.log('Logged out!');
        } catch (error) {
            console.log("error while removing token", error);
        }
        navigation.navigate('Login');
    }

    const validateForm = () => {
        let errors = {};
        if (!newPassword) {
            errors.newPassword = "Enter a new password!";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Confirm the new password!";
        }
        if (newPassword !== confirmPassword) {
            errors.passwordsSame = "Passwords do not match!";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const fetchAPI = () => {
        setLoading(true);
        console.log("reset info sent!", user);
        let url = `${BASE_ONBOARD_URL}/update-password`

        // console.log('username', user.userId,
        //     'password', newPassword,
        //     'token', user.userToken
        // )

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'username': user.userName,
                'password': newPassword,
                'token': user.userToken
            }
        };

        axios.request(config)
            .then((response) => {
                if (response.data.status.statusCode !== 1) {
                    // console.log(JSON.stringify(response.data));
                    toast.show("Please try again!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setLoading(false);
                    logout();
                    navigation.navigate('Login');
                }
                else {
                    // console.log(JSON.stringify(response.data));
                    toast.show("Password updated!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setLoading(false);
                    logout();
                    navigation.replace('Login');
                }

            })
            .catch((error) => {
                console.log(error);
                toast.show("Please try again after some time!", {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
                setLoading(false);
            });

        // ***** temporary timeout *****

        // setTimeout(() => {
        //     setLoading(false);
        //     logout();
        //     navigation.navigate('Login');
        // }, 2000);
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />
            <Image resizeMode='center' style={styles.logo} source={require('../assets/LogoBlack.png')}></Image>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.heading}>Reset your password</Text>
            <Text>You need to reset your password because this is the first time you are signing in, or because your password has expired.</Text>
            <View style={styles.formContainer}>
                {/* <View style={styles.newPasswordContainer}> */}
                    {/* <TextInput style={styles.inputPassword} secureTextEntry={!isPasswordVisible} value={newPassword} placeholder='New Password' onChangeText={setNewPassword} /> */}
                    <TextInput
                        label="New Password"
                        value={newPassword}
                        secureTextEntry={true}
                        mode={'outlined'}
                        outlineStyle={{
                            borderRadius: 12,
                            borderColor: errors.username ? 'red' : '#6237A0'
                        }}
                        style={{ backgroundColor: 'white' }}
                        textColor='#28104E'
                        selectionColor='#6237a0'
                        activeOutlineColor="#6237a0"
                        onChangeText={text => setNewPassword(text)}
                    />
                    {/* <View style={styles.eyeContainer}>
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Ionicons size={20} name={isPasswordVisible ? 'eye-off' : 'eye'} color='#061621' />
                        </TouchableOpacity>
                    </View> */}
                {/* </View> */}
                {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
                {/* <TextInput style={styles.input} value={confirmPassword} secureTextEntry={true} placeholder='Confirm Password' onChangeText={setConfirmPassword} /> */}
                <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        secureTextEntry={true}
                        mode={'outlined'}
                        outlineStyle={{
                            borderRadius: 12,
                            borderColor: errors.username ? 'red' : '#6237A0'
                        }}
                        style={{ backgroundColor: 'white',marginTop: 10 }}
                        textColor='#28104E'
                        selectionColor='#6237a0'
                        activeOutlineColor="#6237a0"
                        onChangeText={text => setConfirmPassword(text)}
                    />
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}{errors.passwordsSame ? <Text style={{ color: 'red' }}>{errors.passwordsSame}</Text> : null}
            </View>

            {loading ? <ActivityIndicator color={'#6237a0'} size={40} style={{ marginTop: 12, alignSelf: 'flex-end' }} /> : <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    heading: {
        alignSelf: 'flex-start',
        fontSize: 25,
        color: '#6237a0',
        marginBottom: 10
    },
    logo: {
        height: 90,
        width: 180,
        alignSelf: 'flex-start',
        // marginVertical: 8
    },
    email: {
        alignSelf: 'flex-start',
        marginBottom: 15,
        color: 'gray'
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    input: {
        marginHorizontal: 1,
        marginBottom: 15,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 0.4,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 3,
    },
    formContainer: {
        // backgroundColor: 'cyan',
        width: '100%',
        marginVertical: 15
    },
    formButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20
    },
    errorText: {
        color: 'orange',
        marginBottom: 10,
    },
    eyeContainer: {
        height: 40,
        marginLeft: 5,
        justifyContent: 'center'
    },
    inputPassword: {
        height: 40,
        width: '90%',
        // padding: 10,
        // borderRadius: 5,
    },

    newPasswordContainer: {
        flexDirection: 'row',
        marginHorizontal: 1,
        marginBottom: 15,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 0.4,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 3,
    },
    button: {
        width: 100,
        alignSelf: 'flex-end',
        backgroundColor: '#6237A0',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        borderRadius: 12
    }
})