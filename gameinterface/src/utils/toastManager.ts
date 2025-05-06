
import { toast as sonnerToast } from "sonner";
import { toast, useToast } from "@/hooks/use-toast";

const toastQueue: Array<{
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  className?: string;
}> = [];

let isProcessingQueue = false;


const processNextToast = () => {
  if (toastQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const nextToast = toastQueue.shift();
  
  if (nextToast) {

    toast({
      ...nextToast,
    });
    
    setTimeout(() => {
      processNextToast();
    }, 300);
  }
};


export const queueToast = (
  title: string,
  description?: string,
  variant?: "default" | "destructive" | "success" | "warning" | "info",
  className?: string
) => {
  toastQueue.push({ title, description, variant, className });
  
  if (!isProcessingQueue) {
    processNextToast();
  }
};

// For sonner toast
const sonnerQueue: Array<{
  message: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
}> = [];

let isProcessingSonnerQueue = false;


const processNextSonnerToast = () => {
  if (sonnerQueue.length === 0) {
    isProcessingSonnerQueue = false;
    return;
  }

  isProcessingSonnerQueue = true;
  const nextToast = sonnerQueue.shift();
  
  if (nextToast) {
    // Use the sonner toast
    const { message, description, type = "default" } = nextToast;
    
    sonnerToast[type](message, {
      description,
      onDismiss: () => {
        // Process the next toast after a slight delay
        setTimeout(() => {
          processNextSonnerToast();
        }, 300);
      }
    });
  }
};

// Add a Sonner toast to the queue
export const queueSonnerToast = (
  message: string,
  description?: string,
  type?: "success" | "error" | "info" | "warning"
) => {
  sonnerQueue.push({ message, description, type });
  
  if (!isProcessingSonnerQueue) {
    processNextSonnerToast();
  }
};

// Function to dismiss all toasts at once
export const dismissAllToasts = () => {
  // Clear all queues
  toastQueue.length = 0;
  sonnerQueue.length = 0;
  
  // Set processing flags to false
  isProcessingQueue = false;
  isProcessingSonnerQueue = false;
  
  // Get toast dismiss function from the global context
  // Instead of using useToast hook directly which causes errors
  // We'll access the global toast state directly through the exported function
  toast.dismiss();
  
  // For sonner, we can use the dismiss function
  sonnerToast.dismiss();
};

// Get the current queue length
export const getToastQueueLength = () => {
  return toastQueue.length + sonnerQueue.length;
};
