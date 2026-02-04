import { useMemo } from 'react';
// import { motion } from 'framer-motion';

const ActivityHeatmap = ({ activeDates = [] }) => {
    // Generate last 365 days data for continuous grid
    const { weeks, monthLabels } = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);

        // Adjust start date to previous Sunday to align grid
        const dayOfWeek = startDate.getDay();
        const alignedStartDate = new Date(startDate);
        alignedStartDate.setDate(startDate.getDate() - dayOfWeek);

        const weeksArr = [];
        const monthLabelsArr = [];
        let currentMonth = -1;

        // Iterate week by week
        const currentDate = new Date(alignedStartDate);

        // We need 53 weeks to cover a full year safely
        for (let w = 0; w < 53; w++) {
            const weekData = [];

            // Check month of the first day of this week to determine label placement
            const firstDayOfMonth = currentDate.getMonth();
            if (firstDayOfMonth !== currentMonth) {
                // Determine label position (approximate centered above the month's start)
                monthLabelsArr.push({
                    name: currentDate.toLocaleString('default', { month: 'short' }),
                    x: w * 12 // 10px box + 2px gap = 12px
                });
                currentMonth = firstDayOfMonth;
            }

            for (let d = 0; d < 7; d++) {
                // If date is in future relative to "today" (real today), we treat it as empty or future slot
                const validDate = new Date(currentDate);
                // In LeetCode, future days are just empty slots
                // We render them
                weekData.push({ date: validDate, offset: d });

                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeksArr.push(weekData);
        }

        return { weeks: weeksArr, monthLabels: monthLabelsArr };
    }, []);

    const activeSet = useMemo(() => {
        return new Set((activeDates || []).map(d => new Date(d).toDateString()));
    }, [activeDates]);

    // Dimensions
    const boxSize = 10;
    const gap = 2; // LeetCode style is tight
    const width = 53 * (boxSize + gap);
    const height = 7 * (boxSize + gap) + 20; // +20 for labels

    return (
        <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-200">Submission Calendar</h3>
                <span className="text-xs text-gray-500">Last 12 Months</span>
            </div>

            <div className="overflow-x-auto">
                <svg width={width} height={height} className="mx-auto block">
                    {/* Month Labels */}
                    {monthLabels.map((label, i) => (
                        <text
                            key={i}
                            x={label.x}
                            y={10}
                            fill="#9CA3AF"
                            fontSize="10"
                            fontFamily="monospace"
                        >
                            {label.name}
                        </text>
                    ))}

                    {/* Grid */}
                    <g transform="translate(0, 20)">
                        {weeks.map((week, wIndex) => (
                            <g key={wIndex} transform={`translate(${wIndex * (boxSize + gap)}, 0)`}>
                                {week.map((dayObj, dIndex) => {
                                    const isFuture = dayObj.date > new Date();
                                    if (isFuture) return null; // Don't render future squares? Or render empty. LeetCode renders empty.

                                    const isActive = activeSet.has(dayObj.date.toDateString());
                                    // LeetCode Green Scale (approx)
                                    const fill = isActive ? '#2cbb5d' : '#2d2d2d';

                                    return (
                                        <rect
                                            key={dIndex}
                                            y={dIndex * (boxSize + gap)}
                                            width={boxSize}
                                            height={boxSize}
                                            fill={fill}
                                            rx={2} // Rounded corners
                                            className="hover:stroke-white hover:stroke-1 transition-all duration-300"
                                        >
                                            <title>{dayObj.date.toDateString()}</title>
                                        </rect>
                                    );
                                })}
                            </g>
                        ))}
                    </g>
                </svg>
            </div>

            <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                <span>Less</span>
                <div className="w-2.5 h-2.5 bg-[#2d2d2d] rounded-[2px]" />
                <div className="w-2.5 h-2.5 bg-[#2cbb5d] rounded-[2px]" />
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
