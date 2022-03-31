import React, { useState, useEffect } from "react"
import { SafeAreaView, Text, FlatList, TouchableOpacity, Platform } from "react-native"
import DropDownPicker from 'react-native-dropdown-picker'

import FlatListComponent from "./components/FlatListComponent"

import { Menu, MenuItem } from 'react-native-material-menu';

import { useRoute } from "@react-navigation/native"
import Icon from 'react-native-vector-icons/MaterialIcons'
import Prompt from "react-native-prompt-cross";

import axios from 'axios';

const Home = ({ navigation }) => {

    const [selectedPlatform, setSelectedConsole] = useState("Todos")
    const [openConsoleDialog, setOpenConsoleDialog] = useState(false)
    const [games, setGames] = useState([])
    const [platforms, setPlatforms] = useState([])
    const [categories, setCategories] = useState([{label: "Categoria", value: "Categoria"}])

    const [visibleCategory, setVisibleCategory] = useState(false)
    const [visiblePlatform, setVisiblePlatform] = useState(false)
    const [visibleMenu, setVisibleMenu] = useState(false)
    const hideMenu = () => setVisibleMenu(false);
    const showMenu = () => setVisibleMenu(true);

    const route = useRoute()

    const serverHost = (Platform.OS) === "ios" ? "localhost" : "10.0.2.2"
    const addIcon = <Icon name="add" size={36} color="#00F4" />


    useEffect(()=>{
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
        .then((req) => setCategories(
            req.data.map((item) => {return({label: item.category, value: item.category})})
            .unshift({label: "Categoria", value: "Categoria"})
            )
        )
        .catch((erro) => console.log(erro))
        axios.get('http://' + serverHost + ':3000/games')
        .then((req) => setGames(req.data))
        .catch((erro) => console.log(erro))
      }, [route.params?.res])

      const saveCategory = (newCategory) => {
        axios.post('http://' + serverHost + ':3000/category', {
          category: newCategory,
        })
          .then( (req) => {
            const temp = [...categories, req.data]
            setCategories(temp)
            alert("Nova categoria salva com sucesso.")
          })
          .catch((erro) => alert("Erro: " + erro))
      }

      const savePlatform = (newPlatform) => {
        axios.post('http://' + serverHost + ':3000/platform', {
          platform: newPlatform,
        })
          .then( (req) => {
            const temp = [...platforms, req.data]
            setPlatforms(temp)
            alert("Nova plataforma salva com sucesso.")
          })
          .catch((erro) => alert("Erro: " + erro))
      }

    const addGame = () => {
        setVisibleMenu(false)
        navigation.navigate('GameForm', {gameData: null, name: "Adicionando jogo"})
    }

    const addPlatform = () => {
        setVisibleMenu(false)
        setVisiblePlatform(true)
        // Prompt.show(
        //     "Adicionando nova plataforma",
        //     "Insira abaixo o nome da plataforma: ",
        //     [
        //         {
        //             text: "Cancelar",
        //             onPress: null
        //         }, 
        //         {
        //             text: "Adicionar",
        //             onPress: (text) => {
        //                 const newPlatform = text
        //                 savePlatform(newPlatform)
        //             }
        //         }
        //     ]
        // )
    }

    const addCategory = () => {
        setVisibleMenu(false)
        setVisibleCategory(true)
        // Prompt.show(
        //     "Adicionando nova Categoria",
        //     "Insira abaixo o nome da Categoria: ",
        //     [
        //         {
        //             text: "Cancelar",
        //             onPress: null,
        //         }, 
        //         {
        //             text: "Adicionar",
        //             onPress: (text) => {
        //                 const newCategory = text
        //                 saveCategory(newCategory)
        //             },
        //         }
        //     ]
        // )
    }

    const data = [...games]

    const filteredData = data.filter((item) => {
        if (selectedPlatform === "Todos") {
          return item
        }
        else if (item.platform === selectedPlatform) {
          return item
        }
      })

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
              <Menu
                visible={visibleMenu}
                anchor={<TouchableOpacity 
                  style={{borderWidth: 0, borderRadius: 5, height: 36, width: 36, alignItems: "center" }} 
                  onPress={showMenu}
                >
                  {addIcon}
                </TouchableOpacity>}
                onRequestClose={hideMenu}
              >
                <MenuItem onPress={addGame}>Adicionar Jogo</MenuItem>
                <MenuItem onPress={addPlatform}>Adicionar Plataforma</MenuItem>
                <MenuItem onPress={addCategory}>Adicionar Categoria</MenuItem>
              </Menu>
            ),
          })
        }
    )

    return (
        <SafeAreaView>
            <Prompt
                title="Adicionando nova plataforma"
                message="Insira abaixo o nome da plataforma: "
                visible={visiblePlatform}
                useNatifIosPrompt
                callbackOrButtons={[
                    {
                        text: "Cancelar",
                        style: "cancel",
                        onPress: () => setVisiblePlatform(false),
                    },
                    {
                        text: "Adicionar",
                        onPress: (text) => {
                            const newPlatform = text
                            savePlatform(newPlatform)
                        }
                    }
                ]}
            />
            <Prompt
                title="Adicionando nova categoria"
                message="Insira abaixo o nome da categoria: "
                visible={visibleCategory}
                useNatifIosPrompt
                callbackOrButtons={[
                    {
                        text: "Cancelar",
                        style: "cancel",
                        onPress: () => setVisibleCategory(false),
                    },
                    {
                        text: "Adicionar",
                        onPress: (text) => {
                            const newCategory = text
                            saveCategory(newCategory)
                        }
                    }
                ]}
            />
            <Text>Filtrar por plataforma</Text>
            <DropDownPicker
                open={openConsoleDialog}
                value={selectedPlatform}
                items={platforms}
                setOpen={setOpenConsoleDialog}
                setValue={setSelectedConsole}
            />
            <FlatList 
                style={{marginBottom: 64}}
                keyExtractor={(item, index) => item.id.toString()} 
                data={filteredData} 
                renderItem={(item) => <FlatListComponent data={item}/>}/>
        </SafeAreaView>
    )
}

export default Home