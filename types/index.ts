export type UserRole = 'patient' | 'pharmacist' | 'doctor';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface Drug { id: string; name: string; category?: string; dosage?: string; description?: string; }
export interface Pharmacy { id: string; name: string; address?: string; phone?: string; distance?: number; isOpen?: boolean; }
export interface PharmacyDrug { id: string; drugId?: string; pharmacyId?: string; name?: string; drug?: Drug; price?: number; stock?: number; quantity?: number; expiryDate?: string; }
export interface Order { id: string; status: OrderStatus; totalAmount?: number; createdAt?: string; pharmacyName?: string; pharmacy?: Pharmacy; items?: PharmacyDrug[]; }
export interface Prescription { id: string; title?: string; fileUrl?: string; status?: string; createdAt?: string; notes?: string; patientName?: string; }
export interface Conversation { id: string; participantName?: string; lastMessage?: string; updatedAt?: string; }
export interface ChatMessage { id: string; conversationId: string; senderId?: string; message: string; createdAt?: string; }
