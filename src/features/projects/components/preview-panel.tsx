"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  MaximizeIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Id } from "@convex/_generated/dataModel";
import { useProjectFiles } from "../hooks/use-files";

type DeviceMode = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export const PreviewPanel = ({ projectId }: { projectId: Id<"projects"> }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const projectFiles = useProjectFiles(projectId);

  const previewHtml = useMemo(() => {
    if (!projectFiles) return "";

    const indexHtml = projectFiles.find(
      (f) => f.name === "index.html" && f.type === "file",
    );

    if (!indexHtml) {
      return `
        <html>
          <body style="background: #0a0a0f; color: #a1a1aa; font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <h3>Create an index.html file to see the preview</h3>
          </body>
        </html>
      `;
    }

    let htmlContent = indexHtml.content || "";

    // Naive replacement of linked CSS and JS to make it work in a standalone iframe
    projectFiles.forEach((file) => {
      if (file.type !== "file") return;

      if (file.name.endsWith(".css")) {
        // Replace <link rel="stylesheet" href="styles.css" /> with <style>...</style>
        const linkRegex = new RegExp(
          `<link[^>]*href=["']\\.?/?${file.name}["'][^>]*>`,
          "g",
        );
        htmlContent = htmlContent.replace(
          linkRegex,
          `<style>\n${file.content}\n</style>`,
        );
      } else if (file.name.endsWith(".js") || file.name.endsWith(".jsx")) {
        // We inject Babel standalone for JSX. Replace <script src="App.jsx"> with <script type="text/babel">
        // This is a naive implementation but works for simple previews
        const scriptRegex = new RegExp(
          `<script[^>]*src=["']\\.?/?${file.name}["'][^>]*><\\/script>`,
          "g",
        );
        htmlContent = htmlContent.replace(
          scriptRegex,
          `<script type="text/babel" data-type="module">\n${file.content}\n</script>`,
        );
      }
    });

    // Add Babel if we see any React/JSX to avoid crash
    if (htmlContent.includes("text/babel") && !htmlContent.includes("babel.min.js")) {
      htmlContent = htmlContent.replace(
        "</head>",
        `\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n</head>`,
      );
    }

    return htmlContent;
  }, [projectFiles]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090B]/40 backdrop-blur-xl">
      {/* Toolbar */}
      <div className="shrink-0 h-10 flex items-center justify-between px-3 border-b bg-white/5 border-white/10 gap-2 z-10">
        {/* Device toggles */}
        <div className="flex items-center gap-1">
          <div className="flex bg-[#09090B]/40 rounded-md p-0.5 border border-white/10 shadow-inner">
            {(
              [
                {
                  mode: "desktop" as DeviceMode,
                  icon: MonitorIcon,
                  label: "Desktop",
                },
                {
                  mode: "tablet" as DeviceMode,
                  icon: TabletIcon,
                  label: "Tablet",
                },
                {
                  mode: "mobile" as DeviceMode,
                  icon: SmartphoneIcon,
                  label: "Mobile",
                },
              ] as const
            ).map(({ mode, icon: Icon, label }) => (
              <Tooltip key={mode}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setDeviceMode(mode)}
                    className={cn(
                      "size-6 flex items-center justify-center rounded-sm transition-all duration-150 cursor-pointer",
                      deviceMode === mode
                        ? "bg-white/10 shadow-sm text-white border border-white/5"
                        : "text-zinc-500 hover:text-white hover:bg-white/5",
                    )}>
                    <Icon className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleRefresh}
                className="size-6 flex items-center justify-center text-zinc-500 hover:text-white rounded-sm hover:bg-white/10 transition-colors cursor-pointer">
                <RefreshCwIcon
                  className={cn(
                    "size-3.5 transition-transform duration-500",
                    isRefreshing && "animate-spin",
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Refresh
            </TooltipContent>
          </Tooltip>
        </div>

        {/* URL bar */}
        <div className="flex-1 max-w-xs mx-2">
          <div className="flex items-center h-6 px-3 bg-[#09090B]/40 border border-white/10 rounded-md shadow-inner">
            <span className="text-[11px] font-mono text-zinc-400 truncate">
              localhost:3000
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-zinc-500 hover:text-white hover:bg-white/10">
                <MaximizeIcon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Fullscreen
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-zinc-500 hover:text-white hover:bg-white/10">
                <ExternalLinkIcon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Open in new tab
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 bg-transparent flex items-start justify-center overflow-auto p-4">
        <div
          className={cn(
            "h-full bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ring-1 ring-white/10",
            deviceMode === "desktop" && "w-full",
            deviceMode === "tablet" && "w-[768px] max-w-full",
            deviceMode === "mobile" && "w-[375px] max-w-full",
          )}
          style={{ maxWidth: DEVICE_WIDTHS[deviceMode] }}>
          {!projectFiles ? (
            <div className="flex items-center justify-center h-full w-full bg-[#09090B] text-zinc-600 text-sm">
              Loading files...
            </div>
          ) : (
            <iframe
              key={iframeKey}
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          )}
        </div>
      </div>
    </div>
  );
};
