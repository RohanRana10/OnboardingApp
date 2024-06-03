import { FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_PROJECT_URL } from '../../utils/APIConstants';
import { UserContext } from '../../context/userContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';

export default function PendingTasks() {
    const context = useContext(UserContext);
    const { user } = context;
    const navigation = useNavigation();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    let samplePendingTasks = [
        {
            'projectId': 1001,
            'projectName': 'Project A',
            "taskTitle": 'write unit tests for feature X',
            "deadline": '2024-06-12'
        },
        {
            'projectId': 1002,
            'projectName': 'Project B',
            "taskTitle": 'debug issue in backend code',
            "deadline": '2025-06-04'
        },
        {
            'projectId': 1003,
            'projectName': 'Project C',
            "taskTitle": 'design user interface for new feature',
            "deadline": '28/02/2025'
        },
        {
            'projectId': 1004,
            'projectName': 'Project D',
            "taskTitle": 'optimize database queries',
            "deadline": '10/03/2025'
        },
        {
            'projectId': 1005,
            'projectName': 'Project E',
            "taskTitle": 'implement authentication system',
            "deadline": '20/04/2025'
        },
        {
            'projectId': 1006,
            'projectName': 'Project F',
            "taskTitle": 'write documentation for API endpoints',
            "deadline": '05/05/2025'
        },
        {
            'projectId': 1007,
            'projectName': 'Project G',
            "taskTitle": 'conduct code review for pull requests',
            "deadline": '30/06/2025'
        },
        {
            'projectId': 1008,
            'projectName': 'Project H',
            "taskTitle": 'test performance of application',
            "deadline": '25/07/2025'
        },
        {
            'projectId': 1009,
            'projectName': 'Project I',
            "taskTitle": 'update dependencies to latest versions',
            "deadline": '15/08/2025'
        },
        {
            'projectId': 1010,
            'projectName': 'Project J',
            "taskTitle": 'create user stories for upcoming sprint',
            "deadline": '10/09/2025'
        }
    ];

    const [pendingTasks, setPendingTasks] = useState([]);

    const getProject = (taskId) => {
        navigation.navigate('Task', { taskId: taskId });
    }

    const fetchPendingSubtasks = () => {
        setLoading(true);
        let url = `${BASE_PROJECT_URL}/pending-subtasks`
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
                setLoading(false);
                console.log(JSON.stringify(response.data.data));
                setPendingTasks(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                toast.show("Some error occured!", {
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

    // useEffect(() => {
    //     fetchPendingSubtasks();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPendingSubtasks();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: 100,
                    height: 100,
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <Text style={styles.heading}>Pending Tasks</Text>
                {(pendingTasks == null || pendingTasks?.length == 0) ? (<View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 400 }}>No Pending Tasks found!</Text>
                    <Image source={require('../../assets/Images/Logo.png')} style={{ marginTop: 12, width: 70, height: 70 }} />
                </View>) : (
                    <View style={{ paddingTop: 5, paddingHorizontal: 8, marginBottom: 18 }}>
                        <FlatList
                            contentContainerStyle={{}}
                            data={pendingTasks}
                            style={{ flexGrow: 1 }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => getProject(item.taskId)} style={{ borderRadius: 15, elevation: 3, marginBottom: 10, marginHorizontal: 10, paddingVertical: 15, shadowColor: 'black', backgroundColor: 'white', paddingHorizontal: 15, marginTop: 2 }}>
                                    <Text style={{ color: '#6237a0', fontWeight: '500', fontSize: 16, marginBottom: 10 }}>{item.title}</Text>
                                    <View style={{}}>
                                        <Text style={{ fontSize: 15, fontWeight: 300 }}><Text style={{ color: 'gray' }}>Project:</Text> {item.projectTitle}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <MaterialCommunityIcons name="calendar-clock-outline" size={20} color="red" />
                                            <Text style={{ marginLeft: 6, fontWeight: 'bold' }}>{item.endDate}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>)}
            </View>)}
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
        paddingHorizontal: 18,
    },
})