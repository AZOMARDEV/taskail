// @/components/Inbox/services/messageService.ts
import { Message } from "../types/Message";

// Helper function to get random category (keep as is)

export const fetchMockMessages = async (): Promise<Message[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const dayBeforeYesterday = new Date(now);
  dayBeforeYesterday.setDate(now.getDate() - 2);
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);


  // Helper to create dates relative to yesterday/today for consistency
  const todayAt = (hour: number, minute: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  const yesterdayAt = (hour: number, minute: number) => new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), hour, minute);
  const dayBeforeAt = (hour: number, minute: number) => new Date(dayBeforeYesterday.getFullYear(), dayBeforeYesterday.getMonth(), dayBeforeYesterday.getDate(), hour, minute);

  return [
    {
      id: 1,
      sender: "Alice Smith",
      project: "Project Alpha",
      content: "Hey, can we review the latest designs? Let me know your availability.",
      // **** USE Date ****
      timestamp: todayAt(10, 30), // 10:30 AM today
      hasAttachment: true,
      read: false,
      online: true,
      isStarred: false,
      status: "inbox",
      category: "Works",
    },
    {
      id: 2,
      sender: "Frank Ocean",
      project: "Music Album",
      content: "Hey, can you send me the latest tracks? I'm excited to hear them!",
       // **** USE Date ****
      timestamp: todayAt(9, 15), // 9:15 AM today
      hasAttachment: true,
      read: false, // Unread
      online: true,
      isStarred: false,
      status: "inbox",
      category: "Works",
    },
    {
      id: 3,
      sender: "Charlie Brown",
      project: "Vacation Plans",
      content: "Did you book the flights yet? Just checking in.",
      // **** USE Date ****
      timestamp: yesterdayAt(16, 45), // 4:45 PM yesterday
      hasAttachment: false,
      read: true,
      online: true,
      isStarred: false,
      status: "inbox",
      category: "Vacation",
    },
    {
      id: 4,
      sender: "Diana Prince",
      project: "Personal Catchup",
      content: "Let's grab coffee sometime next week! Free on Tuesday?",
      // **** USE Date ****
      timestamp: dayBeforeAt(11, 0), // 11:00 AM day before yesterday
      hasAttachment: false,
      read: true,
      online: false,
      isStarred: false,
      status: "inbox",
      category: "Personal",
    },
    {
      id: 5,
      sender: "Alice Smith",
      project: "Project Alpha",
      content: "Hey, can you send me the latest tracks? I'm excited to hear them!",
      // **** USE Date ****
      timestamp: todayAt(11, 0), // 11:00 AM today (sent)
      hasAttachment: true,
      read: true, // Assume recipient read it for mock data simplicity
      online: true,
      isStarred: false,
      status: "sent",
      category: "Works",
    },
    {
      id: 6,
      sender: "Ethan Hunt",
      project: "Top Secret",
      content: "Message draft...",
      // **** USE Date ****
      timestamp: todayAt(14, 5), // 2:05 PM today (draft)
      hasAttachment: false,
      read: true, // Drafts are technically 'read' by the sender
      online: true,
      isStarred: false,
      status: "draft",
      category: "Works",
    },
    {
      id: 7,
      sender: "Deleted User",
      project: "Old Project",
      content: "This was removed.",
      // **** USE Date ****
      timestamp: lastMonth, // Sometime last month
      hasAttachment: false,
      read: true,
      online: false,
      isStarred: false,
      status: "trash",
      category: "Works",
    },
    {
      id: 8,
      sender: "Bob Johnson",
      project: "Marketing Campaign",
      content: "Meeting reminder for 2 PM today. Please bring the reports.",
      // **** USE Date ****
      timestamp: todayAt(9, 15), // 9:15 AM today
      hasAttachment: false,
      read: true,
      online: false,
      isStarred: true,
      status: "inbox",
      category: "Works",
    },
  ];
};