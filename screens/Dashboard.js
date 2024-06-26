import { View, Modal, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import COLORS from '../constants/colors';
import * as Progress from 'react-native-progress';
import Button from '../components/Button';
import RectangleCard from '../components/RectangleCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { UserContext } from '../context/userContext';
import { BASE_ONBOARD_URL } from '../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import Form from '../components/Form';
import FormHeader from '../components/FormHeader';
import Pdf from 'react-native-pdf';
import Toast from "react-native-toast-notifications";
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Dashboard({ navigation }) {

    const context = useContext(UserContext);
    const { user, userDashboardInfo, formFields, fetchUserDashboard } = context;
    const toast = useToast();
    const [progress, setProgress] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [personalFormFields, setPersonalFormFields] = useState(formFields?.personalDetails ? formFields?.personalDetails : []);
    const [educationalFormFields, setEducationalFormFields] = useState(formFields?.education ? formFields?.education : []);
    const [panFormFields, setPanFormFields] = useState(formFields?.panDetails ? formFields?.panDetails : [])
    const [aadharFormFields, setAadharFormFields] = useState(formFields?.aadharDetails ? formFields?.aadharDetails : [])
    const [agreementFormFields, setAgreementFormFields] = useState(formFields?.agreementDetails ? formFields?.agreementDetails : [])
    const [financialFormFields, setFinancialFormFields] = useState(formFields?.bankDetails ? formFields?.bankDetails : [])
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [imageResource, setImageResource] = useState('');
    const [pdfResource, setPdfResource] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    //**** Dynamic form requirements

    const [formErrors, setFormErrors] = useState({});
    const [personalInfoForm, setPersonalInfoForm] = useState({});
    const [educationalInfoFormData, setEducationalInfoFormData] = useState({});
    const [panInfoData, setPanInfoData] = useState({});
    const [aadharInfoData, setAadharInfoData] = useState({});
    const [agreementInfoData, setAgreementInfoData] = useState({});
    const [financialInfoData, setFinancialInfoData] = useState({});

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const toastRef = useRef();

    const showToast = (message, type) => {

        toastRef.current.show(message, {
            type: type,
            placement: "bottom",
            duration: 3000,
            offset: 50,
            animationType: "slide-in",
            swipeEnabled: false
        });
    };

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
            if (rule.field === 'TEXT_INPUT' && rule.data.isRequired && !formData[rule.data.name] || rule.field === 'TEXT_INPUT' && rule.data.maxLength && formData[rule.data.name] && rule.data.maxLength < formData[rule.data.name].length || rule.field === 'TEXT_INPUT' && rule.data.minLength && formData[rule.data.name] && rule.data.minLength > formData[rule.data.name].length || rule.field === 'UPLOAD_BUTTON' && rule.data.isRequired && !formData[rule.data.name] || rule.field === 'DROPDOWN' && rule.data.isRequired && !formData[rule.data.name]) {
                errors[rule.data.name] = rule.data.badMessage;
            }
        }
        setFormErrors(errors);
        if (Object.keys(errors).length !== 0) {
            // Alert.alert('Error', "Please re-check your inputs");
            showToast('Please re-check your inputs', 'danger');
            console.log("hello ", formErrors);
            return false;
        }

        //validate email
        if (rules.some(rule => rule.data.name === 'email' && formData[rule.data.name] && !checkEmail(formData[rule.data.name]))) {
            // Alert.alert('Error', 'Please enter a valid email');
            showToast('Please enter a valid email', 'success');
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
            let url = `${BASE_ONBOARD_URL}/update-details`
            console.log("Personal Data:", personalInfoForm) // Log the entered values
            let data = JSON.stringify({ ...personalInfoForm });

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
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast("Personal Information updated", 'success');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast("Please try again later", 'normal');
                    }
                })
                .catch((error) => {
                    setIsFormSubmitting(false);
                    console.log(error);
                    showToast("Some error occured!", 'normal');
                });

        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message")
        }
    }

    const submitEducationalInfo = () => {
        console.log("Educational info submitted!");
        // console.log("Edu:" ,educationalInfoFormData);
        setIsFormSubmitting(true);
        if (ValidateForm(educationalFormFields, educationalInfoFormData)) {
            let url = `${BASE_ONBOARD_URL}/update-education`
            let data = JSON.stringify({
                ...educationalInfoFormData,
                gradMemoUrl: educationalInfoFormData?.gradMemoUrl?.path,
                primMemoUrl: educationalInfoFormData?.primMemoUrl?.path,
                secondMemoUrl: educationalInfoFormData?.secondMemoUrl?.path,
            });

            console.log("edu:", data);

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
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Educational Information updated', 'success');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        console.log(response.data.status);
                        setIsFormSubmitting(false);
                        showToast(`${response.data.status.statusMessage}!`, 'normal');
                    }
                })
                .catch((error) => {
                    setIsFormSubmitting(false);
                    console.log(error);
                });
        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message");
        }

    }

    const submitPanInfo = () => {
        console.log("PAN info submitted!");
        setIsFormSubmitting(true);
        if (ValidateForm(panFormFields, panInfoData)) {
            let url = `${BASE_ONBOARD_URL}/save-document`;
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
                    'token': user.userToken,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Pan information updated', 'success');
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again later', 'normal');

                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again later', 'normal');
                });

        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message");
        }
    }

    const submitAadharInfo = () => {
        console.log("Aadhar info submitted!");
        setIsFormSubmitting(true);
        if (ValidateForm(aadharFormFields, aadharInfoData)) {
            let url = `${BASE_ONBOARD_URL}/save-document`;
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
                    'token': user.userToken,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Aadhar Information updated', "success");
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again later', "normal");

                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again later', "normal");

                });
        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message");
        }
    }

    const submitAgreementInfo = () => {
        console.log("Agreement info submitted!");
        setIsFormSubmitting(true);
        if (ValidateForm(agreementFormFields, agreementInfoData)) {
            let url = `${BASE_ONBOARD_URL}/save-document`;
            let data = JSON.stringify({
                "path": agreementInfoData?.path,
                "name": agreementInfoData?.name
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
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Agreement Information updated', "success");
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again', "normal");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again', "normal");

                });
        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message");
        }
    }

    const submitFinancialInfo = () => {
        console.log("Financial info submitted!");
        setIsFormSubmitting(true);
        if (ValidateForm(financialFormFields, financialInfoData)) {
            let url = `${BASE_ONBOARD_URL}/update-bank`
            let data = JSON.stringify({
                ...financialInfoData,
                bank: financialInfoData?.bank?.path,
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
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Financial Information updated', "success");
                        closeModal();
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again', "normal");

                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again', "normal");

                });
        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message");
        }
    }

    const selectMarksheets = async (name) => {
        try {
            setIsUploading(true);
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled && document.assets[0].mimeType == 'application/pdf' || document.assets[0].mimeType == 'image/jpeg' || document.assets[0].mimeType == 'application/jpg') {
                // Create Blob object
                console.log("File Type:", document.assets[0].mimeType);
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_ONBOARD_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.userToken,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        console.log(path);
                        fileInfo.path = path;
                        setEducationalInfoFormData({ ...educationalInfoFormData, [name]: fileInfo });
                        showToast('Upload successful', 'success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again', 'normal');
                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file beacuse file was:", document.assets[0].mimeType);
                showToast('This file type is not supported!', 'warning');
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
            if (!document.canceled && document.assets[0].mimeType == 'application/pdf' || document.assets[0].mimeType == 'image/jpeg' || document.assets[0].mimeType == 'application/jpg') {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_ONBOARD_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.userToken,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        setPanInfoData({ ...panInfoData, [name]: fileInfo, path: path, name: name });
                        showToast('Upload Successful', 'success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again', 'normal');

                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
                showToast('This file type is not supported!', 'warning');
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
            if (!document.canceled && document.assets[0].mimeType == 'application/pdf' || document.assets[0].mimeType == 'image/jpeg' || document.assets[0].mimeType == 'application/jpg') {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_ONBOARD_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.userToken,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                console.log("data", data);
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);
                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        setAadharInfoData({ ...aadharInfoData, [name]: fileInfo, path: path, name: name });
                        showToast('Upload Successful', 'success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again', 'normal');
                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
                showToast('This file type is not supported!', 'warning');
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    }

    const selectAgreement = async (name) => {
        try {
            setIsUploading(true);
            const document = await DocumentPicker.getDocumentAsync({
            });
            if (!document.canceled && document.assets[0].mimeType == 'application/pdf' || document.assets[0].mimeType == 'image/jpeg' || document.assets[0].mimeType == 'application/jpg') {
                // Create Blob object
                const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                let fileInfo = {
                    name: document.assets[0].name,
                    uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                    type: document.assets[0].mimeType
                }
                // Create FormData object
                let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                let data = new FormData();
                data.append('file', {
                    uri: uri,
                    type: document.assets[0].mimeType,
                    name: document.assets[0].name,
                });
                data.append('name', name);
                let url = `${BASE_ONBOARD_URL}/upload-document`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'token': user.userToken,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };
                console.log("data", data);
                axios.request(config)
                    .then((response) => {
                        setIsUploading(false);

                        let path = response.data.data;
                        console.log(JSON.stringify(response.data));
                        setAgreementInfoData({ ...agreementInfoData, [name]: fileInfo, path: path, name: name });
                        showToast('Upload Successful', 'success');


                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again', 'normal');

                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
                showToast('This file type is not supported!', 'warning');
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
                if (!document.canceled && document.assets[0].mimeType == 'application/pdf' || document.assets[0].mimeType == 'image/jpeg' || document.assets[0].mimeType == 'application/jpg') {
                    // Create Blob object
                    const blob = await fetch(document.assets[0].uri).then(response => response.blob());
                    let fileInfo = {
                        name: document.assets[0].name,
                        uri: Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', ''),
                        type: document.assets[0].mimeType
                    }
                    // Create FormData object
                    let uri = Platform.OS === 'android' ? document.assets[0].uri : document.assets[0].uri.replace('file://', '');

                    let data = new FormData();
                    data.append('file', {
                        uri: uri,
                        type: document.assets[0].mimeType,
                        name: document.assets[0].name,
                    });
                    data.append('name', name);
                    let url = `${BASE_ONBOARD_URL}/upload-document`;
                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: url,
                        headers: {
                            'token': user.userToken,
                            'Content-Type': 'multipart/form-data',
                        },
                        data: data
                    };
                    console.log("data sent", data);
                    axios.request(config)
                        .then((response) => {
                            setIsUploading(false);
                            if (response.data.data == null) {
                                console.log("error uploading file")
                                console.log(JSON.stringify(response.data));
                            }
                            else {
                                let path = response.data.data;
                                console.log(JSON.stringify(response.data));
                                console.log(path);
                                fileInfo.path = path;
                                setFinancialInfoData({ ...financialInfoData, [name]: fileInfo });
                                showToast('Upload Successful', 'success');
                            }

                        })
                        .catch((error) => {
                            setIsUploading(false);
                            console.log(error);
                            showToast('Please try uploading again', 'normal');
                        });
                }
                else {
                    setIsUploading(false);
                    console.log("Returning without file");
                    showToast('This file type is not supported!', 'warning');
                }
            } catch (error) {
                console.error('Error picking document:', error);
            }
        }

        const closeModal = () => {
            setIsModalVisible(false);
            toast.show("Details updated successfully!", {
                type: "success",
                placement: "top",
                duration: 3000,
                offset: 50,
                animationType: "slide-in",
                swipeEnabled: false
            });
        }

        const renderFormStep = () => {
            switch (step) {
                case 1:
                    return (
                        <View style={styles.form}>
                            <View style={{}}>
                                <FormHeader backFunction={closeModal}
                                    nextFunction={submitPersonalInfo}
                                    isFormSubmitting={isFormSubmitting}
                                    formNumber={'1'}
                                    formHeading={'Personal Information'}
                                />
                                <Form rules={personalFormFields}
                                    formData={personalInfoForm}
                                    handleTextChange={handlePersonalInfoTextChange}
                                    handleDropdownChange={handlePersonalInfoDropdown}
                                    formErrors={formErrors}
                                    saveForm={submitPersonalInfo} />
                            </View>
                        </View>
                    )
                    break;
                case 2: {
                    return (
                        <View style={styles.form}>
                            <View>
                                <FormHeader backFunction={() => setStep((prev) => prev - 1)}
                                    nextFunction={submitEducationalInfo}
                                    isFormSubmitting={isFormSubmitting}
                                    formNumber={'2'}
                                    formHeading={'Educational Qualifications'}
                                />
                                <Form rules={educationalFormFields}
                                    formData={educationalInfoFormData}
                                    handleTextChange={handleEducationalInfoTextChange}
                                    formErrors={formErrors}
                                    selectFile={selectMarksheets}
                                    saveForm={submitEducationalInfo}
                                    isUploading={isUploading}
                                    createPreview={createPreview} />
                            </View>
                        </View>
                    )
                    break;
                }
                case 3: {
                    return (
                        <View style={styles.form}>
                            <View>
                                <FormHeader backFunction={() => setStep((prev) => prev - 1)}
                                    nextFunction={submitPanInfo}
                                    isFormSubmitting={isFormSubmitting}
                                    formNumber={'3'}
                                    formHeading={'PAN Card Details'}
                                />
                                <Form rules={panFormFields}
                                    formData={panInfoData}
                                    handleTextChange={handlePanInfoTextChange}
                                    selectFile={selectPAN}
                                    formErrors={formErrors}
                                    saveForm={submitPanInfo}
                                    isUploading={isUploading}
                                    createPreview={createPreview}
                                />
                            </View>
                        </View>
                    )
                    break;
                }
                case 4: {
                    return (
                        <View style={styles.form}>
                            <View>
                                <FormHeader backFunction={() => setStep((prev) => prev - 1)}
                                    nextFunction={submitAadharInfo}
                                    isFormSubmitting={isFormSubmitting}
                                    formNumber={'4'}
                                    formHeading={'Aadhar Card Details'}
                                />
                                <Form rules={aadharFormFields}
                                    formData={aadharInfoData}
                                    handleTextChange={handleAadharInfoTextChange}
                                    selectFile={selectAadhar}
                                    formErrors={formErrors}
                                    saveForm={submitAadharInfo}
                                    isUploading={isUploading}
                                    createPreview={createPreview}
                                />
                            </View>
                        </View>
                    )
                    break;
                }
                case 5: {
                    return (
                        <View style={styles.form}>
                            <View>
                                <FormHeader backFunction={() => setStep((prev) => prev - 1)}
                                    nextFunction={submitAgreementInfo}
                                    isFormSubmitting={isFormSubmitting}
                                    formNumber={'5'}
                                    formHeading={'Agreement Form'}
                                />

                                <Form rules={agreementFormFields}
                                    formData={agreementInfoData}
                                    selectFile={selectAgreement}
                                    formErrors={formErrors}
                                    saveForm={submitAgreementInfo}
                                    isUploading={isUploading}
                                    isDownloading={isDownloading}
                                    setIsDownloading={setIsDownloading}
                                    createPreview={createPreview}
                                />
                            </View>
                        </View>
                    )
                }
                case 6: {
                    return (
                        <View style={styles.form}>
                            <View>
                                <FormHeader backFunction={() => setStep((prev) => prev - 1)}
                                    nextFunction={submitFinancialInfo}
                                    isFormSubmitting={isFormSubmitting}
                                    formNumber={'6'}
                                    formHeading={'Financial Information'}
                                />
                                <Form rules={financialFormFields}
                                    handleTextChange={handleFinancialInfoTextChange}
                                    formData={financialInfoData}
                                    selectFile={selectFinancial}
                                    formErrors={formErrors}
                                    saveForm={submitFinancialInfo}
                                    isUploading={isUploading}
                                    createPreview={createPreview}
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
                                <TouchableOpacity style={styles.button}>
                                    <Text>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
            }
        }

        const openFormsModal = () => {
            setStep(1);
            setIsModalVisible(true);
        }

        const openPreviewModal = () => {
            setIsPreviewVisible(true);
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
            navigation.replace('Login');
        }

        const handleLogout = () => {
            setIsLoggingOut(true);
            let url = `${BASE_ONBOARD_URL}/logout`;
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
                    if (response.data.status.statusCode === 1) {
                        console.log(JSON.stringify(response.data));
                        logout();
                        setIsLoggingOut(false);
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
                        setIsLoggingOut(false);
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
                    setIsLoggingOut(false);
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
            let url = `${BASE_ONBOARD_URL}/landing`;
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
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
        }


        const createPreview = (data) => {
            if (data.type === 'image/jpeg') {
                setIsPreviewLoading(true);
                setImageResource(data.path);
                setIsPreviewVisible(true);
            }
            else if (data.type === 'application/pdf') {
                setIsPreviewLoading(true);
                setPdfResource({
                    uri: data.path,
                    cache: true
                });
                console.log("Path is:", data.path);
                setIsPreviewVisible(true);
            }
            else {
                showToast('Please select a valid file type', 'normal');

            }
        }

        const closePreviewModal = () => {
            console.log("closed Preview");
            setImageResource('');
            setPdfResource(null);
            setIsPreviewVisible(false);
        }

        useEffect(() => {
            setTimeout(() => {
                setProgress(userDashboardInfo["Percentage Complete"] / 100);
            }, 500);
            console.log("useEffect Loaded");
            console.log("Form fields Fetched?", `${formFields.personalDetails ? "TRUE" : "FALSE"}`);
            // console.log("Form fields Fetched?", `${formFields.personalDetails}`);
        }, [userDashboardInfo]);

        return (
            <SafeAreaView style={styles.container}>
                <Modal visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)} animationType='slide'>
                    <View style={{ flex: 1, paddingVertical: hp(1.8), paddingHorizontal: wp(4) }}>
                        <View style={{
                            width: wp(92),
                            height: hp(100),
                        }}>
                            {renderFormStep()}
                        </View>
                    </View>
                    <Toast ref={toastRef} />
                </Modal>

                <Modal visible={isPreviewVisible}
                    onRequestClose={closePreviewModal} animationType='slide'>
                    <View style={{ flex: 1, paddingVertical: hp(1.8), paddingHorizontal: wp(4) }}>
                        <View style={{
                            width: wp(92),
                            height: hp(100),
                        }}>
                            <TouchableOpacity onPress={closePreviewModal} style={{ alignSelf: 'flex-end', marginBottom: hp(1) }}>
                                <Ionicons size={hp(3)} name={'close-circle-outline'} color={"#6237a0"} />
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                {imageResource !== '' &&
                                    <>
                                        {isPreviewLoading && <ActivityIndicator color={COLORS.primary} size={'large'} style={{}} />}
                                        <Image
                                            source={{ uri: imageResource }}
                                            style={styles.image}
                                            onLoad={() => {
                                                setIsPreviewLoading(false);
                                            }}
                                        />
                                    </>}

                                {pdfResource &&
                                    <>
                                        <View style={{ backgroundColor: '#ccc', padding: hp(1), borderRadius: hp(0.5), alignItems: 'center' }}>

                                            {isPreviewLoading && <ActivityIndicator color={"#6237a0"} size={"large"} style={{}} />}
                                            <Pdf
                                                trustAllCerts={false}
                                                source={pdfResource}
                                                style={styles.pdf}
                                                onLoadComplete={(numberOfPages, filePath) => {
                                                    console.log(`loaded ${numberOfPages}`);
                                                    setIsPreviewLoading(false);
                                                }}
                                                onError={(error) => {
                                                    console.log(`Error Here:`, error);
                                                }}
                                            />
                                        </View>
                                    </>}
                            </View>
                        </View>
                    </View>
                </Modal>

                <StatusBar barStyle={'dark-content'} backgroundColor={'#f2e6ff'} />
                <View style={{ backgroundColor: '#f2e6ff', borderBottomLeftRadius: hp(8), paddingHorizontal: wp(5), borderBottomRightRadius: hp(8), height: hp(26), justifyContent: 'center' }}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.welcomeText}>Welcome</Text>
                        <Text style={{ textTransform: 'capitalize', ...styles.username }}>{userDashboardInfo.firstName ? userDashboardInfo.firstName : 'User'}!</Text>
                    </View>
                    <View style={styles.progressSection}>
                        <View style={styles.progressText}>
                            <Text style={{ fontSize: hp(1.8), lineHeight: hp(2.5) }}>
                                Ready to dive into your new role? Let's streamline your onboarding by completing your profile.
                            </Text>
                            <Text style={{ fontSize: hp(1.8) }}>

                            </Text>
                        </View>
                        <View>
                            <Progress.Circle
                                showsText={true}
                                thickness={hp(1.8)}
                                textStyle={{
                                    fontSize: hp(2.6),
                                    fontWeight: '600'
                                }}
                                color='#330066'
                                borderWidth={1}
                                strokeCap='round'
                                progress={progress}
                                size={hp(16)} />
                        </View>
                    </View>
                </View>
                <View style={styles.uploadContainer}>
                    <Text style={{ fontSize: hp(1.9), fontWeight: '500' }}>
                        Complete Required Details
                    </Text>
                    <View>
                        <TouchableOpacity onPress={openFormsModal} style={styles.uploadButton}>
                            <Text style={{ color: 'white', paddingHorizontal: wp(2), fontSize: hp(1.8) }}>UPLOAD</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <ScrollView>
                        <RectangleCard title={'Personal Information'} isComplete={userDashboardInfo['Personal Information']} />
                        <RectangleCard title={'Educational Qualifications'} isComplete={userDashboardInfo['Education Details']} />
                        <RectangleCard title={'PAN Card Details'} isComplete={userDashboardInfo["Pan Card"]} />
                        <RectangleCard title={'Aadhar Card Details'} isComplete={userDashboardInfo["Aadhar Card"]} />
                        <RectangleCard title={'Agreement Form'} isComplete={userDashboardInfo["Agreement"]} />
                        <RectangleCard title={'Financial Information'} isComplete={userDashboardInfo["Bank Details"]} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp(2.5), backgroundColor: '#fff', marginVertical: hp(1), alignItems: 'center', paddingBottom: hp(5) }}>
                            {isLoggingOut ? (<View style={{ height: hp(6), width: wp(45), justifyContent: 'center' }}>
                                <ActivityIndicator size={'large'} color={"#6237a0"} />
                            </View>) : (
                                <TouchableOpacity onPress={handleLogout} style={{
                                    backgroundColor: '#330066', height: hp(6), borderRadius: hp(1.5), width: wp(45), justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white', alignSelf: 'center', fontSize: hp(1.8) }}>LOGOUT</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity onPress={() => navigation.replace('Waiting')} style={{
                                backgroundColor: '#330066', height: hp(6), borderRadius: hp(1.5), width: wp(45), justifyContent: 'center'
                            }}>
                                <Text style={{ color: 'white', alignSelf: 'center', fontSize: hp(1.8) }}>PROCEED</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            flex: 1
        },
        progressText: {
            width: "60%"
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
            paddingVertical: 12,
            marginVertical: 10,
            paddingHorizontal: 30,
            justifyContent: 'space-between'
        },
        uploadContainer: {
            flexDirection: 'row',
            borderRadius: hp(2),
            alignItems: 'center',
            paddingHorizontal: wp(4),
            justifyContent: 'space-between',
            height: hp(10), backgroundColor: '#fff'
        },
        listItemButton: {
            backgroundColor: COLORS.primary,
            backgroundColor: 'red',
            padding: 8,
            borderRadius: 6
        },
        uploadButton: {
            backgroundColor: '#330066',
            height: hp(5),
            alignItems: 'center', justifyContent: "center",
            width: wp(28),
            borderRadius: hp(1.5),
        },
        progressSection: {
            justifyContent: 'space-between',
            width: wp(90),
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
        },
        listContainer: {
            width: wp(100),
            height: hp(60),
            backgroundColor: '#fff',
        },
        welcomeText: {
            color: COLORS.secondary,
            fontSize: hp(2.5),
            marginRight: wp(1),
        },
        username: {
            color: '#6237a0',
            fontSize: hp(4),
            fontWeight: '600',
        },
        headingContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            // marginBottom: hp(1.5)
        },
        formTitle: {
            fontSize: 25,
            marginTop: 4,
            color: COLORS.primary
        },
        formButtonsContainer: {
            flexDirection: 'row', width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: 10
        },
        form: {
            justifyContent: 'space-between',
            height: hp(100)
        },
        input: {
            marginBottom: 15,
            backgroundColor: 'white',
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
        pdf: {
            width: wp(80),
            height: hp(80),
            backgroundColor: '#ccc',
            justifyContent: 'center'
        },
        image: {
            width: '100%', // Set the desired width
            height: '80%', // Set the desired height
            resizeMode: 'contain', // or 'contain' for different resize modes
            borderRadius: 10, // Optional: Add borderRadius for a rounded image
        },
        button: {
            width: '100%',
            backgroundColor: '#6237A0',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            borderRadius: 12
        },
    })