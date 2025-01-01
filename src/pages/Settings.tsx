import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Settings {
  repoPath: string;
  maxLogLength: number;
  masterUsername: string;
  masterPassword: string;
  instanceUsername: string;
  instancePassword: string;
  jenkinsUsername: string;
  jenkinsApiToken: string;
}

export function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    repoPath: "",
    maxLogLength: 1000,
    masterUsername: "",
    masterPassword: "",
    instanceUsername: "",
    instancePassword: "",
    jenkinsUsername: "",
    jenkinsApiToken: ""
  });

  useEffect(() => {
    // Load all settings
    window.electron.invoke("get-settings").then((savedSettings: Settings) => {
      setSettings(savedSettings);
    });
  }, []);

  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      let lastToastTime = 0;
      const TOAST_COOLDOWN = 2000; // 2 seconds between toasts

      return async (newSettings: Settings) => {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(async () => {
          try {
            await window.electron.invoke("save-settings", newSettings);
            
            // Only show toast if enough time has passed since last toast
            const now = Date.now();
            if (now - lastToastTime >= TOAST_COOLDOWN) {
              toast({
                description: "Settings saved successfully",
                duration: 2000,
              });
              lastToastTime = now;
            }
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to save settings",
            });
          }
        }, 1000); // Wait 1 second after last keystroke before saving
      };
    })(),
    [toast]
  );

  const handleSettingChange = async (key: keyof Settings, value: string | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings); // Update UI immediately
    debouncedSave(newSettings); // Debounced save operation
  };

  const handleSelectFolder = async () => {
    try {
      const path = await window.electron.invoke("select-directory");
      if (path) {
        const newSettings = { ...settings, repoPath: path };
        await window.electron.invoke("save-settings", newSettings);
        setSettings(newSettings);
        toast({
          description: "Repository path saved successfully",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings",
      });
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-8">
          {/* Repository Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Repository Configuration</h2>
            <div className="space-y-2">
              <Label htmlFor="repo-path">Repository Path</Label>
              <div className="flex gap-2">
                <Input
                  id="repo-path"
                  value={settings.repoPath}
                  readOnly
                  placeholder="Select a repository path..."
                />
                <Button onClick={handleSelectFolder} className="shrink-0">
                  Browse
                </Button>
              </div>
            </div>
          </section>

          {/* Script Roller Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Script Roller Configuration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-log-length">Max Log Length</Label>
                <Input
                  id="max-log-length"
                  type="number"
                  value={settings.maxLogLength}
                  onChange={(e) => handleSettingChange('maxLogLength', parseInt(e.target.value))}
                  placeholder="Enter max log length..."
                />
              </div>
            </div>
          </section>

          {/* Jenkins Configuration */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Jenkins Configuration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add your Jenkins credentials to enable automatic QA box updates.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jenkins-username">Jenkins Username</Label>
                <Input
                  id="jenkins-username"
                  value={settings.jenkinsUsername}
                  onChange={(e) => handleSettingChange('jenkinsUsername', e.target.value)}
                  placeholder="Enter Jenkins username..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jenkins-api-token">Jenkins API Token</Label>
                <Input
                  id="jenkins-api-token"
                  type="password"
                  value={settings.jenkinsApiToken}
                  onChange={(e) => handleSettingChange('jenkinsApiToken', e.target.value)}
                  placeholder="Enter Jenkins API token..."
                />
              </div>
            </div>
          </section>

          {/* Credentials Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Credentials</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="master-username">Master Username</Label>
                <Input
                  id="master-username"
                  value={settings.masterUsername}
                  onChange={(e) => handleSettingChange('masterUsername', e.target.value)}
                  placeholder="Enter master username..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="master-password">Master Password</Label>
                <Input
                  id="master-password"
                  type="password"
                  value={settings.masterPassword}
                  onChange={(e) => handleSettingChange('masterPassword', e.target.value)}
                  placeholder="Enter master password..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instance-username">Instance Username</Label>
                <Input
                  id="instance-username"
                  value={settings.instanceUsername}
                  onChange={(e) => handleSettingChange('instanceUsername', e.target.value)}
                  placeholder="Enter instance username..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instance-password">Instance Password</Label>
                <Input
                  id="instance-password"
                  type="password"
                  value={settings.instancePassword}
                  onChange={(e) => handleSettingChange('instancePassword', e.target.value)}
                  placeholder="Enter instance password..."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </>
  );
} 