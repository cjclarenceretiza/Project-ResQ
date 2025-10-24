"use client"

import type React from "react"
import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Copy, Check, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getOrCreateDeviceId, generateMissionPin } from "@/lib/device-id"

export default function CreateMissionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedPin, setGeneratedPin] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [pinCopied, setPinCopied] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return
    
    const newFiles = Array.from(fileList)
    const newPreviews: string[] = []

    newFiles.forEach(file => {
      if (file.type.startsWith("image/")) {
        newPreviews.push(URL.createObjectURL(file))
      }
    })

    setFiles(prevFiles => [...prevFiles, ...newFiles.filter(f => f.type.startsWith("image/"))])
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews])
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files)
  }

  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(previews[indexToRemove])
    
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove))
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove))

    if (fileInputRef.current) {
      fileInputRef.current.value = "" 
    }
  }

  const handleDivClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    processFiles(e.dataTransfer.files)
  }

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  useEffect(() => {
    const id = getOrCreateDeviceId()
    setDeviceId(id)
    setGeneratedPin(generateMissionPin())
  }, [])

  const handleCopyPin = () => {
    navigator.clipboard.writeText(generatedPin)
    setPinCopied(true)
    setTimeout(() => setPinCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    console.log("Files to upload:", files)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/missions")
  }

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/missions"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Relief Mission</h1>
          <p className="text-muted-foreground">
            Organize a disaster relief operation and connect with volunteers in your community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            
            {/* Mission Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Mission Title *</Label>
              <Input id="title" placeholder="e.g., Emergency Food Distribution - Barangay San Roque" required />
              <p className="text-xs text-muted-foreground">
                Be specific and include the location for better visibility
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="e.g., San Roque, Quezon City" required />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select mission category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food Distribution</SelectItem>
                  <SelectItem value="medical">Medical Assistance</SelectItem>
                  <SelectItem value="shelter">Shelter & Housing</SelectItem>
                  <SelectItem value="rescue">Rescue Operations</SelectItem>
                  <SelectItem value="supplies">Supplies & Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mission Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the mission, what help is needed, and any specific requirements..."
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Include details about the situation, what volunteers will do, and any special skills needed
              </p>
            </div>

            {/* Volunteers Needed */}
            <div className="space-y-2">
              <Label htmlFor="volunteers">Number of Volunteers Needed *</Label>
              <Input id="volunteers" type="number" min="1" placeholder="e.g., 15" required />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level *</Label>
              <Select required>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active - Standard Priority</SelectItem>
                  <SelectItem value="urgent">Urgent - Immediate Response Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* Mission Photo */}
            <div className="space-y-2">
              <Label htmlFor="image">Mission Photos (Optional)</Label>
              
              {/* Preview Grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {previews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={src} 
                        alt={`Preview ${index + 1}`} 
                        className="rounded-lg w-full h-32 object-cover" 
                      />
                      <button
                        type="button" 
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropzone */}
              <div 
                onClick={handleDivClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${isDragging 
                    ? 'border-[#ff4500] bg-[#ff4500]/10' 
                    : 'border-border hover:border-[#ff4500]/50'
                  }`}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>

              {/* Hidden File Input */}
              <input 
                id="image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple 
              />
            </div>

            {/* Organizer Info */}
            <div className="space-y-2">
              <Label htmlFor="organizer">Organization Name *</Label>
              <Input id="organizer" placeholder="e.g., Quezon City LGU" required />
              <p className="text-xs text-muted-foreground">
                Your organization will be publicly visible as the mission organizer
              </p>
            </div>
          </div>

          {/* Organizer ID */}
          <div className="bg-[#ff4500]/10 border border-[#ff4500]/20 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#ff4500] text-[#ff4500]-foreground rounded-full flex items-center justify-center text-sm font-bold">
                !
              </span>
               Organizer PIN
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save this PIN to manage your mission from any device. You'll need it to mark the mission as complete or
              make changes.
            </p>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="pin" className="text-xs mb-2 block">
                  PIN Code
                </Label>
                <Input id="pin" value={generatedPin} readOnly className="font-mono text-lg font-bold" />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleCopyPin} className="bg-transparent">
                {pinCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-[#ff4500]/10 border border-[#ff4500]/20 rounded-lg p-4">
            <p className="text-sm text-[#ff4500] font-medium mb-2">Transparency Commitment</p>
            <p className="text-xs text-muted-foreground">
              By creating this mission, you commit to providing regular updates, photos, and receipts to maintain
              transparency with volunteers and donors. This builds trust in the ResQ community.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-[#ff4500] text-[#ff4500]-foreground hover:bg-[#ff4500]/90"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Mission..." : "Create Mission"}
            </Button>
            <Link href="/missions" className="flex-1">
              <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}