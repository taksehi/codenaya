"use client";

import { cn } from "@/lib/utils";
import { Id } from "@convex/_generated/dataModel";
import { useState, useCallback } from "react";
import { FaGithub } from "react-icons/fa";
import { Allotment } from "allotment";
import { FileExplorer } from "./file-explorer";
import { CodePanel, OpenTab } from "./code-panel";
import { PreviewPanel } from "./preview-panel";

const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 500;
const DEFAULT_SIDEBAR_WIDTH = 240;
const DEFAULT_MAIN_SIZE = 1000;

const Tab = ({
	label,
	isActive,
	onClick,
}: {
	label: string;
	isActive: boolean;
	onClick: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				"flex items-center gap-2 h-full px-4 cursor-pointer border-r border-white/10 text-sm font-medium transition-all duration-200",
				isActive
					? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
					: "text-zinc-400 hover:bg-white/5 hover:text-white",
			)}>
			<span>{label}</span>
		</div>
	);
};

export const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
	const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
	const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
	const [activeFileId, setActiveFileId] = useState<Id<"files"> | null>(null);

	const handleFileOpen = useCallback(
		(fileId: Id<"files">, fileName: string) => {
			// Add tab if not already open
			setOpenTabs((prev) => {
				const exists = prev.some((tab) => tab.id === fileId);
				if (exists) return prev;
				return [...prev, { id: fileId, name: fileName }];
			});
			setActiveFileId(fileId);
			// Switch to editor view when opening a file
			setActiveView("editor");
		},
		[],
	);

	const handleTabSelect = useCallback((fileId: Id<"files">) => {
		setActiveFileId(fileId);
	}, []);

	const handleTabClose = useCallback(
		(fileId: Id<"files">) => {
			setOpenTabs((prev) => {
				const updated = prev.filter((tab) => tab.id !== fileId);
				// If we closed the active tab, activate the last remaining tab
				if (activeFileId === fileId) {
					setActiveFileId(updated.length > 0 ? updated[updated.length - 1].id : null);
				}
				return updated;
			});
		},
		[activeFileId],
	);

	return (
		<div className="h-full flex flex-col">
			<nav className="h-8.75 flex items-center bg-white/5 backdrop-blur-md border-b border-white/10 shrink-0 z-40">
				<Tab
					label="Code"
					isActive={activeView === "editor"}
					onClick={() => setActiveView("editor")}
				/>
				<Tab
					label="Preview"
					isActive={activeView === "preview"}
					onClick={() => setActiveView("preview")}
				/>

				{/* Todo: Implement logic for github button */}
				<div className="flex-1 flex justify-end h-full">
					<div
						className="flex items-center gap-1.5 h-full px-4 cursor-pointer
            text-zinc-400 border-l border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200 font-medium">
						<FaGithub className="size-3.5" />
						<span className="text-sm">Export</span>
					</div>
				</div>
			</nav>

			{/* Main content area */}
			<div className="flex-1 overflow-hidden">
				<div className="h-full relative">
					{/* Editor view — file explorer + code */}
					<div
						className={cn(
							"absolute inset-0 transition-opacity duration-150",
							activeView === "editor"
								? "opacity-100 z-10"
								: "opacity-0 z-0 pointer-events-none",
						)}>
						<Allotment
							defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
							<Allotment.Pane
								snap
								minSize={MIN_SIDEBAR_WIDTH}
								maxSize={MAX_SIDEBAR_WIDTH}
								preferredSize={DEFAULT_SIDEBAR_WIDTH}>
								<FileExplorer
									projectId={projectId}
									onFileOpen={handleFileOpen}
								/>
							</Allotment.Pane>
							<Allotment.Pane>
								<CodePanel
									openTabs={openTabs}
									activeFileId={activeFileId}
									onTabSelect={handleTabSelect}
									onTabClose={handleTabClose}
								/>
							</Allotment.Pane>
						</Allotment>
					</div>

					{/* Preview view */}
					<div
						className={cn(
							"absolute inset-0 transition-opacity duration-150",
							activeView === "preview"
								? "opacity-100 z-10"
								: "opacity-0 z-0 pointer-events-none",
						)}>
						<PreviewPanel projectId={projectId} />
					</div>
				</div>
			</div>
		</div>
	);
};
