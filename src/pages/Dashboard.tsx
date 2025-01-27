import { ServiceTabs } from "@/components/dashboard/ServiceTabs";
import { QASearchBox } from "@/components/QASearchBox";
import { ServiceControls } from "@/components/ServiceControls";
import { ServiceSections } from "@/components/ServiceSections";
import { TomcatStatus } from "@/components/TomcatStatus";
import { useServices } from "@/contexts/ServicesContext";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { useEffect, useState, useRef, useCallback } from "react";
import { BuildProgressSheet, type Step } from "@/components/BuildProgressSheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Dashboard() {
  const {
    showFavorites,
    setShowFavorites,
    sections,
    toggleFavorite,
    toggleEnabled,
    selectedQABox,
    setSelectedQABox,
    skipTests,
    forceUpdate,
    setSkipTests,
    setForceUpdate,
  } = useServices();

  const {
    currentFile,
    processStatus,
    handlePlay: originalHandlePlay,
    handleStop: originalHandleStop,
    setProcessStatus,
  } = useFileProcessor();

  const [buildSheetOpen, setBuildSheetOpen] = useState(false);
  const [buildSteps, setBuildSteps] = useState<Step[]>([
    { id: 'folders', title: 'Initializing Tomcat Folders', status: 'pending', logs: [] },
    { id: 'properties', title: 'Creating Properties Files', status: 'pending', logs: [] },
    // { id: 'local', title: 'Building Local Services', status: 'pending', logs: [] },
    // { id: 'remote', title: 'Downloading Remote Services', status: 'pending', logs: [] },
    { id: 'copy', title: 'Copying WAR Files', status: 'pending', logs: [] },
    { id: 'docker', title: 'Starting Docker Containers', status: 'pending', logs: [] }
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTomcat, setSelectedTomcat] = useState<number | null>(null);
  const [containerLogs, setContainerLogs] = useState<string>("");
  const logPollingInterval = useRef<NodeJS.Timeout>();

  const [tomcatStatuses, setTomcatStatuses] = useState<
    Record<number, "stopped" | "running">
  >({
    1: "stopped",
    2: "stopped",
    3: "stopped",
    4: "stopped",
    5: "stopped",
  });

  const updateStepStatus = (
    stepId: string,
    status: "pending" | "in-progress" | "completed" | "error"
  ) => {
    console.log(`Updating step ${stepId} to status: ${status}`);
    setBuildSteps((steps) =>
      steps.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  // Load settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await window.electron.invoke("get-settings");
      if (settings.selectedQABox) {
        setSelectedQABox(settings.selectedQABox);
      }
    };
    loadSettings();
  }, []);

  // Save QA box selection when it changes
  const handleQABoxChange = (value: string) => {
    setSelectedQABox(value);
  };

  const updateContainerStatuses = useCallback(async () => {
    try {
      const statuses = await window.electron.invoke("get-container-statuses");
      setTomcatStatuses(statuses);
    } catch (error) {
      console.error("Error fetching container statuses:", error);
    }
  }, []);

  const addStepLog = (stepId: string, log: string) => {
    setBuildSteps((steps) =>
      steps.map((step) =>
        step.id === stepId ? { ...step, logs: [...step.logs, log] } : step
      )
    );
  };

  const handlePlay = async () => {
    setBuildSheetOpen(true);
    setProcessStatus("running");

    // Reset all steps to pending and clear their logs
    setBuildSteps((steps) =>
      steps.map((step) => ({
        ...step,
        status: "pending",
        logs: [],
      }))
    );

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Helper to ensure state updates are processed
    const setStepStatus = async (stepId: string, status: Step["status"]) => {
      console.log(`Setting step ${stepId} to status:`, status);
      updateStepStatus(stepId, status);
      await delay(100);

      // If status is error, mark all subsequent steps as error without clearing logs
      if (status === "error") {
        setBuildSteps((steps) => {
          // Get only the active (non-commented) steps
          const activeSteps = steps.filter((step) => !step.id.startsWith("//"));

          // Find the index of the failed step in active steps
          const failedStepIndex = activeSteps.findIndex((s) => s.id === stepId);

          return steps.map((step) => {
            // Skip commented out steps
            if (step.id.startsWith("//")) return step;

            // Find the index of current step in active steps
            const stepIndex = activeSteps.findIndex((s) => s.id === step.id);

            // Only mark steps after the failed step as error
            if (stepIndex > failedStepIndex) {
              return { ...step, status: "error" };
            }
            return step;
          });
        });
      }
    };

    try {
      // Initialize Tomcat folders
      await setStepStatus('folders', 'in-progress');
      try {
        addStepLog('folders', 'Starting Tomcat folders initialization...');
        await window.electron.invoke('initialize-tomcat-folders');
        addStepLog('folders', 'Successfully initialized Tomcat folders');
        await setStepStatus('folders', 'completed');
      } catch (error) {
        addStepLog('folders', `Error: ${error.message}`);
        console.error('Error initializing Tomcat folders:', error);
        await setStepStatus('folders', 'error');
        throw error;
      }

      // Create Properties Files
      await setStepStatus("properties", "in-progress");
      try {
        addStepLog("properties", "Starting properties files creation...");
        const files = await window.electron.invoke(
          "create-properties-files",
          {
            enabled: sections.enabled,
            allServices: sections.all
          }
        );
        addStepLog("properties", `Created ${files.length} properties files`);
        files.forEach((file) => {
          addStepLog("properties", `Created: ${file}`);
        });
        await setStepStatus("properties", "completed");
        await delay(500);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        addStepLog(
          "properties",
          `Error creating properties files: ${errorMessage}`
        );
        console.error("Error creating properties files:", error);
        await setStepStatus("properties", "error");
        return; // Exit after setting error status
      }

      // Build local services
      // await setStepStatus('local', 'in-progress');
      // try {
      //   addStepLog('local', 'Starting local services build...');
      //   window.electron.on('build-log', (data: { stepId: string, log: string }) => {
      //     addStepLog(data.stepId, data.log);
      //   });

      //   const result = await window.electron.invoke('build-local-services', sections.enabled);
      //   if (result.success) {
      //     await setStepStatus('local', 'completed');
      //   } else {
      //     addStepLog('local', `Error building local services: ${result.error}`);
      //     await setStepStatus('local', 'error');
      //     return; // Exit after setting error status
      //   }
      // } catch (error) {
      //   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      //   addStepLog('local', `Error building local services: ${errorMessage}`);
      //   console.error('Error building local services:', error);
      //   await setStepStatus('local', 'error');
      //   return; // Exit after setting error status
      // }

      // Download remote services
      // await setStepStatus('remote', 'in-progress');
      // try {
      //   addStepLog('remote', 'Starting remote services download...');
      //   await window.electron.invoke('download-remote-services', sections.enabled);
      //   addStepLog('remote', 'Successfully downloaded remote services');
      //   await setStepStatus('remote', 'completed');
      //   await delay(500);
      // } catch (error) {
      //   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      //   addStepLog('remote', `Error downloading remote services: ${errorMessage}`);
      //   console.error('Error downloading remote services:', error);
      //   await setStepStatus('remote', 'error');
      //   return; // Exit after setting error status
      // }

      // Copy WAR files
      await setStepStatus("copy", "in-progress");
      try {
        addStepLog("copy", "Starting WAR files copy...");
        await window.electron.invoke("copy-war-files", sections.enabled, "copy");
        addStepLog("copy", "Successfully copied WAR files");
        await setStepStatus("copy", "completed");
        await delay(500);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        addStepLog("copy", `Error copying WAR files: ${errorMessage}`);
        console.error("Error copying WAR files:", error);
        await setStepStatus("copy", "error");
        return; // Exit after setting error status
      }

      // Start Docker containers
      await setStepStatus('docker', 'in-progress');
      try {
        addStepLog('docker', 'Starting Docker containers...');
        const settings = await window.electron.invoke('get-settings');
        
        // Get unique tomcat numbers from enabled services
        const enabledTomcats = [...new Set(sections.enabled
          .map(service => service.tomcatNumber))];

        await window.electron.invoke('start-tomcat-containers', {
          tomcatNumbers: enabledTomcats,
          paths: {
            repoPath: settings.repoPath
          }
        });
        await updateContainerStatuses();
        addStepLog('docker', 'Successfully started Docker containers');
        await setStepStatus('docker', 'completed');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        addStepLog('docker', `Error starting Docker containers: ${errorMessage}`);
        console.error('Error starting Docker containers:', error);
        await setStepStatus('docker', 'error');
        return;
      }
    } catch (error) {
      console.error("Error during service build:", error);
      setProcessStatus("error");
      return;
    }

    // Only close the build sheet if everything succeeded
    setTimeout(() => {
      setBuildSheetOpen(false);
    }, 2000);
  };

  const handleStop = async () => {
    try {
      // Kill all docker containers
      await window.electron.invoke("kill-docker-containers");

      // Update container statuses after stopping
      setTomcatStatuses({
        1: "stopped",
        2: "stopped",
        3: "stopped",
        4: "stopped",
        5: "stopped",
      });

      // Hide the build sheet
      setBuildSheetOpen(false);

      // Reset all build steps to pending and clear logs
      setBuildSteps((steps) =>
        steps.map((step) => ({
          ...step,
          status: "pending",
          logs: [], // Clear logs when stopping
        }))
      );

      // Call original stop handler
      await originalHandleStop();
    } catch (error) {
      console.error("Error stopping services:", error);
    }
  };

  const isBuildInProgress = buildSteps.some(
    (step) => step.status === "in-progress" || step.status === "completed"
  );

  const fetchContainerLogs = useCallback(async (tomcatId: number) => {
    try {
      const logs = await window.electron.invoke("get-container-logs", tomcatId);
      setContainerLogs(logs);
    } catch (error) {
      console.error("Error fetching container logs:", error);
    }
  }, []);

  const handleTomcatClick = async (tomcatId: number) => {
    setSelectedTomcat(tomcatId);
    setDrawerOpen(true);

    // Initial fetch
    await fetchContainerLogs(tomcatId);

    // Set up polling for live logs
    logPollingInterval.current = setInterval(() => {
      fetchContainerLogs(tomcatId);
    }, 2000); // Poll every 2 seconds
  };

  // Cleanup polling when drawer closes
  const handleDrawerClose = () => {
    if (logPollingInterval.current) {
      clearInterval(logPollingInterval.current);
    }
    setDrawerOpen(false);
  };

  // Add console logs to debug the conditions
  useEffect(() => {
    console.log("Process Status:", processStatus);
    console.log("Build Sheet Open:", buildSheetOpen);
  }, [processStatus, buildSheetOpen]);

  // Add this helper function
  const isPlayDisabled = !selectedQABox;

  return (
    <div className="relative min-h-screen pb-20">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <ServiceTabs
              value={showFavorites ? "favorite" : "all"}
              onValueChange={(value) => setShowFavorites(value === "favorite")}
            />
            <QASearchBox value={selectedQABox} onChange={handleQABoxChange} />
          </div>
          <Tooltip>
            <TooltipTrigger>
              <div>
                {" "}
                {/* Wrapper div needed for tooltip to work with disabled button */}
                <ServiceControls
                  status={processStatus}
                  onPlay={handlePlay}
                  onStop={handleStop}
                  currentFile={currentFile}
                  enabledServicesCount={sections.enabled.length}
                  disabled={isPlayDisabled}
                />
              </div>
            </TooltipTrigger>
            {isPlayDisabled && (
              <TooltipContent>
                <p>QA box must be selected to start services</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        <div className="space-y-8">
          <ServiceSections
            showFavorites={showFavorites}
            sections={sections}
            toggleFavorite={toggleFavorite}
            toggleEnabled={toggleEnabled}
            skipTests={skipTests}
            forceUpdate={forceUpdate}
            onSkipTestsChange={setSkipTests}
            onForceUpdateChange={setForceUpdate}
          />
        </div>
      </div>

      <footer className="fixed bottom-0 left-[240px] right-0 border-t bg-background z-10">
        <div className="container mx-auto p-4 flex items-center justify-center">
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((id) => (
              <div
                key={id}
                onClick={() => handleTomcatClick(id)}
                className="cursor-pointer"
              >
                <TomcatStatus id={id} status={tomcatStatuses[id]} />
              </div>
            ))}
          </div>
        </div>
      </footer>

      {processStatus === "running" && !buildSheetOpen && (
        <Button
          variant="outline"
          size="sm"
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-lg rounded-r-none"
          onClick={() => setBuildSheetOpen(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <BuildProgressSheet
        open={buildSheetOpen}
        onOpenChange={setBuildSheetOpen}
        steps={buildSteps}
      />

      <Drawer open={drawerOpen} onOpenChange={handleDrawerClose}>
        <DrawerContent>
          <div className="p-4 bg-gray-900">
            <DrawerHeader>
              <DrawerTitle className="text-gray-200">
                Tomcat {selectedTomcat} Logs
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="h-[60vh] rounded-md border border-gray-700">
              <div className="bg-black p-4 min-h-full">
                <pre className="whitespace-pre-wrap font-mono text-sm text-green-400 font-medium leading-relaxed">
                  {containerLogs || "No logs available..."}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
