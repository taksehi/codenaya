"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TerminalIcon, TrashIcon, ChevronRightIcon } from "lucide-react";

interface LogEntry {
	id: number;
	type: "info" | "success" | "error" | "command" | "warn" | "dim";
	text: string;
	timestamp: number;
}

const INITIAL_LOGS: LogEntry[] = [
	{
		id: 1,
		type: "command",
		text: "$ codenaya init --template react",
		timestamp: Date.now() - 8000,
	},
	{
		id: 2,
		type: "info",
		text: "Scaffolding project structure...",
		timestamp: Date.now() - 7500,
	},
	{
		id: 3,
		type: "dim",
		text: "  ├── index.html",
		timestamp: Date.now() - 7000,
	},
	{
		id: 4,
		type: "dim",
		text: "  ├── App.jsx",
		timestamp: Date.now() - 6800,
	},
	{
		id: 5,
		type: "dim",
		text: "  ├── styles.css",
		timestamp: Date.now() - 6600,
	},
	{
		id: 6,
		type: "dim",
		text: "  └── components/Hero.jsx",
		timestamp: Date.now() - 6400,
	},
	{
		id: 7,
		type: "success",
		text: "✓ Project scaffolded successfully",
		timestamp: Date.now() - 6000,
	},
	{
		id: 8,
		type: "command",
		text: "$ installing dependencies...",
		timestamp: Date.now() - 5500,
	},
	{
		id: 9,
		type: "info",
		text: "  react@19.2.3",
		timestamp: Date.now() - 4000,
	},
	{
		id: 10,
		type: "info",
		text: "  react-dom@19.2.3",
		timestamp: Date.now() - 3800,
	},
	{
		id: 11,
		type: "success",
		text: "✓ 2 packages installed in 1.2s",
		timestamp: Date.now() - 3000,
	},
	{
		id: 12,
		type: "command",
		text: "$ generating components...",
		timestamp: Date.now() - 2000,
	},
	{
		id: 13,
		type: "info",
		text: "  → Hero section with gradient text",
		timestamp: Date.now() - 1500,
	},
	{
		id: 14,
		type: "info",
		text: "  → Feature cards grid",
		timestamp: Date.now() - 1200,
	},
	{
		id: 15,
		type: "info",
		text: "  → Responsive navigation bar",
		timestamp: Date.now() - 1000,
	},
	{
		id: 16,
		type: "success",
		text: "✓ 3 components generated",
		timestamp: Date.now() - 500,
	},
	{
		id: 17,
		type: "command",
		text: "$ building preview...",
		timestamp: Date.now() - 400,
	},
	{
		id: 18,
		type: "success",
		text: "✓ Ready on localhost:3000 — 842ms",
		timestamp: Date.now(),
	},
];

const LOG_COLORS: Record<LogEntry["type"], string> = {
	info: "text-[#cdd6f4]",
	success: "text-emerald-400",
	error: "text-rose-400",
	command: "text-indigo-400 font-semibold",
	warn: "text-amber-400",
	dim: "text-[#585b70]",
};

export const TerminalPanel = () => {
	const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [logs]);

	const handleClear = () => {
		setLogs([]);
	};

	return (
		<div className="flex flex-col h-full bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs">
			{/* Header */}
			<div className="shrink-0 h-9 flex items-center justify-between px-3 bg-[#181825] border-b border-[#313244]">
				<div className="flex items-center gap-2">
					<TerminalIcon className="size-3.5 text-[#6c7086]" />
					<span className="text-[11px] font-semibold text-[#a6adc8] uppercase tracking-wider">
						Terminal
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClear}
						title="Clear terminal"
						className="size-6 text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] rounded-sm">
						<TrashIcon className="size-3" />
					</Button>
				</div>
			</div>

			{/* Log output */}
			<ScrollArea className="flex-1 min-h-0">
				<div ref={scrollRef} className="p-3 space-y-0.5">
					{logs.map((log) => (
						<div
							key={log.id}
							className={cn(
								"flex gap-0 leading-5 hover:bg-[#313244]/20 px-1 -mx-1 rounded-sm",
								LOG_COLORS[log.type],
							)}>
							<span className="select-none">{log.text}</span>
						</div>
					))}

					{logs.length === 0 && (
						<div className="text-[#585b70] italic text-[11px] py-2">
							Terminal cleared. Awaiting commands...
						</div>
					)}

					{/* Cursor line */}
					<div className="flex items-center gap-1.5 mt-2 text-[#a6adc8]">
						<ChevronRightIcon className="size-3 text-emerald-400" />
						<span className="text-indigo-400">~</span>
						<span className="w-[6px] h-[14px] bg-[#cdd6f4] animate-pulse" />
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
