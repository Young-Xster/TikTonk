import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function Scheduler({
  selectedDates,
  setSelectedDates,
  isPremium = false,
}) {
  const [events, setEvents] = useState([]);
  const [dailyPickCounts, setDailyPickCounts] = useState({});
  const [lastResetDate, setLastResetDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // Reset daily picks every 24 hours for free users
  useEffect(() => {
    const currentDate = moment().format("YYYY-MM-DD");
    if (!isPremium && currentDate !== lastResetDate) {
      setDailyPickCounts({});
      setLastResetDate(currentDate);
    }
  }, [isPremium, lastResetDate]);

  // Generate hourly time slots for a given date
  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 6; // Start from 6 AM
    const endHour = 23; // End at 11 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeSlot = moment(date).hour(hour).minute(0).second(0);
      slots.push({
        time: timeSlot.format("HH:mm"),
        datetime: timeSlot.toDate(),
        available: true,
      });
    }
    return slots;
  };

  const handleSlotSelect = ({ start }) => {
    const selectedDate = moment(start).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");

    // For free users, only allow current day
    if (!isPremium && selectedDate !== today) {
      alert(
        "Free users can only schedule for today. Upgrade to Premium to schedule for the entire month!"
      );
      return;
    }

    // Check daily limits
    const currentPickCount = dailyPickCounts[selectedDate] || 0;
    const userLimit = isPremium ? 5 : 2;

    if (currentPickCount >= userLimit) {
      alert(
        `You've reached your daily limit of ${userLimit} scheduled posts for ${selectedDate}.`
      );
      return;
    }

    // For free users, show ad on second pick
    if (!isPremium && currentPickCount === 1) {
      const watchAd = window.confirm(
        "Watch an ad to confirm this second pick of the day?"
      );
      if (!watchAd) {
        return;
      }
      alert(
        "Ad would play here... Ad completed! Your slot has been scheduled."
      );
    }

    const newEvent = {
      title: `Upload ${currentPickCount + 1}`,
      start,
      end: moment(start).add(30, "minutes").toDate(),
      id: Date.now(),
      resource: {
        pickNumber: currentPickCount + 1,
        isPremium: isPremium,
      },
    };

    const newEvents = [...events, newEvent];
    setEvents(newEvents);

    // Update daily pick count
    setDailyPickCounts((prev) => ({
      ...prev,
      [selectedDate]: currentPickCount + 1,
    }));

    // Update parent component's selected dates
    const newSelectedDates = [...selectedDates, start];
    setSelectedDates(newSelectedDates);
  };

  const handleEventSelect = (event) => {
    if (window.confirm("Do you want to remove this scheduled upload?")) {
      const eventDate = moment(event.start).format("YYYY-MM-DD");
      const updatedEvents = events.filter((e) => e.id !== event.id);
      setEvents(updatedEvents);

      // Decrease daily pick count
      setDailyPickCounts((prev) => ({
        ...prev,
        [eventDate]: Math.max(0, (prev[eventDate] || 0) - 1),
      }));

      // Update parent component's selected dates
      const updatedDates = selectedDates.filter(
        (date) =>
          moment(date).format("YYYY-MM-DD HH:mm") !==
          moment(event.start).format("YYYY-MM-DD HH:mm")
      );
      setSelectedDates(updatedDates);
    }
  };

  // Custom day cell renderer
  const CustomDayCellWrapper = ({ children, value }) => {
    const cellDate = moment(value).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    const isToday = cellDate === today;
    const isInteractable = isPremium || isToday;

    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          backgroundColor: isInteractable ? "transparent" : "#f5f5f5",
          opacity: isInteractable ? 1 : 0.6,
          cursor: isInteractable ? "pointer" : "not-allowed",
        }}
      >
        {children}
        {!isInteractable && (
          <div
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              backgroundColor: "#ffd700",
              color: "#000",
              fontSize: "10px",
              padding: "1px 4px",
              borderRadius: "8px",
              fontWeight: "bold",
              zIndex: 10,
            }}
          >
            PRO
          </div>
        )}
        {isInteractable && (
          <div
            style={{
              position: "absolute",
              bottom: "2px",
              left: "2px",
              fontSize: "10px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            {dailyPickCounts[cellDate] || 0}/{isPremium ? 5 : 2}
          </div>
        )}
      </div>
    );
  };

  // Time slot selection component
  const TimeSlotSelector = ({ selectedDate, onTimeSelect, onClose }) => {
    const timeSlots = generateTimeSlots(selectedDate);
    const dateString = moment(selectedDate).format("YYYY-MM-DD");
    const usedSlots = events
      .filter(
        (event) => moment(event.start).format("YYYY-MM-DD") === dateString
      )
      .map((event) => moment(event.start).format("HH:mm"));

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            maxHeight: "80vh",
            overflow: "auto",
            width: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ margin: 0, color: "#333" }}>
              Select Time for {moment(selectedDate).format("MMMM D, YYYY")}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#999",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {timeSlots.map((slot) => {
              const isUsed = usedSlots.includes(slot.time);
              return (
                <button
                  key={slot.time}
                  onClick={() => !isUsed && onTimeSelect(slot.datetime)}
                  disabled={isUsed}
                  style={{
                    padding: "0.75rem 0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    background: isUsed ? "#f5f5f5" : "#fff",
                    color: isUsed ? "#999" : "#333",
                    cursor: isUsed ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isUsed) {
                      e.target.style.borderColor = "#ff0050";
                      e.target.style.backgroundColor = "#fff5f5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUsed) {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.backgroundColor = "#fff";
                    }
                  }}
                >
                  {slot.time}
                  {isUsed && (
                    <div style={{ fontSize: "10px", color: "#999" }}>Used</div>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              fontSize: "0.875rem",
              color: "#666",
            }}
          >
            <strong>Picks used today:</strong>{" "}
            {dailyPickCounts[dateString] || 0}/{isPremium ? 5 : 2}
          </div>
        </div>
      </div>
    );
  };

  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [selectedSlotDate, setSelectedSlotDate] = useState(null);

  const handleDateClick = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");

    // For free users, only allow current day
    if (!isPremium && selectedDate !== today) {
      alert(
        "Free users can only schedule for today. Upgrade to Premium to schedule for the entire month!"
      );
      return;
    }

    setSelectedSlotDate(slotInfo.start);
    setShowTimeSelector(true);
  };

  const handleTimeSelect = (datetime) => {
    setShowTimeSelector(false);
    handleSlotSelect({ start: datetime });
  };

  const calendarStyle = {
    height: 500,
    margin: "2rem 0",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={calendarStyle}>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleDateClick}
        onSelectEvent={handleEventSelect}
        defaultView="month"
        views={["month"]}
        style={{ height: "100%" }}
        components={{
          dateCellWrapper: CustomDayCellWrapper,
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: isPremium ? "#ff0050" : "#ff6b35",
            borderRadius: "4px",
            opacity: 0.8,
            color: "white",
            border: "0px",
            display: "block",
            fontSize: "11px",
            padding: "2px 4px",
          },
        })}
        dayPropGetter={(date) => {
          const cellDate = moment(date).format("YYYY-MM-DD");
          const today = moment().format("YYYY-MM-DD");
          const isInteractable = isPremium || cellDate === today;

          return {
            style: {
              backgroundColor: isInteractable ? "transparent" : "#f9f9f9",
              cursor: isInteractable ? "pointer" : "not-allowed",
            },
          };
        }}
      />

      {showTimeSelector && (
        <TimeSlotSelector
          selectedDate={selectedSlotDate}
          onTimeSelect={handleTimeSelect}
          onClose={() => setShowTimeSelector(false)}
        />
      )}

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "0.875rem",
          color: "#666666",
        }}
      >
        <strong>Instructions:</strong> Click on a date to see available time
        slots (6 AM - 11 PM).
        <br />
        {isPremium ? (
          <span style={{ color: "#ff0050", fontWeight: "600" }}>
            Premium: Schedule up to 5 posts per day for the entire month.
          </span>
        ) : (
          <span>
            Free: Schedule up to 2 posts per day (today only).
            <span style={{ color: "#ffa500", fontWeight: "600" }}>
              {" "}
              Upgrade to Premium for full month access!
            </span>
          </span>
        )}
        <br />
        <strong>Total scheduled:</strong> {selectedDates.length} upload
        {selectedDates.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
