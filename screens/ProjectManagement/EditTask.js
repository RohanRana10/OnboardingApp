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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function EditTask({ route, navigation }) {

    const { task, maxDay, maxMonth, maxYear } = route.params;
    const [title, setTitle] = useState(task?.taskName);
    const [description, setDescription] = useState(task?.taskDescription);
    const [endDate, setEndDate] = useState(task?.endDate)
    const [users, setUsers] = useState(task?.users ? task.users : []);
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
        // if (!status) {
        //     errors.status = "Status is required!";
        // }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const handleSubmit = () => {
        if (validateForm()) {
            setSubmitButtonLoading(true);
            Keyboard.dismiss();
            let url = `${BASE_PROJECT_URL}/update-task`
            let data = JSON.stringify({
                "taskId": task.id,
                "title": title,
                "description": description,
                "endDate": endDate,
                "projectId": task.projectId
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
                    toast.show("Task updated!", {
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
                    console.log("error updating task", error);
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
                console.log(JSON.stringify("Employees:", response.data.data));
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

    const handleSearch = (query) => {
        setSeachQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullSearchData, (user) => {
            return contains(user, formattedQuery);
        });
        setSearchData(filteredData);
    }



    useEffect(() => {
        console.log("on Edit task screen:", task);
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginLeft: wp(4) }} onPress={() => navigation.goBack()}>
                        <AntDesign name="back" size={hp(3.3)} color="#6237a0" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Edit Task</Text>
                </View>
                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(1.8), marginTop: hp(1), fontWeight: '300', color: 'gray', width: wp(92) }}>Edit the information below to update your Task.</Text>
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
                    {submitButtonLoading ? (<View style={{ marginVertical: hp(2.5) }}><ActivityIndicator size={'large'} color={"#6237a0"} /></View>) : (
                        <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(1.8) }}>SAVE CHANGES</Text>
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
        paddingVertical: hp(2),
        // paddingHorizontal: 18,
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