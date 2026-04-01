'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteTask, type Task } from '@/lib/actions/tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TaskForm from './TaskForm'

export default function TaskCard({ task }: { task: Task }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deletePending, startDeleteTransition] = useTransition()

  function handleDelete() {
    startDeleteTransition(async () => {
      try {
        await deleteTask(task.id)
        toast.success('Task deleted')
      } catch {
        toast.error('Failed to delete task')
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-base">{task.title}</CardTitle>
        <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
          {task.status}
        </Badge>
      </CardHeader>
      {task.description && (
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
      <CardContent className="flex gap-2 pt-0">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deletePending}
        >
          {deletePending ? 'Deleting…' : 'Delete'}
        </Button>
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
