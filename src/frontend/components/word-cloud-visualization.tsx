"use client"

import { useState, useEffect } from "react"

// Mock word cloud data
const wordCloudData = [
  { text: "climate", value: 64 },
  { text: "change", value: 58 },
  { text: "emissions", value: 42 },
  { text: "carbon", value: 38 },
  { text: "policy", value: 35 },
  { text: "global", value: 32 },
  { text: "warming", value: 30 },
  // More words...
]

export function WordCloudVisualization() {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Create a simple custom word cloud visualization
  const renderCustomWordCloud = () => {
    // Sort words by value (frequency) for consistent rendering
    const sortedWords = [...wordCloudData].sort((a, b) => b.value - a.value)

    return (
      <div className="flex flex-wrap justify-center gap-2 p-4">
        {sortedWords.map((word, index) => {
          // Calculate font size based on word frequency (value)
          // Map the value range to font sizes between 0.8rem and 2.5rem
          const minValue = Math.min(...wordCloudData.map((w) => w.value))
          const maxValue = Math.max(...wordCloudData.map((w) => w.value))
          const fontSize = 0.8 + ((word.value - minValue) / (maxValue - minValue)) * 1.7

          // Assign colors based on index
          const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]
          const color = colors[index % colors.length]

          return (
            <span
              key={word.text}
              className="px-1 py-0.5 rounded hover:bg-muted/50 transition-colors cursor-default"
              style={{
                fontSize: `${fontSize}rem`,
                color: color,
                fontWeight: fontSize > 1.5 ? "bold" : "normal",
              }}
              title={`${word.text}: ${word.value} occurrences`}
            >
              {word.text}
            </span>
          )
        })}
      </div>
    )
  }

  // Render a placeholder if not mounted yet
  const renderPlaceholder = () => (
    <div className="bg-muted/40 rounded-lg p-6 h-[300px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading word cloud visualization...</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="h-[300px] overflow-auto border rounded-md">
        {isMounted ? renderCustomWordCloud() : renderPlaceholder()}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          This word cloud visualizes the most frequent terms across all analyzed sources. The size of each word
          corresponds to its frequency in the documents. Terms like "climate", "change", and "emissions" appear most
          prominently, highlighting the core focus of the research.
        </p>
      </div>
    </div>
  )
}
