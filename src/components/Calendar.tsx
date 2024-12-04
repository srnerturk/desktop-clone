import { useState } from 'react';
import Draggable from 'react-draggable';
import WindowControls from './WindowControls';

interface CalendarProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

const Calendar = ({ onClose, initialPosition }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const days = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`h-8 flex items-center justify-center cursor-pointer hover:bg-blue-100 rounded-full
            ${isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <Draggable
      handle=".window-header"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div className="absolute bg-white rounded-lg shadow-lg overflow-hidden w-[300px]">
        <div className="window-header bg-blue-600 text-white p-2 flex justify-between items-center">
          <span>Takvim</span>
          <WindowControls
            isMaximized={isMaximized}
            onMinimize={() => {}}
            onMaximize={() => setIsMaximized(!isMaximized)}
            onClose={onClose}
          />
        </div>

        <div className="p-4">
          {/* Ay ve Yıl Navigasyonu */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <span className="font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>

          {/* Günler Başlığı */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Takvim Günleri */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>

          {/* Bugünün Tarihi */}
          <div className="mt-4 text-center text-sm text-gray-600">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Calendar; 