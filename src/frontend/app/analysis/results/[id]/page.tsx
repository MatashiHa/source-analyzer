"use client"

import { MarkupEditor } from "@/components/markup-editor"
import { SourceSummary } from "@/components/source-summary"
import { SourceTable } from "@/components/source-table"
import { SourceVisualizations } from "@/components/source-visualizations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ChevronLeft, Edit, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ResultsPage() {
  const [timeRange, setTimeRange] = useState("all")
  const [isMarkupEditorOpen, setIsMarkupEditorOpen] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("visualizations");
  const [labeledSources, setLabeledSources] = useState<string[]>([])


  const openMarkupEditor = (sourceId: string) => {
    setSelectedSourceId(sourceId)
    setIsMarkupEditorOpen(true)
  }

  const getImpactBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="bg-green-500">High</Badge>
      case "medium":
        return <Badge className="bg-blue-500">Medium</Badge>
      case "low":
        return <Badge className="bg-gray-500">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const toggleLabeledStatus = (sourceId: string) => {
    setLabeledSources((prev) => (prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]))
  }

  const isSourceLabeled = (sourceId: string) => {
    return labeledSources.includes(sourceId)
  }

  const titlesToAnnotate = [
    {
      id: "1",
      title: "Climate Change Impact on Global Agriculture",
      impactLevel: "high",
      confidence: 0.92,
      labeled: false,
    },
    {
      id: "2",
      title: "Rising Sea Levels: A Comprehensive Analysis",
      impactLevel: "high",
      confidence: 0.87,
      labeled: false,
    },
    {
      id: "3",
      title: "The Economics of Climate Change Mitigation",
      impactLevel: "medium",
      confidence: 0.75,
      labeled: false,
    },
    {
      id: "4",
      title: "Climate Policy Developments in the EU",
      impactLevel: "medium",
      confidence: 0.68,
      labeled: false,
    },
    {
      id: "5",
      title: "Public Perception of Climate Change",
      impactLevel: "low",
      confidence: 0.55,
      labeled: false,
    },
  ]

  return (
    <div className="flex flex-col items-center py-8 mx-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-center">Climate Change Research</h1>
          <p className="text-muted-foreground mt-1 text-center">Analysis completed on July 12, 2023</p>
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
          <Tabs defaultValue="visualizations" className="w-full" onValueChange={(value) => setCurrentTab(value)}>
            <TabsList>
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="markup">Data Markup</TabsTrigger>
            </TabsList>
            {currentTab !== "markup" && (
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
              </div>
            )}

            <TabsContent value="visualizations" className="mt-4">
              <SourceVisualizations />
            </TabsContent>

            <TabsContent value="sources" className="mt-4">
              <SourceTable />
            </TabsContent>

            {/* <TabsContent value="classification" className="mt-4">
              <SourceClassification />
            </TabsContent> */}

            <TabsContent value="markup" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Markup</CardTitle>
                  <CardDescription>
                    Annotate source titles to refine impact level classification and probabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted/40 p-4 rounded-md">
                      <p className="text-sm">
                        Select a source text to annotate individual words and assign impact level probabilities.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {titlesToAnnotate.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{item.title}</h3>
                              {getImpactBadge(item.impactLevel)}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground">
                                Confidence: {(item.confidence * 100).toFixed(0)}%
                              </div>
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    item.impactLevel === "high"
                                      ? "bg-green-500"
                                      : item.impactLevel === "medium"
                                        ? "bg-blue-500"
                                        : "bg-gray-500"
                                  }`}
                                  style={{ width: `${item.confidence * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="ml-2" size="sm" onClick={() => openMarkupEditor(item.id)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Annotate
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toggleLabeledStatus(item.id)}
                              className={`${
                                isSourceLabeled(item.id)
                                  ? "bg-green-500 hover:bg-green-400"
                                  : ""
                              }`}
                              >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              {isSourceLabeled(item.id) ? "Labeled" : "Not Labeled"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-center">
                      <Button variant="default" className="ml-2" size="sm">
                        Commit and Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Markup Editor Modal */}
      {selectedSourceId && (
        <MarkupEditor
          isOpen={isMarkupEditorOpen}
          onClose={() => setIsMarkupEditorOpen(false)}
          sourceId={selectedSourceId}
        />
      )}
    </div>
  )
}

