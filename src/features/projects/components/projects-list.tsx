import { Kbd } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"
import { useProjectsPartial } from "@/features/projects/hooks/use-projects"
import { Doc } from "@convex/_generated/dataModel"
import { AlertCircleIcon,ArrowRightIcon, GlobeIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"

const formatTimeStamp = ( timestamp: number ) => {
  return formatDistanceToNow(new Date(timestamp), {addSuffix: true})
}

const getProjectIcon = ( {project} : {project: Doc<"projects">}) => {
  if (project.importStatus === "completed") {
    return (
      <FaGithub className="size-4" />
    )
  }
  if (project.importStatus === "failed") {
    return (
      <AlertCircleIcon className="size-4" />
    )
  }
  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-4 animate-spin" />
    )
  }

  return <GlobeIcon className="size-4" />
}

interface projectListProps {
  onViewAll: () => void
}

const ContinueCard = ({ data } : {
  data: Doc<"projects">
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-zinc-500 font-semibold tracking-wide uppercase ml-1">
        Last updated
      </span>
      <Button
        variant={"outline"}
        asChild
        className="h-auto items-start justify-start p-4 bg-white/5 backdrop-blur-md hover:bg-white/10 border-white/10 rounded-xl flex flex-col gap-2 transition-all duration-300 shadow-sm group/card"
      >
        <Link href={`/projects/${data._id}`} className="group w-full" >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="text-zinc-400 group-hover/card:text-white transition-colors">
                {getProjectIcon({project: data})}
              </div>
              <span className="font-semibold text-zinc-200 group-hover/card:text-white truncate text-base transition-colors">
                {data.name}
              </span>
            </div>
            <ArrowRightIcon className="size-4 text-zinc-500 group-hover/card:text-white group-hover/card:translate-x-1 transition-all" />
          </div>
          <span className="text-xs text-zinc-500 group-hover/card:text-zinc-400 transition-colors">
            {formatTimeStamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  )
};

const ProjectItem = ({ data } : {
  data: Doc<"projects">
}) => {
  return (
    <Link href={`/projects/${data._id}`} className="text-sm text-zinc-400 font-medium hover:text-white py-2 px-2 rounded-lg hover:bg-white/5 flex items-center justify-between w-full group transition-all">
      <div className="flex items-center gap-2">
        <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
          {getProjectIcon({project: data})}
        </div>
        <span className="truncate">
          {data.name}
        </span>
      </div>
      <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
        {formatTimeStamp(data.updatedAt)}
      </span>
    </Link>
  )
}

export const ProjectsList = ({ onViewAll }: projectListProps) => {

  const projects = useProjectsPartial(6)

  if (projects === undefined) {
    return <Spinner className="size-4 text-ring " />
  }

  const [mostRecent, ...rest] = projects

  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? <ContinueCard data={mostRecent} /> : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs text-zinc-500 font-semibold tracking-wide uppercase">
              Recent Projects
            </span>
            <button 
              className="flex items-center gap-2 text-zinc-500 text-xs hover:text-white transition-colors"
              onClick={onViewAll}
            >
              <span>View all</span>
              <Kbd className="bg-[#09090B] border-white/10 text-zinc-400 font-mono text-[10px]">⌘K</Kbd>
            </button>
          </div>
          <ul>
            {rest.map((project) => (
              <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}