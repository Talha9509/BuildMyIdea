"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Project } from "./columns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends Project, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const router = useRouter()

  return (
    <div className="overflow-hidden  rounded-xl border border-white/10 bg-slate-950/90 shadow-[inset_1px_0_0_rgba(255,53,17,0.2),0_4px_10px_rgba(255,53,17,0.2)]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="lg:w-[15%] w-[20%] text-white lg:text-xl text-xs">Name</TableHead>
              <TableHead className="lg:w-[37%] w-[40%] text-white lg:text-xl text-xs">Description</TableHead>
              <TableHead className="lg:w-[18%] text-white lg:text-xl hidden lg:table-cell">Main Features</TableHead>
              <TableHead className="lg:w-[10%] w-[15%] text-white lg:text-xl text-xs hidden lg:table-cell">Idea Creator</TableHead>
              <TableHead className="lg:w-[10%] w-[15%] text-white lg:text-xl text-xs table-cell lg:hidden">Owner</TableHead>
              <TableHead className="lg:w-[20%] w-[25%] text-white lg:text-xl text-xs">Submissions</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => router.push(`/project/${row.original.id}`)}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "mainFeature") {
                    return <TableCell key={cell.id} className="hidden lg:table-cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  }
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}