"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTemplates } from "@/hooks/use-templates"
import { ChevronLeft, Tag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// Sample template data
const base = [
  {
    id: "0",
    name: "Default Template",
    description: "Standard classification template for general source analysis",
    categories: ["Source Type", "Content Type", "Impact Level", "Credibility"],
    isDefault: true,
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const { templates, loading, error } = useTemplates();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="flex flex-col items-center py-8 px-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Classification Templates</h1>
        <p className="text-muted-foreground mt-1 text-center">Manage your source classification templates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card key={base[0].id} className="relative">
            {base[0].isDefault && <Badge className="absolute top-4 right-4 bg-primary">Default</Badge>}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {base[0].name}
                  </CardTitle>
                  <CardDescription className="mt-1">{base[0].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {base[0].categories.map((category, i) => (
                      <Badge key={i} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between flex-col items-center">
              <Button size="sm" onClick={() => router.push(`/analysis/new?template=${base[0].id}`)}>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            {template.isDefault && <Badge className="absolute top-4 right-4 bg-primary">Default</Badge>}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {template.categories.map((category, i) => (
                      <Badge key={i} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between flex-col items-center">
              <Button size="sm" onClick={() => router.push(`/analysis/new?template=${template.id}`)}>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

