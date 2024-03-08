import { Animated, Easing } from "react-native";

let rotateValueHolder = new Animated.Value(0);

const startImageRotateFunction = (duration, value) => {
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
        toValue: value,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: false,
    }).start(() => startImageRotateFunction(duration));
};

const rotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
});

export {
    startImageRotateFunction,
    rotateData
}