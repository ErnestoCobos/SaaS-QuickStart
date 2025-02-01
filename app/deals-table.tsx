"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Filter, Plus, SortAsc } from "lucide-react"

const deals = [
  {
    id: "01",
    name: "Acme",
    contact: "Tyra Dhillon",
    email: "tyradhillon@acme.com",
    value: "$3,912",
    source: "Social Networks",
  },
  {
    id: "02",
    name: "Academic Project",
    contact: "Brittni Lando",
    email: "lando@academicproject.com",
    value: "$2,345",
    source: "Outreach",
  },
  {
    id: "03",
    name: "Aimbus",
    contact: "Kevin Chen",
    email: "chen@aimbus.com",
    value: "$13,864",
    source: "Referrals",
  },
  {
    id: "04",
    name: "Big Bang Production",
    contact: "Josh Ryan",
    email: "joshryan@gmail.com",
    value: "$6,314",
    source: "Word-of-mouth",
  },
  {
    id: "05",
    name: "Book Launch",
    contact: "Chieko Chute",
    email: "chieko67@booklaunch.com",
    value: "$5,982",
    source: "Outreach",
  },
]

export function DealsTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortAsc className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Input placeholder="Search deals..." className="w-[200px]" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">{deal.id}</TableCell>
                <TableCell>{deal.name}</TableCell>
                <TableCell>{deal.contact}</TableCell>
                <TableCell>{deal.email}</TableCell>
                <TableCell>{deal.value}</TableCell>
                <TableCell>{deal.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

