export enum UserRole {
  USER = 'USER',
  DRIVER = 'DRIVER',
  NONE = 'NONE'
}

export enum RideStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  MATCHED = 'MATCHED',
  PICKUP_WAY = 'PICKUP_WAY',
  ARRIVED_PICKUP = 'ARRIVED_PICKUP',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  RATED = 'RATED'
}

export interface RideOption {
  id: string;
  name: string;
  multiplier: number;
  eta: number;
  image: string;
  seats: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  carModel: string;
  carPlate: string;
  color: string;
  trips: number;
  location: { x: number; y: number };
}

export interface Location {
  name: string;
  address: string;
  coords: { x: number; y: number };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}
