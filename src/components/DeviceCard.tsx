import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Fan, ThermometerSnowflake, Tv, Plug, Power, Settings2, Wind, RefreshCw, Sun, Clock } from 'lucide-react';
import { Device, ACMode } from '../types';

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
  onValueChange: (id: string, value: number) => void;
  onChangeSetting: (id: string, setting: Partial<Device>) => void;
}

const getDeviceIcon = (type: string, isOn: boolean) => {
  const props = {
    className: `w-6 h-6 ${isOn ? 'text-primary' : 'text-gray-400'}`,
  };
  
  switch (type) {
    case 'light': return <Lightbulb {...props} />;
    case 'fan': return <Fan {...props} className={isOn ? 'text-primary animate-[spin_3s_linear_infinite]' : 'text-gray-400'} />;
    case 'ac': return <ThermometerSnowflake {...props} />;
    case 'tv': return <Tv {...props} />;
    case 'plug': return <Plug {...props} />;
    default: return <Power {...props} />;
  }
};

const getDeviceStatus = (device: Device) => {
  if (device.isResponsive === false) return 'Offline';
  if (!device.isOn) return 'Off';
  if (device.type === 'light') return `${device.value}%`;
  if (device.type === 'ac') return `${device.value}°C`;
  if (device.type === 'fan') return `Speed ${device.value}`;
  return 'On';
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle, onValueChange, onChangeSetting }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasGranularSettings = device.type === 'light' || device.type === 'fan' || device.type === 'ac';
  
  const isUnresponsive = device.isResponsive === false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
        isUnresponsive ? 'opacity-60 grayscale-[0.8]' : ''
      } ${
        device.isOn && !isUnresponsive
          ? 'bg-dark-card border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'bg-dark-card/50 border border-dark-border'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-full ${device.isOn ? 'bg-primary/20' : 'bg-gray-800'}`}>
          {getDeviceIcon(device.type, device.isOn)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              // we don't auto-close anymore to allow schedule editing while off
              onToggle(device.id);
            }}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              device.isOn ? 'bg-primary' : 'bg-gray-600'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm"
              animate={{ x: device.isOn ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      <div className="mt-2 text-left">
        <h3 className="font-semibold text-gray-100 text-sm truncate">{device.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{getDeviceStatus(device)}</p>
      </div>

      {(device.isOn && device.value !== undefined || isExpanded) && (
        <div className="mt-4 pt-3 border-t border-dark-border/50">
          {device.isOn && device.value !== undefined && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{device.type === 'ac' ? 'Temperature' : device.type === 'fan' ? 'Speed' : 'Brightness'}</span>
                <span>{getDeviceStatus(device)}</span>
              </div>
              <input
                type="range"
                min={device.type === 'ac' ? 16 : 1}
                max={device.type === 'ac' ? 30 : device.type === 'fan' ? 5 : 100}
                value={device.value}
                onChange={(e) => onValueChange(device.id, parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-2 border-t border-dark-border/50 space-y-4">
                  
                  {/* Schedule Controls */}
                  <div>
                    <span className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Schedule</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Turn On At</label>
                        <input 
                          type="time" 
                          value={device.schedule?.timeOn || ''} 
                          onChange={(e) => onChangeSetting(device.id, { schedule: { ...device.schedule, timeOn: e.target.value } })}
                          className="bg-gray-800 text-xs text-gray-200 p-1.5 rounded-md border border-gray-700 focus:outline-none focus:border-primary w-full [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Turn Off At</label>
                        <input 
                          type="time" 
                          value={device.schedule?.timeOff || ''} 
                          onChange={(e) => onChangeSetting(device.id, { schedule: { ...device.schedule, timeOff: e.target.value } })}
                          className="bg-gray-800 text-xs text-gray-200 p-1.5 rounded-md border border-gray-700 focus:outline-none focus:border-primary w-full [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Light Granular Controls */}
                  {device.type === 'light' && device.colorTemp !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-2 items-center">
                        <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Color Temp</span>
                        <span>{device.colorTemp}K</span>
                      </div>
                      <div className="relative w-full h-2 rounded-lg" style={{ background: 'linear-gradient(to right, #ff9e3d, #ffd495, #fff, #ccf2ff, #99ddff)' }}>
                        <input
                          type="range"
                          min="2700"
                          max="6500"
                          step="100"
                          value={device.colorTemp}
                          onChange={(e) => onChangeSetting(device.id, { colorTemp: parseInt(e.target.value) })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* Custom thumb tracker indicator */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm border border-gray-200 pointer-events-none"
                          style={{ left: `calc(${((device.colorTemp - 2700) / (6500 - 2700)) * 100}% - 8px)` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fan Granular Controls */}
                  {device.type === 'fan' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${device.oscillation ? 'text-primary animate-spin' : 'text-gray-500'}`} style={{ animationDuration: '4s' }} /> 
                        Oscillation
                      </span>
                      <button
                        onClick={() => onChangeSetting(device.id, { oscillation: !device.oscillation })}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          device.oscillation ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                        }`}
                      >
                        {device.oscillation ? 'On' : 'Off'}
                      </button>
                    </div>
                  )}

                  {/* AC Granular Controls */}
                  {device.type === 'ac' && device.mode && (
                    <div>
                      <span className="text-xs text-gray-400 mb-2 block">Operating Mode</span>
                      <div className="flex gap-2">
                        {(['cool', 'heat', 'fan', 'dry', 'auto'] as ACMode[]).map(mode => (
                          <button
                            key={mode}
                            onClick={() => onChangeSetting(device.id, { mode })}
                            className={`flex-1 capitalize text-xs py-1.5 rounded-md transition-colors ${
                              device.mode === mode 
                                ? mode === 'cool' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : mode === 'heat' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
