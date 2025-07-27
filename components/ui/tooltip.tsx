"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-sm bg-popover text-popover-foreground rounded-md border shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            "top-full left-1/2 transform -translate-x-1/2 mt-2",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export const TooltipContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
) 