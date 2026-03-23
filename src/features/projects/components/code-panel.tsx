"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	CopyIcon,
	CheckIcon,
	XIcon,
	FileCodeIcon,
} from "lucide-react";
import { Id } from "@convex/_generated/dataModel";
import { useFile } from "../hooks/use-files";

export interface OpenTab {
	id: Id<"files">;
	name: string;
}

interface CodePanelProps {
	openTabs: OpenTab[];
	activeFileId: Id<"files"> | null;
	onTabSelect: (fileId: Id<"files">) => void;
	onTabClose: (fileId: Id<"files">) => void;
}

export const CodePanel = ({
	openTabs,
	activeFileId,
	onTabSelect,
	onTabClose,
}: CodePanelProps) => {
	const [copied, setCopied] = useState(false);
	const activeFile = useFile(activeFileId ?? undefined);

	const content = activeFile?.content ?? "";
	const lines = content ? content.split("\n") : [];

	const handleCopy = () => {
		if (!content) return;
		navigator.clipboard.writeText(content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Empty state — no tabs open
	if (openTabs.length === 0) {
		return (
			<div className="flex flex-col h-full bg-[#09090B]/60 backdrop-blur-xl items-center justify-center text-zinc-600">
				<FileCodeIcon className="size-10 mb-4 opacity-40 text-zinc-500" />
				<p className="text-sm font-medium text-zinc-400">No file open</p>
				<p className="text-xs mt-1 text-zinc-600">
					Double-click a file in the explorer to open it
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-[#09090B]/40 backdrop-blur-xl text-zinc-300 font-mono text-[13px] leading-[22px]">
			{/* File tab bar */}
			<div className="flex items-center bg-white/5 border-b border-white/10 overflow-x-auto scrollbar-none shrink-0">
				{openTabs.map((tab) => (
					<div
						key={tab.id}
						onClick={() => onTabSelect(tab.id)}
						className={cn(
							"group/tab flex items-center gap-2 px-3 h-9 text-xs whitespace-nowrap transition-colors duration-100 border-r border-white/10 cursor-pointer",
							activeFileId === tab.id
								? "bg-[#09090B]/60 text-white border-t-2 border-t-indigo-500"
								: "text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border-t-2 border-t-transparent",
						)}>
						<span>{tab.name}</span>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onTabClose(tab.id);
							}}
							className={cn(
								"size-4 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white",
								activeFileId === tab.id
									? "opacity-60 hover:opacity-100"
									: "opacity-0 group-hover/tab:opacity-60 hover:!opacity-100",
							)}>
							<XIcon className="size-3" />
						</button>
					</div>
				))}
			</div>

			{/* Code area */}
			<div className="flex-1 relative group/code min-h-0">
				{/* Copy button */}
				{content && (
					<div className="absolute top-3 right-4 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity duration-200">
						<Button
							variant="secondary"
							size="icon"
							onClick={handleCopy}
							className="size-7 bg-white/5 backdrop-blur-md hover:bg-white/10 text-zinc-300 border border-white/10 shadow-lg">
							{copied ? (
								<CheckIcon className="size-3.5 text-emerald-400" />
							) : (
								<CopyIcon className="size-3.5" />
							)}
						</Button>
					</div>
				)}

				<ScrollArea className="h-full">
					{lines.length > 0 ? (
						<div className="p-4 flex gap-0">
							{/* Line numbers */}
							<div className="flex flex-col text-right text-zinc-700 select-none pr-5 shrink-0 pl-1">
								{lines.map((_, i) => (
									<span key={i} className="leading-[22px]">
										{i + 1}
									</span>
								))}
							</div>
							{/* Code lines */}
							<div className="flex-1 overflow-x-auto">
								<pre>
									{lines.map((line, i) => (
										<div
											key={i}
											className="leading-[22px] hover:bg-white/5">
											{line || <span>&nbsp;</span>}
										</div>
									))}
								</pre>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-full min-h-[200px] text-zinc-500 text-xs">
							{activeFile === undefined
								? "Loading..."
								: "This file is empty"}
						</div>
					)}
				</ScrollArea>
			</div>

			{/* Status bar */}
			<div className="shrink-0 h-6 bg-[#09090B]/60 backdrop-blur-xl border-t border-white/10 flex items-center px-4 text-[11px] text-zinc-500 justify-between">
				<div className="flex items-center gap-4">
					<span>
						{openTabs.find((t) => t.id === activeFileId)?.name ?? "—"}
					</span>
				</div>
				<div className="flex items-center gap-4">
					<span>Ln {lines.length}, Col 1</span>
					<span>UTF-8</span>
				</div>
			</div>
		</div>
	);
};
