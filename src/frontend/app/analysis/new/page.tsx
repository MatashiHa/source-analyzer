"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"
import { ChevronLeft } from "lucide-react"
// import axios from "axios"
// axios.defaults.withCredentials=true
import api from "@/lib/api"
export default function NewAnalysisPage() {
  const router = useRouter()
  const [analysisType, setAnalysisType] = useState("single")
  const [sourceType, setSourceType] = useState("files")
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/analysis/create`, formData)
      const response = await api.post(`/analysis/create`, formData)
      if (!response) throw new Error("Ошибка отправки");
      console.log(formData)
      alert("Данные отправлены!");
    } catch (error) {
      console.error(error);
    }
    // In a real app, this would process the form data
    router.push("/analysis/processing")
  }

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

      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Source Analysis</h1>
        <p className="text-muted-foreground mt-2">Configure your analysis parameters and add sources to begin</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
              <CardDescription>Define the basic parameters for your analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="analysis-name">Analysis Name</Label>
                <Input name="name" id="analysis-name" placeholder="Enter a descriptive name" required />
              </div>

              <div className="grid gap-3">
                <Label>Analysis Type</Label>
                <RadioGroup name="type" defaultValue="single" onValueChange={setAnalysisType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="font-normal">
                      Single Analysis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monitoring" id="monitoring" />
                    <Label htmlFor="monitoring" className="font-normal">
                      Long-term Monitoring
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {/* {analysisType === "monitoring" && (
                <div className="grid gap-3">
                  <Label htmlFor="update-frequency">Update Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="update-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )} */}
              <div className="grid gap-3">
                <CardDescription>Choose classes for analysis from:</CardDescription>
                <div className="grid gap-3">
                  <Label htmlFor="analysis-name">Analysis Categories</Label>
                  <Input name="categories" id="analysis-name" placeholder="Enter a category or classes separated by comma for analysis" required />
                </div>

                <CardDescription>or...</CardDescription>

                <Label htmlFor="classification-template">Classification Templates</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="classification-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="academic">Academic Sources</SelectItem>
                    <SelectItem value="news">News Sources</SelectItem>
                    <SelectItem value="market">Market Research</SelectItem>
                    <SelectItem value="custom">Custom Template</SelectItem>
                  </SelectContent>
                </Select>
                <CardDescription>To make analysis more efficient give it some context!</CardDescription>
                <div className="grid gap-3">
                  <Label htmlFor="analysis-name">Examples (optional)</Label>
                  <Input name="examples" id="analysis-name" placeholder="<Text>The weather is good tonight!<Prediction>Positive;" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Collection</CardTitle>
              <CardDescription>Add sources for analysis or set parameters for automatic collection</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Sources</TabsTrigger>
                  <TabsTrigger value="automatic">Automatic Collection</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="space-y-6 pt-4">
                  <div className="grid gap-3">
                    <Label>Source Type</Label>
                    <RadioGroup name="source_type" defaultValue="files" onValueChange={setSourceType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="files" id="files" />
                        <Label htmlFor="files" className="font-normal">
                          Upload Files
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="links" id="links" />
                        <Label htmlFor="links" className="font-normal">
                          Add Links
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {sourceType === "files" ? (
                    <div className="grid gap-3">
                      <Label>Upload Documents</Label>
                      <FileUploader/>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: .txt, .docx, .pdf (Max 10MB per file)
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Label htmlFor="source-links">Source Links</Label>
                      <Textarea name="urls" id="source-links" placeholder="Enter URLs (one per line)" className="min-h-[120px]" required/>
                      <p className="text-xs text-muted-foreground">
                        Enter one URL per line. The system will crawl and analyze each link.
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="automatic" className="space-y-6 pt-4">
                  <div className="grid gap-3">
                    <Label htmlFor="topic-keywords">Topic Keywords</Label>
                    <Textarea
                      id="topic-keywords"
                      placeholder="Enter keywords separated by commas"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="source-limit">Maximum Sources</Label>
                    <Input id="source-limit" type="number" min="1" max="1000" defaultValue="100" />
                  </div>

                  <div className="grid gap-3">
                    <Label>Source Types to Include</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="news-sources" defaultChecked />
                        <Label htmlFor="news-sources" className="font-normal">
                          News Sources
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="academic-sources" defaultChecked />
                        <Label htmlFor="academic-sources" className="font-normal">
                          Academic Papers
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="blog-sources" defaultChecked />
                        <Label htmlFor="blog-sources" className="font-normal">
                          Blogs & Articles
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="social-sources" />
                        <Label htmlFor="social-sources" className="font-normal">
                          Social Media
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit">Start Analysis</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

{/* <Card>
  <CardHeader>
    <CardTitle>Analysis Options</CardTitle>
    <CardDescription>Configure visualization and output preferences</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label>Visualization Types</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <Switch id="bar-charts" defaultChecked />
          <Label htmlFor="bar-charts" className="font-normal">
            Bar Charts
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="word-clouds" defaultChecked />
          <Label htmlFor="word-clouds" className="font-normal">
            Word Clouds
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="dynamic-graphs" defaultChecked />
          <Label htmlFor="dynamic-graphs" className="font-normal">
            Dynamic Graphs
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="timeline" defaultChecked />
          <Label htmlFor="timeline" className="font-normal">
            Timeline
          </Label>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <Label>Output Options</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <Switch id="summary" defaultChecked />
          <Label htmlFor="summary" className="font-normal">
            Generate Summary
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="source-ranking" defaultChecked />
          <Label htmlFor="source-ranking" className="font-normal">
            Source Ranking
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="export-pdf" defaultChecked />
          <Label htmlFor="export-pdf" className="font-normal">
            Export as PDF
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="export-data" defaultChecked />
          <Label htmlFor="export-data" className="font-normal">
            Export Raw Data
          </Label>
        </div>
      </div>
    </div>
  </CardContent>
</Card> */}
