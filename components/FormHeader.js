import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function FormHeader(props) {
    let backFunction = props.backFunction;
    let nextFunction = props.nextFunction;
    let isFormSubmitting = props.isFormSubmitting;
    let formNumber = props.formNumber;
    let formHeading = props.formHeading;
    return (
        <View style={{backgroundColor: '#fff'}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: hp(5) }}>
                <TouchableOpacity onPress={backFunction} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons size={25} name={'arrow-back-circle-outline'} color={'#6237a0'} />
                    <Text style={{ color: '#6237a0', marginLeft: wp(1), fontSize: hp(1.8) }}>Back</Text>
                </TouchableOpacity>
                {isFormSubmitting ?
                    <>
                        <ActivityIndicator color={'#6237a0'} size={25} style={{ marginRight: hp(2) }} />
                    </> :
                    <>
                        <TouchableOpacity onPress={nextFunction} style={{ flexDirection: 'row', alignItems: 'center', fontSize: hp(1.8) }}>
                            <Text style={{ color: '#6237a0', marginRight: wp(1), fontSize: hp(1.8) }}>Save & Next</Text>
                            <Ionicons size={25} name={'arrow-forward-circle-outline'} color={'#6237a0'} />
                        </TouchableOpacity>
                    </>
                }
            </View>
            <View style={{backgroundColor: '#fff'}}>
                <Text style={{ fontSize: hp(1.8) }}>{`Form (${formNumber}/6)`}</Text>
                <Text style={styles.formTitle}>
                    {formHeading}
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: hp(3),
        marginTop: hp(1),
        color: '#330066'
    },
})