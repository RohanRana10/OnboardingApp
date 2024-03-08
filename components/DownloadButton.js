import React from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Platform } from 'react-native';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function DownloadPDFButton({ pdfUrl, name }) {

    const downloadFromUrl = async () => {
        const filename = name;
        const result = await FileSystem.downloadAsync(
            pdfUrl,
            FileSystem.documentDirectory + filename
        );
        let type = result.headers['content-type'].split(';')[0].trim();
        console.log(type);
        saveFile(result.uri, filename, type);
    };

    const saveFile = async (uri, filename, mimetype) => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    })
                    .catch(e => console.log(e));
            } else {
                shareAsync(uri);
            }
        } else {
            shareAsync(uri);
        }
    };


    return (
        <View>
            <TouchableOpacity style={{ width: '100%', borderRadius: 8, borderWidth: 1.2, borderColor: COLORS.primary, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }} onPress={downloadFromUrl}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Ionicons size={20} name={'download-outline'} color={COLORS.secondary} />
                    <Text style={{ color: COLORS.secondary, marginLeft: 5 }}>DOWNLOAD AGREEMENT FORM</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
