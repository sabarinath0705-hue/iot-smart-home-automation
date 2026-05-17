import { Device } from './types';

export const initialDevices: Device[] = [
  { id: '1', name: 'Main Lights', type: 'light', room: 'Living Room', isOn: true, value: 75, colorTemp: 4000 },
  { id: '2', name: 'AC', type: 'ac', room: 'Living Room', isOn: false, value: 24, mode: 'cool' },
  { id: '3', name: 'TV Power', type: 'tv', room: 'Living Room', isOn: false },
  { id: '4', name: 'Ceiling Fan', type: 'fan', room: 'Bedroom', isOn: true, value: 3, oscillation: true },
  { id: '5', name: 'Night Lamp', type: 'light', room: 'Bedroom', isOn: false, value: 30, colorTemp: 2700 },
  { id: '6', name: 'Coffee Maker', type: 'plug', room: 'Kitchen', isOn: false },
  { id: '7', name: 'Mirror Light', type: 'light', room: 'Bathroom', isOn: false, value: 100, colorTemp: 5500 },
];
