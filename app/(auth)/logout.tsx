import { styles } from '@/styles/auth.styles';
import { useAuth } from '@clerk/clerk-expo';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Logout() {
    const { signOut } = useAuth();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => signOut}>
                <Text style={{ color: '#fff' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}