import { Alert, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
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
import EditSubTaskModal from '../../components/ProjectManagement/EditSubTaskModal';

export default function Task({ route }) {
    const toast = useToast();
    const context = useContext(UserContext);
    const { user, isAdmin } = context;
    const { taskId, users } = route.params;
    const ref = useRef();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [editSubtaskModalVisible, setEditSubtaskModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState({});

    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [subtaskDescription, setSubtaskDescription] = useState('');
    const [subtaskEndDate, setSubtaskEndDate] = useState('');
    const [subtaskUsers, setSubtaskUsers] = useState([]);
    const [subtaskId, setSubtaskId] = useState('');

    // const [temp, setTemp] = useState({});

    const [maxYear, setMaxYear] = useState("");
    const [maxMonth, setMaxMonth] = useState("");
    const [maxDay, setMaxDay] = useState("");

    //TODO change this (add opened in fetched subtasks)
    const [subtasks, setSubtasks] = useState([
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
        { title: "Write unit tests for feature X", opened: false },
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
        // console.log(`Deleting subtask: ${subtaskId}`)
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
        // setSubtaskId(subtaskId);
        // setSubtaskTitle(title);
        // setSubtaskDescription(description);
        // setSubtaskEndDate(endDate);
        // setSubtaskUsers(users);

        console.log("Data sent", subtask);
        // setTemp(subtask);
        navigation.navigate('EditSubtask', { subtask: subtask, taskId: taskId, memberList: users, maxYear: maxYear, maxDay: maxDay, maxMonth: maxMonth });

        // console.log(`Editing subtask: ${subtaskId}`)
        // console.log(`subtask title: ${title}`)
        // console.log(`subtask desc: ${description}`)
        // console.log(`subtask endDate: ${endDate}`)
        // console.log(`subtask users: ${users}`)
        // setModalVisible(true);
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
                console.log("Task details:", JSON.stringify(response.data));
                setTask(response.data.data);
                separateDate(response.data.data.endDate);
                setLoading(false);
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
            {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: 100,
                    height: 100,
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#f2e6ff', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, marginBottom: 5 }}>
                        <Text style={{ fontSize: 12 }}>Task</Text>
                    </View>
                    <View style={{}}>
                        <Menu>
                            <MenuTrigger customStyles={{
                                triggerWrapper: {
                                }
                            }}>
                                <AntDesign name="setting" size={24} color="black" />
                            </MenuTrigger>
                            <MenuOptions customStyles={{
                                optionsContainer: {
                                    borderRadius: 10,
                                    marginTop: 30,
                                }
                            }}>
                                <MenuOption onSelect={() => navigation.navigate('Project', { projectId: task.projectId })}>
                                    <View style={{ paddingHorizontal: 15, justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 5, alignItems: 'center' }}>
                                        <Text style={{}}>View Project</Text>
                                        <Foundation name="graph-trend" size={24} color="#6237a0" />
                                    </View>
                                </MenuOption>
                                <Divider />
                                <MenuOption onSelect={() => navigation.navigate('EditTask', { task: task, maxYear: maxYear, maxDay: maxDay, maxMonth: maxMonth })}>
                                    <View style={{ paddingHorizontal: 15, justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 5, alignItems: 'center' }}>
                                        <Text style={{}}>Edit Task</Text>
                                        <Feather name="edit-3" size={24} color="#3d7bed" />
                                    </View>
                                </MenuOption>
                                <Divider />
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
                                    <View style={{ paddingHorizontal: 15, justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 5, alignItems: 'center' }}>
                                        <Text style={{}}>Delete Task</Text>
                                        <AntDesign name="delete" size={24} color="red" />

                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 8 }} onPress={() => navigation.goBack()}>
                        <AntDesign name="back" size={26} color="#6237a0" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>{task.taskName}</Text>
                </View>
                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 20, color: '#28104e', fontWeight: 900 }}>Description</Text>
                    <Text style={{ marginTop: 8, color: '#6237a0', lineHeight: 17, fontWeight: 300, }}>{task.taskDescription}
                    </Text>
                </View>
                <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 900, fontSize: 25 }}>Sub-Tasks</Text>
                    {(isAdmin || user.roles.includes("manager")) &&
                        <TouchableOpacity onPress={() => { setModalVisible(true); console.log("modal open"); }}>
                            <Image source={require('../../assets/Images/plus.png')} style={{
                                width: 40,
                                height: 40,
                                borderRadius: 25,
                            }} />
                        </TouchableOpacity>
                    }
                </View>
                <Text style={{ marginTop: 10, fontSize: 13, color: 'gray', fontWeight: 300 }}>Enhance your task by adding sub-tasks for greater detail and organization.</Text>
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
                <View style={{ paddingTop: 5, height: '52%' }}>
                    <FlatList
                        data={task.subTasks}
                        style={{ flexGrow: 1 }}
                        renderItem={({ item, index }) => (
                            <SubTask item={item} index={index} toggle={toggleSubTask} onComponentOpen={x => openComponent(x)} onDelete={deleteSubtask} onEdit={editSubtask} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 18,
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
        width: '80%'
    },
})