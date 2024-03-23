import { Image, Text, View,Animated, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import COLORS from '../constants/colors'
import Button from '../components/Button'
const Welcome = ({ navigation }) => {
    return (
        <LinearGradient style={{ flex: 1 }} colors={[COLORS.secondary, COLORS.primary]}>
            {StatusBar.setBarStyle('light-content', true)}
            <View>
                <Image
                    source={require('../assets/LogoIcon.png')}
                    style={{
                        height: 130,
                        width: 130,
                        borderRadius: 20,
                        position: 'absolute',
                        top: 0,
                        left: 50,
                        transform: [
                            { translateX: 50 },
                            { translateY: 50 },
                            { rotate: '-55deg' }
                        ]
                    }}
                />
                <Image
                    source={require('../assets/LogoIcon.png')}
                    style={{
                        height: 110,
                        width: 110,
                        borderRadius: 20,
                        position: 'absolute',
                        top: 140,
                        left: -10,
                        transform: [
                            { translateX: 35 },
                            { translateY: 50 },
                            { rotate: '60deg' }
                        ]
                    }}
                />
                <Image
                    source={require('../assets/LogoIcon.png')}
                    style={{
                        height: 200,
                        width: 200,
                        borderRadius: 20,
                        position: 'absolute',
                        top: 130,
                        left: 120,
                        transform: [
                            { translateX: 45 },
                            { translateY: 60 },
                            
                        ]
                    }}
                />
                <View style={{
                    paddingHorizontal: 22,
                    position: 'absolute',
                    top: 400,
                    width: '100%'
                }}>
                    <Text style={{
                        fontSize: 40,
                        fontWeight: 700,
                        color: COLORS.white
                    }}>Onboard to</Text>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: 600,
                        color: COLORS.white
                    }}>RESOTECH</Text>
                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                            marginVertical: 4
                        }}>
                            Seamless integration awaits. Embark with us on
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                        }}>your next adventure. Join us now!</Text>
                    </View>
                    <Button title="Get Started"
                        onPress={() => navigation.navigate("Login")}
                        style={{
                            marginTop: 22,
                            width: "100%"
                        }} />
                </View>
            </View>
        </LinearGradient>
    )
}

export default Welcome
