import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'parent' | 'driver';
  timestamp: string;
}

interface Conversation {
  id: string;
  parentName: string;
  studentName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const ChatScreen = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      parentName: "John's Parent",
      studentName: 'John Smith',
      lastMessage: 'Will John be attending today?',
      timestamp: '10:30 AM',
      unreadCount: 1,
    },
    {
      id: '2',
      parentName: "Sarah's Parent",
      studentName: 'Sarah Johnson',
      lastMessage: 'Thank you for the update',
      timestamp: '9:45 AM',
      unreadCount: 0,
    },
  ]);

  const loadMessages = async (conversationId: string) => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chat_messages_${conversationId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'driver',
      timestamp: new Date().toLocaleString(),
    };

    try {
      const updatedMessages = [...messages, newMessage];
      await AsyncStorage.setItem(
        `chat_messages_${selectedConversation}`,
        JSON.stringify(updatedMessages)
      );
      setMessages(updatedMessages);
      setMessage('');

      // Update conversation last message
      const updatedConversations = conversations.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: message, timestamp: new Date().toLocaleString() }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedConversation(item.id);
        loadMessages(item.id);
      }}
      className={`flex-row items-center p-4 border-b border-gray-200 ${
        selectedConversation === item.id ? 'bg-blue-50' : ''
      }`}
    >
      <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
        <Text className="text-lg font-bold text-gray-600">
          {item.parentName.charAt(0)}
        </Text>
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-gray-800 font-medium">{item.parentName}</Text>
        <Text className="text-gray-500 text-sm">{item.studentName}</Text>
        <Text className="text-gray-500 text-sm">{item.lastMessage}</Text>
      </View>
      <View className="items-end">
        <Text className="text-gray-400 text-xs">{item.timestamp}</Text>
        {item.unreadCount > 0 && (
          <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center mt-1">
            <Text className="text-white text-xs">{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`mx-4 my-1 max-w-[80%] ${
        item.sender === 'driver' ? 'self-end bg-blue-500' : 'self-start bg-gray-200'
      } rounded-2xl p-3`}
    >
      <Text
        className={`${
          item.sender === 'driver' ? 'text-white' : 'text-gray-800'
        }`}
      >
        {item.text}
      </Text>
      <Text
        className={`text-xs mt-1 ${
          item.sender === 'driver' ? 'text-blue-100' : 'text-gray-500'
        }`}
      >
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {!selectedConversation ? (
          <>
            <View className="flex-row items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800">Messages</Text>
            </View>
            <FlatList
              data={conversations}
              renderItem={renderConversationItem}
              keyExtractor={(item) => item.id}
            />
          </>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <View className="flex-row items-center p-4 border-b border-gray-200">
              <TouchableOpacity
                onPress={() => setSelectedConversation(null)}
                className="mr-3"
              >
                <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-lg font-medium text-gray-800">
                  {conversations.find((c) => c.id === selectedConversation)?.parentName}
                </Text>
                <Text className="text-sm text-gray-500">
                  {conversations.find((c) => c.id === selectedConversation)?.studentName}
                </Text>
              </View>
            </View>

            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ flexGrow: 1 }}
              inverted={false}
            />

            <View className="p-4 border-t border-gray-200 flex-row items-center">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
              />
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-full ${
                  message.trim() ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <MaterialIcons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen; 