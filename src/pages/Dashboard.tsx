import { ServiceTabs } from "@/components/dashboard/ServiceTabs";
import { QASearchBox } from "@/components/QASearchBox";
import { ServiceControls } from "@/components/ServiceControls";
import { ServiceSections } from "@/components/ServiceSections";
import { useServices } from "@/hooks/useServices";
import { initialServices } from "@/data/services";
import { TomcatStatus } from "@/components/TomcatStatus";
import React, { useCallback } from "react";
import { useFileProcessor } from "@/hooks/useFileProcessor";

export function Dashboard() {
  const {
    showFavorites,
    setShowFavorites,
    sections,
    toggleFavorite,
    toggleEnabled,
  } = useServices(initialServices);

  const [selectedQA, setSelectedQA] = React.useState("");
  
  const {
    currentFile,
    processStatus,
    handlePlay: originalHandlePlay,
    handleStop
  } = useFileProcessor();

  const handlePlay = useCallback(() => {
    originalHandlePlay(selectedQA, sections.enabled);
  }, [originalHandlePlay, selectedQA]);

  return (
    <div className="relative min-h-screen pb-20">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <ServiceTabs onValueChange={(value) => setShowFavorites(value === "favorite")} />
            <QASearchBox value={selectedQA} onChange={setSelectedQA} />
          </div>
          <ServiceControls 
            status={processStatus}
            onPlay={handlePlay}
            onStop={handleStop}
            currentFile={currentFile}
          />
        </div>

        <div className="space-y-8">
          <ServiceSections
            showFavorites={showFavorites}
            sections={sections}
            toggleFavorite={toggleFavorite}
            toggleEnabled={toggleEnabled}
          />
        </div>
      </div>

      <footer className="fixed bottom-0 left-[240px] right-0 border-t bg-background z-10">
        <div className="container mx-auto p-4 flex items-center justify-center">
          <div className="flex space-x-4">
            <TomcatStatus id={1} status="running" />
            <TomcatStatus id={2} status="running" />
            <TomcatStatus id={3} status="stopped" />
            <TomcatStatus id={4} status="error" />
            <TomcatStatus id={5} status="running" />
          </div>
        </div>
      </footer>
    </div>
  );
}
