import { useContext, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, TextInput, Platform, Image, KeyboardAvoidingView, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button'
import axios from 'axios';
import { BASE_URL } from '../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/userContext';

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
        // console.log(Object.keys(errors));
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            // console.log(`Submitted! Username: ${username}, Password: ${password}`);
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
        let url = `${BASE_URL}/login`;

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
                    // console.log("Incorrect username or password!");
                    // ToastAndroid.show("Incorrect Username or Password!", 1500);
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
                    token = response.data.data.token;
                    setToken(token);
                    saveUserData(response.data.data);
                    console.log("user info saved at login");

                    if (!response.data.data.passwordUpdated) {
                        navigation.navigate('ResetPassword');
                    }
                    else {
                        fetchUserDashboard();
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }

    const fetchUserDashboard = () => {
        let url = `${BASE_URL}/landing`;
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
                    navigation.navigate('Dashboard');
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
        
            <LinearGradient style={{ flex: 1 }} colors={[COLORS.secondary, COLORS.primary]}>
                {StatusBar.setBarStyle('light-content', true)}
                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} style={styles.container}>

                    <View style={styles.form}>
                        <Image source={require('../assets/New.gif')} style={styles.upperDial} />
                        <Image source={require('../assets/New.gif')} style={styles.lowerDial} />
                        <Image resizeMode='contain' style={styles.image} source={require('../assets/Logo.png')} />
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.input} onChangeText={setUsername} value={username} placeholder='Enter username' />
                        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput style={styles.inputPassword} secureTextEntry={!isPasswordVisible} placeholder='Enter password' value={password} onChangeText={setPassword} />
                            <View style={styles.eyeContainer}>
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Ionicons size={20} name={isPasswordVisible ? 'eye-off' : 'eye'} color='#061621' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        <View style={styles.forgotPwdContainer}>
                            <TouchableOpacity onPress={forgotPassword}>
                                <Text style={styles.forgotPwdText}>Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* <Button style={{
                    marginTop: 10,
                    padding: 20
                }} title='Login' onPress={handleSubmit} /> */}
                        {loading ? <ActivityIndicator color={'white'} size={40} style={{ marginTop: 18 }} /> : <Button title="LOGIN"
                            onPress={handleSubmit}
                            style={{
                                marginTop: 18,
                                width: "100%"
                            }} />}
                    </View>
                </KeyboardAvoidingView>

            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#061621",
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 20,
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
        // backgroundColor: '#061621',
        paddingHorizontal: 25,
        paddingVertical: 28,
        borderRadius: 30,
        // shadowColor: 'black',
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
        // borderWidth: 1,
        // borderColor: 'gray'
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
        // backgroundColor: 'white',
        // borderColor: '#ddd',
        // borderWidth: 1,
        // marginBottom: 15,
        padding: 10,
        borderRadius: 5,
    },
    image: {
        width: 200,
        height: 80,
        alignSelf: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: 'orange',
        marginBottom: 10,
    },
    loginButton: {
        marginTop: 10,
        padding: 20
    },
    forgotPwdContainer: {
        alignItems: 'flex-end',
        // paddingBottom: 10
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
    }
});

