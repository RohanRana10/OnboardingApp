import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function FormHeader(props) {
    let backFunction = props.backFunction;
    let nextFunction = props.nextFunction;
    let isFormSubmitting = props.isFormSubmitting;
    let formNumber = props.formNumber;
    let formHeading = props.formHeading;
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <TouchableOpacity onPress={backFunction} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, marginLeft: 3 }}>Back</Text>
                </TouchableOpacity>
                {isFormSubmitting ?
                    <>
                        <ActivityIndicator color={COLORS.primary} size={25} style={{ marginRight: 10 }} />
                    </> :
                    <>
                        <TouchableOpacity onPress={nextFunction} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: COLORS.primary, marginRight: 5 }}>Save & Next</Text>
                            <Ionicons size={25} name={'arrow-forward-circle-outline'} color={COLORS.primary} />
                        </TouchableOpacity>
                    </>
                }
            </View>
            <Text>{`Form (${formNumber}/6)`}</Text>
            <Text style={styles.formTitle}>
                {formHeading}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 25,
        marginTop: 4,
        color: COLORS.primary
    },
})