import { ActivityIndicator, FlatList, Image, Keyboard, StatusBar, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Searchbar, TextInput } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import filter from 'lodash.filter';
import CheckBox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios'
import { BASE_PROJECT_URL } from '../../utils/APIConstants'
import { UserContext } from '../../context/userContext'
import { useToast } from 'react-native-toast-notifications'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [managerThumbnails, setManagerThumbnails] = useState([]);
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);


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

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    useEffect(() => {
        setSearchLoading(true);
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
        if ((firstName.toLowerCase()).includes(query) || (lastName.toLowerCase()).includes(query)) {
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
                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(1.8), marginTop: hp(1), fontWeight: '300', color: 'gray', width: wp(92) }}>Welcome! Let's start by filling out the information below to create your new project.</Text>
                <View style={styles.form}>
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

                    <Dropdown
                        style={{ ...styles.dropdown, borderColor: errors.tag ? 'red' : '#6237a0', borderWidth: 1 }}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        maxHeight={hp(20)}
                        labelField="label"
                        valueField="value"
                        placeholder="Tag"
                        value={tag}
                        onChange={item => {
                            setTag(item.value);
                        }}
                        renderItem={renderItem}
                    />
                    {errors.tag && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(3)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.5) }}>Tag is required!</Text></View>}

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
                                        borderRadius: hp(1.2),
                                        borderColor: errors.startDate ? 'red' : '#6237A0'
                                    }}
                                    style={{ backgroundColor: 'white', marginTop: hp(1), width: wp(92) }}
                                    onChangeText={setStartDate}
                                    editable={false}
                                    textColor='#28104E'
                                    selectionColor='#6237a0'
                                    activeOutlineColor="#6237a0"
                                />
                            </Pressable>
                            {errors.startDate && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(3)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.5) }}>Start Date is required!</Text></View>}
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
                                            onChangeText={(query) => handleSearch(query)}
                                            style={{ backgroundColor: '#f2e6ff', borderRadius: hp(1.4), width: wp(90), alignSelf: 'center'}}
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
                                                                <Image source={{ uri: item?.profile }} style={{ width: wp(13), height: wp(13), borderRadius: hp(50) }} />
                                                                <View>
                                                                    <Text style={{ fontSize: hp(2.2), marginLeft: wp(2), fontWeight: '600' }}>{(item?.firstName)} {(item.lastName)}</Text>
                                                                    <Text style={{ fontSize: hp(1.9), marginLeft: wp(2), color: 'gray', fontWeight: '300' }}>{item.designation}</Text>
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
                                <TouchableOpacity style={styles.modalButton} onPress={() => setIsSearchModalVisible(false)}>
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(2) }}>SAVE CHANGES</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>

                    <Modal visible={isManagerListModalVisible} animationType='slide' presentationStyle='pageSheet' onRequestClose={() => setIsManagerListModalVisible(false)}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1, backgroundColor: 'white' }}
                        >
                            <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(4), width: wp(92), alignSelf: 'center' }}>
                                <Text style={{
                                    color: '#6237A0', fontSize: hp(3), fontWeight: 'bold'
                                }}>Add Managers</Text>
                                <TouchableOpacity onPress={() => setIsManagerListModalVisible(false)}>
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
                                            value={managerSearchQuery}
                                            onChangeText={(query) => handleManagerSearch(query)}
                                            style={{ backgroundColor: '#f2e6ff', borderRadius: hp(1.4), width: wp(90), alignSelf: 'center'}}
                                        />
                                        {searchError ? (
                                            <Text style={{ marginTop: hp(4), alignSelf: 'center', fontSize: hp(1.8) }}>Error Fetching Managers!</Text>
                                        ) : (
                                            <View style={{ backgroundColor: '#fff', maxHeight: hp(70) }}>
                                                <FlatList
                                                    style={{ marginVertical: hp(1) }}
                                                    data={searchData}
                                                    keyExtractor={(item) => item.user_id}
                                                    renderItem={({ item }) => (

                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                                            <TouchableOpacity onPress={() => {
                                                                updateManagerList((item?.user_id).toString())
                                                                updateManagerThubnailList(item?.profile)
                                                            }} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp(2), marginTop: hp(2) }}>
                                                                <Image source={{ uri: item?.profile }} style={{ width: wp(13), height: wp(13), borderRadius: hp(2) }} />
                                                                <View>
                                                                    <Text style={{ fontSize: hp(2.2), marginLeft: wp(2), fontWeight: '600' }}>{(item?.firstName)} {(item.lastName)}</Text>
                                                                    <Text style={{ fontSize: hp(1.9), marginLeft: wp(2), color: 'gray', fontWeight: '300' }}>{item.designation}</Text>
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
                                <TouchableOpacity style={styles.modalButton} onPress={() => setIsManagerListModalVisible(false)}>
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(2) }}>SAVE CHANGES</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>

                    <View style={{ marginTop: hp(2) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp(92) }}>
                            <Text style={{ fontSize: hp(2) }}>Managers: <Text style={{ color: 'gray', fontWeight: '300' }}>{selectedManagers.length} Members</Text></Text>
                            <TouchableOpacity onPress={() => setIsManagerListModalVisible(true)}>
                                <Image source={require('../../assets/Images/plus.png')} style={{
                                    width: wp(10), height: wp(10), borderRadius: hp(50),
                                    // marginLeft: -18,
                                }} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={{ flexDirection: 'row', marginTop: hp(1) }}>
                            {managerThumbnails.map((thumbnail, index) => {
                                return <Image key={index} source={{ uri: thumbnail }} style={{
                                    width: wp(12), height: wp(12), borderRadius: hp(50),
                                    marginLeft: index == 0 ? 0 : -wp(5),
                                    borderWidth: 2.5,
                                    borderColor: 'white'
                                }} />
                            })}
                        </ScrollView>
                    </View>
                    <View style={{ marginTop: hp(2) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp(2) }}>Team: <Text style={{ color: 'gray', fontWeight: '300' }}>{selectedMembers.length} Members</Text></Text>
                            <TouchableOpacity onPress={() => setIsSearchModalVisible(true)}>
                                <Image source={require('../../assets/Images/plus.png')} style={{
                                    width: wp(10), height: wp(10), borderRadius: hp(50),
                                    // marginLeft: -18,
                                }} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: 0 }}>
                            {thumbnails.map((thumbnail, index) => {
                                return <Image key={index} source={{ uri: thumbnail }} style={{
                                    width: wp(12), height: wp(12), borderRadius: hp(50),
                                    marginLeft: index == 0 ? 0 : -wp(5),
                                }} />
                            })}
                        </ScrollView>
                    </View>
                    {submitButtonLoading ? (<View style={{ marginVertical: hp(2.5) }}><ActivityIndicator size={'large'} color={"#6237a0"} /></View>) : (
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(1.8) }}>CREATE</Text>
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
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: hp(3.6),
        fontWeight: 'bold',
        paddingHorizontal: wp(4),
    },
    form: {
        paddingHorizontal: wp(4)
    },
    button: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(3),
        borderRadius: hp(1.4),
        marginVertical: hp(2.5),
    },
    modalButton: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(4),
        borderRadius: hp(1.4),
    },

    dropdown: {
        marginTop: hp(1.5),
        height: hp(5),
        backgroundColor: 'white',
        borderRadius: hp(1.2),
        padding: hp(1),
    },
    item: {
        paddingHorizontal: hp(2),
        paddingVertical: hp(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: hp(1.8),
    },
    placeholderStyle: {
        fontSize: hp(1.8),
    },
    selectedTextStyle: {
        fontSize: hp(1.8),
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