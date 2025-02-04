import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { SYSTEM_PROMPT } from './constants';
import useConversationStore from '@/stores/useConversationStore';

export interface MessageItem {
  type: 'message';
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type Item = MessageItem;

export const handleTurn = async () => {
  const {
    chatMessages,
    conversationItems,
    setChatMessages,
    setConversationItems
  } = useConversationStore.getState();

  const allConversationItems: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationItems
  ];

  try {
    const response = await fetch('/api/get_response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: allConversationItems })
    });

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return;
    }

    const data: MessageItem = await response.json();
    chatMessages.push(data);
    setChatMessages([...chatMessages]);
    conversationItems.push(data);
    setConversationItems([...conversationItems]);
  } catch (error) {
    console.error('Error processing messages:', error);
  }
};