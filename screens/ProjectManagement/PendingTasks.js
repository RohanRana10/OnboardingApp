import { FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_PROJECT_URL } from '../../utils/APIConstants';
import { UserContext } from '../../context/userContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function PendingTasks() {
    const context = useContext(UserContext);
    const { user } = context;
    const navigation = useNavigation();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [pendingTasks, setPendingTasks] = useState([]);

    const getProject = (taskId) => {
        navigation.navigate('Task', { taskId: taskId });
    }

    const fetchPendingSubtasks = () => {
        setLoading(true);
        let url = `${BASE_PROJECT_URL}/pending-subtasks`
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
                setLoading(false);
                console.log(JSON.stringify(response.data.data));
                setPendingTasks(response.data.data);
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
                setLoading(false);
            });
    }

    // useEffect(() => {
    //     fetchPendingSubtasks();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPendingSubtasks();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            {loading ? (<View style={{ height: hp(95), justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{
                    width: wp(20),
                    height: wp(20),
                }} source={require('../../assets/New.gif')} />
            </View>) : (<View>
                <Text style={styles.heading}>Pending Tasks</Text>
                {(pendingTasks == null || pendingTasks?.length == 0) ? (<View style={{ width: wp(100), height: hp(90), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 400, fontSize: hp(1.8) }}>No Pending Tasks found!</Text>
                    <Image source={require('../../assets/Images/Logo.png')} style={{ marginTop: hp(1.5), width: wp(18), height: wp(18) }} />
                </View>) : (
                    <View style={{ paddingTop: hp(1), paddingHorizontal: wp(2) ,height: hp(85), backgroundColor: '#fff'}}>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: hp(5),}}
                            data={pendingTasks}
                            // style={{ flexGrow: 1 }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => getProject(item.taskId)} style={{ borderRadius: hp(2), elevation: 3, marginBottom: hp(1), paddingVertical: hp(1.8), shadowColor: 'black', backgroundColor: 'white', paddingHorizontal: wp(4), marginTop: hp(0.6), marginHorizontal: wp(2) }}>
                                    <Text style={{ color: '#6237a0', fontWeight: '500', fontSize: hp(2), marginBottom: hp(1) }}>{item.title}</Text>
                                    <View style={{}}>
                                        <Text style={{ fontSize: hp(2), fontWeight: 300 }}><Text style={{ color: 'gray' }}>Project:</Text> {item.projectTitle}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                                            <MaterialCommunityIcons name="calendar-clock-outline" size={hp(2.8)} color="red" />
                                            <Text style={{ marginLeft: wp(1.5), fontWeight: 'bold' , fontSize: hp(1.6)}}>{item.endDate}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>)}
            </View>)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp(95),
        paddingVertical: hp(2),
        backgroundColor: '#fff'
    },
    heading: {
        color: '#6237A0',
        fontSize: hp(3),
        fontWeight: 'bold',
        paddingHorizontal: wp(4),
        height: hp(5),
    },
})