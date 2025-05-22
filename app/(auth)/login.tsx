import { COLORS } from '@/constants';
import { styles } from '@/styles/auth.styles';
import { useSSO } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Login() {

    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const loginHandler = async () => {

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' });
            if (setActive && createdSessionId) {
                setActive({ session: createdSessionId });
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.log('ERROR LOGIN:', error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.brandSection}>
                {/* <Ionicons name='leaf' size={32} color={COLORS.primary} /> */}
            </View>
            <Text style={styles.appName}>Stoyan's SM</Text>
            <Text style={styles.tagline}>don't miss anything</Text>
            <View style={styles.illustrationContainer}>
                <Image
                    style={styles.illustration}
                    source={require('../../assets/images/desktop-computer-bro.png')}
                    resizeMode='cover'
                />
            </View>
            <View style={styles.loginSection}>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={loginHandler}
                    activeOpacity={0.9}
                >
                    <View style={styles.googleIconContainer}>
                        <Ionicons name='logo-google' size={20} color={COLORS.surface} />
                    </View>
                    <Text style={styles.googleButtonText}>Continue with google</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}>By continuing, you agree with our Terms and Privacy Policy</Text>
            </View>
        </View>

    );
}

