import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View,StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function TeamList() {
    const navigation = useNavigation();

    let sampleTeamMembers = [
        {
            "name": "Miss Catherine Watts",
            "email": "catherine.watts@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/women/39.jpg"
        },
        {
            "name": "Miss Irmelin Søyland",
            "email": "irmelin.soyland@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/women/68.jpg"
        },
        {
            "name": "Mr پوریا حیدری",
            "email": "pwry.hydry@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/men/18.jpg"
        },
        {
            "name": "Mr Hans-Jochen Henze",
            "email": "hans-jochen.henze@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/men/25.jpg"
        },
        {
            "name": "Mrs Bonnie Jimenez",
            "email": "bonnie.jimenez@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/women/27.jpg"
        },
        {
            "name": "Mr Necati Kunter",
            "email": "necati.kunter@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/men/95.jpg"
        },
        {
            "name": "Miss Mayya Galchenko",
            "email": "mayya.galchenko@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/women/15.jpg"
        },
        {
            "name": "Mrs Emeline Leroux",
            "email": "emeline.leroux@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/women/74.jpg"
        },
        {
            "name": "Mr Gerardo Soto",
            "email": "gerardo.soto@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/men/34.jpg"
        },
        {
            "name": "Mr César Murillo",
            "email": "cesar.murillo@example.com",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/men/21.jpg"
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => navigation.goBack()}>
                <Text style={{ fontSize: 15, fontWeight: '300' }}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.heading}>My Team</Text>
            <View style={{ marginTop: 12, height: '90%' }}>
                <FlatList data={sampleTeamMembers}
                    keyExtractor={(item) => item.email}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                <Image source={{ uri: item.thumbnail }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                <View>
                                    <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: '600' }}>{item.name}</Text>
                                    <Text style={{ fontSize: 14, marginLeft: 10, color: 'gray', fontWeight: '300' }}>{item.email}</Text>
                                </View>
                            </View>
                        </View>
                    )} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 18,
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: 24,
        fontWeight: 'bold',

    },
})