import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'
import { Entypo, MaterialIcons } from '@expo/vector-icons'

export default function RectangleCard({ title, isComplete }) {
    return (
        <View style={styles.listItem}>
            <Text style={{
                fontSize: 15
            }}>
                {title}
            </Text>
            <View>
                {/* <View style={{...styles.listItemButton, backgroundColor: isComplete ? 'green' : 'red'}}>
                    <Text style={{ color: 'white' }}>{isComplete ? 'Complete' : 'Incomplete'}</Text>
                </View> */}
                {isComplete ? <MaterialIcons name="task-alt" size={28} color="#07da63" /> : <Entypo name="circle-with-cross" size={28} color="red" />}
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        // backgroundColor: '#A6E0FF',
        borderRadius: 10,
        marginHorizontal: 12,
        alignItems: 'center',
        // width: '100%',
        paddingVertical: 15,
        marginVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: "black",
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
    listItemButton: {
        backgroundColor: COLORS.primary,
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 6
    },
})