import Loader from '@/components/Loader';
import { COLORS } from '@/constants';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/notifications.styles';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function Notifications() {

    const notifications = useQuery(api.notifications.getNotifications)
    if (notifications === undefined) return <Loader />
    if (notifications.length === 0) return <NoNotificationsFound />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <FlatList
                data={notifications}
                renderItem={({ item }) => <NotificationItem notification={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

function NoNotificationsFound() {
    return (
        <View style={[styles.container, styles.centered]}>
            <Ionicons name='notifications-outline' size={48} color={COLORS.primary} />
            <Text style={{ fontSize: 20, color: COLORS.white }}>No Notifications</Text>
        </View>
    )
}

function NotificationItem({ notification }: any) {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
                <Link href={`/notifications`} asChild>
                    <TouchableOpacity style={styles.avatarCointainer} >
                        <Image
                            source={notification.sender.image}
                            style={styles.avatar}
                            contentFit='cover'
                            transition={200}
                        />
                        <View style={styles.iconBadge}>
                            {notification.type === 'like' ? (
                                <Ionicons name='heart' size={14} color={COLORS.primary} />
                            ) : notification.type === 'comment' ? (
                                <Ionicons name='person-add' size={14} color='#8b5cf6' />

                            ) : (
                                <Ionicons name='chatbubble' size={14} color='#3b82f6' />
                            )}
                        </View>
                    </TouchableOpacity>
                </Link>

            </View>
        </View>
    )
}