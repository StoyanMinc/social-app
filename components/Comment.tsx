import { styles } from '@/styles/feed.styles';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

interface Comment {
    content: string;
    _creationTime: number;
    user: {
        fullName: string;
        image: string;
    }
}

export default function Comment({ comment }: { comment: Comment }) {
    return (
        <View>
            <Image source={{ uri: comment.user.image }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.user.fullName}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                    {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
                </Text>

            </View>

        </View>
    );
}