import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Settings, Activity, CloudRain, Thermometer, Zap, Bell, User, AlertCircle, X } from 'lucide-react';
import { initialDevices } from './data';
import { Device, Room } from './types';
import { DeviceCard } from './components/DeviceCard';

const ROOMS: Room[] = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom'];

export default function App() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [activeRoom, setActiveRoom] = useState<Room>('Living Room');
  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);
  
  const activeDevices = useMemo(() => {
    return devices.filter(d => d.room === activeRoom);
  }, [devices, activeRoom]);

  const addToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const toggleDevice = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    if (device.isResponsive === false) {
      addToast(`${device.name} is currently offline and unresponsive.`);
      return;
    }

    setDevices(prev => 
      prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d)
    );

    // Simulate network error (15% chance of failure)
    setTimeout(() => {
      if (Math.random() < 0.15) {
        setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: device.isOn } : d));
        addToast(`Command failed: Could not turn ${device.name} ${!device.isOn ? 'on' : 'off'}.`);
      }
    }, 500);
  };

  const changeDeviceValue = (id: string, value: number) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    if (device.isResponsive === false) {
      addToast(`${device.name} is unresponsive. Cannot apply settings.`);
      return;
    }

    setDevices(prev => 
      prev.map(d => d.id === id ? { ...d, value } : d)
    );
  };

  const changeDeviceSetting = (id: string, setting: Partial<Device>) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    if (device.isResponsive === false) {
      addToast(`${device.name} is unresponsive. Cannot apply settings.`);
      return;
    }

    setDevices(prev => 
      prev.map(d => d.id === id ? { ...d, ...setting } : d)
    );
  };

  const activeCount = useMemo(() => devices.filter(d => d.isOn).length, [devices]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-gray-100 selection:bg-primary/30 pb-20 md:pb-0 md:flex-row overflow-x-hidden">
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg w-full md:min-w-[300px]"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-red-400 hover:text-red-200 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Sidebar / Bottom Nav Spacer for desktop padding */}
      <aside className="hidden md:flex flex-col w-24 border-r border-dark-border bg-dark-card items-center py-8 gap-8 fixed h-full z-50">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-8">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <NavIcon icon={<Home />} active />
        <NavIcon icon={<Activity />} />
        <NavIcon icon={<Settings />} />
        
        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            <User className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pl-32 md:pb-6 relative min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Good Morning, Alex</h1>
            <p className="text-sm text-gray-400 mt-1">{activeCount} devices active right now</p>
          </div>
          <button className="relative w-10 h-10 rounded-full border border-dark-border flex items-center justify-center bg-dark-card shadow-sm">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border border-dark-card"></span>
          </button>
        </header>

        {/* Global Sensor Readouts */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SensorCard icon={<Thermometer className="text-orange-400" />} label="Temperature" value="23°C" />
          <SensorCard icon={<CloudRain className="text-blue-400" />} label="Humidity" value="45%" />
          <SensorCard icon={<Zap className="text-yellow-400" />} label="Power Usage" value="1.2 kW" />
          <SensorCard icon={<Activity className="text-accent" />} label="Air Quality" value="Good" />
        </section>

        {/* Room Selection */}
        <section className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
            {ROOMS.map(room => (
              <button
                key={room}
                onClick={() => setActiveRoom(room)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                  activeRoom === room 
                    ? 'bg-white text-dark-bg' 
                    : 'bg-dark-card text-gray-400 hover:bg-gray-800 border border-dark-border'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </section>

        {/* Devices Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{activeRoom} Devices</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {activeDevices.map(device => (
                <DeviceCard 
                  key={device.id} 
                  device={device} 
                  onToggle={toggleDevice} 
                  onValueChange={changeDeviceValue}
                  onChangeSetting={changeDeviceSetting}
                />
              ))}
            </AnimatePresence>
            {activeDevices.length === 0 && (
              <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-500 bg-dark-card/30 rounded-2xl border border-dark-border border-dashed">
                <Zap className="w-8 h-8 mb-2 opacity-50 text-gray-400" />
                <p>No devices in this room.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card/80 backdrop-blur-md border-t border-dark-border h-16 flex items-center justify-around z-50 px-4">
        <NavIcon icon={<Home />} active mobile />
        <NavIcon icon={<Activity />} mobile />
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -translate-y-4 shadow-[0_4px_20px_rgba(59,130,246,0.4)]">
           <Zap className="w-5 h-5 text-white" />
        </div>
        <NavIcon icon={<Bell />} mobile />
        <NavIcon icon={<Settings />} mobile />
      </nav>
    </div>
  );
}

// Utility Components
const SensorCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-center gap-4">
    <div className="p-2.5 bg-gray-800/80 rounded-xl">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 ' + (icon as any).props.className })}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

const NavIcon = ({ icon, active = false, mobile = false }: { icon: React.ReactNode, active?: boolean, mobile?: boolean }) => (
  <button className={`flex items-center justify-center transition-colors ${
    active ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
  } ${mobile ? 'w-10 h-10' : 'w-12 h-12 rounded-xl hover:bg-gray-800/80'}`}>
    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
  </button>
);
