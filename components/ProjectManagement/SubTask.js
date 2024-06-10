import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { UserContext } from '../../context/userContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function SubTask({ item, index, onComponentOpen, onEdit, onDelete, toggle }) {
    const ref = useRef();

    const context = useContext(UserContext);
    const { user, isAdmin } = context;

    const rightSwipe = (subtask) => {
        return (
            <View style={{ justifyContent: 'center', backgroundColor: '#fff', marginBottom: hp(0), flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                    onEdit(subtask);
                    ref.current.close();
                }} style={{ backgroundColor: '#3d7bed', marginLeft: wp(4), width: wp(12), height: wp(12), alignItems: 'center', justifyContent: 'center', borderRadius: hp(50) }}>
                    <AntDesign name="edit" size={hp(2.8)} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        "Confirmation",
                        "Are you sure you want to delete this sub-task?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "OK",
                                onPress: () => { onDelete(subtask.id); ref.current.close() }
                            }
                        ]
                    );
                }} style={{ backgroundColor: 'red', marginLeft: wp(4), width: wp(12), height: wp(12), alignItems: 'center', justifyContent: 'center', borderRadius: hp(50) }}>
                    <AntDesign name="delete" size={hp(2.8)} color="white" />
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        if (item.opened == false) {
            ref.current.close();
        }
    })
    return (
        <Swipeable ref={ref} renderRightActions={() => (isAdmin || user.roles.includes("manager")) ? rightSwipe(item) : null} onSwipeableOpen={() => { onComponentOpen(index); console.log('open') }}>
            {/* toggle(item.id, item.status) */}
            <TouchableOpacity onPress={() => {
                Alert.alert(
                    "Confirmation",
                    `Are you sure you want to mark this task as ${item.status ? "incomplete" : "complete"}?`,
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: () => { toggle(item.id, !item.status) }
                        }
                    ]
                )
            }} style={{ borderRadius: hp(2), elevation: hp(0.5), marginBottom: hp(1), marginHorizontal: wp(1), paddingVertical: hp(1.8), shadowColor: 'black', backgroundColor: 'white', paddingHorizontal: wp(4), marginTop: hp(1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ width: wp(62) }}>
                        <Text style={{ color: '#6237a0', fontWeight: 500, fontSize: hp(1.8) }}>{item.title}</Text>
                        <Text style={{ marginTop: hp(0.5), color: 'gray', fontSize: hp(1.6) }}>{item.description}</Text>
                    </View>
                    {item.status ? <MaterialIcons name="task-alt" size={hp(3)} color="#07da63" /> : <Entypo name="circle-with-cross" size={hp(3)} color="red" />}
                </View>
            </TouchableOpacity>
        </Swipeable>
    )
}

const styles = StyleSheet.create({})