"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for impact levels over time
const impactTimelineData = [
  {
    month: "Jan",
    highImpact: 12,
    mediumImpact: 18,
    lowImpact: 8,
  },
  {
    month: "Feb",
    highImpact: 15,
    mediumImpact: 20,
    lowImpact: 10,
  },
  {
    month: "Mar",
    highImpact: 18,
    mediumImpact: 22,
    lowImpact: 9,
  },
  {
    month: "Apr",
    highImpact: 20,
    mediumImpact: 25,
    lowImpact: 12,
  },
  {
    month: "May",
    highImpact: 25,
    mediumImpact: 30,
    lowImpact: 14,
  },
  {
    month: "Jun",
    highImpact: 30,
    mediumImpact: 28,
    lowImpact: 15,
  },
  {
    month: "Jul",
    highImpact: 28,
    mediumImpact: 25,
    lowImpact: 13,
  },
]

export function ImpactTimeline() {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure chart is only rendered after component is mounted
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Render a placeholder if not mounted yet
  const renderPlaceholder = () => (
    <div className="bg-muted/40 rounded-lg p-6 h-[350px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading impact timeline visualization...</p>
      </div>
    </div>
  )

  return (
    <div>
      {isMounted ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={impactTimelineData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                const formattedName =
                  name === "highImpact" ? "High Impact" : name === "mediumImpact" ? "Medium Impact" : "Low Impact"
                return [value, formattedName]
              }}
            />
            <Legend
              formatter={(value) => {
                return value === "highImpact"
                  ? "High Impact"
                  : value === "mediumImpact"
                    ? "Medium Impact"
                    : "Low Impact"
              }}
            />
            <Line type="monotone" dataKey="highImpact" stroke="#0088FE" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="mediumImpact" stroke="#00C49F" strokeWidth={2} />
            <Line type="monotone" dataKey="lowImpact" stroke="#FFBB28" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        renderPlaceholder()
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          This chart shows the change in number of sources by impact level over time. High impact sources have increased
          significantly in May and June, indicating growing research interest in climate change topics.
        </p>
      </div>
    </div>
  )
}
