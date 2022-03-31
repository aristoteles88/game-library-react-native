import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'

const finishedIcon = <Icon name="check-circle-outline" size={36} color="#0F0B" />

const FlatListComponent = ({ data }) => {

    const gameData = data.item

    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => navigation.navigate('GameForm', {gameData: gameData, name: "Editando jogo"})}>
            <View style={styles.container}>
                <Image source={{ uri: gameData.image ? gameData.image : null }} resizeMode="contain" style={{ width: 60, height: 90 }}/>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal: 28, width: "75%"}}>
                    <View style={{justifyContent: "space-between",}}>
                        <Text adjustsFontSizeToFit={true} style={[styles.flatListItemText, {fontWeight: "bold", fontSize: 22, maxWidth: 230 }] }>{gameData.name}</Text>
                        <Text style={styles.flatListItemText}>{gameData.category}</Text>
                        <Text style={styles.flatListItemText}>{gameData.platform}</Text>
                        
                    </View>
                    <View style={{justifyContent: "space-between",}}>
                        <Text style={[styles.flatListItemText, {fontWeight: "bold", fontSize: 22, marginStart: 5 }]}>{gameData.score.toString()}</Text>
                        <Text style={styles.flatListItemText}>{gameData.isFinished ? finishedIcon : null}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        height: 110,
        backgroundColor: "#5098",
        flexDirection: "row",
    },
    flatListItemText: {
        color: "white"
    }
})
export default FlatListComponent