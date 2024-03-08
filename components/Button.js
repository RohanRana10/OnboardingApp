import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'

export default function Button(props) {
    const filledBgColor = props.color || COLORS.primary;
    const outlineColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlineColor;
    const textColor = props.filled ? COLORS.white : COLORS.primary;
    
    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style
            }}
            onPress={props.onPress}>
            <Text style={{ fontSize: 18, ...{color: textColor} }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        // paddingBottom: 16,
        paddingVertical: 10,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
