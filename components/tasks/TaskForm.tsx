'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createTask, updateTask, type Task } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  task?: Task
  onSuccess?: () => void
}

export default function TaskForm({ task, onSuccess }: Props) {
  const action = task ? updateTask.bind(null, task.id) : createTask
  const [state, formAction, pending] = useActionState(action, {
    error: '',
    success: false,
  })

  useEffect(() => {
    if (state.success) {
      toast.success(task ? 'Task updated' : 'Task created')
      onSuccess?.()
    }
  }, [state.success, onSuccess])

  useEffect(() => {
    if (state.error) toast.error(state.error)
  }, [state.error])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={task?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={task?.description ?? ''}
        />
      </div>
      {task && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={task.status}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {state.error && (
        <p className="text-sm text-red-500" aria-live="polite">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving...' : task ? 'Save changes' : 'Create task'}
      </Button>
    </form>
  )
}
