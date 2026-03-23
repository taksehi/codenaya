"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	SparkleIcon,
	ArrowUpIcon,
	LoaderIcon,
	CodeXmlIcon,
	LayoutIcon,
	PaletteIcon,
	ZapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: number;
}

const SUGGESTION_CHIPS = [
	{ label: "Build a landing page", icon: LayoutIcon },
	{ label: "Add dark mode toggle", icon: PaletteIcon },
	{ label: "Create a contact form", icon: CodeXmlIcon },
	{ label: "Optimize performance", icon: ZapIcon },
];

const MOCK_RESPONSES = [
	"I'll start building that for you. Let me scaffold the component structure first...\n\nI'm creating the following files:\n• `components/Hero.jsx` — Main hero section\n• `components/Navbar.jsx` — Navigation bar\n• `styles/globals.css` — Base styles\n\nGenerating code now...",
	"Great choice! I'm setting up the layout with a modern grid system.\n\nHere's what I'm working on:\n1. Responsive container with CSS Grid\n2. Typography scale using clamp()\n3. Color palette with CSS custom properties\n\nYou'll see the preview update shortly.",
	"On it! I'll implement that with accessibility in mind.\n\nUsing semantic HTML5 elements and ARIA labels where needed. The component will be fully keyboard-navigable.\n\nCheck the code panel for the generated output →",
];

export const ChatPanel = () => {
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "welcome",
			role: "assistant",
			content:
				"Hey! I'm your AI co-pilot. Describe what you want to build and I'll generate the code, preview it live, and iterate with you.\n\nTry something like: *\"Build a modern SaaS landing page with a dark theme\"*",
			timestamp: Date.now(),
		},
	]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const scrollToBottom = useCallback(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
		}
	}, [input]);

	const handleSend = useCallback(() => {
		if (!input.trim() || isStreaming) return;

		const userMsg: Message = {
			id: `user-${Date.now()}`,
			role: "user",
			content: input.trim(),
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsStreaming(true);

		// Simulate AI streaming response
		const responseText =
			MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

		setTimeout(() => {
			const aiMsg: Message = {
				id: `ai-${Date.now()}`,
				role: "assistant",
				content: responseText,
				timestamp: Date.now(),
			};
			setMessages((prev) => [...prev, aiMsg]);
			setIsStreaming(false);
		}, 1500 + Math.random() * 1000);
	}, [input, isStreaming]);

	const handleChipClick = (label: string) => {
		setInput(label);
		// Focus the textarea
		textareaRef.current?.focus();
	};

	return (
		<div className="flex flex-col h-full bg-white/5 backdrop-blur-md border-r border-white/10">
			{/* Header */}
			<div className="shrink-0 h-12 px-4 flex items-center border-b border-white/10">
				<div className="flex items-center gap-2">
					<div className="size-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
						<SparkleIcon className="size-3 text-white" />
					</div>
					<span className="text-sm font-semibold tracking-tight text-zinc-200">
						Assistant
					</span>
				</div>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 min-h-0">
				<div ref={scrollRef} className="p-4 space-y-5">
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={cn(
								"flex gap-3 text-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
								msg.role === "user" && "flex-row-reverse",
							)}>
							{/* Avatar */}
							<div
								className={cn(
									"size-7 shrink-0 rounded-lg flex items-center justify-center mt-0.5",
									msg.role === "user"
										? "bg-zinc-800 text-white border border-white/10"
										: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/20",
								)}>
								{msg.role === "user" ? (
									<span className="text-xs font-bold">U</span>
								) : (
									<SparkleIcon className="size-3.5" />
								)}
							</div>

							{/* Content */}
							<div
								className={cn(
									"max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed shadow-sm",
									msg.role === "user"
										? "bg-indigo-600 text-white rounded-tr-sm shadow-indigo-500/10"
										: "bg-[#18181B] text-zinc-300 rounded-tl-sm border border-white/10",
								)}>
								<p className="whitespace-pre-wrap [&_em]:text-zinc-400 [&_em]:not-italic [&_em]:text-xs">
									{msg.content}
								</p>
							</div>
						</div>
					))}

					{/* Streaming indicator */}
					{isStreaming && (
						<div className="flex gap-3 text-sm animate-in fade-in-0 duration-200">
							<div className="size-7 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm shadow-indigo-500/20">
								<SparkleIcon className="size-3.5 text-white animate-pulse" />
							</div>
							<div className="bg-[#18181B] border border-white/10 rounded-xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
								<div className="flex items-center gap-2 text-zinc-400">
									<LoaderIcon className="size-3.5 animate-spin text-indigo-400" />
									<span className="text-sm">Thinking...</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Suggestion chips — only when few messages */}
			{messages.length <= 1 && (
				<div className="px-4 pb-2 flex flex-wrap gap-1.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
					{SUGGESTION_CHIPS.map((chip) => (
						<button
							key={chip.label}
							onClick={() => handleChipClick(chip.label)}
							className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#18181B]/50
                text-xs text-zinc-400 hover:text-zinc-200 hover:bg-[#27272A]/80
                hover:border-white/20 transition-all duration-150 cursor-pointer shadow-sm">
							<chip.icon className="size-3" />
							{chip.label}
						</button>
					))}
				</div>
			)}

			{/* Input */}
			<div className="shrink-0 p-3 border-t border-white/10">
				<div
					className="flex items-end gap-2 p-2 bg-[#09090B] border border-white/10 rounded-xl
          focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50
          transition-all duration-150 shadow-inner">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
						placeholder="Describe what you want to build..."
						disabled={isStreaming}
						className="flex-1 min-h-[36px] max-h-[150px] bg-transparent border-0 outline-none
              resize-none px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600
              disabled:opacity-50"
						rows={1}
					/>
					<Button
						size="icon"
						onClick={handleSend}
						disabled={!input.trim() || isStreaming}
						className="size-8 shrink-0 rounded-lg bg-white text-black
              hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all duration-150">
						<ArrowUpIcon className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
