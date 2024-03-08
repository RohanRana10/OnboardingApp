import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'

export default function RectangleCard({ title, isComplete }) {
    return (
        <View style={styles.listItem}>
            <Text style={{
                fontSize: 16
            }}>
                {title}
            </Text>
            <View>
                <View style={{...styles.listItemButton, backgroundColor: isComplete ? 'green' : 'red'}}>
                    <Text style={{ color: 'white' }}>{isComplete ? 'Complete' : 'Incomplete'}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        backgroundColor: '#A6E0FF',
        borderRadius: 10,
        alignItems: 'center',
        // width: '100%',
        paddingVertical: 12,
        marginVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    listItemButton: {
        backgroundColor: COLORS.primary,
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 6
    },
})