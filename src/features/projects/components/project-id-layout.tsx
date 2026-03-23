"use client";

import { Navbar } from "@/features/projects/components/navbar";
import { Id } from "@convex/_generated/dataModel";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { ChatPanel } from "./chat-panel";

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 380;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdLayout = ({
	children,
	projectId,
}: {
	children: React.ReactNode;
	projectId: Id<"projects">;
}) => {
	return (
		<div className="w-full flex flex-col h-screen relative bg-[#09090B] overflow-hidden">
			{/* Modern glowing orbs */}
			<div 
				className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none" 
				style={{ background: "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.4), transparent 70%)" }}
			/>
			<div 
				className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none" 
				style={{ background: "radial-gradient(ellipse at top, rgba(236, 72, 153, 0.3), transparent 70%)" }}
			/>
			
			<div className="z-10 flex flex-col h-full">
				<Navbar projectId={projectId} />
				<div className="flex-1 flex overflow-hidden">
					<Allotment
					className="flex-1"
					defaultSizes={[DEFAULT_CONVERSATION_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
					<Allotment.Pane
						snap
						minSize={MIN_SIDEBAR_WIDTH}
						maxSize={MAX_SIDEBAR_WIDTH}
						preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}>
						<ChatPanel />
					</Allotment.Pane>
					<Allotment.Pane>{children}</Allotment.Pane>
				</Allotment>
			  </div>
			</div>
		</div>
	);
};
