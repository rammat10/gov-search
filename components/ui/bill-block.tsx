import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface BillBlockProps {
  children: React.ReactNode
  billId: string
  onGetInsights: (billId: string) => void
}

export function BillBlock({ children, billId, onGetInsights }: BillBlockProps) {
  return (
    <div className="border-l-2 border-primary/20 pl-4 my-4 relative group">
      {children}
      <Button
        size="sm"
        variant="outline"
        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onGetInsights(billId)}
      >
        <Sparkles className="h-3.5 w-3.5 mr-1" />
        Insights
      </Button>
    </div>
  )
}
