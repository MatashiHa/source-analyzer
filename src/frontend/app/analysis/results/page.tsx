"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Download, Share2, Bookmark, Filter, BarChart2, PieChart, LineChart, Cloud } from "lucide-react"
import { SourceTable } from "@/components/source-table"
import { SourceClassification } from "@/components/source-classification"
import { SourceVisualizations } from "@/components/source-visualizations"
import { SourceSummary } from "@/components/source-summary"

export default function ResultsPage() {
  const [timeRange, setTimeRange] = useState("all")

  return (
    <div className="flex flex-col items-center py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-center">Climate Change Research</h1>
          <p className="text-muted-foreground mt-1">Analysis completed on July 12, 2023 • 142 sources analyzed</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
            <CardDescription>Overview of the analyzed sources and key findings</CardDescription>
          </CardHeader>
          <CardContent>
            <SourceSummary />
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
          <Tabs defaultValue="visualizations" className="w-full">
            <TabsList>
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="markup">Data Markup</TabsTrigger>
            </TabsList>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <PieChart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Cloud className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="visualizations" className="mt-4">
              <SourceVisualizations />
            </TabsContent>

            <TabsContent value="sources" className="mt-4">
              <SourceTable />
            </TabsContent>

            <TabsContent value="classification" className="mt-4">
              <SourceClassification />
            </TabsContent>

            <TabsContent value="markup" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Data Markup Tools</h3>
                    <p className="text-muted-foreground mb-4">
                      Use the markup tools to annotate and categorize specific data points
                    </p>
                    <Button>Open Markup Editor</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

