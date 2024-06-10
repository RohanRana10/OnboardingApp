import { useContext, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, Platform, Image, KeyboardAvoidingView, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios';
import { BASE_AUTH_URL, BASE_ONBOARD_URL } from '../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/userContext';
import { TextInput } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Login({ navigation }) {

    const toast = useToast();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const context = useContext(UserContext);
    let token;

    const { saveUserData, saveUserDashboardinfo, user } = context;

    const validateForm = () => {
        let errors = {};
        if (!username) {
            errors.username = "Username is required!";
        }
        if (!password) {
            errors.password = "Password is required!";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            Keyboard.dismiss();
            login();
            setUsername("");
            setPassword("");
            setErrors({});
        }
    }

    const forgotPassword = () => {
        navigation.navigate("ForgotPassword");
    }

    const setToken = async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.log("My error", error);
        }
    }

    const login = () => {
        setLoading(true);
        let url = `${BASE_AUTH_URL}/login`;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'username': username,
                'password': password
            }
        };

        axios.request(config)
            .then((response) => {
                if (response.data.status.statusCode !== 1) {
                    toast.show("Incorrect Username or Password!", {
                        type: "warning",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setLoading(false);
                }
                else {

                    token = response.data.data.userToken;
                    setToken(token);
                    saveUserData(response.data.data);
                    console.log("user info saved at login", response.data.data);

                    if (!response.data.data.passwordUpdated) {
                        navigation.navigate('ResetPassword');
                    }
                    else {
                        if (response.data.data.onboardingStatus) {
                            navigation.replace('SectionSelection');
                        }
                        else {
                            fetchUserDashboard();
                        }
                    }
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
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
                    console.log("dashboard info at login page fetched :", JSON.stringify(response.data.data));
                    saveUserDashboardinfo(response.data.data);
                    navigation.replace('Dashboard');
                    setLoading(false);
                }
                else {
                    console.log(JSON.stringify(response.data));
                    setLoading(false);
                    toast.show("Please try again (LOGIN)!", {
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
                console.log("Error fetching user dashboard data at login page", error);
            });
    }

    return (
        <>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
                <View style={styles.form}>
                    <Image resizeMode='contain' style={styles.image} source={require('../assets/Images/ResotechLogoBlack.png')} />
                    <View style={styles.middleImageContainer}>
                        <Image resizeMode='contain' source={require('../assets/Images/MiddleImage.png')} style={styles.middleImage} />
                    </View>
                    <TextInput
                        label="Username"
                        value={username}
                        mode={'outlined'}
                        outlineStyle={{
                            borderRadius: 12,
                            borderColor: errors.username ? 'red' : '#6237A0'
                        }}
                        style={{ backgroundColor: 'white', width: wp(92), alignSelf: 'center' }}
                        textColor='#28104E'
                        selectionColor='#6237a0'
                        activeOutlineColor="#6237a0"
                        onChangeText={text => setUsername(text)}
                    />
                    {errors.username && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: wp(1) }}>Username is required!</Text></View>}

                    <TextInput
                        label="Password"
                        value={password}
                        mode={'outlined'}
                        secureTextEntry={isPasswordVisible}
                        right={<TextInput.Icon icon={isPasswordVisible ? "eye" : "eye-off"} color={'#6237A0'} onPress={() => setIsPasswordVisible(prev => !prev)} forceTextInputFocus={false} />}
                        outlineStyle={{
                            borderRadius: 12,
                            borderColor: errors.password ? 'red' : '#6237A0'
                        }}
                        style={{ backgroundColor: 'white', marginTop: hp(1), width: wp(92), alignSelf: 'center' }}
                        textColor='#28104E'
                        selectionColor='#6237a0'
                        activeOutlineColor="#6237a0"
                        onChangeText={text => setPassword(text)}
                    />
                    {errors.password && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: wp(1) }}>Password is required!</Text></View>}
                    <View style={styles.forgotPwdContainer}>
                        <TouchableOpacity onPress={forgotPassword}>
                            <Text style={styles.forgotPwdText}>Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? <ActivityIndicator color={'#6237a0'} size={"large"} style={{ marginTop: hp(2) }} /> :
                        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: hp(1.8) }}>LOGIN</Text>
                        </TouchableOpacity>}
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        padding: wp(4),
        backgroundColor: '#fff'
    },
    form: {
        borderRadius: 30,
    },
    image: {
        width: wp(45),
        height: hp(6),
        alignSelf: 'center',
        alignSelf: 'flex-start',
    },
    forgotPwdContainer: {
        alignItems: 'flex-end',
        marginTop: hp(1)
    },
    forgotPwdText: {
        color: 'gray',
        paddingVertical: hp(1),
        fontSize: hp(1.8)
    },
    loginButton: {
        width: wp(92),
        backgroundColor: '#6237A0',
        height: hp(6.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
        borderRadius: hp(1.4),
        alignSelf: 'center'
    },
    middleImageContainer: {
        marginTop: hp("0%")
    },
    middleImage: {
        width: wp(90),
        height: hp(40),
        alignSelf: 'center'
    },
});

