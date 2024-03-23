import { View, Modal, Text, StyleSheet, Platform, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import COLORS from '../constants/colors';
import * as Progress from 'react-native-progress';
import Button from '../components/Button';
import RectangleCard from '../components/RectangleCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { UserContext } from '../context/userContext';
import { BASE_URL } from '../utils/APIConstants';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import Form from '../components/Form';
import FormHeader from '../components/FormHeader';
import Pdf from 'react-native-pdf';
import Toast from "react-native-toast-notifications";
import { useRef } from 'react';

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
            if (rule.field === 'TEXT_INPUT' && rule.data.isRequired && !formData[rule.data.name] || rule.field === 'TEXT_INPUT' && rule.data.maxLength && formData[rule.data.name] && rule.data.maxLength < formData[rule.data.name].length || rule.field === 'UPLOAD_BUTTON' && rule.data.isRequired && !formData[rule.data.name] || rule.field === 'DROPDOWN' && rule.data.isRequired && !formData[rule.data.name]) {
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
            showToast('Please enter a valid email','success');
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
                });

        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message")
        }
    }

    const submitEducationalInfo = () => {
        console.log("Educational info submitted!");
        setIsFormSubmitting(true);
        if (ValidateForm(educationalFormFields, educationalInfoFormData)) {
            let url = `${BASE_URL}/update-education`
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
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Educational Information updated', 'success');
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
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Aadhar Information updated',"success");
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again later',"normal");

                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again later',"normal");

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
                    if (response.data.status.statusCode === 1) {
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Agreement Information updated',"success");
                        setStep((prev) => prev + 1);
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again',"normal");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again',"normal");

                });
        } else {
            setIsFormSubmitting(false);
            console.log("Check Alert Message");
        }
    }

    const submitFinancialInfo = () => {
        console.log("Financial info submitted!");
        setIsFormSubmitting(false);
        if (ValidateForm(financialFormFields, financialInfoData)) {
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
                        setIsFormSubmitting(false);
                        fetchUserDashboard();
                        showToast('Financial Information updated',"success");
                        closeModal();
                    }
                    else {
                        setIsFormSubmitting(false);
                        showToast('Please try again',"normal");

                    }
                })
                .catch((error) => {
                    console.log(error);
                    setIsFormSubmitting(false);
                    showToast('Please try again',"normal");

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
            if (!document.canceled) {
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
                        console.log(path);
                        fileInfo.path = path;
                        setEducationalInfoFormData({ ...educationalInfoFormData, [name]: fileInfo });
                        showToast('Upload successful','success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again','normal');
                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
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
                        setPanInfoData({ ...panInfoData, [name]: fileInfo, path: path, name: name });
                        showToast('Upload Successful','success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again','normal');

                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
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
                        setAadharInfoData({ ...aadharInfoData, [name]: fileInfo, path: path, name: name });
                        showToast('Upload Successful','success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again','normal');
                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
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
                        showToast('Upload Successful','success');

                        
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again','normal');

                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
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
                        console.log(path);
                        fileInfo.path = path;
                        setFinancialInfoData({ ...financialInfoData, [name]: fileInfo });
                        showToast('Upload Successful','success');
                    })
                    .catch((error) => {
                        setIsUploading(false);
                        console.log(error);
                        showToast('Please try uploading again','normal');
                    });
            }
            else {
                setIsUploading(false);
                console.log("Returning without file");
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
            showToast('Please select a valid file type','normal');

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
                <Toast ref={toastRef} />
            </Modal>

            <Modal visible={isPreviewVisible}
                onRequestClose={closePreviewModal} animationType='slide'>
                <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
                    <View style={{
                        width: '100%',
                        height: '100%',
                    }}>
                        <TouchableOpacity onPress={closePreviewModal} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                            <Ionicons size={25} name={'close-circle-outline'} color={COLORS.primary} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            {imageResource !== '' &&
                                <>
                                    {isPreviewLoading && <ActivityIndicator color={COLORS.primary} size={40} style={{}} />}
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
                                    <View style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 10 }}>

                                        {isPreviewLoading && <ActivityIndicator color={COLORS.primary} size={40} style={{}} />}
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
        
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 8
    },
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
        paddingVertical: 12,
        marginVertical: 10,
        paddingHorizontal: 30,
        justifyContent: 'space-between'
    },
    uploadContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#A6E0FF',
        borderRadius: 10,
        alignItems: 'center',
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
    },
    listContainer: {
        width: '100%',
        height: '51%',
        marginTop: 10,
    },
    welcomeText: {
        color: COLORS.secondary,
        fontSize: 30,
        marginRight: 5,
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
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    form: {
        justifyContent: 'space-between',
        height: '100%'
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
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height,
        backgroundColor: '#ccc'
    },
    image: {
        width: '100%', // Set the desired width
        height: '80%', // Set the desired height
        resizeMode: 'contain', // or 'contain' for different resize modes
        borderRadius: 10, // Optional: Add borderRadius for a rounded image
    },
})