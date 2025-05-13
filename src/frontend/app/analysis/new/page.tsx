"use client"

import type React from "react"

import { FileUploader } from "@/components/file-uploader"
import { TemplateSelect } from "@/components/templates-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useTemplates } from "@/hooks/use-templates"
import api from "@/lib/api"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
export default function NewAnalysisPage() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  // const templateQuery = searchParams.get('template')
    
  const [analysisType, setAnalysisType] = useState("single")
  const [sourceType, setSourceType] = useState("files")
  const [template, setTemplate] = useState(true)
  const [extractedTexts, setExtractedTexts] = useState<{text: string}[]>([]);

  const [categories, setCategories] = useState("")
  const { templates, loading, error } = useTemplates();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)

      if (template) {
        formData.set('categories', categories)      
      }
      // Добавляем все извлеченные тексты в FormData
      extractedTexts.forEach((item) => {
        formData.append(`docs`, item.text);
      });

      const response = await api.post(`/analysis/create`, formData)
      if (!response) throw new Error("Ошибка отправки");
    } catch (error) {
      console.error(error);
    }
    router.push("/analysis/processing")
  }
  const handleTextExtracted = (text: string) => {
    setExtractedTexts(prev => [...prev, { text }]);
  };
  // const handleTextExtracted = (text: string, fileName: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     content: prev.content + '\n\n' + text, // Добавляем к основному содержимому
  //     attachments: [...prev.attachments, { fileName, text }] // Сохраняем как вложение
  //   }));
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  
  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    alert(`Error: ${error.message}`);
  };

  return (
    <div className="flex flex-col items-center py-8 max-w-xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">New Source Analysis</h1>
        <p className="text-muted-foreground mt-2 text-center">Configure your analysis parameters and add sources to begin</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-col w-full">
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
                <Label htmlFor="description">Analysis Description (optional)</Label>
                <Input name="description" id="description" placeholder="Enter an analysis description" />
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
              <div className="grid gap-3">
                <CardDescription>Choose classes for analysis from:</CardDescription>
                <div className="grid gap-3">
                  <Label htmlFor="analysis-categories">Analysis Categories</Label>
                  <Input name="categories" id="analysis-categories" onInput={(e) => setTemplate(e.currentTarget.value === '')} placeholder="Enter a category or classes separated by comma for analysis"/>
                </div>

                <CardDescription>or...</CardDescription>
                
                <Label htmlFor="classification-template">Classification Templates</Label>
                {template ? (
                    <TemplateSelect 
                      templates={templates} 
                      onChange={setCategories}
                    /> 
                  ) : (
                    <Select disabled>
                      <SelectTrigger id="classification-template">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                    </Select>
                )}
                <CardDescription>To make analysis more efficient give it some context!</CardDescription>
                <div className="grid gap-3">
                  <Label htmlFor="examples">Examples (optional)</Label>
                  <Input name="examples" id="examples" placeholder="<Text>The weather is good tonight!<Prediction>Positive;" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Collection</CardTitle>
              <CardDescription>Add sources for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                {/* <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Sources</TabsTrigger>
                  <TabsTrigger value="automatic">Automatic Collection</TabsTrigger>
                </TabsList> */}
                <TabsContent value="manual" className="space-y-6">

                  {analysisType === "single" ? (
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
                    ) : (
                      <RadioGroup name="source_type" defaultValue="links" onValueChange={setSourceType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="links" id="links" />
                          <Label htmlFor="links" className="font-normal">
                            Add Links
                          </Label>
                        </div>
                      </RadioGroup>
                    )
                  }

                  {sourceType === "files" && analysisType === "single" ? (
                    <div className="grid gap-3">
                      <Label>Upload Documents</Label>
                      <FileUploader onTextExtracted={handleTextExtracted} onUploadError={handleUploadError}/>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: .txt, .docx, .pdf (Max 1MB per file)
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Label htmlFor="source-links">Source Links</Label>
                      <Textarea name="urls" id="source-links" placeholder="Enter URLs (one per line)" className="min-h-[120px]" required/>
                      <p className="text-xs text-muted-foreground">
                        Enter one URL per line. The system will crawl and analyze each link. (RSS-feed URLs for monitoring or single page URL for single analysis)
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
              Cancel
            </Button>
            { sourceType === "files" && analysisType === "single"  ? (
              <Button 
                type="submit"
                disabled={extractedTexts.length === 0}
              >
                  Start Analysis
              </Button>
            ) : (
              <Button type="submit">Start Analysis</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
