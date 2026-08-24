"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
    id: number
    name: string
    description: string,
    mainFeature: string,
    equity: number,
    bounty: number,
    owner: {
        user: {
            name: string
        }
    }
    submits: [{
        contributors: [{
            dev: {
                user: {
                    name: string
                }
            }
        }]
    }]
}


export const ProjectColumns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: "Name",
        // header: () => <div className="w-[15%] text-center text-white text-2xl">Name</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 lg:text-base text-[8px]">
                {row.original.name}
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        // header: () => <div className="size-10/12 text-center text-white text-2xl">Description</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 lg:text-base text-[8px]">
                {row.original.description}
            </div>
        ),
    },
    {
        accessorKey: "mainFeature",
        header: "Imp",
        // header: () => <div className="size-10/12 text-center text-white text-2xl">Description</div>,
        cell: ({ row }) => (
            <div className="hidden lg:inline-flex line-clamp-2 lg:text-base text-[8px] ">
                {row.original.mainFeature}
            </div>
        ),
    },
    {
        accessorKey: "equity",
        header: "Equity/Bounty",
        // header: () => <div className="size-10/12 text-center text-white text-2xl">Description</div>,
        cell: ({ row }) => {
            const { equity, bounty } = row.original

            return (
                <div className="hidden lg:inline-flex line-clamp-2 lg:text-base text-[8px] ">
                    {equity != null ? `${equity}%` : `Rs ${bounty/100}` }
                </div>
            )
        },
    },
    // {
    //     accessorKey: "equity",
    //     header: "Equity",
    //     // header: () => <div className="size-10/12 text-center text-white text-2xl">Description</div>,
    //     cell: ({ row }) => (
    //         <div className="hidden lg:inline-flex line-clamp-2 lg:text-base text-[8px] ">
    //             {row.original.equity == null ? `-` : `${row.original.equity}%`} 
    //         </div>
    //     ),
    // },
    {
        accessorKey: "owner.user.name",
        header: "Owner",
        // header: () => <div className="size-10 text-center text-white text-2xl">Owner</div>,
        cell: ({ row }) => (
            <div className="line-clamp-2 lg:text-base text-[8px]">
                {row.original.owner.user.name}
            </div>
        ),
    },
    {
        accessorFn: (row) =>
            row.submits.map((s) => s.contributors.map((a) => a.dev.user.name)),
        header: "Submissions",
        // header: () => <div className="w-[15%] text-center text-white text-2xl">Name</div>,
        cell: ({ row }) => {
            const names = row.original.submits.map((s) => s.contributors.map((a) => a.dev.user.name))
            return (
                <div className="line-clamp-2 lg:lg:text-base text-[8px]">
                    {names.join(", ")}
                </div>
            )
        },
    },
]