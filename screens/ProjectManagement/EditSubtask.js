import { ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Searchbar, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { BASE_PROJECT_URL } from '../../utils/APIConstants';
import { UserContext } from '../../context/userContext';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import filter from 'lodash.filter';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function EditSubtask({ route, navigation }) {
    const { subtask, taskId, memberList, maxDay, maxYear, maxMonth } = route.params;
    const [title, setTitle] = useState(subtask?.title);
    const [description, setDescription] = useState(subtask?.description);
    const [endDate, setEndDate] = useState(subtask?.endDate)
    const [errors, setErrors] = useState({});
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [end, setEnd] = useState(new Date());

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);

    const [seachQuery, setSeachQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [fullSearchData, setFullSearchData] = useState('');

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

    const toast = useToast();
    const context = useContext(UserContext);
    const { user } = context;



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


    const handleSubmit = () => {
        if (validateForm()) {
            setSubmitButtonLoading(true);
            Keyboard.dismiss();
            let url = `${BASE_PROJECT_URL}/update-subtask`;
            let data = JSON.stringify({
                "subTaskId": subtask.id,
                "title": title,
                "description": description,
                "taskId": taskId,
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
                    toast.show("Sub-task updated!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    navigation.goBack();
                    setSubmitButtonLoading(true);

                })
                .catch((error) => {
                    console.log("error updating subtask", error);
                    toast.show("Some error occured!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setSubmitButtonLoading(true);

                });
        }
    }

    const getMemberIds = () => {
        let temp = subtask.users.map((user) => {
            return (user.user_id).toString()
        })
        setSelectedMembers(temp);
    }


    const fetchEmployees = () => {
        if (!memberList) {
            setSearchError("Error Loading Members!");
            setSearchLoading(false);
        }
        else {
            setSearchData(memberList);
            setFullSearchData(memberList);
            setSearchLoading(false);
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


    useEffect(() => {
        console.log("on EdtSbtsk screen:", subtask);
        getMemberIds();
        fetchEmployees();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginLeft: wp(4) }} onPress={() => navigation.goBack()}>
                        <AntDesign name="back" size={hp(3.5)} color="#6237a0" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Edit Sub-task</Text>
                </View>
                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(1.8), marginTop: hp(1), fontWeight: '300', color: 'gray', width: wp(92) }}>Edit the information below to update your Sub-task.</Text>
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
                    <View style={{ marginTop: hp(2) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp(2) }}>Assign Members: <Text style={{ color: 'gray', fontWeight: '300' }}>{selectedMembers.length} People</Text></Text>
                            <TouchableOpacity onPress={() => setIsSearchModalVisible(true)}>
                                <Image source={require('../../assets/Images/plus.png')} style={{
                                    width: wp(10), height: wp(10), borderRadius: hp(50),
                                }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {submitButtonLoading ? (<View style={{ marginVertical: hp(2.5) }}><ActivityIndicator size={'large'} color={"#6237a0"} /></View>) : (
                        <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(1.8) }}>SAVE CHANGES</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
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
                    <View style={{ marginHorizontal: wp(4), marginVertical: hp(2), backgroundColor: 'white', height: hp(70), backgroundColor: '#fff' }}>
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
                                    style={{ backgroundColor: '#f2e6ff', borderRadius: hp(1.4) }}
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
                                                            <Text style={{ fontSize: hp(2.2), marginLeft: wp(2), fontWeight: '600' }}>{(item.firstName ? item.firstName : "Name")} {(item.lastName)}</Text>
                                                            <Text style={{ fontSize: hp(1.9), marginLeft: wp(2), color: 'gray', fontWeight: '300' }}>{item.designation ? item.designation : "Designation"}</Text>
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
                        {/* {submitButtonLoading ? (<View style={{ marginVertical: hp(2.5) }}><ActivityIndicator size={'large'} color={"#6237a0"} /></View>) : ( */}
                        <TouchableOpacity style={styles.modalButton} onPress={() => setIsSearchModalVisible(false)}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(2) }}>SAVE CHANGES</Text>
                        </TouchableOpacity>
                        {/* )} */}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: hp(2),
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: hp(3.2),
        fontWeight: 'bold',
        paddingHorizontal: wp(2),
    },
    form: {
        paddingHorizontal: wp(4)
    },
    modalButton: {
        backgroundColor: '#6237a0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(4),
        borderRadius: hp(2),
        marginVertical: hp(2.5),
    },
})