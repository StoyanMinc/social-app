import InitialLayout from "@/components/InitialLayout";
import { COLORS } from "@/constants";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useCallback, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync('light');

        }
    }, [])

    return (
        <ClerkAndConvexProvider>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} onLayout={onLayoutRootView}>
                    <InitialLayout />
                </SafeAreaView>
            </SafeAreaProvider>
        </ClerkAndConvexProvider>
    )
}
