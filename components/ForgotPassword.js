import { View, Text, StyleSheet, StatusBar, Image, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import COLORS from '../constants/colors'
import Button from './Button';
import { Ionicons } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications';
import OTPTextInput from 'react-native-otp-textinput'
import axios from 'axios';
import { BASE_URL,BASE_AUTH_URL } from '../utils/APIConstants';
import { TextInput } from 'react-native-paper';

export default function ForgotPassword({ navigation }) {
    let otpInput = useRef(null);
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [slide, setSlide] = useState(1);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    // const pract = (otp) => {
    //     setOtp(otp);
    // }

    const [timer, setTimer] = useState(120); // 120 seconds = 2 minutes
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            // Timer has reached 0, perform actions like sending OTP
            clearInterval(interval);
            setIsActive(false);
            // Add your OTP sending logic here
        }
        return () => clearInterval(interval);
    }, [isActive, timer]);

    const startTimer = () => {
        setIsActive(true);
    };

    const resendOtp = () => {
        // setTimer(120);
        if (validateEmailForm()) {

            setLoading(true);
            let data = JSON.stringify({
                "email": email
            });
            let url = `${BASE_AUTH_URL}/forget-password/generate-otp`
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 3) {
                        console.log(JSON.stringify(response.data));
                        toast.show("Invalid Email!", {
                            type: "warning",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        setLoading(false);
                    }
                    else if (response.data.status.statusCode === 1) {
                        console.log(JSON.stringify(response.data));
                        console.log("Email provided:", email);
                        setLoading(false);
                        setTimer(120);
                        startTimer();
                        setErrors({});
                    }
                    else {
                        console.log(JSON.stringify(response.data));
                        toast.show("Please try again!", {
                            type: "normal",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        setLoading(false);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    toast.show("Please try again after some time!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                });
        }
    }


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleEmailSubmit = () => {
        //TODO make api call and send otp to the email entered
        if (validateEmailForm()) {

            setLoading(true);
            let data = JSON.stringify({
                "email": email
            });
            let url = `${BASE_AUTH_URL}/forget-password/generate-otp`
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 3) {
                        console.log(JSON.stringify(response.data));
                        toast.show("Invalid Email!", {
                            type: "warning",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        setLoading(false);
                    }
                    else if (response.data.status.statusCode === 1) {
                        console.log('error',JSON.stringify(response.data));
                        console.log("Email provided:", email);
                        setLoading(false);
                        setSlide(slide + 1);
                        startTimer();
                        setErrors({});
                    }
                    else {
                        console.log(JSON.stringify(response.data));
                        toast.show("Please try again!", {
                            type: "normal",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        setLoading(false);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    toast.show("Please try again after some time!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                });
            // setTimeout(() => {
            //     setLoading(false);
            //     console.log("Email provided:", email);
            //     setSlide(slide + 1);
            //     startTimer();
            //     setErrors({});
            // }, 2000);

        }
        // console.log("Email provided:", email);
        // setSlide(slide + 1);
        // setErrors({});
        Keyboard.dismiss();
    }

    const handleOtpSubmit = () => {
        //TODO make api call to check if otp is valid or not
        if (validateOtp()) {
            // setOtp('');
            setLoading(true);
            let data = JSON.stringify({
                "email": email,
                "otp": otp
            });
            let url = `${BASE_AUTH_URL}/forget-password/validate-otp`
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.status.statusCode === 1) {
                        console.log(JSON.stringify(response.data));
                        console.log("OTP provided:", otp);
                        setLoading(false);
                        setSlide(slide + 1);
                        setErrors({});
                    }
                    else {
                        console.log(JSON.stringify(response.data));
                        setLoading(false);
                        toast.show("Invalid OTP!", {
                            type: "warning",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    toast.show("Please try again after some time!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                });

            // setTimeout(() => {
            //     setLoading(false);
            //     console.log("OTP provided:", otp);
            //     setSlide(slide + 1);
            //     setErrors({});
            // }, 2000);

        }
        // console.log("OTP provided", otp);
        // setSlide(slide + 1);
        // setErrors({});
        Keyboard.dismiss();
    }

    const handlePasswordSubmit = () => {
        //TODO make api call and land the user to the login screen upon successful updation
        if (validatePasswords()) {

            setLoading(true);
            let data = JSON.stringify({
                "email": email,
                "password": newPassword
            });
            let url = `${BASE_AUTH_URL}/forget-password/change-password`
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.status.statusCode === 1) {
                        console.log(JSON.stringify(response.data));
                        console.log('New:', newPassword, "Conf:", confirmPassword);
                        setLoading(false);
                        setErrors({});
                        toast.show("Password updated!", {
                            type: "success",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        navigation.navigate('Login');
                    }
                    else {
                        console.log(JSON.stringify(response.data));
                        setLoading(false);
                        toast.show("Some Error Occured!", {
                            type: "warning",
                            placement: "bottom",
                            duration: 3000,
                            offset: 50,
                            animationType: "slide-in",
                            swipeEnabled: false
                        });
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    toast.show("Please try again after some time!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                });
            // setConfirmPassword("");
            // setNewPassword("");
            // setTimeout(() => {
            //     toast.show("Password Updated!", {
            //         type: "normal",
            //         placement: "bottom",
            //         duration: 3000,
            //         offset: 50,
            //         animationType: "slide-in",
            //         swipeEnabled: false
            //     });
            //     setLoading(false);
            //     setErrors({});
            //     navigation.navigate('Login');
            // }, 2000);
        }
        Keyboard.dismiss();
    }

    const validateEmailForm = () => {
        let errors = {};
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Enter a vaild Email Id!";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const validateOtp = () => {
        let errors = {};
        if (!otp || otp.length < 6) {
            errors.otp = "Enter a valid OTP!";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const validatePasswords = () => {
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

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <Image resizeMode='center' style={styles.logo} source={require('../assets/LogoBlack.png')}></Image>
            {/* <Text style={styles.email}>rohan.rana@resotechsolutions.com</Text> */}
            {slide === 1 &&
                <>
                    <Text style={styles.heading}>Forgot password</Text>
                    <Text>Enter your registered Email Id in order to proceed with the password updation process</Text>
                    <View style={styles.formContainer}>
                        {/* <TextInput style={styles.input} value={email} placeholder='Eg: john.doe@resotechsolutions.com' onChangeText={setEmail} /> */}
                        <TextInput
                            label="Email"
                            value={email}
                            mode={'outlined'}
                            placeholder='john.doe@resotechsolutions.com'
                            outlineStyle={{
                                borderRadius: 12,
                                borderColor: errors.email ? 'red' : '#6237A0'
                            }}
                            style={{ backgroundColor: 'white' }}
                            textColor='#28104E'
                            selectionColor='#6237a0'
                            activeOutlineColor="#6237a0"
                            onChangeText={text => setEmail(text)}
                        />
                        {errors.email && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Email is required!</Text></View>}
                    </View>
                    {loading ? <ActivityIndicator color={'#6237a0'} size={40} style={{ marginTop: 18, alignSelf: 'flex-end' }} /> :
                        <TouchableOpacity style={styles.loginButton} onPress={handleEmailSubmit}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
                        </TouchableOpacity>}
                </>
            }
            {slide === 2 &&
                <>
                    <Text style={styles.heading}>Enter OTP</Text>
                    <Text>Please enter the OTP sent to provided Email Id. If not received, click Resend.</Text>
                    <View style={styles.formContainer}>
                        {/* <TextInput style={{ ...styles.input, marginBottom: 5 }} editable={false} selectTextOnFocus={false} value={email} /> */}
                        <TextInput
                            label="Email"
                            value={email}
                            mode={'outlined'}
                            editable={false}
                            // placeholder='john.doe@resotechsolutions.com'
                            outlineStyle={{
                                borderRadius: 12,
                                borderColor: '#6237A0'
                            }}
                            style={{ backgroundColor: 'white' }}
                            textColor='#28104E'
                            selectionColor='#6237a0'
                            activeOutlineColor="#6237a0"
                        // onChangeText={text => setEmail(text)}
                        />
                        {/* <TextInput style={styles.input} keyboardType='numeric' maxLength={6} value={otp} placeholder='Eg: 123456' onChangeText={setOtp} /> */}


                        <OTPTextInput ref={e => (otpInput = e)} textInputStyle={{ marginBottom: 20, width: 40 }} handleTextChange={setOtp} inputCount={6} autoFocus={true} tintColor={'#6237a0'} />


                        {errors.otp && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'red', marginLeft: 5 }}>Enter a valid OTP!</Text></View>}
                        <View style={{ flexDirection: 'row' }}><Text>Not received? </Text>
                            <TouchableOpacity onPress={resendOtp} disabled={isActive}>
                                <Text style={{ color: isActive ? 'gray' : "#330066", fontWeight: '500' }}>Resend</Text>
                            </TouchableOpacity>
                            <Text> after {formatTime(timer)}</Text>
                        </View>
                    </View>
                    {loading ? <ActivityIndicator color={'#6237a0'} size={40} style={{ marginTop: 12, alignSelf: 'flex-end' }} /> : <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 12 }}>
                        {/* <Button style={styles.backButton} filled title="Back" onPress={() => setSlide(slide - 1)} /> */}
                        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Login')}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.loginButton, marginLeft: 10 }} onPress={handleOtpSubmit}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                        </TouchableOpacity>
                        {/* <Button style={styles.submitButton} filled title="Submit" onPress={handleOtpSubmit} /> */}
                    </View>}
                </>
            }

            {slide === 3 &&
                <>
                    <Text style={styles.heading}>Reset your password</Text>
                    <Text style={{ alignSelf: 'flex-start' }}>Please enter and confirm your new password</Text>
                    <View style={styles.formContainer}>
                        {/* <TextInput style={styles.input} editable={false} selectTextOnFocus={false} value={email} /> */}
                        <TextInput
                            label="Email"
                            value={email}
                            mode={'outlined'}
                            editable={false}
                            // placeholder='john.doe@resotechsolutions.com'
                            outlineStyle={{
                                borderRadius: 12,
                                borderColor: '#6237A0'
                            }}
                            style={{ backgroundColor: 'white' }}
                            textColor='#28104E'
                            selectionColor='#6237a0'
                            activeOutlineColor="#6237a0"
                        // onChangeText={text => setEmail(text)}
                        />
                        {/* <View style={styles.newPasswordContainer}> */}
                        {/* <TextInput style={styles.inputPassword} secureTextEntry={!isPasswordVisible} value={newPassword} placeholder='New Password' onChangeText={setNewPassword} />
                            <View style={styles.eyeContainer}>
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Ionicons size={20} name={isPasswordVisible ? 'eye-off' : 'eye'} color='#061621' />
                                </TouchableOpacity>
                            </View> */}
                        <TextInput
                            label="New Password"
                            value={newPassword}
                            secureTextEntry={true}
                            mode={'outlined'}
                            outlineStyle={{
                                borderRadius: 12,
                                borderColor: errors.email ? 'red' : '#6237A0'
                            }}
                            style={{ backgroundColor: 'white', marginTop: 12 }}
                            textColor='#28104E'
                            selectionColor='#6237a0'
                            activeOutlineColor="#6237a0"
                            onChangeText={text => setNewPassword(text)}
                        />
                        {/* </View> */}
                        {/* {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null} */}
                        {errors.newPassword && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'red', marginLeft: 5 }}>{errors.newPassword}</Text></View>}
                        {/* <TextInput style={styles.input} value={confirmPassword} secureTextEntry={true} placeholder='Confirm Password' onChangeText={setConfirmPassword} /> */}
                        <TextInput
                            label="Confirm Password"
                            value={confirmPassword}
                            secureTextEntry={true}
                            mode={'outlined'}
                            outlineStyle={{
                                borderRadius: 12,
                                borderColor: errors.email ? 'red' : '#6237A0'
                            }}
                            style={{ backgroundColor: 'white', marginTop: 12 }}
                            textColor='#28104E'
                            selectionColor='#6237a0'
                            activeOutlineColor="#6237a0"
                            onChangeText={text => setConfirmPassword(text)}
                        />
                        {errors.confirmPassword ? <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'red', marginLeft: 5 }}>{errors.confirmPassword}</Text></View> : null}{errors.passwordsSame ? <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'red', marginLeft: 5 }}>{errors.passwordsSame}</Text></View> : null}
                    </View>
                    {loading ? <ActivityIndicator color={'#6237a0'} size={40} style={{ marginTop: 12, alignSelf: 'flex-end' }} /> : <TouchableOpacity style={styles.loginButton} onPress={handlePasswordSubmit}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                    </TouchableOpacity>}
                </>
            }

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
        fontSize: 24,
        color: "#6237a0",
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
    errorText: {
        color: '#de8704',
        marginBottom: 0,
    },
    formContainer: {
        // backgroundColor: 'cyan',
        width: '100%',
        marginVertical: 15
    },
    backButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        marginHorizontal: 10
    },
    submitButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20
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
    inputPassword: {
        height: 40,
        width: '90%',
        // padding: 10,
        // borderRadius: 5,
    },
    eyeContainer: {
        height: 40,
        marginLeft: 5,
        justifyContent: 'center'
    },

    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    loginButton: {
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