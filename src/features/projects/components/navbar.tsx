import { UserButton } from "@clerk/nextjs";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Id } from "@convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import {
	useProject,
	useRenameProject,
} from "@/features/projects/hooks/use-projects";
import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const font = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
	const project = useProject(projectId);
	const renameProject = useRenameProject();
	const [isRenaming, setIsRenaming] = useState(false);
	const [name, setName] = useState("");
	const handleStartRename = () => {
		if (!project) return;
		setName(project.name);
		setIsRenaming(true);
	};

	const handleSubmit = () => {
		if (!project) return;
		setIsRenaming(false);
		const trimmedName = name.trim();
		if (!trimmedName || trimmedName === project.name) return;
		renameProject({
			id: projectId,
			name: trimmedName,
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		} else if (e.key === "Escape") {
			setIsRenaming(false);
		}
	};

	return (
		<nav className="flex justify-between items-center gap-x-2 p-3 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-sm z-50">
			<div className="flex items-center gap-x-2">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								className="flex items-center gap-1.5 group/logo"
								asChild>
								<Button
									variant={"ghost"}
									className="w-fit! p-1.5! h-7!"
									asChild>
									<Link href="/">
										<Image
											src="/logo.svg"
											alt="Codenaya"
											width={20}
											height={20}
										/>
										<span className={cn("text-sm font-semibold tracking-tight text-white/90 drop-shadow-sm", font.className)}>
											CodeNaya
										</span>
									</Link>
								</Button>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="ml-0! mr-1!" />
						<BreadcrumbItem>
							{isRenaming ? (
								<input
									autoFocus
									value={name}
									type="text"
									onChange={(e) => setName(e.target.value)}
									onFocus={(e) => e.currentTarget.select()}
									onBlur={() => setIsRenaming(false)}
									onKeyDown={(e) => {
										handleKeyDown(e);
									}}
									className="text-sm bg-transparent text-white outline-none
                  focus:ring-1 focus:ring-inset focus:ring-indigo-500 font-medium max-w-40 truncate px-1 rounded-sm"
								/>
							) : (
								<BreadcrumbPage
									onClick={handleStartRename}
									className="text-sm cursor-pointer hover:text-white text-zinc-300 transition-colors font-medium max-w-40 truncate px-1 rounded-sm">
									{project?.name || "loading..."}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				{project?.importStatus == "importing" ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<LoaderIcon className="size-4 text-indigo-400 animate-spin" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Importing...</p>
						</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip>
						<TooltipTrigger asChild>
							<CloudCheckIcon className="size-4 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
						</TooltipTrigger>
						<TooltipContent>
							Saved{" "}
							{project?.updatedAt
								? formatDistanceToNow(project.updatedAt, { addSuffix: true })
								: "Loading..."}
						</TooltipContent>
					</Tooltip>
				)}
			</div>
			<div className="flex items-center gap-2">
				<UserButton />
			</div>
		</nav>
	);
};
