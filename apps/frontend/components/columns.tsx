"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
    id: string
    name: string
    description: string
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

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="line-clamp-2 text-base">
                {row.original.name}
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="line-clamp-2 text-base">
                {row.original.description}
            </div>
        ),
    },
    {
        accessorKey: "owner.user.name",
        header: "Owner",
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