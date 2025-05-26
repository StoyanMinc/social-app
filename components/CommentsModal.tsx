import { COLORS } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/feed.styles';
import Comment from './Comment';
import Loader from './Loader';

type CommentsModalProps = {
    postId: Id<'posts'>,
    visible: boolean,
    onClose: () => void,
}
export default function CommentsModal({ postId, visible, onClose }: CommentsModalProps) {

    const [newComment, setNewComment] = useState<string>('');
    const comments = useQuery(api.comments.getComments, { postId });
    const addComment = useMutation(api.comments.addComment);

    const handleComment = async () => {
        if (!newComment.trim()) return;

        try {
            await addComment({ content: newComment, postId });
            setNewComment('');

        } catch (error) {
            console.log('Error adding comment:', error);
        }
    }


    return (
        <Modal visible={visible} animationType='slide' onRequestClose={onClose} transparent={true}>
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={'white'} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Comments</Text>
                    <View style={{ width: 24 }} />
                </View>
                {comments === undefined ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <Comment comment={item} />}
                        style={styles.commentsList}
                    />
                )
                }
                <View style={styles.commentInput}>
                    <TextInput
                        style={styles.input}
                        placeholder='Add a comment...'
                        placeholderTextColor={COLORS.gray}
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity onPress={handleComment} disabled={!newComment.trim()}>
                        <Text
                            style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}
                        >
                            Post
                        </Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>

        </Modal>
    );
}