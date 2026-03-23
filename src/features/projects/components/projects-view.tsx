"use client";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { FaGithub } from "react-icons/fa";
import { ProjectsList } from "@/features/projects/components/projects-list";
import { useCreateProject } from "@/features/projects/hooks/use-projects";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { useEffect, useState } from "react";
import { ProjectCommandDialog } from "./projects-command-dialog";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProjectsView = () => {
  const createProject = useCreateProject();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault()
          setCommandDialogOpen((prev) => !prev)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <ProjectCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-16 relative bg-[#09090B] overflow-hidden">
        {/* Modern glowing orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.4), transparent 70%)" }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(236, 72, 153, 0.3), transparent 70%)" }}
        />

        <div className="w-full max-w-sm mx-auto flex flex-col gap-6 items-center z-10">
          <div className="flex justify-center w-full items-center mb-6">
            <div className="flex items-center gap-3 w-full group/logo">
              <div className="p-2.5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl ring-1 ring-white/5">
                <Image
                  src="/logo.svg"
                  alt="Codenaya"
                  width={36}
                  height={36}
                  className="drop-shadow-lg"
                />
              </div>
              <h1
                className={cn(
                  "text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500",
                  font.className,
                )}>
                CodeNaya
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-full items-start justify-start p-4 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 shadow-xl flex flex-col rounded-2xl gap-6 transition-all duration-300 hover:-translate-y-1 text-white group"
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors],
                    separator: "-",
                    length: 3,
                  });
                  createProject({
                    name: projectName,
                  });
                }}>
                <div className="flex justify-between w-full items-center">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                    <SparkleIcon className="size-4" />
                  </div>
                  <Kbd className="bg-[#27272A] border-white/10 text-zinc-400 font-mono text-[10px]">⌘J</Kbd>
                </div>
                <div>
                  <span className="text-base font-semibold tracking-tight">New Project</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-full items-start justify-start p-4 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 hover:border-white/20 shadow-xl flex flex-col rounded-2xl gap-6 transition-all duration-300 hover:-translate-y-1 text-white group">
                <div className="flex justify-between w-full items-center">
                  <div className="p-2 rounded-lg bg-white/5 text-zinc-300 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <FaGithub className="size-4" />
                  </div>
                  <Kbd className="bg-[#27272A] border-white/10 text-zinc-400 font-mono text-[10px]">⌘I</Kbd>
                </div>
                <div>
                  <span className="text-base font-semibold tracking-tight">Import</span>
                </div>
              </Button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 mt-2">
              <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
