import { View, Modal, Text, StyleSheet, Platform, PermissionsAndroid, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import COLORS from '../constants/colors';
import * as Progress from 'react-native-progress';
import Button from '../components/Button';
import RectangleCard from '../components/RectangleCard';
import DropdownComponent from '../components/Dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { UserContext } from '../context/userContext';
import { BASE_URL } from '../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DownloadPDFButton from '../components/DownloadButton';
import Form from '../components/Form';


export default function Dashboard({ navigation }) {

    let personalInfoRules = [
        {
            field: "TEXT_INPUT",
            data: {
                name: 'name',
                label: 'Name',
                placeholder: 'Enter Name',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Enter a valid Name'
            }
        },
        {
            field: "DROPDOWN",
            data: {
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Others', value: 'others' }
                ],
                name: 'gender',
                label: 'Gender',
                placeholder: 'Select Gender',
                isRequired: true,
                badMessage: 'Please select a gender'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'contact',
                label: 'Contact No.',
                placeholder: 'Enter Contact No.',
                maxLength: 10,
                keyboardType: 'numeric',
                isRequired: true,
                badMessage: 'Enter a valid Contact No.'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'address1',
                label: 'Address Line 1',
                placeholder: 'Enter House No. and Area',
                isRequired: true,
                badMessage: 'Please enter House No. and Area'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'address2',
                label: 'Address Line 2',
                placeholder: 'Enter State',
                isRequired: true,
                badMessage: 'Please enter State'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'pincode',
                label: 'Pin Code',
                placeholder: 'Enter Pincode',
                maxLength: 6,
                keyboardType: 'numeric',
                isRequired: true,
                badMessage: 'Please enter Pin Code'
            }
        },

    ];
    let educationalInfoRules = [
        {
            field: 'SUBHEADING',
            data: {
                label: 'Graduation'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'graduation',
                label: 'Degree Name',
                placeholder: 'Eg. B.Tech',
                maxLength: 30,
                badMessage: 'Enter a Degree Name'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'graduationYear',
                label: 'Year of Completion',
                placeholder: 'Eg. 2019',
                keyboardType: 'numeric',
                maxLength: 4,
                badMessage: 'Enter a valid Year'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'graduationInstitute',
                label: 'Institute Name',
                placeholder: 'Enter Institute Name',
                maxLength: 30,
                badMessage: 'Enter a valid Institute Name'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'graduationCGPA',
                label: 'CGPA',
                placeholder: 'Eg 9.20',
                keyboardType: 'numeric',
                maxLength: 5,
                badMessage: 'Enter a valid CGPA'
            }
        },
        {
            field: "INFORMATION",
            data: {
                title: 'Upload Marksheet',
                description: '(.pdf, .jpg, .jpeg files only)'
            }
        },
        {
            field: "UPLOAD_BUTTON",
            data: {
                name: 'gradMarksheet',
                isRequired: true,
                badMessage: 'Please upload a valid Marksheet'
            }
        },
        {
            field: 'SUBHEADING',
            data: {
                label: 'Secondary Education'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'secondaryInstitute',
                label: 'Institute Name',
                placeholder: 'Enter Institute Name',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Invalid Secondary Institution Name'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'secondaryYear',
                label: 'Year of Completion',
                placeholder: 'Eg. 2019',
                maxLength: 4,
                keyboardType: 'numeric',
                isRequired: true,
                badMessage: 'Invalid secondary education passing year'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'secondaryStream',
                label: 'Stream',
                placeholder: 'Eg. Science',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Invalid stream name'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'secondaryCGPA',
                label: 'CGPA',
                placeholder: 'Eg 9.20',
                maxLength: 5,
                keyboardType: 'numeric',
                isRequired: true,
                badMessage: 'Invalid secondary education CGPA'
            }
        },
        {
            field: "INFORMATION",
            data: {
                title: 'Upload Marksheet',
                description: '(.pdf, .jpg, .jpeg files only)'
            }
        },
        {
            field: "UPLOAD_BUTTON",
            data: {
                name: 'secondaryMarksheet',
                isRequired: true,
                badMessage: 'Please upload a valid Marksheet'
            }
        },
    ]

    let panInfoRules = [
        {
            field: "TEXT_INPUT",
            data: {
                name: 'panNumber',
                label: 'PAN Number',
                placeholder: 'Eg: QAXCE0891D',
                maxLength: 10,
                // isRequired: true,
                badMessage: 'Invalid PAN Number'
            }
        },
        {
            field: "INFORMATION",
            data: {
                title: 'Upload PAN Card',
                description: '(.pdf, .jpg, .jpeg files only)'
            }
        },
        {
            field: "UPLOAD_BUTTON",
            data: {
                name: 'panUploadData',
                // isRequired: true,
                badMessage: 'Please upload PAN Card'
            }
        },
    ];
    let aadharInfoRules = [
        {
            field: "TEXT_INPUT",
            data: {
                name: 'aadharNumber',
                label: 'Aadhar Number',
                placeholder: 'Eg: 123456781234',
                maxLength: 12,
                isRequired: true,
                badMessage: 'Invalid Aadhar Number'
            }
        },
        {
            field: "INFORMATION",
            data: {
                title: 'Upload Aadhar',
                description: '(.pdf, .jpg, .jpeg files only)'
            }
        },
        {
            field: "UPLOAD_BUTTON",
            data: {
                name: 'aadharUploadData',
                isRequired: true,
                badMessage: 'Please upload Aadhar Card'
            }
        },
    ];
    let agreementInfoRules = [
        {
            field: "DOWNLOAD_BUTTON",
            data: {
                title: 'DOWNLOAD AGREEMENT FORM',
                filename: 'resotech_agreement.pdf',
                url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            }
        },
        {
            field: "PARAGRAPH",
            data: {
                description: 'Kindly download the Agreement Form, review and sign the Terms and Conditions, and then proceed to upload the document below.'
            }
        },
        {
            field: "INFORMATION",
            data: {
                title: 'Upload Signed Agreement Form',
                description: '(.pdf file only)'
            }
        },
        {
            field: "UPLOAD_BUTTON",
            data: {
                name: 'agreementUploadData',
                isRequired: true,
                badMessage: 'Please upload Agreement Form'
            }
        },
    ];
    let financialInfoRules = [
        {
            field: "TEXT_INPUT",
            data: {
                name: 'bankName',
                label: 'Bank Name',
                placeholder: 'Eg. Kotak Mahindra Bank',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Invalid bank name'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'accountNumber',
                label: 'A/C Number',
                placeholder: 'Eg. 1234567890',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Invalid account number'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'bankIfsc',
                label: 'IFSC CODE',
                placeholder: 'Eg. KKMK1234',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Invalid IFSC code'
            }
        },
        {
            field: "TEXT_INPUT",
            data: {
                name: 'bankBranch',
                label: 'Branch Name',
                placeholder: 'Eg. Shiv Nagar, New Delhi',
                maxLength: 30,
                isRequired: true,
                badMessage: 'Invalid Branch Name'
            }
        },
        {
            field: "INFORMATION",
            data: {
                title: 'Upload Cancelled Cheque',
                description: '(.pdf, .jpg, .jpeg files only)'
            }
        },
        {
            field: "UPLOAD_BUTTON",
            data: {
                name: 'financialUploadData',
                isRequired: true,
                badMessage: 'Please upload Cancelled Cheque'
            }
        },
    ];

    // let test = [
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "firstName",
    //             "label": "First Name",
    //             "placeHolder": "Enter First Name",
    //             "maxLength": 30,
    //             "isRequired": true,
    //             "badMessage": "Enter a valid Name"
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "lastName",
    //             "label": "Last Name",
    //             "placeHolder": "Enter Last Name",
    //             "maxLength": 30,
    //             "isRequired": true,
    //             "badMessage": "Enter a valid Name"
    //         }
    //     },
    //     {
    //         "field": "DROPDOWN",
    //         "data": {
    //             "name": "gender",
    //             "label": "Gender",
    //             "placeHolder": "Select Gender",
    //             "isRequired": true,
    //             "badMessage": "Please Select a Gender",
    //             "options": [
    //                 {
    //                     "label": "Male",
    //                     "value": "male"
    //                 },
    //                 {
    //                     "label": "Female",
    //                     "value": "female"
    //                 },
    //                 {
    //                     "label": "Others",
    //                     "value": "others"
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "phoneNumber",
    //             "label": "Contact Number",
    //             "placeHolder": "Enter Contact No",
    //             "maxLength": 10,
    //             "isRequired": true,
    //             "badMessage": "Enter a valid Number",
    //             "keyboardType": "numeric"
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "street",
    //             "label": "Address",
    //             "placeHolder": "Enter House No. and Area",
    //             "isRequired": true,
    //             "badMessage": "Please enter House No. and Area"
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "city",
    //             "label": "City",
    //             "placeHolder": "Enter City",
    //             "isRequired": true,
    //             "badMessage": "Please enter City "
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "state",
    //             "label": "State",
    //             "placeHolder": "Enter State",
    //             "isRequired": true,
    //             "badMessage": "Please enter State "
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "country",
    //             "label": "Country",
    //             "placeHolder": "Enter Country",
    //             "isRequired": true,
    //             "badMessage": "Please enter Country "
    //         }
    //     },
    //     {
    //         "field": "TEXT_INPUT",
    //         "data": {
    //             "name": "pinCode",
    //             "label": "Pin Code",
    //             "placeHolder": "Enter Pin Code",
    //             "maxLength": 6,
    //             "isRequired": true,
    //             "badMessage": "Please enter Pin Code ",
    //             "keyboardType": "numeric"
    //         }
    //     }
    // ]

    let test = [
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "firstName",
                "label": "First Name",
                "placeHolder": "Enter First Name",
                "maxLength": 30,
                "isRequired": true,
                "badMessage": "Enter a valid Name"
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "lastName",
                "label": "Last Name",
                "placeHolder": "Enter Last Name",
                "maxLength": 30,
                "isRequired": true,
                "badMessage": "Enter a valid Name"
            }
        },
        {
            "field": "DROPDOWN",
            "data": {
                "name": "gender",
                "label": "Gender",
                "placeHolder": "Select Gender",
                "isRequired": true,
                "badMessage": "Please Select a Gender",
                "options": [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }, { label: 'Others', value: 'O' }]
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "phoneNumber",
                "label": "Contact Number",
                "placeHolder": "Enter Contact No",
                "maxLength": 10,
                "isRequired": true,
                "badMessage": "Enter a valid Number",
                "keyboardType": "numeric"
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "street",
                "label": "Address",
                "placeHolder": "Enter House No. and Area",
                "isRequired": true,
                "badMessage": "Please enter House No. and Area"
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "city",
                "label": "City",
                "placeHolder": "Enter City",
                "isRequired": true,
                "badMessage": "Please enter City "
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "state",
                "label": "State",
                "placeHolder": "Enter State",
                "isRequired": true,
                "badMessage": "Please enter State "
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "country",
                "label": "Country",
                "placeHolder": "Enter Country",
                "isRequired": true,
                "badMessage": "Please enter Country "
            }
        },
        {
            "field": "TEXT_INPUT",
            "data": {
                "name": "pinCode",
                "label": "Pin Code",
                "placeHolder": "Enter Pin Code",
                "maxLength": 6,
                "isRequired": true,
                "badMessage": "Please enter Pin Code ",
                "keyboardType": "numeric"
            }
        }
    ]

    const context = useContext(UserContext);
    const { user, userDashboardInfo, formFields, fetchUserDashboard } = context;
    const toast = useToast();
    const [progress, setProgress] = useState(0);
    const [panFileName, setPanFileName] = useState("None");
    const [aadharFileName, setAadharFileName] = useState("None");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [agreementFileName, setAgreementFileName] = useState("None");
    const [financialFileName, setFinancialFileName] = useState("None");
    const [personalFormFields, setPersonalFormFields] = useState(formFields?.personalDetails ? formFields?.personalDetails : []);
    const [educationalFormFields, setEducationalFormFields] = useState(formFields?.education ? formFields?.education : []);
    const [panFormFields, setPanFormFields] = useState(formFields?.panDetails ? formFields?.panDetails : [])
    const [aadharFormFields, setAadharFormFields] = useState(formFields?.aadharDetails ? formFields?.aadharDetails : [])
    const [agreementFormFields, setAgreementFormFields] = useState(formFields?.agreementDetails ? formFields?.agreementDetails : [])
    const [financialFormFields, setFinancialFormFields] = useState(formFields?.bankDetails ? formFields?.bankDetails : [])
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    //**** Dynamic form requirements

    const [formErrors, setFormErrors] = useState({});
    const [personalInfoForm, setPersonalInfoForm] = useState({});
    const [educationalInfoFormData, setEducationalInfoFormData] = useState({});
    const [panInfoData, setPanInfoData] = useState({});
    const [aadharInfoData, setAadharInfoData] = useState({});
    const [agreementInfoData, setAgreementInfoData] = useState({});
    const [financialInfoData, setFinancialInfoData] = useState({});

    const handlePersonalInfoTextChange = (text, field) => {
        setPersonalInfoForm({ ...personalInfoForm, [field]: text });
    }
    const handleEducationalInfoTextChange = (text, field) => {
        setEducationalInfoFormData({ ...educationalInfoFormData, [field]: text });
    }
    const handlePanInfoTextChange = (text, field) => {
        setPanInfoData({ ...panInfoData, [field]: text });
    }
    const handleAadharInfoTextChange = (text, field) => {
        setAadharInfoData({ ...aadharInfoData, [field]: text });
    }
    const handleAgreementInfoTextChange = (text, field) => {
        setAgreementInfoData({ ...agreementInfoData, [field]: text });
    }
    const handleFinancialInfoTextChange = (text, field) => {
        setFinancialInfoData({ ...financialInfoData, [field]: text });
    }

    const handlePersonalInfoDropdown = (selection, field) => {
        setPersonalInfoForm({ ...personalInfoForm, [field]: selection });
    }
    const handleEducationalInfoDropdown = (selection, field) => {
        setPersonalInfoForm({ ...educationalInfoFormData, [field]: selection });
    }
    const handlePanInfoDropdown = (selection, field) => {
        setPanInfoData({ ...panInfoData, [field]: selection });
    }
    const handleAadharInfoDropdown = (selection, field) => {
        setAadharInfoData({ ...aadharInfoData, [field]: selection });
    }
    const handleAgreementInfoDropdown = (selection, field) => {
        setAgreementInfoData({ ...agreementInfoData, [field]: selection });
    }
    const handleFinancialInfoDropdown = (selection, field) => {
        setFinancialInfoData({ ...financialInfoData, [field]: selection });
    }

    const checkEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const ValidateForm = (rules, formData) => {
        // Validate TEXT_INPUT fields
        let errors = {};
        for (const rule of rules) {
            if (rule.field === 'TEXT_INPUT' && rule.data.isRequired && !formData[rule.data.name] || rule.field === 'TEXT_INPUT' && rule.data.maxLength && formData[rule.data.name] && rule.data.maxLength < formData[rule.data.name].length || rule.field === 'UPLOAD_BUTTON' && rule.data.isRequired && !formData[rule.data.name] || rule.field === 'DROPDOWN' && rule.data.isRequired && !formData[rule.data.name]) {
                // Alert.alert('Error', rule.data.badMessage);
                // return false;
                errors[rule.data.name] = rule.data.badMessage;
            }
        }
        setFormErrors(errors);
        if (Object.keys(errors).length !== 0) {
            Alert.alert('Error', "Please re-check your inputs");
            console.log("hello ", formErrors);
            return false;
        }

        //validate email
        if (rules.some(rule => rule.data.name === 'email' && formData[rule.data.name] && !checkEmail(formData[rule.data.name]))) {
            Alert.alert('Error', 'Please enter a valid email');
            return false;
        }

        // All validations passed
        // Alert.alert('Success', 'Information updated!');
        return true;
    }

    //**** end


    const submitPersonalInfo = () => {
        console.log("personal info submitted!");
        setIsFormSubmitting(true);
        if (ValidateForm(personalFormFields, personalInfoForm)) {
            let url = `${BASE_URL}/update-details`
            console.log("Presonal Data:", personalInfoForm) // Log the entered values
            // console.log("Presonal Data:", user.token) // Log the entered values
            let data = JSON.stringify({ ...personalInfoForm });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': user.token,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        Alert.alert('Success', 'Personal Information updated');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        Alert.alert('Error', 'Please try again');
                    }
                    // setFormErrors({});
                })
                .catch((error) => {
                    setIsFormSubmitting(false);
                    console.log(error);
                });

        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message")
        }
    }

    const submitEducationalInfo = () => {
        console.log("Educational info submitted!");
        if (ValidateForm(educationalFormFields, educationalInfoFormData)) {
            let url = `${BASE_URL}/update-education`
            // console.log("Educational Data:", educationalInfoFormData);
            let data = JSON.stringify({
                ...educationalInfoFormData,
                gradMemoUrl: educationalInfoFormData?.gradMemoUrl?.path,
                primMemoUrl: educationalInfoFormData?.primMemoUrl?.path,
                secondMemoUrl: educationalInfoFormData?.secondMemoUrl?.path,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': user.token,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 1) {
                        fetchUserDashboard();
                        Alert.alert('Success', 'Educational Information updated');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        Alert.alert('Error', 'Please try again');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("Check Alert Message");
        }

    }

    const submitPanInfo = () => {
        console.log("PAN info submitted!");
        if (ValidateForm(panFormFields, panInfoData)) {
            let url = `${BASE_URL}/save-document`;
            let data = JSON.stringify({
                "path": panInfoData?.path,
                "number": panInfoData?.panNumber,
                "name": panInfoData?.name
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': user.token,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    if (response.data.status.statusCode === 1) {
                        fetchUserDashboard();
                        Alert.alert('Success', 'Pan information updated');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        Alert.alert('Error', 'Please try again');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert('Error', 'Please try again');
                });
            // console.log("PAN Data:", panInfoData);

        } else {
            console.log("Check Alert Message");
        }
    }
    const check = () => {
        console.log("Educational info submitted!");
        if (ValidateForm(educationalFormFields, educationalInfoFormData)) {
            console.log("Educational Data Check:", educationalInfoFormData);
            setStep(step + 1);
        } else {
            console.log("Check Alert Message");
        }
    }

    const submitAadharInfo = () => {
        console.log("Aadhar info submitted!");
        if (ValidateForm(aadharFormFields, aadharInfoData)) {
            // console.log("Aadhar Data:", aadharInfoData);
            let url = `${BASE_URL}/save-document`;
            let data = JSON.stringify({
                "path": aadharInfoData?.path,
                "number": aadharInfoData?.aadharNumber,
                "name": aadharInfoData?.name
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': user.token,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    if (response.data.status.statusCode === 1) {
                        fetchUserDashboard();
                        Alert.alert('Success', 'Aadhar Information updated');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        Alert.alert('Error', 'Please try again');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert('Error', 'Please try again');
                });
            // setStep(step + 1);
        } else {
            console.log("Check Alert Message");
        }
    }
    const submitAgreementInfo = () => {
        console.log("Agreement info submitted!");
        if (ValidateForm(agreementFormFields, agreementInfoData)) {
            // console.log("Agreement Data:", agreementInfoData);
            let url = `${BASE_URL}/save-document`;
            let data = JSON.stringify({
                "path": agreementInfoData?.path,
                "name": agreementInfoData?.name
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': user.token,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios.request(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    if (response.data.status.statusCode === 1) {
                        fetchUserDashboard();
                        Alert.alert('Success', 'Agreement Information updated');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        Alert.alert('Error', 'Please try again');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert('Error', 'Please try again');
                });
            // setStep(step + 1);
        } else {
            console.log("Check Alert Message");
        }
    }

    const submitFinancialInfo = () => {
        console.log("Financial info submitted!");
        if (ValidateForm(financialFormFields, financialInfoData)) {
            // console.log("Agreement Data:", financialInfoData);
            let url = `${BASE_URL}/update-bank`
            let data = JSON.stringify({
                ...financialInfoData,
                bank: financialInfoData?.bank?.path,
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'token': user.token,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 1) {
                        fetchUserDashboard();
                        Alert.alert('Success', 'Financial Information updated');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        Alert.alert('Error', 'Please try again');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            // setStep(step + 1);
        } else {
            console.log("Check Alert Message");
        }
    }

    const selectMarksheets = async (name) => {
        try {
            setIsUploading(true);
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled) {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                // console.log("Data in blob:", blob);
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    // blob: blob,
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                // console.log(uri);

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                // console.log(data);

                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        console.log(path);
                        fileInfo.path = path;
                        // setPanInfoData({ ...panInfoData, [name]: fileInfo, path: path, name: name }); //TODO UPDATE THIS
                        setEducationalInfoFormData({ ...educationalInfoFormData, [name]: fileInfo });
                        Alert.alert('Success', 'Upload Successful!');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        Alert.alert('error', 'Please try uploading again!');
                    });

            }
        } catch (error) {
            setIsUploading(false);
            console.error('Error picking document:', error);
        }
    }

    const selectPAN = async (name) => {
        try {
            setIsUploading(true);
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled) {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                // console.log("Data in blob:", blob);
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    // blob: blob,
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                // console.log(uri);

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                // console.log(data);
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        setPanInfoData({ ...panInfoData, [name]: fileInfo, path: path, name: name }); //TODO UPDATE THIS
                        Alert.alert('Success', 'Upload Successful!');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        Alert.alert('error', 'Please try uploading again!');
                    });
            }
        } catch (error) {
            setIsUploading(false);
            console.error('Error picking document:', error);
        }
    }

    const selectAadhar = async (name) => {
        try {
            setIsUploading(true);
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled) {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                // console.log("Data in blob:", blob);
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    // blob: blob,
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                // console.log(uri);
                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                // console.log(data);
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        setAadharInfoData({ ...aadharInfoData, [name]: fileInfo, path: path, name: name });
                        Alert.alert('Success', 'Upload Successful!');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        Alert.alert('error', 'Please try uploading again!');
                    });
                // setAadharFileName(document.assets[0].name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    }

    const selMarkTemp = async (name) => {
        try {
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled) {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                console.log("Data in blob:", blob);
                let data = {
                    name: document.assets[0].name,
                    // uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    blob: blob,
                    // type: document.assets[0].mimeType
                }
                setAadharInfoData({ ...educationalInfoFormData, [name]: data });
                // setAadharFileName(document.assets[0].name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    }

    const selectAgreement = async (name) => {
        try {
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled) {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                // console.log("Data in blob:", blob);
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    // blob: blob,
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                // console.log(uri);
                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        setAgreementInfoData({ ...agreementInfoData, [name]: fileInfo, path: path, name: name });
                        Alert.alert('Success', 'Upload Successful!');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        Alert.alert('error', 'Please try uploading again!');
                    });
                // setAgreementInfoData({ ...agreementInfoData, [name]: data });
                // setAgreementFileName(document.assets[0].name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    }

    const selectFinancial = async (name) => {
        try {
            setIsUploading(true);
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled) {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                // console.log("Data in blob:", blob);
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    // blob: blob,
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                // console.log(uri);

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                // console.log(data);
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        console.log(path);
                        fileInfo.path = path;
                        // setPanInfoData({ ...panInfoData, [name]: fileInfo, path: path, name: name });
                        setFinancialInfoData({ ...financialInfoData, [name]: fileInfo });
                        Alert.alert('Success', 'Upload Successful!');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        Alert.alert('error', 'Please try uploading again!');
                    });
                // setFinancialInfoData({ ...financialInfoData, [name]: data });
                // setFinancialFileName(document.assets[0].name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    }

    const closeModal = () => {
        setIsModalVisible(false);
        // setAadharFileName("None");
        // setAgreementFileName("None");
        // setPanFileName("None");
        // setFinancialFileName("None");
    }

    const renderFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.form}>
                        <View style={{}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={closeModal} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 3 }}>Back</Text>
                                </TouchableOpacity>
                                {isFormSubmitting ?
                                    <>
                                        <ActivityIndicator color={COLORS.primary} size={25} style={{ marginRight: 10 }} />
                                    </> :
                                    <>
                                        <TouchableOpacity onPress={submitPersonalInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: COLORS.primary, marginRight: 5 }}>Save & Next</Text>
                                            <Ionicons size={25} name={'arrow-forward-circle-outline'} color={COLORS.primary} />
                                        </TouchableOpacity>
                                    </>
                                }
                            </View>
                            <Text>Form (1/6)</Text>
                            <Text style={styles.formTitle}>
                                Personal Information
                            </Text>
                            <Form rules={personalFormFields}
                                formData={personalInfoForm}
                                handleTextChange={handlePersonalInfoTextChange}
                                handleDropdownChange={handlePersonalInfoDropdown}
                                formErrors={formErrors}
                                saveForm={submitPersonalInfo} />
                        </View>
                        {/* <View style={styles.formButtonsContainer}>
                            <Button style={styles.formButton} title="Save" onPress={submitPersonalInfo} />
                        </View> */}
                    </View>
                )
                break;
            case 2: {
                return (
                    <View style={styles.form}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => setStep(step - 1)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 5 }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={submitEducationalInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.primary, marginRight: 5 }}>Next</Text>
                                    <Ionicons size={25} name={'arrow-forward-circle-outline'} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text>Form (2/6)</Text>
                            <Text style={styles.formTitle}>
                                Educational Qualifications
                            </Text>
                            <Form rules={educationalFormFields}
                                formData={educationalInfoFormData}
                                handleTextChange={handleEducationalInfoTextChange}
                                formErrors={formErrors}
                                selectFile={selectMarksheets}
                                saveForm={submitEducationalInfo}
                                isUploading={isUploading} />
                        </View>
                        {/* <View style={styles.formButtonsContainer}>
                            <Button style={{ marginLeft: 15, ...styles.formButton }} title="Save" onPress={submitEducationalInfo} />
                        </View> */}
                    </View>
                )
                break;
            }
            case 3: {
                return (
                    <View style={styles.form}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => setStep(step - 1)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 5 }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={submitPanInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.primary, marginRight: 5 }}>Next</Text>
                                    <Ionicons size={25} name={'arrow-forward-circle-outline'} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text>Form (3/6)</Text>
                            <Text style={styles.formTitle}>
                                PAN Card Details
                            </Text>
                            <Form rules={panFormFields}
                                formData={panInfoData}
                                handleTextChange={handlePanInfoTextChange}
                                selectFile={selectPAN}
                                formErrors={formErrors}
                                saveForm={submitPanInfo}
                                isUploading={isUploading}
                            />
                        </View>
                        {/* <View style={styles.formButtonsContainer}>
                            <Button style={{ marginLeft: 15, ...styles.formButton }} filled title="Save" onPress={submitPanInfo} />
                        </View> */}
                    </View>
                )
                break;
            }
            case 4: {
                return (
                    <View style={styles.form}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => setStep(step - 1)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 5 }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={submitAadharInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.primary, marginRight: 5 }}>Save & Next</Text>
                                    <Ionicons size={25} name={'arrow-forward-circle-outline'} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text>Form (4/6)</Text>
                            <Text style={styles.formTitle}>
                                Aadhar Card Details
                            </Text>
                            <Form rules={aadharFormFields}
                                formData={aadharInfoData}
                                handleTextChange={handleAadharInfoTextChange}
                                selectFile={selectAadhar}
                                formErrors={formErrors}
                                saveForm={submitAadharInfo}
                                isUploading={isUploading}
                            />
                        </View>
                        {/* <View style={styles.formButtonsContainer}>
                            <Button style={{ marginLeft: 15, ...styles.formButton }}  title="Save" onPress={submitAadharInfo} />
                        </View> */}
                    </View>
                )
                break;
            }
            case 5: {
                return (
                    <View style={styles.form}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => setStep(step - 1)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 5 }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={submitAgreementInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.primary, marginRight: 5 }}>Save & Next</Text>
                                    <Ionicons size={25} name={'arrow-forward-circle-outline'} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text>Form (5/6)</Text>
                            <Text style={styles.formTitle}>
                                Agreement Form
                            </Text>
                            <Form rules={agreementFormFields}
                                formData={agreementInfoData}
                                selectFile={selectAgreement}
                                formErrors={formErrors}
                                saveForm={submitAgreementInfo}
                                isUploading={isUploading}
                            />
                        </View>
                        {/* <View style={styles.formButtonsContainer}>
                            <Button style={{ marginLeft: 15, ...styles.formButton }}  title="Save" onPress={submitAgreementInfo} />
                        </View> */}
                    </View>
                )
            }
            case 6: {
                return (
                    <View style={styles.form}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => setStep(step - 1)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 5 }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={submitFinancialInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.primary, marginRight: 5 }}>Save</Text>
                                    <Ionicons size={25} name={'checkmark-circle-outline'} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text>Form (6/6)</Text>
                            <Text style={styles.formTitle}>
                                Financial Information
                            </Text>
                            <Form rules={financialFormFields}
                                handleTextChange={handleFinancialInfoTextChange}
                                formData={financialInfoData}
                                selectFile={selectFinancial}
                                formErrors={formErrors}
                                saveForm={submitFinancialInfo}
                                isUploading={isUploading}
                            />
                        </View>
                        {/* <View style={styles.formButtonsContainer}>
                            <Button style={{ marginLeft: 15, ...styles.formButton }} title="Submit" onPress={submitFinancialInfo} />
                        </View> */}
                    </View>
                )
                break;
            }
            default:
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 20, color: COLORS.primary
                        }}>Your details have been received!</Text>
                        <View style={{ width: '50%', margin: 20 }}>
                            <Button filled title="Close" onPress={closeModal} />
                        </View>
                    </View>
                );
        }
    }

    const openFormsModal = () => {
        setStep(1);
        setIsModalVisible(true);
    }

    const verifyToken = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('Token on dashboard: ', token);
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            console.log('Logged out!');
        } catch (error) {
            console.log("error while removing token", error);
        }
        navigation.navigate('Login');
    }

    const handleLogout = () => {
        let url = `${BASE_URL}/logout`;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.token
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status.statusCode === 1) {
                    console.log(JSON.stringify(response.data));
                    logout();
                    toast.show("Logged out!", {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                }
                else {
                    console.log(JSON.stringify(response.data));
                    toast.show("Some error occured!", {
                        type: "normal",
                        placement: "bottom",
                        duration: 3000,
                        offset: 50,
                        animationType: "slide-in",
                        swipeEnabled: false
                    });
                }

            })
            .catch((error) => {
                console.log(error);
                toast.show("Please try again!", {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 50,
                    animationType: "slide-in",
                    swipeEnabled: false
                });
            });
    }

    const fetchUserData = () => {
        let url = `${BASE_URL}/landing`;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.token
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        setTimeout(() => {
            setProgress(userDashboardInfo["Percentage Complete"] / 100);
        }, 500);
        // verifyToken();
        console.log("useEffect Loaded");
        // getFormFields();
        console.log("Form fields Fetched?", `${formFields.personalDetails ? "TRUE" : "FALSE"}`);
        // console.log("dashboard info at dashboard:", userDashboardInfo);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)} animationType='slide'>
                <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
                    <View style={{
                        width: '100%',
                        height: '100%',
                    }}>
                        {renderFormStep()}
                    </View>
                </View>
            </Modal>
            {StatusBar.setBarStyle('dark-content', true)}
            <View style={styles.headingContainer}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={{ textTransform: 'capitalize', ...styles.username }}>{userDashboardInfo.firstName ? userDashboardInfo.firstName : 'User'}!</Text>
            </View>
            <View style={styles.progressSection}>
                <View style={styles.progressText}>
                    <Text style={{ fontSize: 16, color: COLORS.secondary, marginVertical: 4 }}>
                        Ready to dive into your new role?
                    </Text>
                    <Text style={{ fontSize: 16, color: COLORS.secondary }}>
                        Let's streamline your onboarding by completing your profile.
                    </Text>
                </View>
                <View>
                    <Progress.Circle
                        showsText={true}
                        thickness={9}
                        textStyle={{
                            fontSize: 25,
                            fontWeight: '600'
                        }}
                        color='#f59433'
                        borderWidth={1}
                        strokeCap='round'
                        progress={progress}
                        size={115} />
                </View>
            </View>
            <View style={styles.uploadContainer}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                }}>
                    Start Completing Details
                </Text>
                <View>
                    <TouchableOpacity onPress={openFormsModal} style={styles.uploadButton}>
                        <Text style={{ color: 'white', paddingHorizontal: 4 }}>UPLOAD</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.listContainer}>
                <ScrollView style={styles.scrollView}>
                    <RectangleCard title={'Personal Information'} isComplete={userDashboardInfo['Personal Information']} />
                    <RectangleCard title={'Educational Qualifications'} isComplete={userDashboardInfo['Education Details']} />
                    <RectangleCard title={'PAN Card Details'} isComplete={userDashboardInfo["Pan Card"]} />
                    <RectangleCard title={'Aadhar Card Details'} isComplete={userDashboardInfo["Aadhar Card"]} />
                    <RectangleCard title={'Agreement Form'} isComplete={userDashboardInfo["Agreement"]} />
                    <RectangleCard title={'Financial Information'} isComplete={userDashboardInfo["Bank Details"]} />
                    <View>
                        <TouchableOpacity onPress={handleLogout} style={styles.uploadButton}>
                            <Text style={{ color: 'white', paddingHorizontal: 4, alignSelf: 'center' }}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'cyan',
        // flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 8

    },
    // scrollView:{
    //     paddingVertical: 20
    // },
    progressText: {
        width: "62%"
    },
    formButton: {
        backgroundColor: 'white',
        width: '48%'
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: '#A6E0FF',
        borderRadius: 10,
        alignItems: 'center',
        // width: '100%',
        paddingVertical: 12,
        marginVertical: 10,
        paddingHorizontal: 30,
        justifyContent: 'space-between'
    },
    uploadContainer: {
        flexDirection: 'row',
        // backgroundColor: '#A6E0FF',
        borderWidth: 2,
        borderColor: '#A6E0FF',
        borderRadius: 10,
        alignItems: 'center',
        // width: '100%',
        paddingVertical: 16,
        marginTop: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    listItemButton: {
        backgroundColor: COLORS.primary,
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 6
    },
    uploadButton: {
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 6
    },
    progressSection: {
        justifyContent: 'space-evenly',
        width: '100%',
        height: '22%',
        backgroundColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        // borderColor: 'gray',
        // borderWidth: 2
    },
    listContainer: {
        // backgroundColor: 'cyan',
        width: '100%',
        height: '51%',
        marginTop: 10,
    },
    welcomeText: {
        color: COLORS.secondary,
        fontSize: 30,
        marginRight: 5,
        // marginHorizontal: 10
    },
    username: {
        color: COLORS.primary,
        fontSize: 45,
        fontWeight: '600',
    },
    headingContainer: {
        flexDirection: 'row',
        marginTop: 25,
        marginBottom: 15,
        // backgroundColor: 'cyan',
        alignItems: 'baseline',
    },
    formTitle: {
        fontSize: 25,
        marginTop: 4,
        color: COLORS.primary
    },
    formButtonsContainer: {
        flexDirection: 'row', width: '100%',
        alignItems: 'center',
        // backgroundColor: 'red',
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    form: {
        justifyContent: 'space-between',
        // backgroundColor: '#ddd',
        height: '100%'
    },
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
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    dropdown: {
        marginHorizontal: 1,
        marginBottom: 15,
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
    iconStyle: {
        width: 20,
        height: 20,
    },
})