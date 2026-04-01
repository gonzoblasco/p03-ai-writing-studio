'use client'

import { useState } from 'react'
import { type Task } from '@/lib/actions/tasks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import TaskCard from './TaskCard'

type Filter = 'all' | 'pending' | 'done'

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered =
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <div className="space-y-4">
      <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks found.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
