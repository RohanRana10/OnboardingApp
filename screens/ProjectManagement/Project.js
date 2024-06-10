import { FlatList, Image, Modal, StyleSheet, StatusBar, Text, TouchableOpacity, View, Pressable, Platform, Keyboard, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
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
import { BASE_PROJECT_URL } from '../../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import filter from 'lodash.filter';
import Checkbox from 'expo-checkbox';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Project({ route }) {

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

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);

    const [maxYear, setMaxYear] = useState("");
    const [maxMonth, setMaxMonth] = useState("");
    const [maxDay, setMaxDay] = useState("");

    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

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
        if (project.users == null) {
            console.log("no users found");
        }
        else {
            let temp = project?.users.map((user) => {
                return (user.user_id).toString()
            })
            console.log('temp', temp);
            setSelectedMembers(temp);
        }
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

    const toggleEndDatePicker = () => {
        setShowEndDatePicker(!showEndDatePicker);
    }

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (January is 0) and pad with leading zero if necessary
        const year = date.getFullYear(); // Get full year

        return `${year}-${month}-${day}`;
    }

    const onEndDateChange = ({ type }, selectedDate) => {
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
        if ((firstName.toLowerCase()).includes(query) || (lastName.toLowerCase()).includes(query)) {
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
                console.log("status code:", response.data.status.statusCode);
                if (response.data.status.statusCode !== 1) {
                    setFetchError(true);
                    setLoading(false);
                }
                else {
                    console.log(JSON.stringify(response.data.data));
                    setProject(response.data.data);
                    getMemberIds(response.data.data);
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

    //     fetchProjectDetails();
    //     fetchEmployees();
    //     // getMemberIds();
    //     setSearchLoading(true);
    //     // fetchSearchData(URL);
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchProjectDetails();
            fetchEmployees();
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
            {loading ? (<View style={{ height: hp(95), justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: wp(20),
                    height: wp(20),
                }} source={require('../../assets/New.gif')} />
            </View>) : (
                <View>
                    {fetchError ? (<View style={{  }}>
                        <TouchableOpacity style={{ marginRight: wp(2) }} onPress={() => navigation.goBack()}>
                            <AntDesign name="back" size={hp(3.2)} color="#6237a0" />
                        </TouchableOpacity>
                        <View style={{height: hp(90), alignItems: "center", justifyContent: 'center'}}>
                        <Text>Error loading project!</Text>
                        <Image style={{ width: wp(13), height: wp(13), marginTop: hp(1)}} source={require('../../assets/Images/server.png')}/>
                        </View>
                    </View>) : (<View>
                        <View style={{ flexDirection: 'row', width: wp(92), justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1) }}>

                            <View style={{ backgroundColor: '#f2e6ff', paddingVertical: hp(1), paddingHorizontal: wp(3), borderRadius: hp(1.5) }}>
                                <Text style={{ fontSize: hp(1.6) }}>Project</Text>
                            </View>
                            <View style={{}}>
                                {isAdmin &&
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
                                                // maxWidth: wp(45)
                                            }
                                        }}>
                                            <MenuOption onSelect={() => editProject()}>
                                                <View style={{ paddingHorizontal: wp(3), justifyContent: 'space-between', flexDirection: 'row', paddingVertical: hp(1), alignItems: 'center' }}>
                                                    <Text style={{ fontSize: hp(1.8) }}>Edit Project</Text>
                                                    <Feather name="edit-3" size={hp(3)} color="#3d7bed" />

                                                </View>
                                            </MenuOption>
                                            <Divider />
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
                                                <View style={{ paddingHorizontal: wp(3), justifyContent: 'space-between', flexDirection: 'row', paddingVertical: hp(1), alignItems: 'center' }}>
                                                    <Text style={{ fontSize: hp(1.8) }}>Delete Project</Text>
                                                    <AntDesign name="delete" size={hp(3)} color="red" />
                                                </View>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                }
                            </View>

                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginRight: wp(2) }} onPress={() => navigation.goBack()}>
                                <AntDesign name="back" size={hp(3.2)} color="#6237a0" />
                            </TouchableOpacity><Text style={styles.heading}>{project.projectName}</Text>
                        </View>

                        <Modal visible={isSearchModalVisible} animationType='slide' presentationStyle='pageSheet' onRequestClose={() => setIsSearchModalVisible(false)}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={{ flex: 1, backgroundColor: 'white' }}
                            >
                                <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(4), width: wp(92), alignSelf: 'center' }}>
                                    <Text style={{
                                        color: '#6237A0', fontSize: hp(3), fontWeight: 'bold',
                                    }}>Add Members</Text>
                                    <TouchableOpacity onPress={() => setIsSearchModalVisible(false)}>
                                        <Text style={{ fontSize: hp(2), fontWeight: '400' }}>Close</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ marginHorizontal: wp(4), marginVertical: hp(2), backgroundColor: 'white', height: hp(70) }}>
                                    {searchLoading ? (
                                        <ActivityIndicator size={'large'} color={'#6237a0'} />
                                    ) : (
                                        <View style={{}}>
                                            <Searchbar
                                                placeholder='Search People...'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                value={seachQuery}
                                                inputStyle={{ fontSize: hp(1.9), alignItems: 'center' }}
                                                onChangeText={(query) => handleSearch(query)}
                                                style={{ backgroundColor: '#f2e6ff', borderRadius: hp(2) }}
                                            />
                                            {searchError ? (
                                                <Text style={{ marginTop: hp(4), alignSelf: 'center', fontSize: hp(1.8) }}>Error Fetching Members!</Text>
                                            ) : (
                                                <View style={{ backgroundColor: '#fff', maxHeight: hp(70) }}>
                                                    <FlatList
                                                        style={{ marginVertical: hp(1) }}
                                                        data={searchData}
                                                        keyExtractor={(item) => item.user_id}
                                                        renderItem={({ item }) => (

                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                                                <TouchableOpacity onPress={() => {
                                                                    updateMemberList((item?.user_id).toString())
                                                                    updateThubnailList(item?.profile)
                                                                }} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp(2), marginTop: hp(2) }}>
                                                                    <Image source={{ uri: item?.profile }} style={{ width: wp(13), height: wp(13), borderRadius: 25 }} />
                                                                    <View>
                                                                        <Text style={{ fontSize: hp(2.2), marginLeft: wp(2), fontWeight: '600' }}>{(item?.firstName)} {(item.lastName)}</Text>
                                                                        <Text style={{ fontSize: hp(1.9), marginLeft: wp(2), color: 'gray', fontWeight: '300' }}>{item.designation}</Text>
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
                                                                        style={{ marginRight: wp(4) }}
                                                                        color={'#6237a0'}
                                                                    />
                                                                </View>
                                                            </View>
                                                        )}
                                                    />
                                                </View>
                                            )}
                                        </View>

                                    )}
                                </View>
                                <View style={{ marginHorizontal: wp(4) }}>
                                    {submitButtonLoading ? (<View style={{ marginTop: 18 }}><ActivityIndicator size={"large"} color={"#6237a0"} /></View>) : (
                                        <TouchableOpacity style={styles.modalButton} onPress={() => updateProjectMembers()}>
                                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(2) }}>SAVE CHANGES</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </KeyboardAvoidingView>
                        </Modal>

                        <View style={{ marginTop: hp(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Progress.Circle size={hp(16)} progress={project["percentage complete"] / 100}
                                color='#07da63'
                                unfilledColor='#ddd'
                                showsText={true}
                                formatText={() => `${Math.ceil(project["percentage complete"])}%`}
                                textStyle={{ color: '#28104e', fontWeight: 'bold', fontSize: hp(2.6) }}
                                strokeCap='round'
                                borderWidth={0}
                                thickness={hp(2)}
                            />
                            <View style={{ width: wp(45) }}>
                                <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: hp(1.8) }}>{project?.users?.length} Members</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: hp(1) }}>
                                    {project?.users.map((user, index) => {
                                        return <Image key={index} source={{ uri: user.profile ? user.profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf2j71u2ipMbi4uUIcRaomOvJOSPkvvUPWFA&usqp=CAU' }} style={{
                                            width: wp(12), height: wp(12), borderRadius: hp(50),
                                            marginLeft: index == 0 ? 0 : -wp(5),
                                            // borderWidth: 1.5,
                                            // borderColor: '#6237a0'
                                        }} />
                                    })}
                                    {(isAdmin || user.roles.includes("manager")) &&
                                        <TouchableOpacity onPress={() => setIsSearchModalVisible(true)}>
                                            <Image source={require('../../assets/Images/plus.png')} style={{
                                                width: wp(12), height: wp(12), borderRadius: hp(50),
                                                marginLeft: -wp(5),
                                                borderWidth: 2.5,
                                                borderColor: 'white'
                                            }} />
                                        </TouchableOpacity>
                                    }


                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: hp(2), maxHeight: hp(15) }}>
                            <Text style={{ fontSize: hp(2.5), color: '#28104e', fontWeight: 900 }}>Description</Text>
                            <Text style={{ marginTop: hp(1), color: '#6237a0', fontWeight: 300, fontSize: hp(1.8), lineHeight: hp(2.5) }}>{project.description}
                            </Text>
                        </View>

                        <View style={{ marginTop: hp(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 900, fontSize: hp(3.7) }}>Tasks</Text>
                            {(isAdmin || user.roles.includes("manager")) &&
                                <TouchableOpacity onPress={() => {
                                    setIsAddTaskModalVisible(true);
                                    separateDate(project.endDate);
                                    setTitle("");
                                    setDescription("");
                                    setEndDate("");
                                }}>
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
                        <Text style={{ marginTop: hp(1), fontSize: hp(1.6), color: 'gray', fontWeight: 300 }}>{project.tasks ? "Select a task to view its associated sub-tasks" : "Start by adding some tasks to this project"}</Text>
                        <View style={{ height: hp(40), paddingTop: hp(2) }}>
                            <FlatList
                                data={project.tasks}//TODO check this after adding tasks
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => loadTaskInfo(item.id)} style={{ borderRadius: hp(2), elevation: hp(0.5), marginBottom: hp(1.8), marginHorizontal: wp(1), paddingVertical: hp(1.8), shadowColor: 'black', backgroundColor: 'white', paddingHorizontal: wp(3.5), marginTop: hp(0.3) }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ width: wp(62) }}>
                                                <Text style={{ color: '#6237a0', fontWeight: 500, fontSize: hp(1.8) }}>{item.taskName}</Text>
                                                <Text style={{ marginTop: hp(0.5), color: 'gray', fontSize: hp(1.6) }}>{item.subTaskCount} Subtasks</Text>
                                            </View>
                                            {item.status ? <MaterialIcons name="task-alt" size={hp(3)} color="#07da63" /> : <Entypo name="circle-with-cross" size={hp(3)} color="red" />}
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
                                        <TouchableOpacity style={{ marginRight: wp(1.5) }} onPress={() => setIsAddTaskModalVisible(false)}>
                                            <AntDesign name="back" size={hp(3.5)} color="#6237a0" />
                                        </TouchableOpacity>
                                        <Text style={styles.modalHeading}>New Task</Text>
                                    </View>

                                    <TextInput
                                        label="Title"
                                        value={title}
                                        mode={'outlined'}
                                        outlineStyle={{
                                            borderRadius: hp(1.2),
                                            borderColor: errors.title ? 'red' : '#6237A0'
                                        }}
                                        style={{ backgroundColor: 'white', marginTop: hp(1), width: wp(92) }}
                                        onChangeText={text => setTitle(text)}
                                        textColor='#28104E'
                                        selectionColor='#6237a0'
                                        activeOutlineColor="#6237a0"
                                    />
                                    {errors.title && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(3)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.5) }}>Title is required!</Text></View>}

                                    <TextInput
                                        label="Description"
                                        multiline
                                        numberOfLines={4}
                                        value={description}
                                        mode={'outlined'}
                                        outlineStyle={{
                                            borderRadius: hp(1.2),
                                            borderColor: errors.description ? 'red' : '#6237A0'
                                        }}
                                        style={{ backgroundColor: 'white', marginTop: hp(1), width: wp(92) }}
                                        onChangeText={text => setDescription(text)}
                                        textColor='#28104E'
                                        selectionColor='#6237a0'
                                        activeOutlineColor="#6237a0"
                                    />
                                    {errors.description && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(3)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.5) }}>Description is required!</Text></View>}

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
                                                    borderRadius: hp(1.2),
                                                    borderColor: errors.endDate ? 'red' : '#6237A0'
                                                }}
                                                style={{ backgroundColor: 'white', marginTop: hp(1), width: wp(92) }}
                                                onChangeText={setEndDate}
                                                editable={false}
                                                textColor='#28104E'
                                                selectionColor='#6237a0'
                                                activeOutlineColor="#6237a0"
                                            />
                                        </Pressable>
                                        {errors.endDate && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(3)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.5) }}>End Date is required!</Text></View>}
                                    </View>
                                    }



                                    {submitButtonLoading ? (<View style={{ marginTop: hp(2) }}><ActivityIndicator size={"large"} color={"#6237a0"} /></View>) : (
                                        <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(1.8) }}>CREATE</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </Modal>
                    </View>)}
                </View>)}

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: 'white',
        borderTopLeftRadius: hp(4.5),
        borderTopRightRadius: hp(4.5),
        padding: wp(4.5),
    },
    modalButton: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(3),
        borderRadius: hp(2),
        marginTop: hp(2),
    },
    modalHeading: {
        color: '#6237A0',
        fontSize: hp(3),
        fontWeight: 'bold',
    },
})