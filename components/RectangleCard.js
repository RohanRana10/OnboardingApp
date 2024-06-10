import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function RectangleCard({ title, isComplete }) {
    return (
        <View style={styles.listItem}>
            <Text style={{
                fontSize: hp(2)
            }}>
                {title}
            </Text>
            <View>
                {isComplete ? <MaterialIcons name="task-alt" size={hp(2.8)} color="#07da63" /> : <Entypo name="circle-with-cross" size={hp(2.8)} color="red" />}
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        // backgroundColor: '#A6E0FF',
        borderRadius: hp(3),
        marginHorizontal: wp(2.5),
        alignItems: 'center',
        // width: '100%',
        // paddingVertical: 15,
        height: hp(6.5),
        marginVertical: hp(1.2),
        paddingHorizontal: wp(4),
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        shadowColor: "black",
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: hp(0.5),
    },
})