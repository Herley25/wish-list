import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/product";
import { formatCurrency } from "@/functions/format-currency";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

const PHONE_NUMBER = ""

export default function Cart(){
    // Guardar a informação do endereço
    const [address, setAddress] = useState("")
    const cartStore = useCartStore();
    const navigate = useNavigation();

    //* percorrer todos os produtos e fazendo o cálculo
    const total = formatCurrency(
        cartStore.products.reduce(
            (total, product) => total + product.price * product.quantity, 0
        )
    )

    //* Função para remover produto
    function handleProductRemove(product: ProductCartProps){
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
            {
                text: "Cancelar",
            },
            {
                text: "Remover",
                onPress: () => cartStore.remove(product.id)
            }
        ])
    }

    //* Função que informa os dados da entrega
    function handleOrder(){
        if(address.trim().length === 0){
            return Alert.alert("Pedido", "Informe os dados da entrega")
        }

        const products = cartStore.products.map((product) =>
            `\n ${product.quantity} ${product.title}`).join("")

        //* formatar menssagem para enviar para "whatsap"
        const message = `
        🍔 NOVO PEDIDO
            \n Entregar em: ${address}

            ${products}

            \n Valor total: ${total}
        `

        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)
        console.log(message)
        cartStore.clear()
        navigate.goBack();
    }


    return(
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                extraHeight={100}
            >
                <ScrollView>
                    <View className="p-5 flex-1">
                        {cartStore.products.length > 0 ? (
                            <View className="border-b border-slate-700">
                                {cartStore.products.map((product) => (
                                    <Product 
                                        key={product.id} 
                                        data={product} 
                                        onPress={() => handleProductRemove(product)}
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text className="font-body text-slate-400 text-center my-8">
                                Seu carrinho está vazio
                            </Text>
                        )}

                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">
                                Total:
                            </Text>

                            <Text className="text-lime-400 text-2xl font-heading">
                                {total}
                            </Text>
                        </View>

                        <Input
                            onChangeText={setAddress}
                            blurOnSubmit
                            placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento"
                            onSubmitEditing={handleOrder}
                        />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>


            <View className="p-5 gap-5">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>

                <LinkButton title="Volta ao cardápio" href="/" />
            </View>
        </View>
    );
}