import { useMemo } from 'react';

const ActivityHeatmap = ({ activeDates = [] }) => {
    // UI Theme (Purple/Dark)
    const THEME = {
        background: '#111827', // gray-900
        empty: '#1f2937',      // gray-800
        active: '#c084fc',     // purple-400 (Brand Primary)
        activeDim: '#6b21a8',  // purple-800
        text: '#9CA3AF',       // gray-400
        border: '#374151'      // gray-700
    };

    const boxSize = 12;
    const gap = 3;
    const monthGap = 20; // Distinct gap between months

    const { days, monthLabels, totalWidth } = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);

        // Align start date to the preceding Sunday
        // This ensures the top-left is always a Sunday loop start
        const dayOfWeek = startDate.getDay();
        const alignedStartDate = new Date(startDate);
        alignedStartDate.setDate(startDate.getDate() - dayOfWeek);

        const daysArr = [];
        const monthLabelsArr = [];

        // Trackers
        let currentX = 0;
        let lastMonth = -1;

        // Iterate day by day from aligned start until today
        const currentDate = new Date(alignedStartDate);

        while (currentDate <= today) {
            const currentMonth = currentDate.getMonth();
            const currentDayOfWeek = currentDate.getDay(); // 0 = Sun


            // Logic to advance X position (New Column)
            // 1. If it's the 1st of a new month (distinct visual break)
            // 2. If it's Sunday (standard week break), UNLESS we just broke for the month

            // Check for month change first (Highest priority for the "Gap")
            if (currentMonth !== lastMonth) {
                if (lastMonth !== -1) {
                    // It's a new month, add the Month Gap
                    // If it's mid-week (e.g. Wed), this creates the jagged split
                    currentX += monthGap;
                }

                // Add label for the new month at this position
                // We only add label if we have enough predicted width or just place it
                monthLabelsArr.push({
                    name: currentDate.toLocaleString('default', { month: 'short' }),
                    x: currentX
                });

                lastMonth = currentMonth;
            } else if (currentDayOfWeek === 0 && daysArr.length > 0) {
                // If it's Sunday (and not the very first day), move to next column
                // standard gap
                currentX += boxSize + gap;
            }

            // Calculation for Y is standard
            const y = currentDayOfWeek * (boxSize + gap);

            daysArr.push({
                date: new Date(currentDate),
                x: currentX,
                y: y,
                month: currentMonth
            });

            // Advance
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Final width estimate
        return {
            days: daysArr,
            monthLabels: monthLabelsArr,
            totalWidth: currentX + boxSize + monthGap
        };
    }, []);

    const activeSet = useMemo(() => {
        return new Set((activeDates || []).map(d => new Date(d).toDateString()));
    }, [activeDates]);

    return (
        <div
            className="p-4 rounded-xl w-full overflow-hidden border"
            style={{
                backgroundColor: '#0d1117', // Github/Leetcode dark bg
                borderColor: THEME.border
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-200">Submission Calendar</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Total Active Days: {activeDates.length}</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                <svg width={Math.max(totalWidth, 800)} height={140} className="min-w-full">
                    <g transform="translate(0, 20)">
                        {days.map((dayObj, index) => {
                            const isFuture = dayObj.date > new Date();
                            const dateStr = dayObj.date.toDateString();
                            const isActive = activeSet.has(dateStr);

                            if (isFuture) return null;

                            return (
                                <rect
                                    key={index}
                                    x={dayObj.x}
                                    y={dayObj.y}
                                    width={boxSize}
                                    height={boxSize}
                                    rx={2}
                                    fill={isActive ? THEME.active : THEME.empty}
                                    className="transition-colors duration-200"
                                    stroke={THEME.border}
                                    strokeWidth={isActive ? 0 : 1}
                                >
                                    <title>{dateStr}: {isActive ? 'Solved' : 'No activity'}</title>
                                </rect>
                            );
                        })}
                    </g>

                    {/* Month Labels */}
                    {monthLabels.map((label, i) => (
                        <text
                            key={i}
                            x={label.x}
                            y={10}
                            fill={THEME.text}
                            fontSize="10"
                            className="font-mono"
                        >
                            {label.name}
                        </text>
                    ))}
                </svg>
            </div>

            <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: THEME.empty, border: `1px solid ${THEME.border}` }} />
                <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: THEME.activeDim }} />
                <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: THEME.active }} />
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
