import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = ({ onPress, title, style } : { onPress: any, title : string, style: any }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    appButtonContainer: {
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
      },
      appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
});

export default CustomButton;