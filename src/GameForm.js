import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from "react-native"
import CheckBox from '@react-native-community/checkbox';

import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import DropDownPicker from "react-native-dropdown-picker";

import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'

const serverHost = (Platform.OS) === "ios" ? "localhost" : "10.0.2.2"

const deleteIcon = <Icon name="delete" size={36} color="#F00B" />

const GameForm = ({ navigation }) => {

    const [id, setId] = useState(0)
    const [name, setName] = useState("")
    const [year, setYear] = useState("")
    const [score, setScore] = useState("")
    const [description, setDescription] = useState("")
    const [isFinished, setIsFinished] = useState(false)
    const [image, setImage] = useState("")

    const [openPlatformDialog, setOpenPlatformDialog] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState("Plataforma")

    const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("Categoria")


    const [platforms, setPlatforms] = useState([])
    const [categories, setCategories] = useState([{label: "Categoria", value: "Categoria"}])
    
    const route = useRoute()    
    const gameData = route.params.gameData

    const [addingGame, setAddingGame] = useState(true)


    const selectImageAlert = () => {
        Alert.alert(
            'Selecionar imagem',
            `Deseja selecionar a imagem da galeria ou da câmera?`,
            [
                {
                    text: "Cancelar",
                    onPress: null,
                    style: "cancel"
                }, 
                {
                    text: "Câmera",
                    onPress: () => launchCamera(saveToPhotos=true, (res) => {
                        setImage(res.assets[0].uri)
                    }),
                },
                {
                    text: "Galeria",
                    onPress: () => launchImageLibrary(saveToPhotos=true, (res) => {
                        setImage(res.assets[0].uri)
                    }),
                }
            ]
        )
    }

    const onSaveButtonPress = () => {
        if (addingGame){
            saveGame()
        } else { 
            updateGame()
        }
    }

    const saveGame = () => {
        if (name.trim() != "") {
            axios.post('http://' + serverHost + ':3000/games', {
            name: name,
            year: year,
            score: score,
            category: selectedCategory,
            platform: selectedPlatform,
            isFinished: isFinished,
            image: image,
            description:description,
            })
            .then( (res) => {
                alert("Jogo salvo com sucesso.")
                navigation.navigate("Home", { res })
            })
            .catch((erro) => alert("Erro: " + erro))
        } else {
            alert("O campo Título do Jogo deve ser preenchido.")
        }
      }

      const updateGame = () => {
        if (name.trim() != "") {
            axios.patch('http://' + serverHost + ':3000/games/' + id, {
                name: name,
                year: year,
                score: score,
                category: selectedCategory,
                platform: selectedPlatform,
                isFinished: isFinished,
                image: image,
                description:description,
            })
                .then((res) => {
                    alert("Jogo editado com sucesso!")
                    navigation.navigate("Home", { res })
                })
                .catch((erro) => alert("Erro: " + erro))
        } else {
            alert("O campo Titulo do Jogo deve ser preenchido.")
        }
    }

    const confirmGameDeletion = () => {
        Alert.alert(
            'Excluindo Jogo',
            `Deseja excluir o jogo ${name}?`,
            [
                {
                    text: "Cancelar",
                    onPress: null,
                    style: "cancel"
                }, 
                {
                    text: "Excluir",
                    onPress: deleteGame,
                    style: "destructive",
                }
            ]
        )
    }
    
      const deleteGame = () => {
        axios.delete('http://' + serverHost + ':3000/games/' + id)
          .then( (res) => {
            alert("Jogo deletado com sucesso.")
            navigation.navigate("Home", { res })
          })
          .catch((erro) => alert("Erro: " + erro))
      }


    useEffect(()=> {
        if (gameData !== null) {
            setId(gameData.id)
            setName(gameData.name)
            setYear(gameData.year)
            setScore(gameData.score)
            setSelectedCategory(gameData.category)
            setSelectedPlatform(gameData.platform)
            setImage(gameData.image)
            setIsFinished(gameData.isFinished)
            setDescription(gameData.description)
            setAddingGame(false)
        }
        axios.get('http://' + serverHost + ':3000/platform')
            .then((req) => {
                let tempPlatforms = []
                req.data.forEach((item) => tempPlatforms.push(item.platform))
                tempPlatforms = tempPlatforms.sort((a,b) => (a > b) ? 1 : -1)
                tempPlatforms.unshift("Todos")
                setPlatforms(tempPlatforms.map((item) => {return {label: item, value: item}}))
            })
            .catch((erro) => console.log(erro))
        axios.get('http://' + serverHost + ':3000/category')
            .then((req) => {
                const tempCategories = [{label: "Categoria", value: "Categoria"}]
                req.data.forEach((item) => tempCategories.push({label: item.category, value: item.category}))
                setCategories(tempCategories)
            })
            .catch((erro) => console.log(erro))
    }, [])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
            <TouchableOpacity 
                style={{borderWidth: 0, borderRadius: 5, height: 36, width: 36, alignItems: "center" }} 
                onPress={confirmGameDeletion}>
                {deleteIcon}
              </TouchableOpacity>
            ),
          })
        }
    )

    return (
        <View>
            <KeyboardAvoidingView>
            {/* behavior="padding"> */}
                <SafeAreaView height="100.82%">
                <ScrollView>
                    <View style={{alignItems: "center", marginTop: 10,}}>
                        <Image 
                            source={{ uri: image ? image : null }} 
                            resizeMode="contain" 
                            style={{ width: 200, height: 300, borderWidth: 1, borderColor: "#000", }}
                            />
                        <TouchableOpacity onPress={selectImageAlert} style={styles.pickPhotoButton}>
                            <Text style={{color: "#00F"}}>Escolher imagem</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.containerInputBox]}>
                        <Text>Título do Jogo</Text>
                        <TextInput 
                            style={[styles.inputBox]} 
                            value={name} 
                            placeholder="Jogo (Obrigatório)" 
                            placeholderTextColor={"#CCC"}
                            onChangeText={(text) => setName(text)}/>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={[styles.containerInputBoxSplit2First]}>
                            <Text>Ano de lançamento</Text>
                            <TextInput 
                                style={[styles.inputBox]} 
                                value={year} 
                                placeholder="YYYY" 
                                placeholderTextColor={"#CCC"} 
                                onChangeText={(text) => setYear(text)}/>
                        </View>
                        <View style={[styles.containerInputBoxSplit2Second]}>
                            <Text>Nota de avaliação</Text>
                            <TextInput 
                                style={[styles.inputBox]} 
                                value={score} 
                                placeholder="0.0" 
                                placeholderTextColor={"#CCC"} 
                                onChangeText={(text) => setScore(text)}/>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5}}>
                        <View style={{width: "45%"}}>
                            <Text>Plataforma</Text>
                            <DropDownPicker
                                open={openPlatformDialog}
                                value={selectedPlatform}
                                items={platforms}
                                setOpen={setOpenPlatformDialog}
                                setValue={setSelectedPlatform}
                            />
                        </View>
                        <View style={{width: "45%"}}>
                            <Text>Categoria</Text>
                            <DropDownPicker
                                open={openCategoryDialog}
                                value={selectedCategory}
                                items={categories}
                                setOpen={setOpenCategoryDialog}
                                setValue={setSelectedCategory}
                            />
                        </View>
                    </View>

                    <View style={[styles.containerCheckBox, {flexDirection: "row"}]}>
                        <CheckBox
                        value={isFinished}
                        onValueChange={setIsFinished}
                        />
                        <Text style={{marginStart: 10}}>Finalizado</Text>
                    </View>

                    <View style={[styles.containerInputBox]}>
                        <Text>Descrição</Text>
                        <TextInput 
                            style={[styles.inputBox, {height: 210, fontSize: 16, textAlignVertical: "top"}]} 
                            value={description} 
                            multiline={true} 
                            numberOfLines={5} 
                            placeholder="Insira uma descrição para o jogo" 
                            onChangeText={(text) => setDescription(text)}/>
                    </View>
                </ScrollView>
                
                <View style={{position: 'relative', bottom: 0, left: 0, right: 0, height: 64}}>
                    <TouchableOpacity style={[styles.saveButton]} onPress={onSaveButtonPress}>
                        <Text style={{color: "#FFF", fontSize: 22, fontWeight: "bold", textAlign: "center"}}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
            
        </View>
    )
}

const styles = StyleSheet.create({
    inputBox:{
        borderRadius: 10,
        borderWidth: 1,
        height: 50,
        fontSize: 28,
        padding: 8,
        backgroundColor: "#FFF",
    },
    containerInputBox: {
        alignContent: "center",
        justifyContent: "center",
        width: "94%",
        marginHorizontal: "3%",
        marginVertical: 5,
    },
    containerInputBoxSplit2First: {
        alignContent: "center",
        justifyContent: "center",
        width: "45%",
        marginStart: "3%",
        marginEnd: "2%",
        marginVertical: 5,
    },
    containerInputBoxSplit2Second: {
        alignContent: "center",
        justifyContent: "center",
        width: "45%",
        marginStart: "2%",
        marginEnd: "3%",
        marginVertical: 5,
    },
    pickPhotoButton: {
        alignItems: "center", 
        marginTop: 10, 
        borderRadius: 5, 
        borderWidth: 1, 
        backgroundColor: "#00F2", 
        padding: 10,
    },
    saveButton: {
        backgroundColor: "#80FF",
        height: 48,
        padding: 12, 
    },
    containerCheckBox: {
        justifyContent: "flex-start",
        width: "94%",
        marginHorizontal: "3%",
        marginVertical: 5,
        alignItems: "center",
    },
})

export default GameForm 