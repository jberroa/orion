import "./App.css";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "./components/Sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "./components/ui/breadcrumb";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Documentation } from "./pages/Documentation";
import { Configuration } from "./pages/Configuration";
import { Settings } from "./pages/Settings";
import { ThemeProvider } from "./components/ThemeProvider";
import { ServicesProvider } from '@/contexts/ServicesContext';

function App() {
  return (
    <ServicesProvider>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main className="p-6 pb-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/config" element={<Configuration />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </ServicesProvider>
  );
}

export default App;
