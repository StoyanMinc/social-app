import { COLORS } from '@/constants';
import { styles } from '@/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View, Modal, TouchableOpacity } from 'react-native';

type Post = {
  _id: string;
  _creationTime: number;
  caption?: string;
  comments: number;
  imageUrl: string;
  likes: number;
  storageId: string;
  userId: string;
};

type PostModalProps = {
  post: Post;
  closemodal: () => void;
};

export default function PostModal({ post, closemodal }: PostModalProps) {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            onRequestClose={() => closemodal}
        >
            <View style={styles.modalBackdrop}>

                <View style={styles.postDetailContainer}>
                    <View style={styles.postDetailHeader}>
                        <TouchableOpacity onPress={closemodal}>
                            <Ionicons name='close' size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={post.imageUrl}
                        style={styles.postDetailImage}
                        cachePolicy={'memory-disk'}
                        contentFit='cover'
                        transition={200}
                    />
                </View>

            </View>
        </Modal>
    );
}