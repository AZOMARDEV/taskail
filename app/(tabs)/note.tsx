// app/(tabs)/note.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Keyboard,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Plus,
  X,
  Search,
  Pencil,
  Trash2,
  StickyNote,
  ArrowLeft,
  Check,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTabBar } from '@/components/TabBar/TabBarContext';

// --- Note Type ---
interface UserNote {
  id: string;
  content: string;
  createdAt: Date;
}

// --- Mock Data ---
const MOCK_NOTES: UserNote[] = [
  { id: 'note1', content: 'Remember to follow up on the new client proposal by end of day. Need to send over the revised contract.', createdAt: new Date(Date.now() - 3600000) },
  { id: 'note2', content: 'Draft meeting agenda for design sync on Monday. Topics: user feedback, next sprint planning, and component library updates.', createdAt: new Date(Date.now() - 86400000) },
  { id: 'note3', content: 'Research alternative payment gateways for project Saturn. Focus on lower transaction fees and better international support.', createdAt: new Date(Date.now() - 259200000) },
  { id: 'note4', content: 'Check performance metrics for last week’s marketing campaign. Compile a report for the weekly review.', createdAt: new Date(Date.now() - 604800000) },
];


export default function NotePage() {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  // --- Modal States ---
  const [isNewNoteModalVisible, setIsNewNoteModalVisible] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<UserNote | null>(null);
  const [editingText, setEditingText] = useState('');

  const { setIsTabBarVisible } = useTabBar();

  useEffect(() => {
    setNotes(MOCK_NOTES.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
    
    const showSub = Keyboard.addListener("keyboardDidShow", () => setIsTabBarVisible(false));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setIsTabBarVisible(true));
    return () => { showSub.remove(); hideSub.remove(); };
  }, [setIsTabBarVisible]);

  const navigateToDashboard = () => router.replace("/(tabs)/dashboard");

  // --- Add Note Logic (for the modal) ---
  const openNewNoteModal = () => setIsNewNoteModalVisible(true);
  const closeNewNoteModal = () => { setIsNewNoteModalVisible(false); setNewNoteContent(''); };
  
  const saveNewNote = () => {
    if (newNoteContent.trim() === '') return;
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      content: newNoteContent.trim(),
      createdAt: new Date(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    closeNewNoteModal();
  };

  // --- Edit Note Logic (for the modal) ---
  const startEditing = (note: UserNote) => {
    setNoteToEdit(note);
    setEditingText(note.content);
    setIsEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!noteToEdit || editingText.trim() === '') return;
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === noteToEdit.id ? { ...note, content: editingText.trim() } : note
    ));
    closeEditModal();
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setNoteToEdit(null);
    setEditingText('');
  };

  // --- Delete Note Logic ---
  const deleteNote = (id: string) => {
    Alert.alert(
      'Delete Note', 'Are you sure you want to delete this note?',
      [ { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setNotes(prevNotes => prevNotes.filter(note => note.id !== id)) },
      ], { cancelable: true }
    );
  };

  // --- Search and Filtering ---
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return notes.filter(note => note.content.toLowerCase().includes(lowerCaseQuery));
  }, [notes, searchQuery]);

  const clearSearch = () => setSearchQuery('');

  // --- Helper Functions ---
  const formatNoteDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Header */}
      <View className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white ${Platform.OS === "ios" ? "pt-3" : "pt-10"}`}>
        <TouchableOpacity onPress={navigateToDashboard} className="p-2 -ml-2"><ArrowLeft size={26} color="black" /></TouchableOpacity>
        <Text className="text-xl font-['Outfit-Bold'] text-center flex-1 text-gray-800">Quick Notes</Text>
        <TouchableOpacity onPress={() => searchInputRef.current?.focus()} className="p-2 -mr-2"><Search size={22} color="black" /></TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View className="flex-1">
        <ScrollView
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Search Input remains for convenience */}
            <View className="px-4 pb-4">
                <View className="flex-row items-center bg-white rounded-xl px-4 py-2 border border-gray-200 shadow-sm">
                <Search size={20} color="#9CA3AF" />
                <TextInput ref={searchInputRef} placeholder="Search notes..." placeholderTextColor="#9CA3AF" className="flex-1 ml-3 text-base font-['Outfit-Regular'] text-gray-800" value={searchQuery} onChangeText={setSearchQuery} returnKeyType="search" />
                {searchQuery.length > 0 && (<TouchableOpacity onPress={clearSearch} className="ml-2 p-1"><X size={18} color="#6B7280" /></TouchableOpacity>)}
                </View>
            </View>

            {/* Note List */}
            <View className="px-4">
                {filteredNotes.length === 0 ? (
                <View className="flex-1 items-center justify-center min-h-[400px]">
                    <StickyNote size={80} color="#CBD5E1" className="mb-6" />
                    <Text className="text-xl font-['Outfit-SemiBold'] text-center text-gray-700 mb-2">{searchQuery ? "No Notes Found" : "Your Note Pad is Empty"}</Text>
                    <Text className="text-base font-['Outfit-Regular'] text-gray-500 text-center px-6">{searchQuery ? "Try a different search term." : "Tap the '+' button to add your first note."}</Text>
                </View>
                ) : (
                filteredNotes.map(note => (
                    <View key={note.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
                    <Text className="text-base font-['Outfit-Regular'] text-gray-800 leading-relaxed mb-3">{note.content}</Text>
                    <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                        <Text className="text-xs text-gray-500 font-['Outfit-Regular']">{formatNoteDate(note.createdAt)}</Text>
                        <View className="flex-row items-center space-x-3">
                        <TouchableOpacity onPress={() => startEditing(note)} className="p-1.5 bg-indigo-50 rounded-full"><Pencil size={16} color="#4F46E5" /></TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteNote(note.id)} className="p-1.5 bg-red-50 rounded-full"><Trash2 size={16} color="#EF4444" /></TouchableOpacity>
                        </View>
                    </View>
                    </View>
                ))
                )}
            </View>
        </ScrollView>
      </View>

      {/* --- NEW: Floating Action Button (FAB) for adding notes --- */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openNewNoteModal}
        className="absolute bottom-24 right-6 bg-accent w-14 h-14 rounded-full items-center justify-center shadow-lg z-20"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>

      {/* --- NEW: Add New Note Modal --- */}
      <Modal animationType="fade" transparent={true} visible={isNewNoteModalVisible} onRequestClose={closeNewNoteModal}>
        <TouchableWithoutFeedback onPress={closeNewNoteModal}>
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-2xl w-full p-6 shadow-xl">
                <View className="flex-row justify-between items-center mb-4"><Text className="text-lg font-['Outfit-Bold'] text-gray-800">Add New Note</Text><TouchableOpacity onPress={closeNewNoteModal} className="p-1 -mr-2 -mt-2"><X size={24} color="#6B7280" /></TouchableOpacity></View>
                <TextInput value={newNoteContent} onChangeText={setNewNoteContent} multiline autoFocus={true} className="bg-gray-100 rounded-lg p-4 text-base font-['Outfit-Regular'] text-gray-800 h-40 border border-gray-200" textAlignVertical="top" placeholder="Jot down your thought..." placeholderTextColor="#9CA3AF" />
                <TouchableOpacity onPress={saveNewNote} disabled={newNoteContent.trim() === ''} className={`mt-6 w-full py-3.5 rounded-xl items-center ${newNoteContent.trim() === '' ? 'bg-gray-300' : 'bg-accent'}`}><Text className="font-['Outfit-SemiBold'] text-white text-base">Save Note</Text></TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- Edit Note Modal (from previous response) --- */}
      <Modal animationType="fade" transparent={true} visible={isEditModalVisible} onRequestClose={closeEditModal}>
        <TouchableWithoutFeedback onPress={closeEditModal}>
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-2xl w-full p-6 shadow-xl">
                <View className="flex-row justify-between items-center mb-4"><Text className="text-lg font-['Outfit-Bold'] text-gray-800">Edit Note</Text><TouchableOpacity onPress={closeEditModal} className="p-1 -mr-2 -mt-2"><X size={24} color="#6B7280" /></TouchableOpacity></View>
                <TextInput value={editingText} onChangeText={setEditingText} multiline autoFocus={true} className="bg-gray-100 rounded-lg p-4 text-base font-['Outfit-Regular'] text-gray-800 h-40 border border-gray-200" textAlignVertical="top" placeholder="Your note..." placeholderTextColor="#9CA3AF" />
                <View className="flex-row gap-5 mt-6 space-x-3">
                    <TouchableOpacity onPress={closeEditModal} className="flex-1 py-3 bg-gray-200 rounded-xl items-center"><Text className="font-['Outfit-SemiBold'] text-gray-700 text-base">Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={saveEdit} disabled={editingText.trim() === ''} className={`flex-1 py-3 rounded-xl items-center ${editingText.trim() === '' ? 'bg-gray-300' : 'bg-accent'}`}><Text className="font-['Outfit-SemiBold'] text-white text-base">Save Changes</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
}