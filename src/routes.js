import { Database } from './database.js'
import { randomUUID } from 'crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: ((req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)
      return res.end(JSON.stringify(tasks))
    })
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: ((req, res) => {
      const {title, description} = req.body

      if (!title || !description) {
        return res.writeHead(400).end()
      }

      const id = randomUUID()

      const task = {
        id,
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log(task)

      database.insert('tasks', task)

      return res.writeHead(201).end()
    })
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: ((req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify('Task not found'))
      }
     
      const {title, description} = req.body


      const data = {
        id,
        title: title ? title : null,
        description: description ? description : null,
        updated_at: new Date().toISOString()
      }

      database.update('tasks', id, data)

      return res.writeHead(201).end()
    })
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: ((req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify('Task not found'))
      }

      database.completedAt('tasks', id)

      return res.writeHead(201).end()
    })
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: ((req, res) => {
      const {id} = req.params

      const task = database.electById('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify('Task not found'))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    })
  },
]