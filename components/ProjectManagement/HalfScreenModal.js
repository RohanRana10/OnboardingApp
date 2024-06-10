import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, Image, Pressable, Platform, Keyboard, ScrollView, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native';
import { Searchbar, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/userContext';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import { BASE_PROJECT_URL } from '../../utils/APIConstants';
import Checkbox from 'expo-checkbox';
import filter from 'lodash.filter';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const HalfScreenModal = ({ isVisible, onClose, taskId, fetchTaskDetails, users, maxYear, maxMonth, maxDay }) => {
    const toast = useToast();
    const context = useContext(UserContext);
    const { user } = context;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [endDate, setEndDate] = useState();
    const [end, setEnd] = useState(new Date());

    const data = [
        { label: 'Pending', value: 'pending' },
        { label: 'Complete', value: 'complete' },

    ];

    const [seachQuery, setSeachQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [fullSearchData, setFullSearchData] = useState('');

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    // const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);

    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);


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
            Keyboard.dismiss();
            setSubmitButtonLoading(true);
            let url = `${BASE_PROJECT_URL}/new-subtask`
            let data = JSON.stringify({
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
                    fetchTaskDetails();
                    toast.show("Sub-task Added!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                    setSubmitButtonLoading(false);
                    onClose();
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
                    onClose();
                });
        }
    }

    // const renderItem = item => {
    //     return (
    //         <View style={styles.item}>
    //             <Text style={styles.textItem}>{item.label}</Text>
    //         </View>
    //     );
    // };

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

    // const fetchEmployees = () => {
    //     let url = `${BASE_PROJECT_URL}/get-employees`
    //     let config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: url,
    //         headers: {
    //             'token': user.userToken
    //         }
    //     };

    //     axios.request(config)
    //         .then((response) => {
    //             console.log(JSON.stringify(response.data.data));
    //             setSearchData(response.data.data);
    //             setFullSearchData(response.data.data);
    //             setSearchLoading(false);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             setSearchError(error);
    //             setSearchLoading(false);
    //         });
    // }

    const qwerty = () => {
        if (!users) {
            setSearchError("Error Loading Members!");
            setSearchLoading(false);
        }
        else {
            setSearchData(users);
            setFullSearchData(users);
            setSearchLoading(false);
        }

    }

    useEffect(() => {
        // fetchEmployees();
        qwerty();
    }, [])


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



    return (
        <View>
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <ScrollView
                    contentContainerStyle={styles.modalContainer}
                    activeOpacity={1}
                // onPress={onClose}
                >
                    <View style={styles.modal}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginRight: wp(1.5) }} onPress={onClose}>
                                <AntDesign name="back" size={hp(3.5)} color="#6237a0" />
                            </TouchableOpacity>
                            <Text style={styles.modalHeading}>New Sub-Task</Text>
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
                        {errors.description && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(3)} color="red" /><Text style={{color: 'black', marginLeft: wp(1), fontSize: hp(1.5) }}>Description is required!</Text></View>}

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
                                    style={{ backgroundColor: 'white',marginTop: hp(1), width: wp(92) }}
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
                        {/* <Dropdown
                            style={{ ...styles.dropdown, borderColor: errors.status ? 'red' : '#6237a0', borderWidth: 1 }}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={data}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Status"
                            value={status}
                            onChange={item => {
                                setStatus(item.value);
                            }}
                            renderItem={renderItem}
                        />
                        {errors.status && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={24} color="red" /><Text style={{ color: 'black', marginLeft: 5 }}>Status is required!</Text></View>} */}

                        <View style={{ marginTop: hp(2) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp(2) }}>Assign Members: <Text style={{ color: 'gray', fontWeight: '300' }}>{selectedMembers.length} People</Text></Text>
                                <TouchableOpacity onPress={() => setIsSearchModalVisible(true)}>
                                    <Image source={require('../../assets/Images/plus.png')} style={{
                                        width: wp(10), height: wp(10), borderRadius: hp(50),
                                        // marginLeft: -wp(4.5),
                                    }} />
                                </TouchableOpacity>
                            </View>
                            {/* <ScrollView horizontal style={{ flexDirection: 'row', marginTop: 10, paddingLeft: 0 }}>
                                {thumbnails.map((thumbnail, index) => {
                                    return <Image key={index} source={{ uri: thumbnail }} style={{
                                        width: 50, height: 50, borderRadius: 25,
                                        marginLeft: index == 0 ? 0 : -18,
                                    }} />
                                })}
                            </ScrollView> */}
                        </View>
                        {submitButtonLoading ? (<View style={{ marginVertical: hp(2) }}><ActivityIndicator size={'large'} color={"#6237a0"} /></View>) : (
                            <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: hp(1.8) }}>CREATE</Text>
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
                                color: '#6237A0',  fontSize: hp(3), fontWeight: 'bold',
                            }}>Add Members</Text>
                            <TouchableOpacity onPress={() => setIsSearchModalVisible(false)}>
                                <Text style={{ fontSize: hp(2), fontWeight: '400' }}>Close</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{  marginHorizontal: wp(4), marginVertical: hp(2), backgroundColor: 'white', height: hp(70), backgroundColor: '#fff' }}>
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
                                        style={{ backgroundColor: '#f2e6ff', borderRadius: hp(2) }}
                                    />
                                    {searchError ? (
                                        <Text style={{  marginTop: hp(4), alignSelf: 'center', fontSize: hp(1.8) }}>Error Fetching Members!</Text>
                                    ) : (
                                        <View style={{backgroundColor: '#fff', maxHeight: hp(70)}}>
                                        <FlatList
                                            style={{ marginVertical: hp(1)  }}
                                            data={searchData}
                                            keyExtractor={(item) => item.user_id}
                                            renderItem={({ item }) => (

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                                    <TouchableOpacity onPress={() => {
                                                        updateMemberList((item?.user_id).toString())
                                                        updateThubnailList(item?.profile)
                                                    }} style={{flexDirection: 'row', alignItems: 'center', marginLeft: wp(2), marginTop: hp(2) }}>
                                                        <Image source={{ uri: item?.profile }} style={{ width: wp(12), height: wp(12), borderRadius: hp(50) }} />
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
                                        /></View>
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

            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
        padding: wp(4),
        borderRadius: hp(2),
        marginTop: hp(2),
    },
    modalHeading: {
        color: '#6237A0',
        fontSize: hp(3),
        fontWeight: 'bold',
        // paddingHorizontal: 18,
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
    item: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default HalfScreenModal;
