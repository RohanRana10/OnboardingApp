import { FlatList, StyleSheet, Text, View, TouchableOpacity, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors';
import { Dropdown } from 'react-native-element-dropdown';
import DownloadPDFButton from './DownloadButton';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
// import { TextInput } from 'react-native-paper';
// import { TextInput } from 'react-native';
import { Madoka, Hoshi } from 'react-native-textinput-effects';
import { useToast } from 'react-native-toast-notifications';

export default function Form(props) {

    const toast = useToast();
    let rules = props.rules;
    let isUploading = props.isUploading;
    let formData = props.formData;
    // console.log("FormData :", formData);
    let handleTextChange = props.handleTextChange;
    let handleDropdownChange = props.handleDropdownChange;
    let selectFile = props.selectFile;
    let formErrors = props.formErrors;
    let saveForm = props.saveForm;

    const makeToast = () => {
        console.log("toast made");
        Alert.alert('Error', "No changes found!");
    }
    return (
        <View style={{ width: '100%', height: '84%', marginTop: 0, paddingVertical: 0 }}>
            <FlatList removeClippedSubviews={false} style={{ marginVertical: 10 }} data={rules} renderItem={({ item }) => {
                return (
                    <View>
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
                                    style={{ marginBottom: 5 }}
                                    onChangeText={(text) => handleTextChange(text, item.data.name)}
                                    keyboardType={item.data.keyboardType ? item.data.keyboardType : 'default'}
                                    // this is used as active border color
                                    borderColor={formErrors[item.data.name] ? 'red' : COLORS.primary}
                                    // active border height
                                    borderHeight={3}
                                    inputPadding={10}
                                    labelStyle={{ color: COLORS.primary, fontWeight: '400', fontSize: 15 }}
                                    inputStyle={{ color: '#6f6f70' }}
                                    // this is used to set backgroundColor of label mask.
                                    // please pass the backgroundColor of your TextInput container.
                                    backgroundColor={'white'}
                                />
                                {formErrors[item.data.name] ?
                                    <Text style={{ color: 'red', marginBottom: 0 }}>{formErrors[item.data.name]}</Text>
                                    : <></>
                                }
                            </>
                        ) : item.field === 'DROPDOWN' ? (
                            <>
                                {/* <Text style={styles.label}>{item.data.label}</Text> */}
                                <Dropdown
                                    style={{ ...styles.dropdown, borderColor: formErrors[item.data.name] ? 'red' : styles.dropdown.borderColor, marginTop: 8, marginBottom: 8 }}
                                    // labelField={item.data.label}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    // iconStyle={styles.iconStyle}
                                    data={item.data.options}
                                    // data={JSON.parse(item.data.options.replace(/'/g, '"'))}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    value={formData[item.data.name]}
                                    placeholder={item.data.placeHolder}
                                    onChange={selection => {
                                        handleDropdownChange(selection.value, item.data.name)
                                        console.log("selected:", selection.value)
                                        // console.log(":::", formData[item.data.name])
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
                                    <Text style={{ color: 'red', marginBottom: 10 }}>{formErrors[item.data.name]}</Text>
                                    : <></>
                                }
                            </>
                        ) : item.field === 'SUBHEADING' ? (
                            <>
                                <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: '500', color: 'black' }}>{item.data.label}:</Text>
                            </>
                        ) : item.field === 'INFORMATION' ? (
                            <>
                                <Text style={styles.label}>{item.data.title}</Text>
                                <Text style={{ color: 'gray' }}>{item.data.description}</Text>
                            </>
                        ) : item.field === 'UPLOAD_BUTTON' ? (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ marginVertical: 20, width: '50%', overflow: 'hidden' }}>File selected: <Text style={{ color: 'gray' }}>{formData[item.data.name]?.name ? formData[item.data.name]?.name : 'None'}</Text></Text>
                                    {isUploading ?
                                        <>
                                        <ActivityIndicator color={COLORS.primary} size={40} style={{ marginRight: 10 }} />
                                        </> :
                                        <>
                                            <TouchableOpacity style={{ width: 110, borderRadius: 8, borderWidth: 1.2, borderColor: formErrors[item.data.name] ? 'red' : COLORS.primary, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => selectFile(item.data.name)}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                    <Ionicons size={20} name={'share-outline'} color={'black'} />
                                                    <Text style={{ color: 'black', marginLeft: 5 }}>UPLOAD</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    }

                                </View>
                                {formErrors[item.data.name] ?
                                    <Text style={{ color: 'red', marginBottom: 10 }}>{formErrors[item.data.name]}</Text>
                                    : <></>
                                }
                            </>
                        ) : item.field === 'DOWNLOAD_BUTTON' ? (
                            <>
                                <DownloadPDFButton name={item.data.filename} pdfUrl={item.data.url} />
                            </>
                        ) : item.field === 'PARAGRAPH' ? (
                            <>
                                <Text style={{ marginBottom: 15 }}>Kindly download the Agreement Form, review and sign the Terms and Conditions, and then proceed to upload the document below.</Text>
                            </>
                        ) : null}
                    </View>
                )
            }} />
            {/* <View style={styles.formButtonsContainer}>
                <TouchableOpacity
                    onPress={Object.keys(formData).length !== 0 ? saveForm : makeToast}
                    style={{
                        borderWidth: 2, backgroundColor: Object.keys(formData).length === 0 ? '#aaa' : COLORS.primary, borderColor: COLORS.primary, borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', width: '48%'
                    }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '500' }}>Save</Text>
                </TouchableOpacity>
            </View> */}
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
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#ccc',
        borderWidth: 1.2,
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
    item: {
        padding: 17,
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
    label: {
        fontSize: 16,
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