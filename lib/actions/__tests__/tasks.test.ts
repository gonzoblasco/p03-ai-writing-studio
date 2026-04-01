import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { getTasks, createTask, updateTask, deleteTask } from '../tasks'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const mockCreateClient = vi.mocked(createClient)
const mockRevalidatePath = vi.mocked(revalidatePath)

const MOCK_USER = { id: 'user-123' }

const MOCK_TASKS = [
  {
    id: 'task-1',
    title: 'First task',
    description: null,
    status: 'pending' as const,
    user_id: MOCK_USER.id,
    created_at: '2026-01-01T00:00:00Z',
  },
]

// Creates a chainable thenable query builder that resolves to `resolveValue`
function createQueryBuilder(resolveValue: unknown) {
  const builder: any = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    then: (resolve: (v: unknown) => unknown) =>
      Promise.resolve(resolveValue).then(resolve),
  }
  return builder
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getTasks', () => {
  it('returns tasks from database', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => createQueryBuilder({ data: MOCK_TASKS, error: null }),
    } as any)

    const result = await getTasks()

    expect(result).toEqual(MOCK_TASKS)
  })

  it('returns empty array on database error', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => createQueryBuilder({ data: null, error: { message: 'DB error' } }),
    } as any)

    const result = await getTasks()

    expect(result).toEqual([])
  })
})

describe('createTask', () => {
  it('inserts task and revalidates dashboard', async () => {
    const builder = createQueryBuilder({ error: null })
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: MOCK_USER } }),
      },
      from: () => builder,
    } as any)

    const fd = new FormData()
    fd.set('title', 'New task')
    fd.set('description', 'A description')

    const result = await createTask({ error: '', success: false }, fd)

    expect(builder.insert).toHaveBeenCalledWith({
      title: 'New task',
      description: 'A description',
      status: 'pending',
      user_id: MOCK_USER.id,
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    expect(result).toEqual({ error: '', success: true })
  })

  it('returns Unauthorized when no user', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any)

    const fd = new FormData()
    fd.set('title', 'Task')

    const result = await createTask({ error: '', success: false }, fd)

    expect(result).toEqual({ error: 'Unauthorized', success: false })
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })
})

describe('updateTask', () => {
  it('filters by both task id and user_id', async () => {
    const builder = createQueryBuilder({ error: null })
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: MOCK_USER } }),
      },
      from: () => builder,
    } as any)

    const fd = new FormData()
    fd.set('title', 'Updated title')
    fd.set('description', '')
    fd.set('status', 'done')

    const result = await updateTask('task-1', { error: '', success: false }, fd)

    expect(builder.eq).toHaveBeenCalledWith('id', 'task-1')
    expect(builder.eq).toHaveBeenCalledWith('user_id', MOCK_USER.id)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    expect(result).toEqual({ error: '', success: true })
  })

  it('returns Unauthorized when no user', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any)

    const fd = new FormData()
    fd.set('title', 'Title')
    fd.set('status', 'pending')

    const result = await updateTask('task-1', { error: '', success: false }, fd)

    expect(result).toEqual({ error: 'Unauthorized', success: false })
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })
})

describe('deleteTask', () => {
  it('filters by both task id and user_id', async () => {
    const builder = createQueryBuilder({ error: null })
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: MOCK_USER } }),
      },
      from: () => builder,
    } as any)

    await deleteTask('task-1')

    expect(builder.eq).toHaveBeenCalledWith('id', 'task-1')
    expect(builder.eq).toHaveBeenCalledWith('user_id', MOCK_USER.id)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
  })

  it('does nothing when no user', async () => {
    const builder = createQueryBuilder({ error: null })
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: () => builder,
    } as any)

    await deleteTask('task-1')

    expect(builder.delete).not.toHaveBeenCalled()
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })
})
