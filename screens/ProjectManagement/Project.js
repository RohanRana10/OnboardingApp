import { FlatList, Image, Modal, StyleSheet, StatusBar, Text, TouchableOpacity, View, Pressable, Platform, Keyboard, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import { AntDesign, Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Searchbar, TextInput } from 'react-native-paper';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider } from '../../components/ProjectManagement/Divider';
import { BASE_ONBOARD_URL, BASE_PROJECT_URL } from '../../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import filter from 'lodash.filter';
import Checkbox from 'expo-checkbox';


export default function Project({ route }) {

    const URL = 'https://randomuser.me/api/?results=20';
    const toast = useToast();
    const context = useContext(UserContext);
    const { user, isAdmin } = context;
    const { projectId } = route.params;
    const navigation = useNavigation();
    const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
    const [endDate, setEndDate] = useState();
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [end, setEnd] = useState(new Date());
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState(true);

    const [seachQuery, setSeachQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [fullSearchData, setFullSearchData] = useState('');

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    // const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [memberList, setMemberList] = useState([]);

    const [maxYear, setMaxYear] = useState("");
    const [maxMonth, setMaxMonth] = useState("");
    const [maxDay, setMaxDay] = useState("");

    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

    const validateForm = () => {
        let errors = {};
        if (!title) {
            errors.title = "Username is required!";
        }
        if (!description) {
            errors.description = "Description is required!";
        }
        if (!endDate) {
            errors.endDate = "End Date is required!";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const loadTaskInfo = (taskId) => {
        navigation.navigate('Task', { taskId: taskId, users: project.users });
    }

    const getMemberIds = (project) => {
        let temp = project.users.map((user) => {
            return (user.user_id).toString()
        })
        console.log('temp', temp);
        setSelectedMembers(temp);
    }

    const handleDelete = (projectId) => {
        const url = `${BASE_PROJECT_URL}/delete-project`
        setLoading(true);
        let data = JSON.stringify({
            "id": projectId
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
                toast.show("Project Deleted!", {
                    type: "success",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
                navigation.navigate('Home');
                setLoading(false);
            })
            .catch((error) => {
                console.log('error deleting project:', error);
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

    // let sampleTeam = [
    //     "https://randomuser.me/api/portraits/thumb/women/61.jpg",
    //     "https://randomuser.me/api/portraits/thumb/women/12.jpg",
    //     "https://randomuser.me/api/portraits/thumb/women/8.jpg",
    //     "https://randomuser.me/api/portraits/thumb/men/88.jpg"
    // ];

    // let sampleTasks = [
    //     {
    //         "id": 1,
    //         "taskName": "Design Home and Splash Screens",
    //         "taskDescription": "Task Description sample 1",
    //         "projectId": 1,
    //         "status": false,
    //         "subTasks": null,
    //         "subTaskCount": 0
    //     },
    //     {
    //         "id": 2,
    //         "taskName": "Design dashboard Screens",
    //         "taskDescription": "Task Description sample 1",
    //         "projectId": 1,
    //         "status": false,
    //         "subTasks": null,
    //         "subTaskCount": 0
    //     },
    // ];

    const toggleEndDatePicker = () => {
        // console.log('toggle called');
        setShowEndDatePicker(!showEndDatePicker);
    }

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (January is 0) and pad with leading zero if necessary
        const year = date.getFullYear(); // Get full year

        return `${year}-${month}-${day}`;
    }

    const onEndDateChange = ({ type }, selectedDate) => {
        // console.log('end date change called')
        if (type == 'set') {
            const currentDate = selectedDate;
            setEnd(currentDate);
            console.log(currentDate);
            if (Platform.OS == 'android') {
                toggleEndDatePicker();
                setEndDate(formatDate(currentDate));
            }
        }
        else {
            toggleEndDatePicker();
        }
    }


    const updateMemberList = (username) => {
        if (selectedMembers.includes(username)) {
            setSelectedMembers(selectedMembers.filter(item => item !== username));
        } else {
            setSelectedMembers([...selectedMembers, username]);
        }
    }

    const updateThubnailList = (url) => {
        if (thumbnails.includes(url)) {
            setThumbnails(thumbnails.filter(item => item !== url));
        } else {
            setThumbnails([...thumbnails, url]);
        }
    }

    const handleSearch = (query) => {
        setSeachQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullSearchData, (user) => {
            return contains(user, formattedQuery);
        });
        setSearchData(filteredData);
    }

    const contains = ({ firstName, lastName, designation }, query) => {

        if (firstName.includes(query) || lastName.includes(query)) {
            return true;
        }
        else {
            return false;
        }
    }

    const fetchEmployees = () => {
        let url = `${BASE_PROJECT_URL}/get-employees`
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
                console.log(JSON.stringify(response.data.data));
                setSearchData(response.data.data);
                setFullSearchData(response.data.data);
                setSearchLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setSearchError(error);
                setSearchLoading(false);
            });
    }

    const handleSubmit = () => {
        if (validateForm()) {
            Keyboard.dismiss();
            setSubmitButtonLoading(true);
            let url = `${BASE_PROJECT_URL}/new-task`;
            let data = JSON.stringify({
                "title": title,
                "description": description,
                "projectId": projectId,
                "endDate": endDate
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
                    setSubmitButtonLoading(false);
                    fetchProjectDetails();
                    toast.show("Task Added!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setIsAddTaskModalVisible(false);
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
                    setSubmitButtonLoading(false);
                    setIsAddTaskModalVisible(false);
                });
        }
        console.log('Title:', title)
        console.log('Desc:', description);
        console.log('Deadline:', endDate);

    }

    const fetchProjectDetails = () => {
        setLoading(true);
        let url = `${BASE_PROJECT_URL}/get-project-details`;
        let data = JSON.stringify({
            "id": projectId
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
                console.log(JSON.stringify(response.data.data));
                setProject(response.data.data);
                getMemberIds(response.data.data);
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

    //     fetchProjectDetails();
    //     fetchEmployees();
    //     // getMemberIds();
    //     setSearchLoading(true);
    //     // fetchSearchData(URL);
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            // fetchProjects();
            fetchProjectDetails();
            fetchEmployees();
            // getMemberIds();
            setSearchLoading(true);
        }, [])
    );


    const fetchSearchData = async (url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setSearchData(json.results);
            setFullSearchData(json.results);
            setSearchLoading(false);
            // console.log(json.results);
        } catch (error) {
            setSearchError(error);
            setSearchLoading(false);
            console.log(error);
        }
    }

    const editProject = () => {
        navigation.navigate('EditProject', { project: project })
    }

    const updateProjectMembers = () => {
        setSubmitButtonLoading(true);
        const url = `${BASE_PROJECT_URL}/update-team-members`
        let data = JSON.stringify({
            "id": projectId,
            "users": selectedMembers
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
                setIsSearchModalVisible(false);
                fetchProjectDetails();
                toast.show("Project members updated!", {
                    type: "success",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
                setSubmitButtonLoading(false);
            })
            .catch((error) => {
                console.log("Error updating members", error);
                setSubmitButtonLoading(false);
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

    const separateDate = (date) => {
        const [year, month, day] = date.split("-");
        setMaxYear(Number(year));
        setMaxMonth(Number(month) - 1);
        setMaxDay(Number(day));
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: 100,
                    height: 100,
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <View style={{ backgroundColor: '#f2e6ff', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }}>
                        <Text style={{ fontSize: 12 }}>Project</Text>
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
                                <MenuOption onSelect={() => editProject()}>
                                    <View style={{ paddingHorizontal: 15, justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 5, alignItems: 'center' }}>
                                        <Text style={{}}>Edit Project</Text>
                                        <Feather name="edit-3" size={24} color="#3d7bed" />

                                    </View>
                                </MenuOption>
                                <Divider />
                                {/* handleDelete(projectId) */}
                                <MenuOption onSelect={() => {
                                    Alert.alert(
                                        "Delete Project",
                                        "Are you sure you want to permanently delete this project?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => handleDelete(projectId)
                                            }
                                        ]
                                    )
                                }} >
                                    <View style={{ paddingHorizontal: 15, justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 5, alignItems: 'center' }}>
                                        <Text style={{}}>Delete Project</Text>
                                        <AntDesign name="delete" size={24} color="red" />
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 8 }} onPress={() => navigation.goBack()}>
                        {/* <Ionicons name="arrow-back-circle" size={26} color="#6237a0" /> */}
                        <AntDesign name="back" size={26} color="#6237a0" />
                    </TouchableOpacity><Text style={styles.heading}>{project.projectName}</Text>
                </View>

                <Modal visible={isSearchModalVisible} animationType='slide' presentationStyle='pageSheet' onRequestClose={() => setIsSearchModalVisible(false)}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, backgroundColor: 'white' }}
                    >
                        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 }}>
                            <Text style={{
                                color: '#6237A0', fontSize: 24, fontWeight: 'bold',
                            }}>Add Members</Text>
                            <TouchableOpacity onPress={() => setIsSearchModalVisible(false)}>
                                <Text style={{ fontSize: 17, fontWeight: '400' }}>Close</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginHorizontal: 15, marginVertical: 18, backgroundColor: 'white', height: '80%' }}>
                            {searchLoading ? (
                                <ActivityIndicator size={'large'} color={'#6237a0'} />
                            ) : (
                                <View style={{ height: '100%' }}>
                                    <Searchbar
                                        placeholder='Search People...'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        value={seachQuery}
                                        onChangeText={(query) => handleSearch(query)}
                                        style={{ backgroundColor: '#f2e6ff', borderRadius: 10 }}
                                    />
                                    {searchError ? (
                                        <Text style={{ marginTop: 12, alignSelf: 'center' }}>Error Fetching Members!</Text>
                                    ) : (
                                        <FlatList
                                            style={{ height: '100%', marginVertical: 2, }}
                                            data={searchData}
                                            keyExtractor={(item) => item.user_id}
                                            renderItem={({ item }) => (

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                                    <TouchableOpacity onPress={() => {
                                                        updateMemberList((item?.user_id).toString())
                                                        updateThubnailList(item?.profile)
                                                    }} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 12 }}>
                                                        <Image source={{ uri: item?.profile }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                                        <View>
                                                            <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: '600' }}>{(item?.firstName)} {(item.lastName)}</Text>
                                                            <Text style={{ fontSize: 14, marginLeft: 10, color: 'gray', fontWeight: '300' }}>{item.designation}</Text>
                                                        </View>

                                                    </TouchableOpacity>
                                                    <View>
                                                        <Checkbox
                                                            disabled={false}
                                                            value={selectedMembers.includes((item?.user_id).toString())}
                                                            onValueChange={(newValue) => {
                                                                updateMemberList((item?.user_id).toString())
                                                                updateThubnailList(item?.profile)
                                                            }}
                                                            style={{ marginRight: 10 }}
                                                            color={'#6237a0'}
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    )}
                                </View>

                            )}
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                            {submitButtonLoading ? (<View style={{ marginTop: 18 }}><ActivityIndicator size={"large"} color={"#6237a0"} /></View>) : (
                                <TouchableOpacity style={styles.modalButton} onPress={() => updateProjectMembers()}>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>SAVE CHANGES</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Progress.Circle size={120} progress={project["percentage complete"] / 100}
                        color='#07da63'
                        unfilledColor='#ddd'
                        showsText={true}
                        formatText={() => `${Math.ceil(project["percentage complete"])}%`}
                        textStyle={{ color: '#28104e', fontWeight: 'bold' }}
                        strokeCap='round'
                        borderWidth={0}
                        thickness={15}
                    />
                    <View style={{ width: '48%' }}>
                        <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>{project?.users?.length} Members</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                            {project?.users.map((user, index) => {
                                return <Image key={index} source={{ uri: user.profile ? user.profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf2j71u2ipMbi4uUIcRaomOvJOSPkvvUPWFA&usqp=CAU' }} style={{
                                    width: 45, height: 45, borderRadius: 25,
                                    marginLeft: index == 0 ? 0 : -18,
                                    borderWidth: 1.5,
                                    borderColor: '#6237a0'
                                }} />
                            })}
                            {(isAdmin || user.roles.includes("manager")) &&
                                <TouchableOpacity onPress={() => setIsSearchModalVisible(true)}>
                                    <Image source={require('../../assets/Images/plus.png')} style={{
                                        width: 45, height: 45, borderRadius: 25,
                                        marginLeft: -18,
                                        borderWidth: 2.5,
                                        borderColor: 'white'
                                    }} />
                                </TouchableOpacity>
                            }


                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 20, color: '#28104e', fontWeight: 900 }}>Description</Text>
                    <Text style={{ marginTop: 8, color: '#6237a0', lineHeight: 17, fontWeight: 300, }}>{project.description}
                    </Text>
                </View>

                <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 900, fontSize: 25 }}>Tasks</Text>
                    {(isAdmin || user.roles.includes("manager")) &&
                        <TouchableOpacity onPress={() => {
                            setIsAddTaskModalVisible(true);
                            separateDate(project.endDate);
                            setTitle("");
                            setDescription("");
                            setEndDate("");
                        }}>
                            <Image source={require('../../assets/Images/plus.png')} style={{
                                width: 40,
                                height: 40,
                                borderRadius: 25,
                                borderWidth: 2.5,
                                borderColor: 'white'
                            }} />
                        </TouchableOpacity>
                    }
                </View>
                <Text style={{ marginTop: 2, fontSize: 13, color: 'gray', fontWeight: 300 }}>{project.tasks ? "Select a task to view its associated sub-tasks" : "Start by adding some tasks to this project"}</Text>
                <View style={{ height: '39%', paddingTop: 10 }}>
                    <FlatList
                        data={project.tasks}//TODO check this after adding tasks
                        style={{ flexGrow: 1 }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => loadTaskInfo(item.id)} style={{ borderRadius: 15, elevation: 3, marginBottom: 10, marginHorizontal: 2, paddingVertical: 12, shadowColor: 'black', backgroundColor: 'white', paddingHorizontal: 10, marginTop: 2 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ width: '90%' }}>
                                        <Text style={{ color: '#6237a0', fontWeight: 500, fontSize: 15 }}>{item.taskName}</Text>
                                        <Text style={{ marginTop: 5, color: 'gray', fontSize: 13 }}>{item.subTaskCount} Subtasks</Text>
                                    </View>
                                    {item.status ? <MaterialIcons name="task-alt" size={24} color="#07da63" /> : <Entypo name="circle-with-cross" size={24} color="red" />}
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                <Modal
                    visible={isAddTaskModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsAddTaskModalVisible(false)}
                >
                    <View
                        style={styles.modalContainer}
                        activeOpacity={1}
                    // onPress={onClose}
                    >
                        <View style={styles.modal}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={{ marginRight: 8 }} onPress={() => setIsAddTaskModalVisible(false)}>
                                    <AntDesign name="back" size={26} color="#6237a0" />
                                </TouchableOpacity>
                                <Text style={styles.modalHeading}>New Task</Text>
                            </View>
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            
                            <TouchableOpacity onPress={() => setIsAddTaskModalVisible(false)}>
                                <Text style={{ fontSize: 15, fontWeight: '300' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View> */}
                            <TextInput
                                label="Title"
                                value={title}
                                mode={'outlined'}
                                outlineStyle={{
                                    borderRadius: 12,
                                    borderColor: errors.title ? 'red' : '#6237A0'
                                }}
                                style={{ backgroundColor: 'white', marginTop: 12 }}
                                onChangeText={text => setTitle(text)}
                                textColor='#28104E'
                                selectionColor='#6237a0'
                                activeOutlineColor="#6237a0"
                            />
                            {errors.title && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Title is required!</Text></View>}

                            <TextInput
                                label="Description"
                                multiline
                                numberOfLines={4}
                                value={description}
                                mode={'outlined'}
                                outlineStyle={{
                                    borderRadius: 12,
                                    borderColor: errors.description ? 'red' : '#6237A0'
                                }}
                                style={{ backgroundColor: 'white', marginTop: 10 }}
                                onChangeText={text => setDescription(text)}
                                textColor='#28104E'
                                selectionColor='#6237a0'
                                activeOutlineColor="#6237a0"
                            />
                            {errors.description && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Description is required!</Text></View>}

                            {showEndDatePicker &&
                                <DateTimePicker
                                    mode='date'
                                    display='spinner'
                                    value={end}
                                    onChange={onEndDateChange}
                                    minimumDate={new Date()}
                                    maximumDate={new Date(maxYear, maxMonth, maxDay)}
                                />
                            }

                            {!showEndDatePicker && <View>
                                <Pressable onPress={toggleEndDatePicker}>
                                    <TextInput
                                        label="Deadline"
                                        value={endDate}
                                        mode={'outlined'}
                                        maxLength={12}
                                        outlineStyle={{
                                            borderRadius: 12,
                                            borderColor: errors.endDate ? 'red' : '#6237A0'
                                        }}
                                        style={{ backgroundColor: 'white', marginTop: 10 }}
                                        onChangeText={setEndDate}
                                        editable={false}
                                        textColor='#28104E'
                                        selectionColor='#6237a0'
                                        activeOutlineColor="#6237a0"
                                    />
                                </Pressable>
                                {errors.endDate && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>End Date is required!</Text></View>}
                            </View>
                            }



                            {submitButtonLoading ? (<View style={{ marginTop: 18 }}><ActivityIndicator size={"large"} color={"#6237a0"} /></View>) : (
                                <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>CREATE</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>
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
        width: '80%'

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 18,
    },
    modalButton: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 15,
        marginTop: 18,
    },
    modalHeading: {
        color: '#6237A0',
        fontSize: 24,
        fontWeight: 'bold',
        // paddingHorizontal: 18,
    },
})