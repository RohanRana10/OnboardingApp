import { ActivityIndicator, Button, FlatList, Image, Keyboard, StatusBar, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { StatusBar } from 'expo-status-bar'
import { Searchbar, TextInput } from 'react-native-paper'
import { FontAwesome, Fontisto, Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import filter from 'lodash.filter';
import CheckBox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios'
import { BASE_PROJECT_URL } from '../../utils/APIConstants'
import { UserContext } from '../../context/userContext'
import { useToast } from 'react-native-toast-notifications'
import { useNavigation } from '@react-navigation/native'

const URL = 'https://randomuser.me/api/?results=20';

export default function AddProject() {

    const context = useContext(UserContext);
    const { user } = context;
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();

    const toast = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [start, setStart] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);

    const [end, setEnd] = useState(new Date());
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [seachQuery, setSeachQuery] = useState('');
    const [managerSearchQuery, setManagerSeachQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [fullSearchData, setFullSearchData] = useState('');

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isManagerListModalVisible, setIsManagerListModalVisible] = useState(false);

    // const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [managerThumbnails, setManagerThumbnails] = useState([]);
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

    // const extractThumbnails = (selectedMembers, data) => {
    //     const thumbnailURLs = [];

    //     data.forEach(person => {
    //         if (selectedMembers.includes(person.login.username)) {
    //             thumbnailURLs.push(person.picture.thumbnail);
    //             console.log('url added')
    //         }
    //     });

    //     return thumbnailURLs;
    // }

    const updateMemberList = (username) => {
        if (selectedMembers.includes(username)) {
            setSelectedMembers(selectedMembers.filter(item => item !== username));
        } else {
            setSelectedMembers([...selectedMembers, username]);
        }
    }
    const updateManagerList = (username) => {
        if (selectedManagers.includes(username)) {
            setSelectedManagers(selectedManagers.filter(item => item !== username));
        } else {
            setSelectedManagers([...selectedManagers, username]);
        }
    }

    const updateThubnailList = (url) => {
        if (thumbnails.includes(url)) {
            setThumbnails(thumbnails.filter(item => item !== url));
        } else {
            setThumbnails([...thumbnails, url]);
        }
    }
    const updateManagerThubnailList = (url) => {
        if (managerThumbnails.includes(url)) {
            setManagerThumbnails(managerThumbnails.filter(item => item !== url));
        } else {
            setManagerThumbnails([...managerThumbnails, url]);
        }
    }


    const data = [
        { label: 'Web', value: 2 },
        { label: 'Mobile', value: 1 },
        { label: 'UI', value: 3 },
        { label: 'Design', value: 4 },
        { label: 'Testing', value: 5 },
    ];

    const [value, setValue] = useState(null);

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    useEffect(() => {
        setSearchLoading(true);
        // fetchSearchData(URL);
        fetchEmployees();
    }, []);

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


    const toggleStartDatePicker = () => {
        setShowStartDatePicker(!showStartDatePicker);
    }

    const toggleEndDatePicker = () => {
        setShowEndDatePicker(!showEndDatePicker);
    }

    const handleSearch = (query) => {
        setSeachQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullSearchData, (user) => {
            return contains(user, formattedQuery);
        });
        setSearchData(filteredData);
    }

    const handleManagerSearch = (query) => {
        setManagerSeachQuery(query);
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

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (January is 0) and pad with leading zero if necessary
        const year = date.getFullYear(); // Get full year
        return `${year}-${month}-${day}`;
    }

    const onStartDateChange = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate;
            setStart(currentDate);
            if (Platform.OS == 'android') {
                toggleStartDatePicker();
                setStartDate(formatDate(currentDate));
            }
        }
        else {
            toggleStartDatePicker();
        }
    }

    const onEndDateChange = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate;
            setEnd(currentDate);
            if (Platform.OS == 'android') {
                toggleEndDatePicker();
                setEndDate(formatDate(currentDate));
            }
        }
        else {
            toggleEndDatePicker();
        }
    }

    const validateForm = () => {
        let errors = {};
        if (!title) {
            errors.title = "Username is required!";
        }
        if (!description) {
            errors.description = "Description is required!";
        }
        if (!tag) {
            errors.tag = "Tag is required!";
        }
        if (!startDate) {
            errors.startDate = "Start Date is required!";
        }
        if (!endDate) {
            errors.endDate = "End Date is required!";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            Keyboard.dismiss();
            setSubmitButtonLoading(true);
            let url = `${BASE_PROJECT_URL}/new-project`;
            let data = JSON.stringify({
                "title": title,
                "description": description,
                "tag": tag,
                "managerId": selectedManagers,
                "startDate": startDate,
                "endDate": endDate,
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
                    toast.show("Project created!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    navigation.navigate('Home');
                    setSubmitButtonLoading(false);
                })
                .catch((error) => {
                    console.log("Error adding project", error);
                    toast.show("Some error occured!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setSubmitButtonLoading(false);
                });
        }

        console.log("title", title);
        console.log("desc", description);
        console.log("tag", tag);
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        console.log('Member Ids:', selectedMembers);
        console.log('Manager Ids:', selectedManagers);//TODO update this to send all managers
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            <ScrollView>
                <Text style={styles.heading}>New Project</Text>
                <Text style={{ paddingHorizontal: 18, marginTop: 8, fontWeight: '300', color: 'gray' }}>Welcome! Let's start by filling out the information below to create your new project.</Text>
                <View style={styles.form}>
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
                    {/* <TextInput
                    label="Tag"
                    value={tag}
                    mode={'outlined'}
                    maxLength={12}
                    outlineStyle={{
                        borderRadius: 12,
                        borderColor: errors.tag ? 'red' : '#6237A0'
                    }}
                    style={{ backgroundColor: 'white', marginTop: 10 }}
                    onChangeText={text => setTag(text)}
                /> */}

                    <Dropdown
                        style={{ ...styles.dropdown, borderColor: errors.tag ? 'red' : '#6237a0', borderWidth: 1 }}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Tag"
                        value={tag}
                        onChange={item => {
                            setTag(item.value);
                        }}
                        renderItem={renderItem}
                    />
                    {errors.tag && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Tag is required!</Text></View>}

                    {showStartDatePicker &&
                        <DateTimePicker
                            mode='date'
                            display='spinner'
                            value={start}
                            onChange={onStartDateChange}
                        />
                    }

                    {!showStartDatePicker &&
                        <View>
                            <Pressable onPress={toggleStartDatePicker}>
                                <TextInput
                                    label="Start Date"
                                    value={startDate}
                                    mode={'outlined'}
                                    maxLength={12}
                                    outlineStyle={{
                                        borderRadius: 12,
                                        borderColor: errors.startDate ? 'red' : '#6237A0'
                                    }}
                                    style={{ backgroundColor: 'white', marginTop: 10 }}
                                    onChangeText={setStartDate}
                                    editable={false}
                                    textColor='#28104E'
                                    selectionColor='#6237a0'
                                    activeOutlineColor="#6237a0"
                                />
                            </Pressable>
                            {errors.startDate && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Start Date is required!</Text></View>}
                        </View>
                    }

                    {showEndDatePicker &&
                        <DateTimePicker
                            mode='date'
                            display='spinner'
                            value={end}
                            onChange={onEndDateChange}
                            minimumDate={new Date()}
                        />
                    }

                    {!showEndDatePicker &&
                        <View>
                            <Pressable onPress={toggleEndDatePicker}>
                                <TextInput
                                    label="End Date"
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
                                                            <CheckBox
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
                                <TouchableOpacity style={styles.modalButton} onPress={() => setIsSearchModalVisible(false)}>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>SAVE CHANGES</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>

                    <Modal visible={isManagerListModalVisible} animationType='slide' presentationStyle='pageSheet' onRequestClose={() => setIsManagerListModalVisible(false)}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1, backgroundColor: 'white' }}
                        >
                            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 }}>
                                <Text style={{
                                    color: '#6237A0', fontSize: 24, fontWeight: 'bold',
                                }}>Add Managers</Text>
                                <TouchableOpacity onPress={() => setIsManagerListModalVisible(false)}>
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
                                            value={managerSearchQuery}
                                            onChangeText={(query) => handleManagerSearch(query)}
                                            style={{ backgroundColor: '#f2e6ff', borderRadius: 10 }}
                                        />
                                        {searchError ? (
                                            <Text style={{ marginTop: 12, alignSelf: 'center' }}>Error Fetching Managers!</Text>
                                        ) : (
                                            <FlatList
                                                style={{ height: '100%', marginVertical: 2, }}
                                                data={searchData}
                                                keyExtractor={(item) => item.user_id}
                                                renderItem={({ item }) => (

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                                        <TouchableOpacity onPress={() => {
                                                            updateManagerList((item?.user_id).toString())
                                                            updateManagerThubnailList(item?.profile)
                                                        }} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 12 }}>
                                                            <Image source={{ uri: item?.profile }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                                            <View>
                                                                <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: '600' }}>{(item?.firstName)} {(item.lastName)}</Text>
                                                                <Text style={{ fontSize: 14, marginLeft: 10, color: 'gray', fontWeight: '300' }}>{item.designation}</Text>
                                                            </View>

                                                        </TouchableOpacity>
                                                        <View>
                                                            <CheckBox
                                                                disabled={false}
                                                                value={selectedManagers.includes((item?.user_id).toString())}
                                                                onValueChange={(newValue) => {
                                                                    updateManagerList((item?.user_id).toString())
                                                                    updateManagerThubnailList(item?.profile)
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
                                <TouchableOpacity style={styles.modalButton} onPress={() => setIsManagerListModalVisible(false)}>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>SAVE CHANGES</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>

                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17 }}>Managers: <Text style={{ color: 'gray', fontWeight: '300' }}>{selectedManagers.length} Members</Text></Text>
                            <TouchableOpacity onPress={() => setIsManagerListModalVisible(true)}>
                                <Image source={require('../../assets/Images/plus.png')} style={{
                                    width: 42, height: 42, borderRadius: 25,
                                    marginLeft: -18,
                                }} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={{ flexDirection: 'row', marginTop: 10, paddingLeft: 0 }}>
                            {managerThumbnails.map((thumbnail, index) => {
                                return <Image key={index} source={{ uri: thumbnail }} style={{
                                    width: 50, height: 50, borderRadius: 25,
                                    marginLeft: index == 0 ? 0 : -18,
                                    borderWidth: 2.5,
                                    borderColor: 'white'
                                }} />
                            })}
                        </ScrollView>
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17 }}>Team: <Text style={{ color: 'gray', fontWeight: '300' }}>{selectedMembers.length} Members</Text></Text>
                            <TouchableOpacity onPress={() => setIsSearchModalVisible(true)}>
                                <Image source={require('../../assets/Images/plus.png')} style={{
                                    width: 42, height: 42, borderRadius: 25,
                                    marginLeft: -18,
                                }} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={{ flexDirection: 'row', marginTop: 10, paddingLeft: 0 }}>
                            {thumbnails.map((thumbnail, index) => {
                                return <Image key={index} source={{ uri: thumbnail }} style={{
                                    width: 50, height: 50, borderRadius: 25,
                                    marginLeft: index == 0 ? 0 : -18,
                                }} />
                            })}
                        </ScrollView>
                    </View>
                    {submitButtonLoading ? (<View style={{marginVertical: 18}}><ActivityIndicator size={'large'} color={"#6237a0"} /></View>) : (
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>CREATE</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </ScrollView>
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
    form: {
        paddingHorizontal: 18
    },
    button: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 15,
        marginVertical: 18,
        // width: '47%',
    },
    modalButton: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 10,
    },


    dropdown: {
        marginTop: 15,
        height: 52,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,

        // elevation: 2,
    },
    // icon: {
    //     marginRight: 5,
    // },
    item: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})