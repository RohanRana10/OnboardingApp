import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Others', value: 'others' }
];

const DropdownComponent = () => {
    const [value, setValue] = useState(null);
    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            value={value}
            onChange={item => {
                setValue(item.value);
            }}
            renderItem={renderItem}
        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        marginHorizontal: 1,
        marginBottom: 15,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 0.4,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
});