export type Room = 'Living Room' | 'Bedroom' | 'Kitchen' | 'Bathroom';

export type DeviceType = 'light' | 'fan' | 'ac' | 'tv' | 'plug';
export type ACMode = 'cool' | 'heat' | 'fan' | 'dry' | 'auto';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: Room;
  isOn: boolean;
  value?: number; // brightness, temperature, or speed
  colorTemp?: number; // Light color temperature (e.g. 2700 - 6500)
  oscillation?: boolean; // Fan oscillation
  mode?: ACMode; // AC mode
}
