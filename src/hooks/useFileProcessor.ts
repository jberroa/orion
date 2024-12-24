import { useState } from 'react';

interface UseFileProcessorReturn {
  files: string[];
  currentFile?: string;
  processStatus: "running" | "stopped" | "error";
  handlePlay: (qaBox: string) => Promise<void>;
  handleStop: () => void;
  handleNext: () => void;
}

export function useFileProcessor(): UseFileProcessorReturn {
  const [files, setFiles] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [processStatus, setProcessStatus] = useState<"running" | "stopped" | "error">("stopped");

  const handlePlay = async (qaBox: string) => {
    console.log('Processing with QA Box:', qaBox);
    try {
      if (!window.electron) {
        throw new Error('Electron API not available');
      }
      
      const filesList = await window.electron.invoke('read-folder');
      setFiles(filesList);
      setCurrentFileIndex(0);
      setProcessStatus("running");
    } catch (error) {
      console.error('Error reading folder:', error);
      setProcessStatus("error");
    }
  };

  const handleStop = () => {
    setCurrentFileIndex(-1);
    setProcessStatus("stopped");
  };

  const handleNext = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(prev => prev + 1);
    } else {
      handleStop();
    }
  };

  return {
    files,
    currentFile: currentFileIndex >= 0 ? files[currentFileIndex] : undefined,
    processStatus,
    handlePlay,
    handleStop,
    handleNext,
  };
} 