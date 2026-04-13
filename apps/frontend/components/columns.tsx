"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
    id: number
    name: string
    description: string,
    mainFeature: string,
    owner: {
        user: {
            name: string
        }
    }
    submits: [{
        dev: {
            user: {
                name: string
            }
        }
    }]
}

export type Submission = {
    liveLink:string
    repoLink: string
    dev:{
        user:{
            id:number
            name:string
        }
    }
}

export const SubmissionColumn: ColumnDef<Submission>[]=[

]

export const ProjectColumns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: "Name",
        // header: () => <div className="w-[15%] text-center text-white text-2xl">Name</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 text-base">
                {row.original.name}
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        // header: () => <div className="size-10/12 text-center text-white text-2xl">Description</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 text-base">
                {row.original.description}
            </div>
        ),
    },
    {
        accessorKey: "mainFeature",
        header: "Imp",
        // header: () => <div className="size-10/12 text-center text-white text-2xl">Description</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 text-base">
                {row.original.mainFeature}
            </div>
        ),
    },
    {
        accessorKey: "owner.user.name",
        header: "Owner",
        // header: () => <div className="size-10 text-center text-white text-2xl">Owner</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 text-base">
                {row.original.owner.user.name}
            </div>
        ),
    },
    {
        accessorFn: (row) =>
            row.submits.map((s) => s.dev.user.name),
        header: "Submissions",
        // header: () => <div className="w-[15%] text-center text-white text-2xl">Name</div>,
        cell: ({ row }) => {
            const names = row.original.submits.map((s) => s.dev.user.name)
            return (
                <div className="line-clamp-2 text-base">
                    {names.join(", ")}
                </div>
            )
        },
    },
]