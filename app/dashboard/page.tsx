import { getTasks } from '@/lib/actions/tasks'
import TaskList from '@/components/tasks/TaskList'

export default async function DashboardPage() {
  const tasks = await getTasks()
  return <TaskList tasks={tasks} />
}
