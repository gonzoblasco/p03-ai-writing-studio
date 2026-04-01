'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Task = {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'done'
  user_id: string
  created_at: string
}

type TaskState = { error: string; success: boolean }

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()

  // RLS policy "Users can view their own tasks" filters by auth.uid() = user_id
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Task[]
}

export async function createTask(
  prevState: TaskState,
  formData: FormData
): Promise<TaskState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized', success: false }

  const { error } = await supabase.from('tasks').insert({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    status: 'pending',
    user_id: user.id,
  })

  if (error) return { error: error.message, success: false }

  revalidatePath('/dashboard')
  return { error: '', success: true }
}

export async function updateTask(
  taskId: string,
  prevState: TaskState,
  formData: FormData
): Promise<TaskState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized', success: false }

  const { error } = await supabase
    .from('tasks')
    .update({
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      status: formData.get('status') as 'pending' | 'done',
    })
    .eq('id', taskId)
    .eq('user_id', user.id)

  if (error) return { error: error.message, success: false }

  revalidatePath('/dashboard')
  return { error: '', success: true }
}

export async function deleteTask(taskId: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id)
  revalidatePath('/dashboard')
}
