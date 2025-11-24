import { RideOption, Driver, Location } from './types';

export const APP_COLOR = '#1A4DBE';
export const APP_COLOR_LIGHT = '#Eef2FF';

export const MOCK_RIDE_OPTIONS: RideOption[] = [
  { id: 'eco', name: 'Blue Eco', multiplier: 1.0, eta: 4, image: '🚗', seats: 4 },
  { id: 'plus', name: 'Blue Plus', multiplier: 1.4, eta: 8, image: '🚙', seats: 4 },
  { id: 'xl', name: 'Blue XL', multiplier: 1.8, eta: 12, image: '🚐', seats: 6 },
];

export const MOCK_DRIVER: Driver = {
  id: 'd1',
  name: 'James Wilson',
  rating: 4.9,
  carModel: 'Toyota Camry',
  carPlate: 'ABC 1234',
  color: 'White',
  trips: 1420,
  location: { x: 50, y: 50 }
};

export const POPULAR_LOCATIONS: Location[] = [
  { name: 'Home', address: '123 Maple Street', coords: { x: 20, y: 80 } },
  { name: 'Office', address: 'Tech Plaza, Floor 4', coords: { x: 80, y: 20 } },
  { name: 'Central Mall', address: '45 Broad Avenue', coords: { x: 50, y: 50 } },
];
