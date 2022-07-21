import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'
import SelectedIngredientCard from '../../components/SelectedIngredientCard/SelectedIngredientCard'
import IngredientCard from '../../components/IngredientCard/IngredientCard'
import { listIngredients } from '../../config/lists'
import { colors } from '../../config/theme'
import drinks from '../../config/drinks.json'

const IngredientsScreen = ({ isDareMode }) => {

    const [selectedIngredients, setSelectedIngredients] = useState([])

    function getCombinations(ingredients) {

        let combi = []
        let temp = []
        let slent = Math.pow(2, ingredients.length)

        for (let i = 0; i < slent; i++) {
            temp = []
            for (let j = 0; j < ingredients.length; j++) {
                if ((i & Math.pow(2, j))) {
                    temp.push(ingredients[j])
                }
            }
            if (temp.length > 0) {
                combi.push(temp)
            }
        }

        combi.sort((a, b) => a.length - b.length)
        // console.log(combi.join("\n"))
        console.log(combi.length)
        return combi
    }

    const getCompatibleDrinks = () => {
        let compatibleDrinks = []

        drinks.drinks.forEach(d => {

            let listIngredients = []
            let amountIngredients = 0
            let amountCorrectIngredients = 0
            for (let i = 1; i < 15; i++) {
                
                if (d[`strIngredient${i}`] == null) { break } else amountIngredients++
                
                
                selectedIngredients.forEach(sel => {
                    if (d[`strIngredient${i}`] == (sel || "Ice")) {
                        amountCorrectIngredients++
                    }

                })

                // if (d[`strIngredient${i}`] == sel) {

                //     // listIngredients.push(d[`strIngredient${i}`])

                // } else if (d[`strIngredient${i}`] == null) {
                //     return
                // }

            }

            if(amountIngredients == amountCorrectIngredients) compatibleDrinks.push(d.strDrink)


            // combinations.sort().forEach(c => {

            // })


        })
        return compatibleDrinks
    }


    const renderItemSelected = ({ item, index }) => {
        const isLastUneven = index == selectedIngredients.length - 1 && index % 2 == 0

        // if (isLastUneven) console.log(item + " is last and uneven")
        return (
            <SelectedIngredientCard text={item} isLastUneven={isLastUneven}
                onPress={() => {
                    const newIngredients = [...selectedIngredients]
                    newIngredients.splice(selectedIngredients.indexOf(item), 1)
                    setSelectedIngredients(newIngredients)
                }} />
        )
    }

    const renderItem = ({ item, index }) => {

        return (
            <IngredientCard text={item.name} image={item.image}
                isSelected={selectedIngredients.indexOf(item.name) != -1}
                onPress={() => {
                    const newIngredients = [...selectedIngredients]

                    const isSelectedAtIndex = selectedIngredients.indexOf(item.name)
                    if (isSelectedAtIndex != -1) {
                        newIngredients.splice(isSelectedAtIndex, 1)
                    } else {
                        newIngredients.push(item.name)
                    }

                    setSelectedIngredients(newIngredients)
                }} />
        )
    }

    return (
        <View style={styles.container}>

            <FlatList
                ListHeaderComponent={<View>
                    <View style={styles.readyContainer}>
                        <Text style={[styles.readyTitle,
                        { color: selectedIngredients.length >= 3 ? colors.DARK_GREEN : colors.DARK_RED }]}>
                            {selectedIngredients.length < 3 ? "Not Ready" : "Ready"}
                        </Text>
                        <Text style={styles.readyDescription}>
                            {selectedIngredients.length < 3
                                ? "Choose at least three ingredients to continue."
                                : "Shake your phone to get a random recipe!"}

                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                // let drinkLists = []
                                // selectedIngredients.forEach((s, i) => {

                                //     drinkLists.push(getDrinksWithIngredient(s))

                                // })

                                // console.log(drinkLists);

                                // const combinations = getCombinations(selectedIngredients)
                                const compatibleDrinks = getCompatibleDrinks()
                                console.log(compatibleDrinks);
                                // let test = ["Light rum", "Sugar", "Soda water"]

                                // console.log(test.sort())
                                // console.log(combinations[24].sort())
                            }}>
                            <Text style={{
                                flex: 1, backgroundColor: "green",
                                marginTop: 8, borderRadius: 8,
                                padding: 8, color: "white"
                            }}>
                                Fetch
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: "white", marginVertical: 16, fontSize: 16 }}>
                        {`Selected ingredients (${selectedIngredients.length}/10)`}
                    </Text>
                    <FlatList
                        numColumns={2}
                        data={selectedIngredients}
                        renderItem={renderItemSelected}
                        keyExtractor={(item, index) => index}
                        ListEmptyComponent={<View>
                            <Text style={{ color: "#c0c0c0", marginLeft: 8 }}>No ingredients selected</Text>
                        </View>}
                    />
                    <Text style={{ color: "white", marginVertical: 16, fontSize: 16 }}>Choose ingredients</Text>

                </View>}
                style={{ padding: 16 }}
                contentContainerStyle={{ paddingBottom: 32 }}
                numColumns={3}
                data={listIngredients}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}

            />
        </View>
    )
}

export default IngredientsScreen