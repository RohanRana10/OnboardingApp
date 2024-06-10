import { Alert, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HalfScreenModal from '../../components/ProjectManagement/HalfScreenModal';
import { AntDesign, Feather, Foundation } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SubTask from '../../components/ProjectManagement/SubTask';
import { Divider } from '../../components/ProjectManagement/Divider';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { UserContext } from '../../context/userContext';
import { useToast } from 'react-native-toast-notifications';
import { BASE_PROJECT_URL } from '../../utils/APIConstants';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Task({ route }) {
    const toast = useToast();
    const context = useContext(UserContext);
    const { user, isAdmin } = context;
    const { taskId, users } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState({});


    const [maxYear, setMaxYear] = useState("");
    const [maxMonth, setMaxMonth] = useState("");
    const [maxDay, setMaxDay] = useState("");
    const [fetchError, setFetchError] = useState(false);

    //TODO change this (add opened in fetched subtasks)
    const [subtasks, setSubtasks] = useState([
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
        // { title: "Write unit tests for feature X", opened: false },
    ]);

    const separateDate = (date) => {
        const [year, month, day] = date.split("-");
        setMaxYear(Number(year));
        setMaxMonth(Number(month) - 1);
        setMaxDay(Number(day));
    }


    const toggleSubTask = (subtaskId, status) => {
        console.log(`TODO: Toggle subtask of index ${subtaskId} from ${status} to ${!status}`);
        setLoading(true);
        let url = `${BASE_PROJECT_URL}/update-status`
        let data = JSON.stringify({
            "subTaskId": subtaskId,
            "status": status
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.userToken,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                fetchTaskDetails();
                toast.show("Sub-task status updated!", {
                    type: "success",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error while toggling subtask", error);
                setLoading(false);
                toast.show("Some error occured!", {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
            });
    }

    const openComponent = (ind) => {
        let tempData = subtasks;
        tempData.map((item, index) => {
            if (index == ind) {
                item.opened = true;
            }
            else {
                item.opened = false;
            }
        });
        let temp = [];
        tempData.map((item) => {
            temp.push(item);
        });
        setSubtasks(temp);
    }

    const deleteSubtask = (subtaskId) => {
        const url = `${BASE_PROJECT_URL}/delete-subtask`;
        let data = JSON.stringify({
            "subTaskId": subtaskId
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.userToken,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                fetchTaskDetails();
                toast.show("Sub-task deleted!", {
                    type: "success",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
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
            });
    }
    const editSubtask = (subtask) => {

        console.log("Data sent", subtask);
        navigation.navigate('EditSubtask', { subtask: subtask, taskId: taskId, memberList: users, maxYear: maxYear, maxDay: maxDay, maxMonth: maxMonth });
    }

    const fetchTaskDetails = () => {
        setLoading(true);
        let url = `${BASE_PROJECT_URL}/get-task-details`;
        let data = JSON.stringify({
            "taskId": taskId
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.userToken,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log("status code:", response.data.status.statusCode);
                if (response.data.status.statusCode !== 1) {
                    setFetchError(true);
                    setLoading(false);
                }
                else{
                    console.log("Task details:", JSON.stringify(response.data));
                setTask(response.data.data);
                separateDate(response.data.data.endDate);
                setLoading(false);
                }
                
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
    //     fetchTaskDetails();
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchTaskDetails()
        }, [])
    );

    const deleteTask = () => {
        setLoading(true);
        const url = `${BASE_PROJECT_URL}/delete-task`;
        let data = JSON.stringify({
            "taskId": taskId
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.userToken,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                navigation.goBack();
                toast.show("Task deleted!", {
                    type: "success",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                toast.show("Some error occured!", {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
            });
    }

    const closeModal = () => {
        setModalVisible(false);
    }



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            {loading ? (<View style={{ height: hp(95), justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: wp(20),
                    height: wp(20),
                }} source={require('../../assets/New.gif')} />
            </View>) : (
                <View>
                    {fetchError ? (<View style={{}}>
                        <TouchableOpacity style={{ marginRight: wp(2) }} onPress={() => navigation.goBack()}>
                            <AntDesign name="back" size={hp(3.2)} color="#6237a0" />
                        </TouchableOpacity>
                        <View style={{ height: hp(90), alignItems: "center", justifyContent: 'center' }}>
                            <Text>Error loading Task!</Text>
                            <Image style={{ width: wp(13), height: wp(13), marginTop: hp(1) }} source={require('../../assets/Images/server.png')} />
                        </View>
                    </View>) : (<View>
                        <View style={{ flexDirection: 'row', width: wp(92), justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1) }}>
                            <View style={{ backgroundColor: '#f2e6ff', paddingVertical: hp(1), paddingHorizontal: wp(3), borderRadius: hp(1.5) }}>
                                <Text style={{ fontSize: hp(1.6) }}>Task</Text>
                            </View>
                            <View style={{}}>
                                <Menu>
                                    <MenuTrigger customStyles={{
                                        triggerWrapper: {
                                        }
                                    }}>
                                        <AntDesign name="setting" size={hp(3.2)} color="black" />
                                    </MenuTrigger>
                                    <MenuOptions customStyles={{
                                        optionsContainer: {
                                            borderRadius: hp(1.5),
                                            marginTop: hp(4),
                                            width: wp(45),
                                        }
                                    }}>
                                        <MenuOption onSelect={() => navigation.navigate('Project', { projectId: task.projectId })}>
                                            <View style={{ paddingHorizontal: wp(3), justifyContent: 'space-between', flexDirection: 'row', paddingVertical: hp(1), alignItems: 'center' }}>
                                                <Text style={{ fontSize: hp(1.8) }}>View Project</Text>
                                                <Foundation name="graph-trend" size={hp(3)} color="#6237a0" />
                                            </View>
                                        </MenuOption>

                                        {(isAdmin || user.roles.includes("manager")) &&
                                            <>
                                                <Divider />
                                                <MenuOption onSelect={() => navigation.navigate('EditTask', { task: task, maxYear: maxYear, maxDay: maxDay, maxMonth: maxMonth })}>
                                                    <View style={{ paddingHorizontal: wp(3), justifyContent: 'space-between', flexDirection: 'row', paddingVertical: hp(1), alignItems: 'center' }}>
                                                        <Text style={{ fontSize: hp(1.8) }}>Edit Task</Text>
                                                        <Feather name="edit-3" size={hp(3)} color="#3d7bed" />
                                                    </View>
                                                </MenuOption>
                                                <Divider /></>}
                                        {(isAdmin || user.roles.includes("manager")) &&
                                            <MenuOption onSelect={() => {
                                                Alert.alert(
                                                    "Confirmation",
                                                    "Are you sure you want to delete this task?",
                                                    [
                                                        {
                                                            text: "Cancel",
                                                            onPress: () => console.log("Cancel Pressed"),
                                                            style: "cancel"
                                                        },
                                                        {
                                                            text: "OK",
                                                            onPress: () => deleteTask()
                                                        }
                                                    ]
                                                );
                                            }} >
                                                <View style={{ paddingHorizontal: wp(3), justifyContent: 'space-between', flexDirection: 'row', paddingVertical: hp(1), alignItems: 'center' }}>
                                                    <Text style={{ fontSize: hp(1.8) }}>Delete Task</Text>
                                                    <AntDesign name="delete" size={hp(3)} color="red" />
                                                </View>
                                            </MenuOption>}
                                    </MenuOptions>
                                </Menu>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginRight: wp(2) }} onPress={() => navigation.goBack()}>
                                <AntDesign name="back" size={hp(3.2)} color="#6237a0" />
                            </TouchableOpacity>
                            <Text style={styles.heading}>{task.taskName}</Text>
                        </View>
                        <View style={{ marginTop: hp(2), maxHeight: hp(15) }}>
                            <Text style={{ fontSize: hp(2.5), color: '#28104e', fontWeight: 900 }}>Description</Text>
                            <Text style={{ marginTop: hp(1), color: '#6237a0', fontWeight: 300, fontSize: hp(1.8), lineHeight: hp(2.5) }}>{task.taskDescription}
                            </Text>
                        </View>
                        <View style={{ marginTop: hp(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 900, fontSize: hp(3.7) }}>Sub-Tasks</Text>
                            {(isAdmin || user.roles.includes("manager")) &&
                                <TouchableOpacity onPress={() => { setModalVisible(true); console.log("modal open"); }}>
                                    <Image source={require('../../assets/Images/plus.png')} style={{
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: hp(50),
                                        // borderWidth: 2.5,
                                        // borderColor: 'white'
                                    }} />
                                </TouchableOpacity>
                            }
                        </View>
                        <Text style={{ marginTop: hp(1), fontSize: hp(1.6), color: 'gray', fontWeight: 300 }}>Enhance your task by adding sub-tasks for greater detail and organization.</Text>
                        <HalfScreenModal
                            isVisible={modalVisible}
                            onClose={closeModal}
                            taskId={taskId}
                            fetchTaskDetails={fetchTaskDetails}
                            users={users}
                            maxYear={maxYear}
                            maxDay={maxDay}
                            maxMonth={maxMonth}
                        />
                        <View style={{ height: hp(40), paddingTop: hp(2) }}>
                            <FlatList
                                data={task.subTasks}
                                renderItem={({ item, index }) => (
                                    <SubTask item={item} index={index} toggle={toggleSubTask} onComponentOpen={x => openComponent(x)} onDelete={deleteSubtask} onEdit={editSubtask} />
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>)}
                </View>)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp(100),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: hp(2.6),
        fontWeight: 'bold',
        width: wp(75)
    },
})