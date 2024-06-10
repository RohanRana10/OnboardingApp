import { ScrollView, StyleSheet, StatusBar, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import * as Progress from 'react-native-progress';
import { UserContext } from '../../context/userContext'
import axios from 'axios'
import { BASE_PROJECT_URL } from '../../utils/APIConstants'
import { useToast } from 'react-native-toast-notifications'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Home() {
    const { height, width } = Dimensions.get('window');
    const navigation = useNavigation();
    const context = useContext(UserContext);
    const { user, updatePendingTasks } = context;
    const [selectedTab, setSelectedTab] = useState(0);
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isErrorScreenVisible, setIsErrorScreenVisible] = useState(false);

    const [projects, setProjects] = useState([]);

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
                    setSelectedTab(0);
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

    useFocusEffect(
        React.useCallback(() => {
            fetchProjects();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            {loading ? (<View style={{ height: hp(95), justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: wp(20),
                    height: wp(20),
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: wp(4) }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', width: wp(92) }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FontAwesome name="bars" size={hp(2.8)} color="#6237a0" />
                        </TouchableOpacity>
                        <Text style={{ color: '#6237A0', fontSize: hp(3.2), fontWeight: 'bold', marginLeft: wp(3) }}>{user.firstName}'s Dashboard</Text>
                    </View>

                </View>
                <View style={{ marginTop: hp(2) }}>
                    <View style={{ width: wp(92), height: hp(9), borderRadius: hp(2), flexDirection: 'row', alignItems: 'center', paddingLeft: wp(2), paddingRight: wp(2), backgroundColor: '#f2e6ff', alignSelf: 'center', justifyContent: 'space-evenly' }}>

                        <TouchableOpacity onPress={() => filterProjects('', 0)} style={{ width: wp(27), height: hp(7), backgroundColor: selectedTab === 0 ? '#6237a0' : '#f2e6ff', borderRadius: hp(2), justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ color: selectedTab === 0 ? 'white' : '#6237A0', fontSize: hp(2), fontWeight: '700' }}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => filterProjects("ongoing", 1)} style={{ width: wp(27), height: hp(7), backgroundColor: selectedTab === 1 ? '#6237a0' : '#f2e6ff', borderRadius: hp(2), justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ color: selectedTab === 1 ? 'white' : '#6237A0', fontSize: hp(2), fontWeight: '700' }}>Ongoing</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => filterProjects('completed', 2)} style={{ width: wp(27), height: hp(7), backgroundColor: selectedTab === 2 ? '#6237a0' : '#f2e6ff', borderRadius: hp(2), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: selectedTab === 2 ? 'white' : '#6237A0', fontSize: hp(2), fontWeight: '700' }}>Completed</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ backgroundColor: '#fff' }}>
                        {onScreenProjects?.length == 0 ? (
                            <View style={{ width: wp(100), height: hp(80), alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontWeight: 400, fontSize: hp(1.8) }}>No Projects Found!</Text>
                                <Image source={require('../../assets/Images/Logo.png')} style={{ marginTop: hp(2), width: wp(16), height: wp(16) }} />
                            </View>
                        ) : (
                            <View style={{height: hp(75) }}>
                            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', paddingTop: hp(1.5), backgroundColor: 'white', paddingBottom: hp(5)}}>
                                {onScreenProjects.map((item, index) => (
                                    <TouchableOpacity key={item.id} onPress={() => loadProjectInfo(item.id)} style={{ ...styles.projectContainer, marginTop: hp(1.5) }}>
                                        <Progress.Circle size={hp(5)} progress={item["Percentage Complete"] / 100}
                                            color='#07da63'
                                            unfilledColor='#ddd'
                                            strokeCap='round'
                                            borderWidth={0}
                                            thickness={hp(1)}
                                        />
                                        <Text style={{ marginVertical: hp(1.2), color: '#aaa', fontSize: hp(1.5) }}>{item["total tasks"] == null ? 0 : item["total tasks"]} Tasks</Text>
                                        <Text style={{ fontWeight: '600', fontSize: hp(2), color: '#28104E', marginBottom: hp(1.8) }}>{item.projectName}</Text>
                                        <View style={{ backgroundColor: '#f2e6ff', alignSelf: 'flex-start', paddingHorizontal: wp(1.5), borderRadius: hp(1.5), paddingVertical: hp(0.7) }}>
                                            <Text style={{}}>{item.tag ? (item.tag).charAt(0).toUpperCase() + (item.tag).slice(1) : "General"}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView></View>)}
                    </View>

                </View>
            </View>)}
        </SafeAreaView>

        // <SafeAreaView style={styles.container}>
        //     <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
        //     {loading ? (
        //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //             <Image style={{
        //                 width: 100,
        //                 height: 100,
        //             }} source={require('../../assets/New.gif')} />
        //         </View>
        //     ) : (
        //         <View style={{ flex: 1 }}>
        //             <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: wp(4) }}>
        //                 <View style={{ alignItems: 'center', flexDirection: 'row', width: wp(92) }}>
        //                     <TouchableOpacity onPress={() => navigation.goBack()}>
        //                         <FontAwesome name="bars" size={24} color="black" />
        //                     </TouchableOpacity>
        //                     <Text style={{ color: '#6237A0', fontSize: hp(3.2), fontWeight: 'bold', marginLeft: wp(3) }}>{user.firstName}'s Dashboard</Text>
        //                 </View>
        //             </View>
        //             <View style={{ marginTop: hp(2) }}>
        //                 <View style={{ width: wp(92), height: hp(9), borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingLeft: wp(2), paddingRight: wp(2), backgroundColor: '#f2e6ff', alignSelf: 'center', justifyContent: 'space-evenly' }}>
        //                     <TouchableOpacity onPress={() => filterProjects('', 0)} style={{ width: wp(27), height: hp(7), backgroundColor: selectedTab === 0 ? '#6237a0' : '#f2e6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
        //                         <Text style={{ color: selectedTab === 0 ? 'white' : '#6237A0', fontSize: hp(2), fontWeight: '700' }}>All</Text>
        //                     </TouchableOpacity>
        //                     <TouchableOpacity onPress={() => filterProjects("ongoing", 1)} style={{ width: wp(27), height: hp(7), backgroundColor: selectedTab === 1 ? '#6237a0' : '#f2e6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
        //                         <Text style={{ color: selectedTab === 1 ? 'white' : '#6237A0', fontSize: hp(2), fontWeight: '700' }}>Ongoing</Text>
        //                     </TouchableOpacity>
        //                     <TouchableOpacity onPress={() => filterProjects('completed', 2)} style={{ width: wp(27), height: hp(7), backgroundColor: selectedTab === 2 ? '#6237a0' : '#f2e6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
        //                         <Text style={{ color: selectedTab === 2 ? 'white' : '#6237A0', fontSize: hp(2), fontWeight: '700' }}>Completed</Text>
        //                     </TouchableOpacity>
        //                 </View>
        //                 {onScreenProjects?.length == 0 ? (
        //                     <View style={{ width: wp(100), height: hp(80), alignItems: 'center', justifyContent: 'center' }}>
        //                         <Text style={{ fontWeight: 400, fontSize: hp(2) }}>No Projects Found!</Text>
        //                         <Image source={require('../../assets/Images/Logo.png')} style={{ marginTop: 12, width: wp(16), height: wp(16) }} />
        //                     </View>
        //                 ) : (
        //                     <ScrollView contentContainerStyle={{ paddingVertical: hp(1.5), backgroundColor: 'white', alignItems: 'center' }}>
        //                         {onScreenProjects.map((item, index) => (
        //                             <TouchableOpacity key={item.id} onPress={() => loadProjectInfo(item.id)} style={{ ...styles.projectContainer, marginTop: hp(1.5), alignItems: 'center' }}>
        //                                 <Progress.Circle size={40} progress={item["Percentage Complete"] / 100}
        //                                     color='#07da63'
        //                                     unfilledColor='#ddd'
        //                                     strokeCap='round'
        //                                     borderWidth={0}
        //                                     thickness={7}
        //                                 />
        //                                 <Text style={{ marginVertical: hp(1.2), color: '#aaa', fontSize: hp(1.5) }}>{item["total tasks"] == null ? 0 : item["total tasks"]} Tasks</Text>
        //                                 <Text style={{ fontWeight: '600', fontSize: hp(2), color: '#28104E', marginBottom: hp(1.8) }}>{item.projectName}</Text>
        //                                 <View style={{ backgroundColor: '#f2e6ff', alignSelf: 'flex-start', paddingHorizontal: wp(1.5), borderRadius: 8, paddingVertical: hp(0.7) }}>
        //                                     <Text style={{}}>{item.tag ? (item.tag).charAt(0).toUpperCase() + (item.tag).slice(1) : "General"}</Text>
        //                                 </View>
        //                             </TouchableOpacity>
        //                         ))}
        //                     </ScrollView>
        //                 )}
        //             </View>
        //         </View>
        //     )}
        // </SafeAreaView>


    )
}

const styles = StyleSheet.create({
    container: {
        height: hp(100),
        paddingTop: hp(2),
        backgroundColor: '#fff'
    },
    projectContainer: {
        width: wp(43),
        minHeight: hp(20),
        // aspectRatio: 0.75,
        backgroundColor: 'white',
        borderRadius: hp(5),
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
        paddingHorizontal: wp(4),
        paddingVertical: hp(4),
    }
})