import { Toaster } from '@/components/ui/sonner'
import NewTaskButton from '@/components/dashboard/NewTaskButton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">My Tasks</h1>
          <NewTaskButton />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      <Toaster />
    </>
  )
}
