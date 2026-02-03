import { useMemo } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ activeDates = [] }) => {
    // Helper to get days in a month
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    // Group dates by month for the last year
    const monthsData = useMemo(() => {
        const today = new Date();
        const months = [];

        // We want to show roughly the last 12 months. 
        // Let's iterate backwards 11 months from current + current month = 12 months.
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const year = d.getFullYear();
            const monthIndex = d.getMonth(); // 0-11
            const monthName = d.toLocaleString('default', { month: 'short' });
            const daysInMonth = getDaysInMonth(year, monthIndex);

            // Generate weeks for this specific month
            const weeks = [];
            let currentWeek = Array(7).fill(null); // filled with null initially

            // Fill initial empty days if month doesn't start on Sunday
            // getDay(): 0 = Sunday, 1 = Monday...
            const startDay = new Date(year, monthIndex, 1).getDay();

            // Determine active status for each day
            for (let day = 1; day <= daysInMonth; day++) {
                const dateObj = new Date(year, monthIndex, day);
                const dayOfWeek = dateObj.getDay();

                // If it's a new week (and not the very first iteration where startDay might be > 0), push old week and reset
                // But specifically for the grid logic:
                // We just place 'day' at 'dayOfWeek'. 
                // If dayOfWeek is 0 (Sunday) and we have data in currentWeek, implies new row??
                // Actually typical heatmap columns are WEEKS (vertical). Rows are DAYS (horizontal).
                // Wait, standard contribution graph:
                // Columns = Weeks.
                // Rows = Days (Sun, Mon, Tue...).
                // So day 1 (say Wed) goes to Column 0, Row 3.
                // day 2 (Thu) goes to Column 0, Row 4.

                // We need to build COLUMNS.
                // Algorithm:
                // 1. Calculate which "Week Index" of the month this day belongs to.
                // Week 0: days before first Saturday...
                // Actually simpler: Just push days into a flat array of "slots" for the month, allowing for offsets.

                // Let's assume standard Column-first flow (Weeks are columns).
                // Column 0: may have empty slots at top.
            }

            // REVISED ALGORITHM for Column-based Month view
            const totalSlots = startDay + daysInMonth;
            const numWeeks = Math.ceil(totalSlots / 7);

            const monthWeeks = [];
            for (let w = 0; w < numWeeks; w++) {
                const weekData = Array(7).fill(null);
                for (let d = 0; d < 7; d++) {
                    const dayIndex = (w * 7) + d; // absolute index in the month's grid
                    const dayNum = dayIndex - startDay + 1;

                    if (dayNum > 0 && dayNum <= daysInMonth) {
                        weekData[d] = new Date(year, monthIndex, dayNum);
                    }
                }
                monthWeeks.push(weekData);
            }

            months.push({
                name: monthName,
                year,
                weeks: monthWeeks
            });
        }
        return months;
    }, []);

    const activeSet = useMemo(() => {
        return new Set((activeDates || []).map(d => new Date(d).toDateString()));
    }, [activeDates]);

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 w-full overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">Activity History</h3>

            <div className="flex gap-4 min-w-max pb-2">
                {monthsData.map((month, mIndex) => (
                    <div key={mIndex} className="flex flex-col gap-2">
                        {/* Month Label */}
                        <span className="text-xs text-gray-400 font-medium h-4 block text-center w-full">
                            {month.name}
                        </span>

                        {/* Month Grid */}
                        <div className="flex gap-[3px]">
                            {month.weeks.map((week, wIndex) => (
                                <div key={wIndex} className="flex flex-col gap-[3px]">
                                    {week.map((date, dIndex) => {
                                        if (!date) {
                                            // Empty slot (padding for start/end of month)
                                            return <div key={dIndex} className="w-3 h-3" />;
                                        }

                                        const isActive = activeSet.has(date.toDateString());
                                        return (
                                            <motion.div
                                                key={dIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: (mIndex * 0.1) + (wIndex * 0.01) }}
                                                className={`w-3 h-3 rounded-sm ${isActive
                                                        ? 'bg-purple-500 shadow-glow-purple-subtle'
                                                        : 'bg-gray-700/30 hover:bg-gray-700'
                                                    }`}
                                                title={date.toDateString()}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-700/30 rounded-sm"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
