import { COLORS } from '@/constants'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },

    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface
    },

    headerTitle: {
        fontSize: 24,
        fontFamily: 'JetBrainsMono-Medium',
        color: COLORS.primary
    },

    listContainer: {
        padding: 16,
        gap: 16
    },

    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 12
    },

    notificationContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12
    },

    avatarCointainer: {
        position: 'relative',
        marginRight: 12
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: COLORS.surface
    },

    iconBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: COLORS.background,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.surface
    },

    notificationInfo: {
        flex: 1,
    },

    username: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2
    },

    action: {
        color: COLORS.gray,
        fontSize: 14,
        marginBottom: 2
    },

    timeAgo: {
        fontSize: 12,
        color: COLORS.gray,
    },

    postImage: {
        width: 44,
        height: 44,
        borderRadius: 6,
    },

    centered: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})