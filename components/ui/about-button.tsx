import { Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AboutButton() {
  return (
    <Link href="/about">
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-50"
        aria-label="About this application"
      >
        <Info className="h-5 w-5" />
      </Button>
    </Link>
  )
} 