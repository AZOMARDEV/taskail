import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView
        intensity={50}
        tint="dark"
        style={StyleSheet.absoluteFill}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={onCancel}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              Are you sure, you want to log out?
            </Text>
            
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onConfirm}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF4B55',
    marginBottom: 10,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  cancelText: {
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LogoutConfirmationModal;