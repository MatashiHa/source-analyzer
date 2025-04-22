"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Save, RotateCcw, ChevronDown } from "lucide-react"

// Types for our data model
interface Word {
  id: string
  text: string
  degree: "high" | "medium" | "low" | null
  selected?: boolean
}

interface ImpactLevel {
  degree: "high" | "medium" | "low"
  probability: number
  color: string
}

interface SourceTitle {
  id: string
  title: string
  words: Word[]
  impactLevels: ImpactLevel[]
}

// Sample data
const sampleSourceTitle: SourceTitle = {
  id: "1",
  title: "Climate Change Impact on Global Agriculture",
  words: [
    { id: "w1", text: "Climate", degree: "high" },
    { id: "w2", text: "Change", degree: "high" },
    { id: "w3", text: "Impact", degree: "high" },
    { id: "w4", text: "on", degree: null },
    { id: "w5", text: "Global", degree: "medium" },
    { id: "w6", text: "Agriculture", degree: "medium" },
  ],
  impactLevels: [
    { degree: "high", probability: 0.7, color: "bg-green-500" },
    { degree: "medium", probability: 0.25, color: "bg-blue-500" },
    { degree: "low", probability: 0.05, color: "bg-gray-500" },
  ],
}

export function MarkupEditor({
  isOpen,
  onClose,
  sourceId,
}: {
  isOpen: boolean
  onClose: () => void
  sourceId: string
}) {
  const [sourceTitle, setSourceTitle] = useState<SourceTitle>(sampleSourceTitle)
  const [activeTab, setActiveTab] = useState<"words" | "probabilities">("words")
  const [isDirty, setIsDirty] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)

  // Reset to initial state when sourceId changes
  useEffect(() => {
    // In a real app, you would fetch the source data based on sourceId
    setSourceTitle(sampleSourceTitle)
    setIsDirty(false)
    setSelectionMode(false)
  }, [sourceId])

  // Calculate default probabilities based on word-to-degree counts
  const recalculateProbabilities = () => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    }

    // Count words by degree
    sourceTitle.words.forEach((word) => {
      if (word.degree) {
        counts[word.degree]++
      }
    })

    const total = counts.high + counts.medium + counts.low

    if (total === 0) return // Avoid division by zero

    // Calculate new probabilities
    const newImpactLevels = sourceTitle.impactLevels.map((level) => ({
      ...level,
      probability: counts[level.degree] / total,
    }))

    setSourceTitle({
      ...sourceTitle,
      impactLevels: newImpactLevels,
    })

    setIsDirty(true)
  }


  // Toggle word selection
  const toggleWordSelection = (wordId: string) => {
    if (!selectionMode) return

    const updatedWords = sourceTitle.words.map((word) =>
      word.id === wordId ? { ...word, selected: !word.selected } : word,
    )

    setSourceTitle({
      ...sourceTitle,
      words: updatedWords,
    })
  }

  // Toggle selection mode
  const toggleSelectionMode = () => {
    if (selectionMode) {
      // Clear all selections when exiting selection mode
      const updatedWords = sourceTitle.words.map((word) => ({
        ...word,
        selected: false,
      }))

      setSourceTitle({
        ...sourceTitle,
        words: updatedWords,
      })
    }

    setSelectionMode(!selectionMode)
  }

  // Update word degree for a single word
  const handleWordDegreeChange = (wordId: string, degree: "high" | "medium" | "low" | null) => {
    const updatedWords = sourceTitle.words.map((word) => (word.id === wordId ? { ...word, degree } : word))

    setSourceTitle({
      ...sourceTitle,
      words: updatedWords,
    })

    setIsDirty(true)
  }

  // Apply degree to all selected words
  const applyDegreeToSelected = (degree: "high" | "medium" | "low" | null) => {
    const updatedWords = sourceTitle.words.map((word) => (word.selected ? { ...word, degree, selected: false } : word))

    setSourceTitle({
      ...sourceTitle,
      words: updatedWords,
    })

    setIsDirty(true)
    setSelectionMode(false)
  }

  // Count selected words
  const selectedCount = sourceTitle.words.filter((word) => word.selected).length

  // Update impact level probability
  const handleProbabilityChange = (degree: "high" | "medium" | "low", newValue: number) => {
    // Ensure probabilities sum to 1
    const otherLevels = sourceTitle.impactLevels.filter((level) => level.degree !== degree)
    const currentTotal = otherLevels.reduce((sum, level) => sum + level.probability, 0)
    const remaining = 1 - newValue

    // If remaining is negative, we can't adjust
    if (remaining < 0) return

    // Adjust other probabilities proportionally
    const adjustmentFactor = currentTotal > 0 ? remaining / currentTotal : 0

    const updatedLevels = sourceTitle.impactLevels.map((level) => {
      if (level.degree === degree) {
        return { ...level, probability: newValue }
      } else {
        return {
          ...level,
          probability: currentTotal > 0 ? level.probability * adjustmentFactor : remaining / otherLevels.length,
        }
      }
    })

    setSourceTitle({
      ...sourceTitle,
      impactLevels: updatedLevels,
    })

    setIsDirty(true)
  }

  // Save changes
  const handleSave = () => {
    // In a real app, you would save the changes to your backend
    console.log("Saving changes:", sourceTitle)
    setIsDirty(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Markup Editor</DialogTitle>
          <DialogDescription>Annotate words and assign impact level probabilities</DialogDescription>
        </DialogHeader>

        <div className="py-4 overflow-y-auto">
          <h3 className="font-medium text-lg mb-2">{sourceTitle.title}</h3>

          <Tabs
            defaultValue="words"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "words" | "probabilities")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="words">Word Annotation</TabsTrigger>
              <TabsTrigger value="probabilities">Impact Probabilities</TabsTrigger>
            </TabsList>

            <TabsContent value="words" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <Button variant={selectionMode ? "default" : "outline"} size="sm" onClick={toggleSelectionMode}>
                  {selectionMode ? "Exit Selection Mode" : "Select Multiple Words"}
                </Button>

                {selectionMode && selectedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{selectedCount} words selected</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => applyDegreeToSelected("high")}
                      >
                        High
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => applyDegreeToSelected("medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-gray-500 text-white hover:bg-gray-600"
                        onClick={() => applyDegreeToSelected("low")}
                      >
                        Low
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => applyDegreeToSelected(null)}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 p-4 border justify-center rounded-md min-h-[100px]">
                {sourceTitle.words.map((word) => (
                  <div key={word.id} className="flex justify-between">
                    <Badge
                      variant={word.degree ? "default" : "outline"}
                      className={`
                        h-8
                        ${
                          word.degree === "high"
                            ? "bg-green-500 hover:bg-green-400"
                            : word.degree === "medium"
                              ? "bg-blue-500 hover:bg-blue-400"
                              : word.degree === "low"
                                ? "bg-gray-500 hover:bg-gray-400"
                                : ""
                        }
                        ${word.selected ? "ring-2 ring-offset-1 ring-primary" : ""}
                      `}
                      onClick={() => (selectionMode ? toggleWordSelection(word.id) : null)}
                    >
                      {word.text}
                      {!selectionMode && (
                        <DropdownDegreeSelector
                          word={word}
                          onSelect={(degree) => handleWordDegreeChange(word.id, degree)}
                        />
                      )}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={recalculateProbabilities}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Recalculate Probabilities
                </Button>
              </div>

              <div className="bg-muted/40 p-3 rounded-md text-sm">
                <p>
                  <strong>Note:</strong> You can exclude unnecessary words from the analysis by pressing "Clear" on them.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="probabilities" className="space-y-4 mt-4">
              <div className="space-y-6">
                {sourceTitle.impactLevels.map((level) => (
                  <div key={level.degree} className="space-y-2">
                    <div className="flex justify-between">
                      <Label>{level.degree.charAt(0).toUpperCase() + level.degree.slice(1)} Impact</Label>
                      <span className="text-sm font-medium">{(level.probability * 100).toFixed(1)}%</span>
                    </div>
                    <Slider
                      value={[level.probability * 100]}
                      min={0}
                      max={100}
                      step={1}
                      className={level.color}
                      onValueChange={(value) => handleProbabilityChange(level.degree, value[0] / 100)}
                    />
                    <div className="text-xs text-muted-foreground">
                      {level.degree === "high"
                        ? "Words strongly indicating high impact"
                        : level.degree === "medium"
                          ? "Words indicating moderate impact"
                          : "Words indicating minimal impact"}
                    </div>
                  </div>
                ))}

                <div className="bg-muted/40 p-3 rounded-md text-sm">
                  <p>
                    <strong>Note:</strong> Probabilities are automatically adjusted to sum to 100%. Default values are
                    inferred from word annotations.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isDirty}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Component for selecting word degree
function DropdownDegreeSelector({
  word,
  onSelect,
}: {
  word: Word
  onSelect: (degree: "high" | "medium" | "low" | null) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (degree: "high" | "medium" | "low" | null) => {
    onSelect(degree)
    setIsOpen(false)
  }

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button
        className="h-5 w-5 rounded-full bg-background/20 hover:bg-background/40 flex items-center justify-center text-xs"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        aria-label="Select impact level"
      >
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-popover border rounded-md shadow-md z-10 w-36 text-muted-foreground">
          <div className="p-1 text-sm">
            <button
              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-muted flex items-center"
              onClick={() => handleSelect("high")}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              High Impact
            </button>
            <button
              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-muted flex items-center"
              onClick={() => handleSelect("medium")}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              Medium Impact
            </button>
            <button
              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-muted flex items-center"
              onClick={() => handleSelect("low")}
            >
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              Low Impact
            </button>
            {word.degree && (
              <>
                <div className="border-t my-1"></div>
                <button
                  className="w-full text-center px-2 py-1.5 rounded-sm hover:bg-muted text-destructive"
                  onClick={() => handleSelect(null)}
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
