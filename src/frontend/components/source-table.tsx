"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, ArrowUpDown, ExternalLink } from "lucide-react"

// Define the Source type
interface Source {
  id: string
  title: string
  type: string
  date: string
  relevance: number
  classification: string[]
}

// Update the sources array to include more explicit impact level percentages
const sources: Source[] = [
  {
    id: "1",
    title: "Climate Change Impact on Global Agriculture",
    type: "Academic Paper",
    date: "2023-05-12",
    relevance: 92,
    classification: ["Primary", "Scientific", "High Impact"],
  },
  {
    id: "2",
    title: "Rising Sea Levels: A Comprehensive Analysis",
    type: "Research Report",
    date: "2023-04-18",
    relevance: 87,
    classification: ["Primary", "Scientific"],
  },
  {
    id: "3",
    title: "The Economics of Climate Change Mitigation",
    type: "Journal Article",
    date: "2023-06-02",
    relevance: 85,
    classification: ["Secondary", "Economic"],
  },
  {
    id: "4",
    title: "Climate Policy Developments in the EU",
    type: "News Article",
    date: "2023-07-01",
    relevance: 78,
    classification: ["Secondary", "Policy"],
  },
  {
    id: "5",
    title: "Public Perception of Climate Change",
    type: "Survey Report",
    date: "2023-03-15",
    relevance: 72,
    classification: ["Primary", "Social"],
  },
  {
    id: "6",
    title: "Technological Solutions for Carbon Capture",
    type: "Technical Report",
    date: "2023-05-28",
    relevance: 89,
    classification: ["Primary", "Technical", "High Impact"],
  },
  {
    id: "7",
    title: "Climate Change and Biodiversity Loss",
    type: "Research Paper",
    date: "2023-02-10",
    relevance: 81,
    classification: ["Primary", "Scientific"],
  },
]

// Replace the SourceTable function with this updated version
export function SourceTable() {
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [sortField, setSortField] = useState<"relevance" | "date">("relevance")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSource = (id: string) => {
    setSelectedSources((prev) => (prev.includes(id) ? prev.filter((sourceId) => sourceId !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedSources(selectedSources.length === sources.length ? [] : sources.map((source) => source.id))
  }

  const toggleSort = (field: "relevance" | "date") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filter sources based on search query
  const filteredSources = sources.filter((source) => {
    if (!searchQuery) return true
    return (
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.classification.some((cls) => cls.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Sort sources based on sort field and direction
  const sortedSources = [...filteredSources].sort((a, b) => {
    if (sortField === "relevance") {
      return sortDirection === "asc" ? a.relevance - b.relevance : b.relevance - a.relevance
    } else {
      // Sort by date
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search sources..."
            className="h-9"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="sm" variant="ghost" className="h-9 px-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={selectedSources.length === 0}>
            Export Selected
          </Button>
        </div> */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>
                <Checkbox
                  checked={selectedSources.length === filteredSources.length && filteredSources.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead> */}
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Source</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {/* <TableHead>Type</TableHead> */}
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => toggleSort("date")}>
                  <span>Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => toggleSort("relevance")}>
                  <span>Impact Level</span>
                  <ArrowUpDown className={`h-3 w-3 ${sortField === "relevance" ? "text-primary" : ""}`} />
                </div>
              </TableHead>
              {/* <TableHead>Classification</TableHead> */}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSources.map((source) => (
              <TableRow key={source.id}>
                {/* <TableCell>
                  <Checkbox
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                  />
                </TableCell> */}
                <TableCell>
                  <div className="font-medium">{source.title}</div>
                </TableCell>
                {/* <TableCell>{source.type}</TableCell> */}
                <TableCell>{new Date(source.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-10 text-right">{source.relevance}%</div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${source.relevance >= 85 ? "bg-green-500" : source.relevance >= 75 ? "bg-blue-500" : "bg-primary"}`}
                        style={{ width: `${source.relevance}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                {/* <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {source.classification.map((cls, i) => (
                      <Badge key={i} variant={cls.includes("High Impact") ? "default" : "outline"}>
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </TableCell> */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Source
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>Edit Classification</DropdownMenuItem>
                      <DropdownMenuItem>Add to Favorites</DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Showing {sortedSources.length} of {sources.length} sources
        </div>
        <div>
          Sorted by: <span className="font-medium">{sortField === "relevance" ? "Impact Level" : "Date"}</span> (
          {sortDirection === "desc" ? "highest first" : "lowest first"})
        </div>
      </div>
    </div>
  )
}
