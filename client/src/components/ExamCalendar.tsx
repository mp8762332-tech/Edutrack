import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ExamEvent {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  invigilators: number[];
  hasConflict?: boolean;
}

interface ExamCalendarProps {
  exams: ExamEvent[];
  onDateClick?: (date: Date) => void;
}

export function ExamCalendar({ exams, onDateClick }: ExamCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const buildCalendarDays = () => {
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
    return days;
  };

  const getExamsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return exams.filter((exam) => exam.date === dateStr);
  };

  const calendarDays = buildCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <div className="flex gap-2">
          <Button onClick={handlePrevMonth} variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={handleNextMonth} variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, idx) => {
          const dayExams = date ? getExamsForDate(date) : [];
          const hasConflict = dayExams.some((e) => e.hasConflict);
          const isToday = date && new Date().toDateString() === date.toDateString();
          const isCurrentMonth = date && date.getMonth() === currentMonth.getMonth();

          return (
            <div
              key={idx}
              onClick={() => date && onDateClick?.(date)}
              className={`min-h-24 p-2 border rounded cursor-pointer transition-colors ${
                !date ? "bg-gray-50" : ""
              } ${isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"} ${
                !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
              } ${hasConflict ? "border-red-300 bg-red-50" : ""} hover:bg-blue-100`}
            >
              {date && (
                <>
                  <div className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : ""}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayExams.slice(0, 2).map((exam) => (
                      <div
                        key={exam.id}
                        className={`text-xs p-1 rounded truncate ${
                          exam.hasConflict
                            ? "bg-red-200 text-red-800"
                            : "bg-purple-200 text-purple-800"
                        }`}
                        title={`${exam.subject} ${exam.startTime}-${exam.endTime}`}
                      >
                        {exam.subject}
                      </div>
                    ))}
                    {dayExams.length > 2 && (
                      <div className="text-xs text-gray-600 px-1">
                        +{dayExams.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-200 rounded"></div>
          <span>Exam Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>Conflict Detected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </Card>
  );
}
