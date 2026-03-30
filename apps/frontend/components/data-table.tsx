"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden  rounded-xl border border-white/10 bg-slate-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_30px_rgba(70,80,90,0.2)]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="w-[15%] text-white text-2xl">Name</TableHead>
              <TableHead className="w-[55%] text-white text-2xl">Description</TableHead>
              <TableHead className="w-[15%] text-white text-2xl">Owner</TableHead>
              <TableHead className="w-[15%] text-white text-2xl">Submissions</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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