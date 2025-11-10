import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableItem = ({ level, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: level.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md p-4 mb-3 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{level.title}</h3>
          <p className="text-sm text-gray-600">{level.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-gray-500">Level {level.level}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">{level.difficulty}</span>
            <span className="text-xs text-gray-500">Order: {level.order}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Link
          to={`/level/${level.id}`}
          target="_blank"
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Preview
        </Link>
        <button
          onClick={() => onEdit(level.id)}
          className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(level.id)}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

const ManageLevels = () => {
  const { levels, deleteLevel, reorderLevels, exportLevelsJSON, importLevelsJSON } = useApp()
  const navigate = useNavigate()
  const [sortedLevels, setSortedLevels] = useState(
    [...levels].sort((a, b) => a.order - b.order)
  )

  useEffect(() => {
    setSortedLevels([...levels].sort((a, b) => a.order - b.order))
  }, [levels])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setSortedLevels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        reorderLevels(newItems)
        return newItems
      })
    }
  }

  const handleDelete = (levelId) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      deleteLevel(levelId)
      setSortedLevels((items) => items.filter((item) => item.id !== levelId))
    }
  }

  const handleExport = () => {
    exportLevelsJSON()
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonData = event.target.result
          if (importLevelsJSON(jsonData)) {
            alert('Levels imported successfully!')
            window.location.reload()
          } else {
            alert('Failed to import levels. Please check the JSON format.')
          }
        } catch (error) {
          alert('Error reading file: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Levels</h1>
          <div className="flex space-x-3">
            <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={() => navigate('/admin/levels/new')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create Level
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Levels (Drag to reorder)</h2>
          {sortedLevels.length === 0 ? (
            <p className="text-gray-600">No levels created yet. Create your first level!</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedLevels.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedLevels.map((level) => (
                  <SortableItem
                    key={level.id}
                    level={level}
                    onEdit={(id) => navigate(`/admin/levels/${id}`)}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageLevels
