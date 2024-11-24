import fs from 'fs/promises'
import path from 'path'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

async function getAboutContent() {
  const filePath = path.join(process.cwd(), 'app/about/content.md')
  const content = await fs.readFile(filePath, 'utf8')
  return content
}

export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </div>
    </div>
  )
} 