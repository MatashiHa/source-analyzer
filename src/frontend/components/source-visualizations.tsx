"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const barData = [
  { name: "Scientific", primary: 42, secondary: 18 },
  { name: "Policy", primary: 28, secondary: 35 },
  { name: "Economic", primary: 15, secondary: 22 },
  { name: "Social", primary: 10, secondary: 15 },
  { name: "Technical", primary: 25, secondary: 10 },
]

const pieData = [
  { name: "High Impact", value: 35 },
  { name: "Medium Impact", value: 45 },
  { name: "Low Impact", value: 20 },
]

const lineData = [
  { date: "Jan", publications: 12 },
  { date: "Feb", publications: 19 },
  { date: "Mar", publications: 15 },
  { date: "Apr", publications: 25 },
  { date: "May", publications: 32 },
  { date: "Jun", publications: 28 },
  { date: "Jul", publications: 20 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function SourceVisualizations() {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure charts are only rendered after component is mounted
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Render a placeholder if not mounted yet
  const renderPlaceholder = () => (
    <div className="bg-muted/40 rounded-lg p-6 h-[300px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading visualization...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Source Distribution by Type</CardTitle>
            <CardDescription>Breakdown of primary and secondary sources by content type</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="primary" name="Primary Sources" fill="#0088FE" />
                  <Bar dataKey="secondary" name="Secondary Sources" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              renderPlaceholder()
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Distribution</CardTitle>
            <CardDescription>Percentage of sources by impact level</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              renderPlaceholder()
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publication Timeline</CardTitle>
          <CardDescription>Number of publications over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isMounted ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="publications"
                  name="Publications"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            renderPlaceholder()
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Word Cloud Visualization</CardTitle>
          <CardDescription>Most frequent terms across all sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Sources</TabsTrigger>
              <TabsTrigger value="primary">Primary Sources</TabsTrigger>
              <TabsTrigger value="secondary">Secondary Sources</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <div className="bg-muted/40 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Word cloud visualization would appear here</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (This is a placeholder for the actual word cloud component)
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="primary" className="pt-4">
              <div className="bg-muted/40 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Primary sources word cloud</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="secondary" className="pt-4">
              <div className="bg-muted/40 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Secondary sources word cloud</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

