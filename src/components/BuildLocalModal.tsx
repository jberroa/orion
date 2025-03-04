import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Terminal, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

export type Step = {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  logs: string[];
};

type BuildLocalModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: Step;
};

export function BuildLocalModal({ open, onOpenChange, step }: BuildLocalModalProps) {
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasError = step.status === 'error';

  // Add debug logs
  useEffect(() => {
    console.log("BuildLocalModal - Step updated:", step);
    console.log("BuildLocalModal - Logs:", step.logs);
  }, [step]);

  // Modify the terminal messages logic to preserve logs
  const terminalMessages = useMemo(() => {
    console.log("BuildLocalModal - Creating messages from logs:", step.logs);
    const messages = [];
    
    if (step.status !== 'pending' || step.logs.length > 0) {
      messages.push({
        type: 'status',
        stepId: step.id,
        content: 'Processing...',
        status: 'in-progress'
      });
    }

    // Ensure we're properly mapping the logs
    const logMessages = step.logs.map(log => ({
      type: 'log' as const,
      stepId: step.id,
      content: log,
      isError: log.toLowerCase().includes('error')
    }));
    
    messages.push(...logMessages);

    if (step.status === 'completed') {
      messages.push({
        type: 'status',
        stepId: step.id,
        content: 'Completed',
        status: step.status
      });
    } else if (step.status === 'error') {
      messages.push({
        type: 'status',
        stepId: step.id,
        content: 'Failed',
        status: step.status
      });
    }

    console.log("BuildLocalModal - Final messages:", messages);
    return messages;
  }, [step]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isTerminalCollapsed && scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [terminalMessages.length, isTerminalCollapsed]);

  const progress = step.status === 'completed' ? 100 : step.status === 'in-progress' ? 50 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col h-[80vh]">
        <DialogHeader>
          <DialogTitle>Building Local Services</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          <div className="space-y-6">
            <Progress 
              value={progress}
              className={cn(
                "mb-4",
                hasError ? "bg-red-100 [&>div]:bg-red-500" : ""
              )}
            />
          </div>

          <div className={cn(
            "rounded-md border border-gray-800 bg-gray-950 flex flex-col transition-all duration-200",
            isTerminalCollapsed ? "flex-shrink-0" : "flex-1 min-h-0"
          )}>
            <button 
              onClick={() => setIsTerminalCollapsed(prev => !prev)}
              className="flex items-center gap-2 border-b border-gray-800 p-2 w-full hover:bg-gray-900 transition-colors"
            >
              <Terminal className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-400 flex-1 text-left">Console Output</span>
              {isTerminalCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            <div className={cn(
              "transition-all duration-200 overflow-hidden flex-1",
              isTerminalCollapsed ? "h-0" : "flex-1"
            )}>
              <ScrollArea 
                ref={scrollRef} 
                className="h-full relative"
                type="always"
                scrollHideDelay={0}
              >
                <div className="font-mono text-xs p-2 min-w-full inline-block pb-6 pr-6">
                  {terminalMessages.map((message, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "py-1 min-h-[20px] flex flex-row items-start min-w-fit whitespace-nowrap",
                        message.type === 'log' 
                          ? message.isError ? 'text-red-400' : 'text-gray-300'
                          : message.status === 'in-progress' 
                            ? 'text-blue-400' 
                            : message.status === 'completed'
                              ? 'text-green-400'
                              : 'text-red-400'
                      )}
                    >
                      <span className="text-gray-500 select-none shrink-0 mr-2">[{message.stepId}]</span>
                      <span className="whitespace-pre">{message.content}</span>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" className="mr-0.5" />
                <ScrollBar orientation="horizontal" className="mb-0.5" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 