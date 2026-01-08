import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Sunrise, Sun, Moon, Cake, Cookie, Wine, X, Check, Plus, FolderPlus, ChevronRight } from 'lucide-react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import type { Folder } from '@/lib/store';
import { cn } from '@/lib/cn';

const ICON_MAP: Record<string, React.ElementType> = {
  Sunrise,
  Sun,
  Moon,
  Cake,
  Cookie,
  Wine,
};

interface FolderPickerProps {
  visible: boolean;
  folders: Folder[];
  selectedId?: string;
  suggestedId?: string;
  onSelect: (folderId: string) => void;
  onCreateFolder?: (name: string, color: string, icon: string, parentId?: string) => void;
  onClose: () => void;
}

export function FolderPicker({
  visible,
  folders,
  selectedId,
  suggestedId,
  onSelect,
  onCreateFolder,
  onClose,
}: FolderPickerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#F59E0B');
  const [selectedIcon, setSelectedIcon] = useState('Sun');
  const [parentIdForNewFolder, setParentIdForNewFolder] = useState<string | undefined>(undefined);

  const colors = [
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#10B981', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#14B8A6', // Teal
  ];

  const icons = ['Sunrise', 'Sun', 'Moon', 'Cake', 'Cookie', 'Wine'];

  // Organize folders into top-level and subfolders
  const topLevelFolders = folders.filter(f => !f.parentId);
  const getSubfolders = (parentId: string) => folders.filter(f => f.parentId === parentId);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }
    if (onCreateFolder) {
      onCreateFolder(newFolderName.trim(), selectedColor, selectedIcon, parentIdForNewFolder);
      setNewFolderName('');
      setShowCreateForm(false);
      setParentIdForNewFolder(undefined);
    }
  };

  const handleClose = () => {
    setShowCreateForm(false);
    setNewFolderName('');
    setParentIdForNewFolder(undefined);
    onClose();
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/70 justify-end">
          <Pressable
            className="flex-1"
            onPress={handleClose}
          />
          <View
            className="bg-zinc-900 rounded-t-3xl"
            style={{ maxHeight: '80%' }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
              <Text className="text-lg font-bold text-white">
                {showCreateForm
                  ? parentIdForNewFolder
                    ? `Add Subfolder to ${folders.find(f => f.id === parentIdForNewFolder)?.name}`
                    : 'Create New Folder'
                  : 'Choose Folder'}
              </Text>
              <Pressable
                onPress={handleClose}
                className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center"
              >
                <X size={18} color="#71717A" />
              </Pressable>
            </View>

            {/* Suggested Banner */}
            {suggestedId && !showCreateForm && (
              <View className="mx-5 mt-4 mb-2 px-3 py-2 bg-amber-500/20 rounded-xl flex-row items-center">
                <Text className="text-amber-500 text-sm">
                  AI suggests filing under:{' '}
                  <Text className="font-semibold">
                    {folders.find((f) => f.id === suggestedId)?.name}
                  </Text>
                </Text>
              </View>
            )}

            {showCreateForm ? (
              /* Create Folder Form */
              <View className="px-5 py-4">
                {/* Folder Name Input */}
                <Text className="text-white font-semibold mb-2">Folder Name</Text>
                <TextInput
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="e.g., Smoothies, Appetizers..."
                  placeholderTextColor="#71717A"
                  className="bg-zinc-800 text-white rounded-xl px-4 py-3 mb-4"
                  autoFocus
                />

                {/* Color Picker */}
                <Text className="text-white font-semibold mb-2">Choose Color</Text>
                <View className="flex-row flex-wrap mb-4">
                  {colors.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      className="w-12 h-12 rounded-full items-center justify-center m-1"
                      style={{
                        backgroundColor: color,
                        opacity: selectedColor === color ? 1 : 0.5,
                      }}
                    >
                      {selectedColor === color && (
                        <Check size={20} color="white" />
                      )}
                    </Pressable>
                  ))}
                </View>

                {/* Icon Picker */}
                <Text className="text-white font-semibold mb-2">Choose Icon</Text>
                <View className="flex-row flex-wrap mb-4">
                  {icons.map((iconName) => {
                    const IconComponent = ICON_MAP[iconName] || Sun;
                    return (
                      <Pressable
                        key={iconName}
                        onPress={() => setSelectedIcon(iconName)}
                        className={cn(
                          'w-14 h-14 rounded-xl items-center justify-center m-1',
                          selectedIcon === iconName ? 'bg-amber-500' : 'bg-zinc-800'
                        )}
                      >
                        <IconComponent
                          size={24}
                          color={selectedIcon === iconName ? '#000' : selectedColor}
                        />
                      </Pressable>
                    );
                  })}
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setShowCreateForm(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 items-center active:bg-zinc-700"
                  >
                    <Text className="text-white font-semibold">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleCreateFolder}
                    className="flex-1 py-3 rounded-xl bg-amber-500 items-center active:bg-amber-600"
                  >
                    <Text className="text-black font-semibold">Create</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              /* Folder List with Hierarchy */
              <ScrollView style={{ maxHeight: 500 }}>
                <View className="px-4 py-3">
                  {/* Top-level folders */}
                  {topLevelFolders.map((folder) => {
                    const subfolders = getSubfolders(folder.id);
                    return (
                      <View key={folder.id} className="mb-3">
                        {/* Parent Folder */}
                        <View className="flex-row items-center">
                          <Pressable
                            onPress={() => onSelect(folder.id)}
                            className={cn(
                              'flex-1 flex-row items-center p-3 rounded-xl',
                              selectedId === folder.id ? 'bg-amber-500' : 'bg-zinc-800',
                              'active:bg-zinc-700'
                            )}
                          >
                            <View
                              className="w-10 h-10 rounded-full items-center justify-center mr-3"
                              style={{
                                backgroundColor: selectedId === folder.id
                                  ? 'rgba(0,0,0,0.2)'
                                  : `${folder.color}20`,
                              }}
                            >
                              {(() => {
                                const IconComponent = ICON_MAP[folder.icon] || Sun;
                                return (
                                  <IconComponent
                                    size={20}
                                    color={selectedId === folder.id ? 'black' : folder.color}
                                  />
                                );
                              })()}
                            </View>
                            <View className="flex-1">
                              <Text
                                className={cn(
                                  'font-semibold',
                                  selectedId === folder.id ? 'text-black' : 'text-white'
                                )}
                              >
                                {folder.name}
                              </Text>
                              {subfolders.length > 0 && (
                                <Text className={cn(
                                  'text-xs mt-0.5',
                                  selectedId === folder.id ? 'text-black/70' : 'text-zinc-500'
                                )}>
                                  {subfolders.length} subfolder{subfolders.length !== 1 ? 's' : ''}
                                </Text>
                              )}
                            </View>
                            {selectedId === folder.id && (
                              <Check size={18} color="black" />
                            )}
                          </Pressable>

                          {/* Add Subfolder Button */}
                          {onCreateFolder && (
                            <Pressable
                              onPress={() => {
                                setParentIdForNewFolder(folder.id);
                                setShowCreateForm(true);
                              }}
                              className="ml-2 w-10 h-10 rounded-xl bg-emerald-600/20 items-center justify-center active:bg-emerald-600/30"
                            >
                              <FolderPlus size={18} color="#10B981" />
                            </Pressable>
                          )}
                        </View>

                        {/* Subfolders */}
                        {subfolders.length > 0 && (
                          <View className="ml-6 mt-2 space-y-2">
                            {subfolders.map((subfolder) => (
                              <Pressable
                                key={subfolder.id}
                                onPress={() => onSelect(subfolder.id)}
                                className={cn(
                                  'flex-row items-center p-2.5 rounded-lg',
                                  selectedId === subfolder.id ? 'bg-amber-500' : 'bg-zinc-800/50',
                                  'active:bg-zinc-700'
                                )}
                              >
                                <ChevronRight
                                  size={14}
                                  color={selectedId === subfolder.id ? 'black' : '#71717A'}
                                  className="mr-2"
                                />
                                <View
                                  className="w-8 h-8 rounded-full items-center justify-center mr-2"
                                  style={{
                                    backgroundColor: selectedId === subfolder.id
                                      ? 'rgba(0,0,0,0.2)'
                                      : `${subfolder.color}20`,
                                  }}
                                >
                                  {(() => {
                                    const IconComponent = ICON_MAP[subfolder.icon] || Sun;
                                    return (
                                      <IconComponent
                                        size={16}
                                        color={selectedId === subfolder.id ? 'black' : subfolder.color}
                                      />
                                    );
                                  })()}
                                </View>
                                <Text
                                  className={cn(
                                    'flex-1 font-medium text-sm',
                                    selectedId === subfolder.id ? 'text-black' : 'text-white'
                                  )}
                                >
                                  {subfolder.name}
                                </Text>
                                {selectedId === subfolder.id && (
                                  <Check size={16} color="black" />
                                )}
                              </Pressable>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}

                  {/* Create New Top-Level Folder Button */}
                  {onCreateFolder && (
                    <Pressable
                      onPress={() => {
                        setParentIdForNewFolder(undefined);
                        setShowCreateForm(true);
                      }}
                      className="mt-2 p-4 rounded-xl bg-emerald-600/20 border-2 border-emerald-600/50 border-dashed items-center active:bg-emerald-600/30"
                    >
                      <Plus size={24} color="#10B981" />
                      <Text className="text-emerald-500 font-semibold mt-1">
                        Create New Folder
                      </Text>
                    </Pressable>
                  )}
                </View>
              </ScrollView>
            )}

            {/* Safe Area Padding */}
            <View className="h-8" />
          </Pressable>
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
