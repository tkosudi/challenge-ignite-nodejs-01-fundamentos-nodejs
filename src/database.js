import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      }).catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data  = this.#database[table] ?? []

    if (search) {
      console.log(search)
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  selectById(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
    if (rowIndex > -1) {
      return this.#database[table][rowIndex]
    }

    return null
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
    if (rowIndex > -1) {
      const originalRow = this.#database[table][rowIndex];
      const updatedRow = {
        id: originalRow.id,
        title: data.title ?? originalRow.title,
        description: data.description ?? originalRow.description,
        completed_at: originalRow.completed_at,
        created_at: originalRow.created_at,
        updated_at: new Date().toISOString()
      };
  
      this.#database[table][rowIndex] = updatedRow;
      this.#persist()
    }
  }

  completedAt(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
    if (rowIndex > -1) {
      const originalRow = this.#database[table][rowIndex];
      const updatedRow = {...originalRow, completed_at: originalRow.completed_at ? null : new Date().toISOString()};

  
      this.#database[table][rowIndex] = updatedRow;
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}