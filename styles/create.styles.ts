import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    contentContainer: {
        flex: 1
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.white
    },

    contentDisabled: {
        opacity: 0.7
    },

    shareButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },

    shareButtonDisabled: {
        opacity: 0.5
    },

    shareText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600'
    },

    shareTextDisabled: {
        color: COLORS.gray
    },

    emptyImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },

    emptyImageText: {
        fontSize: 16,
        color: COLORS.gray
    },

    content: {
        flex: 1
    },

    scrollContent: {
        flex: 1
    },

    imageSection: {
        width: width,
        height: width,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center'
    },

    previewImage: {
        width: '100%',
        height: '100%'
    },

    changeImageButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0, 0,75)',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        gap: 6
    },

    changeImageText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500'
    },

    inputSection: {
        flex: 1,
        padding: 16
    },

    captionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },

    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12
    },

    captionInput: {
        flex: 1,
        color: COLORS.white,
        fontSize: 18,
        paddingTop: 8,
        minHeight: 40,
    }
});