import { ScrollArea } from "@/components/ui/scroll-area";
import { Id } from "@convex/_generated/dataModel";
import { useState } from "react";
import { useProject } from "@/features/projects/hooks/use-projects";
import {
	ChevronRightIcon,
	CopyMinusIcon,
	FilePlusCornerIcon,
	FolderPlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreateInput } from "./create-input";
import {
	useCreateFile,
	useCreateFolder,
  useFolderContents,
} from "../../hooks/use-files";
import { LoadingRow } from "./loading-row";
import { Tree } from "./tree";

export const FileExplorer = ({ projectId }: { projectId: Id<"projects"> }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [collapseKey, setCollapseKey] = useState(0);
	const [creating, setCreating] = useState<"file" | "folder" | null>(null);

	const project = useProject(projectId);
	const rootFiles = useFolderContents({
		projectId,
		enabled: isOpen,
	});

	const createFile = useCreateFile();
	const createFolder = useCreateFolder();
	// const handleCreate = (name: string) => {
	// 	setCreating(null);

	// 	if (creating === "file") {
	// 		createFile({
	// 			projectId,
	// 			parentId: undefined,
	// 			name,
	// 			content: "",
	// 		});
	// 	} else {
	// 		createFolder({
	// 			projectId,
	// 			parentId: undefined,
	// 			name,
	// 		});
	// 	}
	// };
	const handleCreate = async (name: string) => {
		if (!creating) return;
		const mode = creating;
		try {
			if (mode === "file") {
				await createFile({
					projectId,
					parentId: undefined,
					name,
					content: "",
				});
			} else if (mode === "folder") {
				await createFolder({
					projectId,
					parentId: undefined,
					name,
				});
			}
			setCreating(null);
		} catch {
			// TODO: surface toast/error state
		}
	};

	return (
		<div className="h-full bg-sidebar">
			<ScrollArea>
				<div
					role="button"
					onClick={() => setIsOpen((value) => !value)}
					className="group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-5.5 bg-accent font-bold">
					<ChevronRightIcon
						className={cn(
							"size-4 shrink-0 text-muted-foreground transition-transform",
							isOpen && "rotate-90",
						)}
					/>
					<p className="text-xs uppercase line-clamp-1">
						{project?.name ?? "Loading..."}
					</p>
					<div className="opacity-0 group-hover/project:opacity-100 transition-none duration-0 flex items-center gap-0.5 ml-auto">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setIsOpen(true);
								setCreating("file");
							}}
							variant="highlight"
							size="xs"
							aria-label="New file"
						>
							<FilePlusCornerIcon className="size-3.5" />
						</Button>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setIsOpen(true);
								setCreating("folder");
							}}
							variant="highlight"
							size="xs"
							aria-label="New folder"
						>
							<FolderPlusIcon className="size-3.5" />
						</Button>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setIsOpen(true);
								setCollapseKey((prev) => prev + 1);
							}}
							variant="highlight"
							size="xs"
							aria-label="Collapse"
						>
							<CopyMinusIcon className="size-3.5" />
						</Button>
					</div>
				</div>
				{isOpen && (
					<>
            {rootFiles === undefined && <LoadingRow level={0} />}
						{creating && (
							<CreateInput
								type={creating}
								level={0}
								onSubmit={handleCreate}
								onCancel={() => setCreating(null)}
							/>
						)}
            {rootFiles?.map((item) => (
              <Tree 
                key={`${item._id}-${collapseKey}`}
                item={item}
                level={0}
                projectId={projectId}
              />
            ))}
					</>
				)}
			</ScrollArea>
		</div>
	);
};
