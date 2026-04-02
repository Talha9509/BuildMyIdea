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
  const router=useRouter()

  return (
    <div className="overflow-hidden  rounded-xl border border-white/10 bg-slate-950/90 shadow-[inset_1px_0_0_rgba(255,53,17,0.2),0_4px_10px_rgba(255,53,17,0.2)]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="w-[15%] text-white text-xl">Name</TableHead>
              <TableHead className="w-[53%] text-white text-xl">Description</TableHead>
              <TableHead className="w-[12%] text-white text-xl">Owner</TableHead>
              <TableHead className="w-[20%] text-white text-xl">Submissions</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={()=>router.push(`/project/${row.original.id}`)}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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