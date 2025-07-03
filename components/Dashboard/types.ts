// components/Dashboard/types.ts

// These types should ideally be consistent with or imported from your central TicketsContext
export interface CounterpartyProfile {
  id: string;
  name: string;
  profileImageUrl?: string;
}

export interface Ticket {
  id: string;
  title: string;
  type: "buy" | "sell";
  itemDescription: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  counterparty: CounterpartyProfile;
  notes?: string;
  createdAt: Date; // Using Date object

  // Optional pre-formatted fields for display convenience
  displayDate?: string;
  totalAmount?: number;
}

// The old Project and TeamMember interfaces are removed or replaced by the Ticket structure.