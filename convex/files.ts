import { query, mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { verifyAuth } from "./auth"
import { Doc, Id } from "./_generated/dataModel";

async function assertValidParent(
	ctx: MutationCtx | QueryCtx,
	projectId: Id<"projects">,
	parentId?: Id<"files">,
) {
	if (!parentId) return;
	const parent = await ctx.db.get("files", parentId);
	if (!parent || parent.projectId !== projectId || parent.type !== "folder") {
		throw new Error("Invalid parent folder");
	}
}

export const getFiles = query({
	args: { projectId: v.id("projects") },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const project = await ctx.db.get("projects", args.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		return ctx.db
			.query("files")
			.withIndex("by_project", (q) => q.eq("projectId", args.projectId))
			.collect();
	},
});

export const getFile = query({
	args: { id: v.id("files") },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const file = await ctx.db.get("files", args.id);

		if (!file) {
			throw new Error("File not found");
		}

		const project = await ctx.db.get("projects", file.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		return file;
	},
});

export const getFolderContent = query({
	args: { projectId: v.id("projects"), parentId: v.optional(v.id("files")) },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const project = await ctx.db.get("projects", args.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		await assertValidParent(ctx, args.projectId, args.parentId);

		const files = await ctx.db
			.query("files")
			.withIndex("by_project_parent", (q) =>
				q.eq("projectId", args.projectId).eq("parentId", args.parentId),
			)
			.collect();

		// Sort folders first, then files, alphabetically within each group
		return files.sort((a, b) => {
			// Folders first then files
			if (a.type === "folder" && b.type === "file") return -1;
			if (a.type === "file" && b.type === "folder") return 1;

			// Alphabetically within each group
			return a.name.localeCompare(b.name);
		});
	},
});

export const createFile = mutation({
	args: {
		projectId: v.id("projects"),
		parentId: v.optional(v.id("files")),
		name: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const project = await ctx.db.get("projects", args.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		await assertValidParent(ctx, args.projectId, args.parentId);

		const files = await ctx.db
			.query("files")
			.withIndex("by_project_parent", (q) =>
				q.eq("projectId", args.projectId).eq("parentId", args.parentId),
			)
			.collect();

		const existingFile = files.find(
			(file) => file.name === args.name && file.type === "file",
		);
		if (existingFile) {
			throw new Error("File already exists");
		}

		const now = Date.now();
		await ctx.db.insert("files", {
			projectId: args.projectId,
			parentId: args.parentId,
			name: args.name,
			content: args.content,
			type: "file",
			updatedAt: now,
		});

		await ctx.db.patch("projects", args.projectId, {
			updatedAt: now,
		});
	},
});

export const createFolder = mutation({
	args: {
		projectId: v.id("projects"),
		parentId: v.optional(v.id("files")),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const project = await ctx.db.get("projects", args.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		await assertValidParent(ctx, args.projectId, args.parentId);

		const files = await ctx.db
			.query("files")
			.withIndex("by_project_parent", (q) =>
				q.eq("projectId", args.projectId).eq("parentId", args.parentId),
			)
			.collect();

		const existingFile = files.find(
			(file) => file.name === args.name && file.type === "folder",
		);
		if (existingFile) {
			throw new Error("Folder already exists");
		}

		const now = Date.now();

		await ctx.db.insert("files", {
			projectId: args.projectId,
			parentId: args.parentId,
			name: args.name,
			type: "folder",
			updatedAt: now,
		});

		await ctx.db.patch("projects", args.projectId, {
			updatedAt: now,
		});
	},
});

export const renameFile = mutation({
	args: {
		id: v.id("files"),
		newName: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const file = await ctx.db.get("files", args.id);

		if (!file) {
			throw new Error("File not found");
		}

		const project = await ctx.db.get("projects", file.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		const siblings = await ctx.db
			.query("files")
			.withIndex("by_project_parent", (q) =>
				q.eq("projectId", file.projectId).eq("parentId", file.parentId),
			)
			.collect();

		const existingFile = siblings.find(
			(sibling) =>
				sibling.name === args.newName &&
				sibling.type === file.type &&
				sibling._id !== args.id,
		);

		if (existingFile) {
			throw new Error(`A ${file.type} named "${args.newName}" already exists`);
		}

		// Update the file's name and timestamps
		const now = Date.now();

		await ctx.db.patch("files", args.id, {
			name: args.newName,
			updatedAt: now,
		});

		if (file.parentId) {
			await ctx.db.patch("files", file.parentId, { updatedAt: now });
		}

		await ctx.db.patch("projects", file.projectId, { updatedAt: now });
	},
});

export const deleteFile = mutation({
	args: {
		id: v.id("files"),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const file = await ctx.db.get("files", args.id);

		if (!file) {
			throw new Error("File not found");
		}

		const project = await ctx.db.get("projects", file.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		// Recursively delete all the file/folder and all it's decendents
		const deleteRecursive = async (fileId: Id<"files">) => {
			const item = await ctx.db.get("files", fileId);

			if (!item) return;

			if (item.type === "folder") {
				const children = await ctx.db
					.query("files")
					.withIndex("by_project_parent", (q) =>
						q.eq("projectId", item.projectId).eq("parentId", fileId),
					)
					.collect();

				for (const child of children) {
					await deleteRecursive(child._id);
				}
			}
			if (item.storageId) {
				await ctx.storage.delete(item.storageId);
			}
			await ctx.db.delete("files", fileId);
		};
		await deleteRecursive(args.id);

		// Update parent and project timestamps directly since the current file is deleted
		const now = Date.now();
		if (file.parentId) {
			await ctx.db.patch("files", file.parentId, {
				updatedAt: now,
			});
		}

		await ctx.db.patch("projects", file.projectId, {
			updatedAt: now,
		});
	},
});

export const updateFile = mutation({
	args: {
		id: v.id("files"),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);
		const file = await ctx.db.get("files", args.id);

		if (!file) {
			throw new Error("File not found");
		}

		const project = await ctx.db.get("projects", file.projectId);

		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== identity.subject) {
			throw new Error("Unauthorized access to this project");
		}

		if (file.type !== "file") {
			throw new Error("Cannot update content of a folder");
		}

		// Update the file's content and timestamps
		const now = Date.now();

		await ctx.db.patch("files", args.id, {
			content: args.content,
			updatedAt: now,
		});

		if (file.parentId) {
			await ctx.db.patch("files", file.parentId, { updatedAt: now });
		}

		await ctx.db.patch("projects", file.projectId, { updatedAt: now });
	},
});
