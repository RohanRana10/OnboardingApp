import { FlatList, StyleSheet, Text, View, TouchableOpacity, Alert, KeyboardAvoidingView, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import COLORS from '../constants/colors';
import { Dropdown } from 'react-native-element-dropdown';
import DownloadPDFButton from './DownloadButton';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
// import { TextInput } from 'react-native-paper';
// import { TextInput } from 'react-native';
import { Madoka, Hoshi } from 'react-native-textinput-effects';
import { useToast } from 'react-native-toast-notifications';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Form(props) {

    const toast = useToast();
    let rules = props.rules;
    let isUploading = props.isUploading;
    let isDownloading = props.isDownloading;
    let setIsDownloading = props.setIsDownloading;
    let formData = props.formData;
    // console.log("RULES :", props.rules);
    let handleTextChange = props.handleTextChange;
    let handleDropdownChange = props.handleDropdownChange;
    let selectFile = props.selectFile;
    let formErrors = props.formErrors;
    let saveForm = props.saveForm;
    let openPreview = props.openPreview;
    let createPreview = props.createPreview;

    const makeToast = () => {
        console.log("toast made");
        Alert.alert('Error', "No changes found!");
    }

    const showPreview = (data) => {
        console.log(data);
        createPreview(data);
        // openPreview();
    }

    return (
        <View style={{ width: wp(92), height: hp(84), backgroundColor: '#fff', alignItems: 'center' }}>
            <FlatList contentContainerStyle={{ marginVertical: hp(1.5), paddingBottom: hp(8) }} data={rules} renderItem={({ item }) => {
                return (
                    <View style={{}}>
                        {item.field === 'TEXT_INPUT' ? (
                            // <>
                            //     {/* <Text style={styles.label}>{item.data.label}</Text> */}
                            //     <TextInput
                            //         mode='outlined'
                            //         keyboardType={item.data.keyboardType ? item.data.keyboardType : 'default'}
                            //         label={item.data.label}
                            //         style={{ ...styles.input }}
                            //         outlineColor={formErrors[item.data.name] ? 'red' : '#ccc'}
                            //         outlineStyle={{ borderRadius: 12, borderWidth: 1.2 }}
                            //         activeOutlineColor={COLORS.primary}
                            //         value={formData[item.data.name]}
                            //         placeholder={item.data.placeholder}
                            //         onChangeText={(text) => handleTextChange(text, item.data.name)}
                            //     />
                            //     {formErrors[item.data.name] ?
                            //         <Text style={{ color: 'red', marginBottom: 10 }}>{formErrors[item.data.name]}</Text>
                            //         : <></>}
                            // </>

                            // <>
                            //     <Text style={styles.label}>{item.data.label}</Text>
                            //     <TextInput
                            //         keyboardType={item.data.keyboardType ? item.data.keyboardType : 'default'}
                            //         style={{ ...styles.inputNormal, borderColor: formErrors[item.data.name] ? 'red' : '#ccc' }}
                            //         value={formData[item.data.name]}
                            //         placeholder={item.data.placeholder}
                            //         onChangeText={(text) => handleTextChange(text, item.data.name)}
                            //     />
                            //     {formErrors[item.data.name] ?
                            //         <Text style={{ color: 'red', marginBottom: 10 }}>{formErrors[item.data.name]}</Text>
                            //         : <></>
                            //     }
                            // </>

                            // <>
                            //     <Madoka
                            //         label={item.data.label}
                            //         value={formData[item.data.name]}
                            //         style={{ marginBottom: 5 }}
                            //         onChangeText={(text) => handleTextChange(text, item.data.name)}
                            //         keyboardType={item.data.keyboardType ? item.data.keyboardType : 'default'}
                            //         // this is used as active and passive border color
                            //         borderColor={formErrors[item.data.name] ? 'red' : COLORS.primary}
                            //         inputPadding={10}
                            //         labelHeight={24}
                            //         labelStyle={{ color: 'gray', fontWeight: '300', fontSize: 10 }}
                            //         inputStyle={{ color: COLORS.primary, fontSize: 20, fontWeight: '400' }}
                            //     />
                            //     {formErrors[item.data.name] ?
                            //         <Text style={{ color: 'red', marginBottom: 5 }}>{formErrors[item.data.name]}</Text>
                            //         : <></>}
                            // </>

                            <>
                                <Hoshi
                                    label={item.data.label}
                                    value={formData[item.data.name]}
                                    style={{ marginBottom: hp(1), width: wp(92) }}
                                    onChangeText={(text) => handleTextChange(text, item.data.name)}
                                    keyboardType={item.data.keyboardType ? item.data.keyboardType : 'default'}
                                    // this is used as active border color
                                    borderColor={'#6237a0'}
                                    // active border height
                                    borderHeight={3}
                                    inputPadding={wp(2)}
                                    labelStyle={{ color: formErrors[item.data.name] ? 'red' : '#6237a0', fontWeight: '400', fontSize: hp(1.8) }}
                                    inputStyle={{ color: '#6f6f70', fontWeight: '500' }}
                                    // this is used to set backgroundColor of label mask.
                                    // please pass the backgroundColor of your TextInput container.
                                    backgroundColor={'white'}
                                />
                                {formErrors[item.data.name] ?
                                    // <Text style={{ color: 'red', marginBottom: 0 }}>{formErrors[item.data.name]}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(2.5)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.6) }}>{formErrors[item.data.name]}</Text></View>
                                    : <></>
                                }
                            </>
                        ) : item.field === 'DROPDOWN' ? (
                            <>
                                <Dropdown
                                    style={{ ...styles.dropdown, borderColor: formErrors[item.data.name] ? 'red' : '#6237a0', borderWidth: 1 }}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={item.data.options}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    value={formData[item.data.name]}
                                    placeholder={item.data.placeHolder}
                                    onChange={selection => {
                                        handleDropdownChange(selection.value, item.data.name)
                                        console.log("selected:", selection.value)
                                    }}
                                    renderItem={item => {
                                        return (
                                            <View style={styles.item}>
                                                <Text style={styles.textItem}>{item.label}</Text>
                                            </View>
                                        );
                                    }}
                                />
                                {formErrors[item.data.name] ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(2.5)} color="red" /><Text style={{ color: 'black', marginLeft: wp(1), fontSize: hp(1.6) }}>{formErrors[item.data.name]}</Text></View>
                                    : <></>
                                }
                            </>
                        ) : item.field === 'SUBHEADING' ? (
                            <>
                                <Text style={{ fontSize: hp(2.6), marginBottom: hp(1), fontWeight: '500', color: 'black' }}>{item.data.label}:</Text>
                            </>
                        ) : item.field === 'INFORMATION' ? (
                            <>
                                <Text style={styles.label}>{item.data.title}</Text>
                                <Text style={{ color: 'gray', fontSize: hp(1.6) }}>{item.data.description}</Text>
                            </>
                        ) : item.field === 'UPLOAD_BUTTON' ? (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ marginVertical: hp(2.5), fontSize: hp(1.8), width: wp(50), overflow: 'hidden' }}>File selected: <Text style={{ color: 'gray', fontSize: hp(1.8) }}>
                                        {formData[item.data.name]?.name ? formData[item.data.name]?.name : 'None'}</Text>
                                    </Text>
                                    {isUploading ?
                                        <>
                                            <ActivityIndicator color={'#6237a0'} size={'large'} style={{ marginRight: hp(2) }} />
                                        </> :
                                        <>
                                            {formData[item.data.name]?.name ? <>
                                                {/* {console.log(formData)} */}
                                                <TouchableOpacity style={{}} onPress={() => {
                                                    // console.log(`Preview for ${formData[item.data.name]?.path ? formData[item.data.name]?.path : formData?.path}`)
                                                    let data = {
                                                        path: formData[item.data.name]?.path ? formData[item.data.name]?.path : formData?.path,
                                                        name: formData[item.data.name]?.name,
                                                        type: formData[item.data.name]?.type
                                                    };
                                                    showPreview(data);
                                                }}>
                                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                        <Text style={{ color: 'orange', marginRight: hp(0.5), fontSize: hp(1.8) }}>Preview</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </> : <></>}

                                            <TouchableOpacity style={{ width: wp(26), borderRadius: hp(1), borderWidth: hp(0.2), borderColor: formErrors[item.data.name] ? 'red' : '#6237a0', height: hp(5), justifyContent: 'center', alignItems: 'center' }} onPress={() => { selectFile(item.data.name) }}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                    <Ionicons size={hp(2.5)} name={'share-outline'} color={'#6237a0'} />
                                                    <Text style={{ color: '#6237a0', marginLeft: hp(0.8), fontSize: hp(1.8) }}>UPLOAD</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    }

                                </View>
                                {formErrors[item.data.name] ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="warning" size={hp(2.5)} color="red" /><Text style={{ color: 'black', marginLeft: hp(1) }}>{formErrors[item.data.name]}</Text></View>
                                    : <></>
                                }
                            </>
                        ) : item.field === 'DOWNLOAD_BUTTON' ? (
                            <>
                                {isDownloading ?
                                    <>
                                        <ActivityIndicator color={'#6237a0'} size={'large'} style={{ marginVertical: hp(1) }} />
                                    </> :
                                    <>
                                        <DownloadPDFButton setIsDownloading={setIsDownloading} name={item.data.fileName} pdfUrl={item.data.url} />
                                    </>
                                }

                            </>
                        ) : item.field === 'PARAGRAPH' ? (
                            <>
                                <Text style={{ marginBottom: hp(1.8), fontSize: hp(1.6) }}>Kindly download the Agreement Form, review and sign the Terms and Conditions, and then proceed to upload the document below.</Text>
                            </>
                        ) : null}
                    </View>
                )
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        // marginHorizontal: 1,
        marginBottom: 15,
        // height: 50,
        backgroundColor: 'white',
        // borderRadius: 12,
        // borderColor: '#ddd',
        // borderWidth: 0.4,
        // padding: 12,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 3,
    },
    inputNormal: {
        marginHorizontal: 1,
        marginBottom: 15,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#ccc',
        borderWidth: 1.2,
        padding: 12,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 3,
    },
    dropdown: {
        // marginHorizontal: 1,
        // marginBottom: 15,
        marginTop: hp(1.5),
        height: hp(6),
        backgroundColor: 'white',
        borderRadius: hp(1.2),
        padding: hp(1),
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 2,
    },
    item: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
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
    label: {
        fontSize: hp(1.8),
        marginVertical: 8,
        fontWeight: 'bold'
    },
    formButtonsContainer: {
        flexDirection: 'row', width: '100%',
        alignItems: 'center',
        // backgroundColor: 'red',
        justifyContent: 'flex-end',
        marginVertical: 10
    },
    formButton: {
        // backgroundColor: 'white',
        width: '48%'
    },
})