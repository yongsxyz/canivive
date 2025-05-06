
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { dismissAllToasts } from "@/utils/toastManager"

export function Toaster() {
  const { toasts, queue } = useToast()
  const [progress, setProgress] = useState<Record<string, number>>({});

  // Reset progress and ensure animation runs for each toast
  useEffect(() => {
    // Clear old progress when toasts array changes
    if (toasts.length > 0) {
      const activeToast = toasts[0];
      const { id, duration = 5000 } = activeToast;
      
      // Reset progress to 100 immediately when a new toast appears
      setProgress({
        [id]: 100  // Start fresh at 100%
      });
      
      // Start the progress animation
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const newProgress = Math.max(0, (remaining / duration) * 100);
        
        setProgress({
          [id]: newProgress  // Only track active toast
        });
        
        if (newProgress <= 0) {
          clearInterval(interval);
        }
      }, 10);
      
      return () => clearInterval(interval);
    }
  }, [toasts]);  // Dependencies array includes toasts to reset animation when it changes

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, duration = 5000, ...props }) {
        let Icon;
        switch (variant) {
          case "destructive":
            Icon = XCircle;
            break;
          case "warning":
            Icon = AlertTriangle;
            break;
          case "success":
            Icon = CheckCircle;
            break;
          case "info":
          default:
            Icon = Info;
        }

        return (
          <Toast 
            key={id} 
            variant={variant} 
            duration={duration}
            progress={progress[id] || 100}
            queueCount={queue.length + 1} // +1 to include current toast
            {...props}
          >
            <div className="flex gap-3 items-start">
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
