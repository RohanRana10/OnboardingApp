import React from 'react';
import { View, Button, TouchableOpacity, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Platform } from 'react-native';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function DownloadPDFButton({ pdfUrl, name, setIsDownloading }) {

    const downloadFromUrl = async () => {
        setIsDownloading(true);
        const filename = name;
        const result = await FileSystem.downloadAsync(
            pdfUrl,
            FileSystem.documentDirectory + filename
        );
        let type = result.headers['content-type'].split(';')[0].trim();
        console.log("uri:", result.uri);
        console.log("result:", result);
        console.log("filename:", filename);
        saveFile(result.uri, filename, type);
    };

    const saveFile = async (uri, filename, mimetype) => {
        console.log("mimetype:", mimetype);
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                        Alert.alert('Success', "Download successful!");
                        setIsDownloading(false);
                    })
                    .catch((e) => {
                        console.log(e);
                        setIsDownloading(false);
                    });
            } else {
                setIsDownloading(false);
                shareAsync(uri);
            }
        } else {
            setIsDownloading(false);
            shareAsync(uri);
        }
    };


    return (
        <View style={{alignSelf: 'center'}}>
            <TouchableOpacity style={{ width: wp(92), borderRadius: hp(1), borderWidth: hp(0.2), borderColor: "#6237a0", height: hp(5), justifyContent: 'center', alignItems: 'center', marginBottom: hp(2) }} onPress={downloadFromUrl}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Ionicons size={hp(3)} name={'download-outline'} color={"#6237a0"} />
                    <Text style={{ color: "#6237a0", marginLeft: 5, fontSize: hp(1.8) }}>DOWNLOAD AGREEMENT FORM</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
