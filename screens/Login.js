import { useContext, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, Platform, Image, KeyboardAvoidingView, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button'
import axios from 'axios';
import { BASE_URL, BASE_AUTH_URL, BASE_ONBOARD_URL } from '../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/userContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';


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

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

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
                    // console.log(token);
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
                        else{
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
                    setLoading(false);
                    navigation.replace('Dashboard');
                    // navigation.replace('SectionSelection');
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
                    {/* <Image source={require('../assets/New.gif')} style={styles.upperDial} /> */}
                    {/* <Image source={require('../assets/New.gif')} style={styles.lowerDial} /> */}
                    <Image resizeMode='contain' style={styles.image} source={require('../assets/Images/ResotechLogoBlack.png')} />
                    <View style={styles.middleImageContainer}>
                        <Image resizeMode='contain' source={require('../assets/Images/MiddleImage.png')} style={styles.middleImage} />
                    </View>
                    {/* <Text style={styles.label}>Username</Text> */}
                    {/* <TextInput style={styles.input} onChangeText={setUsername} value={username} placeholder='Enter username' /> */}
                    <TextInput
                        label="Username"
                        value={username}
                        mode={'outlined'}
                        outlineStyle={{
                            borderRadius: 12,
                            borderColor: errors.username ? 'red' : '#6237A0'
                        }}
                        style={{ backgroundColor: 'white' }}
                        textColor='#28104E'
                        selectionColor='#6237a0'
                        activeOutlineColor="#6237a0"
                        onChangeText={text => setUsername(text)}
                    />
                    {errors.username && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Username is required!</Text></View>}
                    {/* <Text style={styles.label}>Password</Text> */}
                    {/* <View style={styles.passwordContainer}>
                            <TextInput style={styles.inputPassword} secureTextEntry={!isPasswordVisible} placeholder='Enter password' value={password} onChangeText={setPassword} />
                            <View style={styles.eyeContainer}>
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Ionicons size={20} name={isPasswordVisible ? 'eye-off' : 'eye'} color='#061621' />
                                </TouchableOpacity>
                            </View>
                        </View> */}
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
                        style={{ backgroundColor: 'white', marginTop: 10 }}
                        textColor='#28104E'
                        selectionColor='#6237a0'
                        activeOutlineColor="#6237a0"
                        onChangeText={text => setPassword(text)}
                    />
                    {errors.password && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Password is required!</Text></View>}
                    <View style={styles.forgotPwdContainer}>
                        <TouchableOpacity onPress={forgotPassword}>
                            <Text style={styles.forgotPwdText}>Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? <ActivityIndicator color={'#6237a0'} size={40} style={{ marginTop: 18 }} /> :
                        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>LOGIN</Text>
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
        padding: 20,
        backgroundColor: '#fff'
    },
    upperDial: {
        position: 'absolute',
        left: -185,
        top: -330,
        width: 400,
        height: 400
    },
    lowerDial: {
        position: 'absolute',
        left: 140,
        top: 360,
        width: 400,
        height: 400
    },
    form: {
        // paddingHorizontal: 12,
        // paddingVertical: 28,
        borderRadius: 30,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#B3B6BB',
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
    },
    inputPassword: {
        height: 40,
        width: '88%',
        padding: 10,
        borderRadius: 5,
    },
    image: {
        width: 180,
        height: 50,
        alignSelf: 'center',
        alignSelf: 'flex-start',
        // marginBottom: 20,
    },
    errorText: {
        color: 'black',
        marginBottom: 10,
    },
    loginButton: {
        marginTop: 10,
        padding: 20
    },
    forgotPwdContainer: {
        alignItems: 'flex-end',
    },
    forgotPwdText: {
        color: 'gray',
        paddingVertical: 5
    },
    passwordContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 41,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
    },
    eyeContainer: {
        height: 40,
        marginLeft: 5,
        justifyContent: 'center'
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#6237A0',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 12
    },
    middleImageContainer: {
        marginTop: 20
    },
    middleImage: {
        width: '100%',
        height: 270,
        // backgroundColor: 'cyan'
    },
});

