import { Button, FlatList, ScrollView, StyleSheet, StatusBar, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
// import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import * as Progress from 'react-native-progress';
import { UserContext } from '../../context/userContext'
import axios from 'axios'
import { BASE_PROJECT_URL } from '../../utils/APIConstants'
import { useToast } from 'react-native-toast-notifications'



export default function Home() {
    const navigation = useNavigation();
    const context = useContext(UserContext);
    const { user, updatePendingTasks } = context;
    const [selectedTab, setSelectedTab] = useState(0);
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isErrorScreenVisible, setIsErrorScreenVisible] = useState(false);

    const isFocused = useIsFocused();

    const [projects, setProjects] = useState([
        // { name: "Rohan", id: 1 },
        // { name: "Raman", id: 2 },
        // { name: "Rishabh", id: 3 },
        // { name: "Ravi", id: 4 },
        // { name: "Vansh", id: 5 },
        // { name: "Vishal", id: 6 },
        // { name: "Jai", id: 7 },
        // { name: "Rishi", id: 8 },
    ]);

    const filterProjects = (condition, value) => {

        setSelectedTab(value);
        if (value == 0) {
            setOnScreenProjects(projects);
        }
        else {
            let temp = projects.filter((project) => {
                return (project.status).toLowerCase() === condition
            })
            setOnScreenProjects(temp);
        }

    }

    function getRandomNumber() {
        return Math.floor(Math.random() * 101); // 10 because Math.random() generates a number from 0 (inclusive) to 1 (exclusive)
    }

    const [onScreenProjects, setOnScreenProjects] = useState([]);

    const loadProjectInfo = (id) => {
        navigation.navigate('Project', { projectId: id });
    }

    const fetchProjects = () => {
        setLoading(true);
        let url = `${BASE_PROJECT_URL}/get-projects`;
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
                console.log(response.data.status.statusCode);
                if (response.data.status.statusCode === -1) {
                    console.log("-1 response");
                    setLoading(false);
                }
                else {
                    console.log(JSON.stringify(response.data.data.projects));
                    let temp = response.data.data.projects
                    setProjects(temp);
                    setOnScreenProjects(temp);
                    setLoading(false);
                    updatePendingTasks(response.data.data["pending SubTasks"]);
                }

            })
            .catch((error) => {
                console.log("error fetching projects", error);
                toast.show("Some error occured (fetching projects)!", {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
                setIsErrorScreenVisible(true);
                setLoading(false);
            });
    }

    // useEffect(() => {
    //     fetchProjects();
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchProjects();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            {/* {isErrorScreenVisible ? (<View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 400 }}>Error Loading Projects!</Text>
                <Image source={require('../../assets/Images/Logo.png')} style={{ marginTop: 12, width: 70, height: 70 }} /></View>) : (<View> */}
            {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: 100,
                    height: 100,
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 18 }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', width: '75%' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FontAwesome name="bars" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={{ color: '#6237A0', fontSize: 24, fontWeight: 'bold', marginLeft: 10 }}>{user.firstName}'s Dashboard</Text>
                    </View>

                </View>
                <View style={{ marginTop: 14 }}>
                    <View style={{ width: '94%', height: 60, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 5, backgroundColor: '#f2e6ff', alignSelf: 'center' }}>

                        <TouchableOpacity onPress={() => filterProjects('', 0)} style={{ width: '33.33%', height: 50, backgroundColor: selectedTab === 0 ? '#6237a0' : '#f2e6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ color: selectedTab === 0 ? 'white' : '#6237A0', fontSize: 16, fontWeight: '700' }}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => filterProjects("ongoing", 1)} style={{ width: '33.33%', height: 50, backgroundColor: selectedTab === 1 ? '#6237a0' : '#f2e6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ color: selectedTab === 1 ? 'white' : '#6237A0', fontSize: 16, fontWeight: '700' }}>Ongoing</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => filterProjects('completed', 2)} style={{ width: '33.33%', height: 50, backgroundColor: selectedTab === 2 ? '#6237a0' : '#f2e6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: selectedTab === 2 ? 'white' : '#6237A0', fontSize: 16, fontWeight: '700' }}>Completed</Text>
                        </TouchableOpacity>

                    </View>

                    {/* <ScrollView style={{marginBottom: 100}}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center'}}>
                        <View style={{...styles.projectContainer}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: 40}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: -10}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: 40}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: -10}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: 40}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: -10}}>
                        </View>
                        <View style={{...styles.projectContainer, marginTop: 40}}>
                        </View>
                    </View>
                </ScrollView> */}
                    {/* <View style={{ height: '90%' }}>
                    <FlatList
                        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 20, backgroundColor: 'white' }}
                        data={projects} renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => loadProjectInfo(item.id)} style={{ ...styles.projectContainer, marginTop: index % 2 === 0 ? -10 : 20 }}>
                                    <Progress.Circle size={40} progress={0.6}
                                        color='#07da63'
                                        unfilledColor='#ddd'
                                        strokeCap='round'
                                        borderWidth={0}
                                        thickness={7}
                                    />
                                    <Text style={{ marginVertical: 10, color: '#aaa', fontSize: 12 }}>15 Tasks</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 17, color: '#28104E', marginBottom: 18 }}>Project Title </Text>
                                    <View style={{backgroundColor: '#f2e6ff', alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 8, paddingVertical: 5}}>
                                        <Text>Mobile</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item) => item.id.toString()} />
                </View> */}

                    <View style={{ height: '90%' }}>
                        {onScreenProjects?.length == 0 ? (
                            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontWeight: 400 }}>No Projects Found!</Text>
                                <Image source={require('../../assets/Images/Logo.png')} style={{ marginTop: 12, width: 70, height: 70 }} />
                            </View>
                        ) : (
                            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 20, backgroundColor: 'white' }}>
                                {onScreenProjects.map((item, index) => (
                                    <TouchableOpacity key={item.id} onPress={() => loadProjectInfo(item.id)} style={{ ...styles.projectContainer, marginTop: 10 }}>
                                        <Progress.Circle size={40} progress={item["Percentage Complete"] / 100}
                                            color='#07da63'
                                            unfilledColor='#ddd'
                                            // endAngle={0}
                                            strokeCap='round'
                                            borderWidth={0}
                                            thickness={7}
                                        />
                                        <Text style={{ marginVertical: 10, color: '#aaa', fontSize: 12 }}>{item["total tasks"] == null ? 0 : item["total tasks"]} Tasks</Text>
                                        {/* <Text style={{ fontWeight: '600', fontSize: 17, color: '#28104E', marginBottom: 18 }}>Performance Dashboard (Mobile App) </Text> */}
                                        <Text style={{ fontWeight: '600', fontSize: 17, color: '#28104E', marginBottom: 18 }}>{item.projectName}</Text>
                                        <View style={{ backgroundColor: '#f2e6ff', alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 8, paddingVertical: 5 }}>
                                            <Text>{item.tag ? (item.tag).charAt(0).toUpperCase() + (item.tag).slice(1) : "General"}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>)}
                    </View>

                </View>
            </View>)}
            {/* </View>)} */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: '#fff'
    },
    projectContainer: {
        width: 150,
        minHeight: 200,
        // aspectRatio: 0.75,
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: "black",
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 11,
        marginHorizontal: 10,
        // alignItems: 'center',
        color: 'black',
        paddingHorizontal: 15,
        paddingVertical: 20
    }
})