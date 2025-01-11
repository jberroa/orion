import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2, XCircle, Terminal, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useRef, useMemo, useEffect } from "react";

export type Step = {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  logs: string[];
};

type BuildProgressSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: Step[];
};

export function BuildProgressSheet({ open, onOpenChange, steps }: BuildProgressSheetProps) {
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasError = steps.some(step => step.status === 'error');
  const activeStep = steps.find(step => step.status === 'in-progress');
  
  // Show processing for in-progress and all completed steps
  const processingSteps = steps.filter(step => 
    step.status === 'in-progress' || step.status === 'completed'
  );
  
  const getStepIcon = (status: Step['status'], stepIndex: number) => {
    const previousError = steps.slice(0, stepIndex).some(s => s.status === 'error');
    
    if (previousError) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }

    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-orange-300" />;
      default:
        console.warn('Unknown step status:', status);
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const progress = Math.round(
    (steps.filter(step => step.status === 'completed').length / steps.length) * 100
  );

  // Memoize terminal messages to prevent unnecessary recalculations
  const terminalMessages = useMemo(() => steps.flatMap(step => {
    const messages = [];
    if (step.status !== 'pending') {
      messages.push({
        type: 'status',
        stepId: step.id,
        content: 'Processing...',
        status: 'in-progress'
      });
    }

    messages.push(...step.logs.map(log => ({
      type: 'log',
      stepId: step.id,
      content: log,
      isError: log.toLowerCase().includes('error')
    })));

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

    return messages;
  }), [steps]);

  // Updated auto-scroll effect
  useEffect(() => {
    if (!isTerminalCollapsed && scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [terminalMessages.length, isTerminalCollapsed]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Building Services</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          <div className="space-y-6">
            <Progress 
              value={hasError ? 100 : progress} 
              className={cn(
                "mb-4",
                hasError ? "bg-red-100 [&>div]:bg-red-500" : ""
              )}
            />
            <div className="space-y-4">
              {steps.map((step, index) => {
                const previousError = steps.slice(0, index).some(s => s.status === 'error');
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    {getStepIcon(step.status, index)}
                    <span className={cn(
                      "flex-1",
                      previousError ? "text-gray-400" : "",
                      step.status === 'error' ? "text-red-500" : ""
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
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
              "transition-all duration-200 overflow-hidden",
              isTerminalCollapsed ? "h-0" : "h-[200px]"
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
      </SheetContent>
    </Sheet>
  );
} 