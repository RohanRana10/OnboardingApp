import { View, Text, StyleSheet, StatusBar, Image, TextInput, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import COLORS from '../constants/colors'
import Button from './Button';
import { Ionicons } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications';
import OTPTextInput from 'react-native-otp-textinput'
import axios from 'axios';
import { BASE_URL } from '../utils/APIConstants';


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
            let url = `${BASE_URL}/forget-password/generate-otp`
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
            let url = `${BASE_URL}/forget-password/generate-otp`
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
            let url = `${BASE_URL}/forget-password/validate-otp`
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
            let url = `${BASE_URL}/forget-password/change-password`
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
            {StatusBar.setBarStyle('dark-content', true)}
            <Image resizeMode='center' style={styles.logo} source={require('../assets/LogoBlack.png')}></Image>
            {/* <Text style={styles.email}>rohan.rana@resotechsolutions.com</Text> */}
            {slide === 1 &&
                <>
                    <Text style={styles.heading}>Forgot password</Text>
                    <Text>Enter your registered Email Id in order to proceed with the password updation process</Text>
                    <View style={styles.formContainer}>
                        <TextInput style={styles.input} value={email} placeholder='Eg: john.doe@resotechsolutions.com' onChangeText={setEmail} />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    </View>
                    {loading ? <ActivityIndicator color={COLORS.primary} size={40} style={{ marginTop: 12, alignSelf: 'flex-end' }} /> : <Button style={styles.submitButton} filled title="Get OTP" onPress={handleEmailSubmit} />}
                </>
            }
            {slide === 2 &&
                <>
                    <Text style={styles.heading}>Enter OTP</Text>
                    <Text>Please enter the OTP sent to provided Email Id. If not received, click Resend.</Text>
                    <View style={styles.formContainer}>
                        <TextInput style={{ ...styles.input, marginBottom: 5 }} editable={false} selectTextOnFocus={false} value={email} />
                        {/* <TextInput style={styles.input} keyboardType='numeric' maxLength={6} value={otp} placeholder='Eg: 123456' onChangeText={setOtp} /> */}


                        <OTPTextInput ref={e => (otpInput = e)} textInputStyle={{ marginBottom: 20, width: 48 }} handleTextChange={setOtp} inputCount={6} autoFocus={true} tintColor={COLORS.primary} />


                        {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                        <View style={{ flexDirection: 'row' }}><Text>Not received? </Text>
                            <TouchableOpacity onPress={resendOtp} disabled={isActive}>
                                <Text style={{ color: isActive ? 'gray' : COLORS.primary, fontWeight: '500' }}>Resend</Text>
                            </TouchableOpacity>
                            <Text> after {formatTime(timer)}</Text>
                        </View>
                    </View>
                    {loading ? <ActivityIndicator color={COLORS.primary} size={40} style={{ marginTop: 12, alignSelf: 'flex-end' }} /> : <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Button style={styles.backButton} filled title="Back" onPress={() => setSlide(slide - 1)} />
                        <Button style={styles.submitButton} filled title="Submit" onPress={handleOtpSubmit} />
                    </View>}
                </>
            }

            {slide === 3 &&
                <>
                    <Text style={styles.heading}>Reset your password</Text>
                    <Text style={{ alignSelf: 'flex-start' }}>Please enter and confirm your new password</Text>
                    <View style={styles.formContainer}>
                        <TextInput style={styles.input} editable={false} selectTextOnFocus={false} value={email} />
                        <View style={styles.newPasswordContainer}>
                            <TextInput style={styles.inputPassword} secureTextEntry={!isPasswordVisible} value={newPassword} placeholder='New Password' onChangeText={setNewPassword} />
                            <View style={styles.eyeContainer}>
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Ionicons size={20} name={isPasswordVisible ? 'eye-off' : 'eye'} color='#061621' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
                        <TextInput style={styles.input} value={confirmPassword} secureTextEntry={true} placeholder='Confirm Password' onChangeText={setConfirmPassword} />
                        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}{errors.passwordsSame ? <Text style={{ color: 'red' }}>{errors.passwordsSame}</Text> : null}
                    </View>
                    {loading ? <ActivityIndicator color={COLORS.primary} size={40} style={{ marginTop: 12, alignSelf: 'flex-end' }} /> : <Button style={styles.submitButton} filled title="Submit" onPress={handlePasswordSubmit} />}
                </>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'cyan',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    heading: {
        alignSelf: 'flex-start',
        fontSize: 25,
        color: COLORS.primary,
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
        marginBottom: 10,
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
})