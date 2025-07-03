// context/TicketsContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// --- Sub-Types for Ticket Details ---
export interface Comment {
  id: string;
  author: CounterpartyProfile; // Or just a simplified author object { id: string, name: string, avatarUrl?: string }
  text: string;
  createdAt: Date;
  mentions?: string[]; // Array of user IDs or names mentioned
}

export interface ActivityLogEntry {
  id: string;
  actor: CounterpartyProfile; // Or simplified actor
  action: string; // e.g., "updated status to 'In Progress'", "assigned ticket to User X"
  timestamp: Date;
}

// --- Counterparty Profile Type ---
export type CounterpartyProfile = {
  id: string;
  name: string;
  profileImageUrl?: string;
};

// --- Ticket Type Definition (Extended) ---
export type Ticket = {
  id: string;
  title: string;
  type: "buy" | "sell";
  itemDescription: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  counterparty: CounterpartyProfile; // Main client/vendor
  notes?: string;
  createdAt: Date;
  // NEW FIELDS:
  assignees?: CounterpartyProfile[]; // Users assigned to this ticket
  comments?: Comment[];
  activityLog?: ActivityLogEntry[];
  status?: "Open" | "In Progress" | "In Review" | "Blocked" | "Completed" | "Cancelled"; // Example statuses
};

export type NewTicketData = Omit<Ticket, 'id' | 'createdAt' | 'comments' | 'activityLog' | 'assignees' | 'status'> & {
    // When creating a new ticket, these might be optional or set to defaults
    assignees?: CounterpartyProfile[];
    status?: "Open" | "In Progress" | "In Review" | "Blocked" | "Completed" | "Cancelled";
};


interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (newTicketData: NewTicketData) => void;
  deleteTicket: (ticketId: string) => void;
  getTicketById: (ticketId: string) => Ticket | undefined;
  addCommentToTicket: (ticketId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void; // New action
  updateTicketStatus: (ticketId: string, status: Ticket['status'], actor: CounterpartyProfile) => void; // New action
  assignUserToTicket: (ticketId: string, assignee: CounterpartyProfile, actor: CounterpartyProfile) => void; // New action
  loading: boolean;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);
interface TicketsProviderProps { children: ReactNode; }
const STORAGE_KEY = 'app_tickets_data_v3'; // Incremented version due to schema change

// MOCK COUNTERPARTIES (same as before, ensure these are comprehensive)
export const MOCK_CONTEXT_COUNTERPARTIES: CounterpartyProfile[] = [
  { id: 'cp_ctx_1', name: 'Eleanor Vance', profileImageUrl: 'https://i.pravatar.cc/150?img=25' },
  { id: 'cp_ctx_2', name: 'Marcus Cole', profileImageUrl: 'https://i.pravatar.cc/150?img=30' },
  { id: 'cp_ctx_3', name: 'Aisha Khan', profileImageUrl: 'https://i.pravatar.cc/150?img=35' },
  { id: 'cp_ctx_rafiap', name: 'Rafi Islam Apon', profileImageUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 'cp_ctx_zaray', name: 'Zara Yasmin Tasnim', profileImageUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 'cp_ctx_davidm', name: 'David Malan' }, // Added for notification sync
  { id: 'cp_ctx_ikramt', name: 'Ikram Islam Tamim', profileImageUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: 'cp_ctx_mehedih', name: 'Mehedi Hasan', profileImageUrl: 'https://i.pravatar.cc/150?img=8' },
  { id: 'cp_ctx_clienta', name: 'CryptoArt Co.', profileImageUrl: 'https://i.pravatar.cc/150?img=10'},
  { id: 'cp_ctx_vendorb', name: 'UI Kits Inc.'},
  { id: 'cp_ctx_clientc', name: 'Prestige Properties'},
  { id: 'cp_ctx_archfirmd', name: 'Modern Designs LLP', profileImageUrl: "https://i.pravatar.cc/150?img=12"},
  { id: 'cp_ctx_agencye', name: 'Growth Hackers Co.'},
  { id: 'cp_user_current', name: 'Current User (You)', profileImageUrl: 'https://i.pravatar.cc/150?img=50'} // Example for "You"
];

const currentUserMock = MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_user_current')!;
const rafiMock = MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_rafiap')!;
const zaraMock = MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_zaray')!;
const davidMock = MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_davidm')!;
const ikramMock = MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_ikramt')!;

// INITIAL MOCK TICKETS with Extended Data
export const INITIAL_MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT001",
    title: "NFT Website and Mobile App Design",
    type: "sell", itemDescription: "Full design services for NFT platform, including user flows and mockups.",
    quantity: 1, pricePerUnit: 1250, currency: "USD",
    counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_clienta')!,
    createdAt: new Date(Date.now() - 86400000 * 2),
    notes: "Initial design phase discussion. Needs stakeholder review by EOW.",
    status: "In Progress",
    assignees: [rafiMock, zaraMock],
    comments: [
      { id: uuidv4(), author: rafiMock, text: "Hey @Zara Yasmin Tasnim, can you take a look at the new UI proposal for the homepage?", createdAt: new Date(new Date().setHours(new Date().getHours() - 3)), mentions: ['Zara Yasmin Tasnim']},
      { id: uuidv4(), author: zaraMock, text: "Sure, @Rafi Islam Apon! Checking it out now. Looks promising!", createdAt: new Date(new Date().setHours(new Date().getHours() - 2)) }
    ],
    activityLog: [
      { id: uuidv4(), actor: currentUserMock, action: "created this ticket.", timestamp: new Date(Date.now() - 86400000 * 2)},
      { id: uuidv4(), actor: currentUserMock, action: "assigned Rafi Islam Apon.", timestamp: new Date(new Date().setHours(new Date().getHours() - 6))},
      { id: uuidv4(), actor: currentUserMock, action: "assigned Zara Yasmin Tasnim.", timestamp: new Date(new Date().setHours(new Date().getHours() - 5))},
    ]
  },
  {
    id: "TKT002",
    title: "Redesign Dashboard Finance",
    type: "buy", itemDescription: "Purchase and integration of a premium finance dashboard template for internal reporting.",
    quantity: 1, pricePerUnit: 199, currency: "USD",
    counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_vendorb')!,
    createdAt: new Date(Date.now() - 86400000 * 3),
    status: "Open",
    assignees: [zaraMock],
    activityLog: [
        {id: uuidv4(), actor: currentUserMock, action: "created ticket", timestamp: new Date(Date.now() - 86400000 * 3)},
        {id: uuidv4(), actor: currentUserMock, action: `assigned Zara Yasmin Tasnim`, timestamp: new Date(new Date().setHours(new Date().getHours() - 5))},
    ]
  },
  {
    id: "TKT003",
    title: "Real Estate Website Design Project",
    type: "sell", itemDescription: "Development of a responsive real estate portal with MLS integration.",
    quantity: 1, pricePerUnit: 3500, currency: "EUR",
    counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_clientc')!,
    createdAt: new Date(Date.now() - 86400000 * 4),
    status: "Completed",
    comments: [
        {id: uuidv4(), author: davidMock, text: "Looks good, please proceed with the development phase. Payment has been processed.", createdAt: new Date(new Date(Date.now() - 86400000 * 1).setHours(14, 0,0))}
    ],
    activityLog: [
        {id: uuidv4(), actor: davidMock, action: "marked as Completed", timestamp: new Date(new Date(Date.now() - 86400000 * 1).setHours(14, 5,0))}
    ]
  },
  {
    id: "TKT004",
    title: "Architecture Web Design Project",
    type: "sell", itemDescription: "Showcase portfolio for an architecture firm, highlighting recent projects.",
    quantity: 1, pricePerUnit: 1800, currency: "GBP",
    counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_archfirmd')!,
    createdAt: new Date(Date.now() - 86400000 * 5),
    status: "In Review",
    assignees: [ikramMock],
    activityLog: [
        {id: uuidv4(), actor: currentUserMock, action: `assigned Ikram Islam Tamim`, timestamp: new Date(Date.now() - 86400000 * 5)},
        {id: uuidv4(), actor: ikramMock, action: `updated status to In Review`, timestamp: new Date(new Date(Date.now() - 86400000 * 1).setHours(13, 0, 0))},
    ]
  },
  // TKT005 and others can be similarly extended
];


export const TicketsProvider: React.FC<TicketsProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load/Save useEffects (remain the same as your last version)
  useEffect(() => {
    const loadTicketsFromStorage = async () => {
      setLoading(true);
      try {
        const storedTicketsJson = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTicketsJson) {
          const storedTicketsRaw = JSON.parse(storedTicketsJson) as Array<any>;
          const parsedTickets = storedTicketsRaw.map(t => ({
            ...t,
            createdAt: new Date(t.createdAt),
            // Ensure comments and activityLog also parse their dates
            comments: t.comments ? t.comments.map((c: any) => ({...c, createdAt: new Date(c.createdAt)})) : [],
            activityLog: t.activityLog ? t.activityLog.map((a: any) => ({...a, timestamp: new Date(a.timestamp)})) : [],
          }));
          setTickets(parsedTickets.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
          console.log("Context: Tickets loaded from AsyncStorage.");
        } else {
          setTickets([...INITIAL_MOCK_TICKETS].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
          console.log("Context: No tickets in AsyncStorage, loaded initial mock data.");
        }
      } catch (error) {
        console.error("Context: Failed to load tickets from AsyncStorage:", error);
        setTickets([...INITIAL_MOCK_TICKETS].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } finally {
        setLoading(false);
      }
    };
    loadTicketsFromStorage();
  }, []);

  useEffect(() => {
    if (!loading) {
      const saveTicketsToStorage = async () => {
        try {
          const storableTickets = tickets.map(t => ({
            ...t,
            createdAt: t.createdAt.toISOString(),
            comments: t.comments ? t.comments.map(c => ({...c, createdAt: c.createdAt.toISOString()})) : undefined,
            activityLog: t.activityLog ? t.activityLog.map(a => ({...a, timestamp: a.timestamp.toISOString()})) : undefined,
          }));
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storableTickets));
          console.log("Context: Tickets saved to AsyncStorage.");
        } catch (error) {
          console.error("Context: Failed to save tickets to AsyncStorage:", error);
        }
      };
      saveTicketsToStorage();
    }
  }, [tickets, loading]);

  const addTicket = useCallback((newTicketData: NewTicketData) => {
    const newTicket: Ticket = {
      ...newTicketData,
      id: uuidv4(),
      createdAt: new Date(),
      status: newTicketData.status || "Open", // Default status
      comments: [],
      activityLog: [{id: uuidv4(), actor: currentUserMock, action: "created this ticket.", timestamp: new Date()}],
      assignees: newTicketData.assignees || [],
    };
    setTickets((prevTickets) => [newTicket, ...prevTickets].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }, []);

  const deleteTicket = useCallback((ticketId: string) => {
    setTickets((prevTickets) => prevTickets.filter((t) => t.id !== ticketId));
  }, []);

  const getTicketById = useCallback((ticketId: string): Ticket | undefined => {
    if (loading) { return undefined; } // Or handle as per your preference
    return tickets.find(t => t.id === ticketId);
  }, [tickets, loading]);

  // --- NEW CONTEXT ACTIONS ---
  const addCommentToTicket = useCallback((ticketId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    setTickets(prevTickets => prevTickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newComment: Comment = {
          ...commentData,
          id: uuidv4(),
          createdAt: new Date(),
        };
        const updatedActivityLog = [
            ...(ticket.activityLog || []),
            {id: uuidv4(), actor: commentData.author, action: `commented: "${commentData.text.substring(0,30)}..."`, timestamp: new Date()}
        ];
        return { ...ticket, comments: [...(ticket.comments || []), newComment], activityLog: updatedActivityLog };
      }
      return ticket;
    }));
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: Ticket['status'], actor: CounterpartyProfile) => {
    setTickets(prevTickets => prevTickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedActivityLog = [
            ...(ticket.activityLog || []),
            {id: uuidv4(), actor: actor, action: `updated status to '${status}'.`, timestamp: new Date()}
        ];
        return { ...ticket, status, activityLog: updatedActivityLog };
      }
      return ticket;
    }));
  }, []);

  const assignUserToTicket = useCallback((ticketId: string, assignee: CounterpartyProfile, actor: CounterpartyProfile) => {
    setTickets(prevTickets => prevTickets.map(ticket => {
      if (ticket.id === ticketId) {
        const existingAssignees = ticket.assignees || [];
        if (existingAssignees.find(a => a.id === assignee.id)) return ticket; // Already assigned
        
        const updatedActivityLog = [
            ...(ticket.activityLog || []),
            {id: uuidv4(), actor: actor, action: `assigned the ticket to ${assignee.name}.`, timestamp: new Date()}
        ];
        return { ...ticket, assignees: [...existingAssignees, assignee], activityLog: updatedActivityLog };
      }
      return ticket;
    }));
  }, []);


  const contextValue: TicketsContextType = {
    tickets, addTicket, deleteTicket, getTicketById, loading,
    addCommentToTicket, updateTicketStatus, assignUserToTicket, // Expose new actions
  };

  return (
    <TicketsContext.Provider value={contextValue}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = (): TicketsContextType => {
  const context = useContext(TicketsContext);
  if (context === undefined) throw new Error('useTickets must be used within a TicketsProvider');
  return context;
};