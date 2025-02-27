'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { UploadDropzone } from "@/utils/uploadthing"
import { toast } from "@/hooks/use-toast"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  disabled
}: ImageUploadProps) {
  if (disabled) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
        {value && (
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              onChange(res[0].url)
              toast({
                title: "Success",
                description: "Image uploaded successfully",
              })
            }
          }}
          onUploadError={(error) => {
            toast({
              title: "Error",
              description: error.message || "Something went wrong",
              variant: "destructive",
            })
          }}
          className="w-full ut-upload-dropzone:ut-ready:border-muted-foreground"
        />
      )}
    </div>
  )
}