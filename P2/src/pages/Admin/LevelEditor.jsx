import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

// Available custom block components (admin can add more by creating files in /src/components/blocks/)
const AVAILABLE_BLOCKS = ['TankGauge'] // Add more block names here when new components are added

const SortableBlock = ({ block, index, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `block-${index}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getBlockTypeLabel = (block) => {
    if (block.type === 'custom-block') return `Custom: ${block.component}`
    return block.type.charAt(0).toUpperCase() + block.type.slice(1)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-between border border-gray-200"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        <div>
          <span className="font-semibold text-gray-900">{getBlockTypeLabel(block)}</span>
          {block.config?.title && (
            <span className="text-sm text-gray-600 ml-2">- {block.config.title}</span>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(index)}
          className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(index)}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

const LevelEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { levels, addLevel, updateLevel } = useApp()
  const isNew = id === 'new'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 1,
    difficulty: 'Beginner',
    metadata: {
      blockDiagram: '',
      pinout: '',
      components: [],
      pdfLink: '',
    },
    blocks: [],
    unlocked: true,
  })

  const [editingBlockIndex, setEditingBlockIndex] = useState(null)
  const [blockForm, setBlockForm] = useState(null)
  const [showAddBlock, setShowAddBlock] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isNew) {
      const level = levels.find((l) => l.id === parseInt(id))
      if (level) {
        setFormData(level)
      }
    }
  }, [id, levels, isNew])

  const handleMetadataChange = (key, value) => {
    setFormData({
      ...formData,
      metadata: { ...formData.metadata, [key]: value },
    })
  }

  const handleComponentsChange = (value) => {
    const components = value.split(',').map((c) => c.trim()).filter((c) => c)
    handleMetadataChange('components', components)
  }

  const handleAddBlock = (type) => {
    let newBlock = { type }

    if (type === 'api') {
      newBlock = {
        type: 'api',
        fields: [
          { label: 'API Key', value: '', key: 'apiKey' },
          { label: 'Template ID', value: '', key: 'templateId' },
        ],
      }
    } else if (type === 'graph') {
      newBlock = {
        type: 'graph',
        config: {
          title: '',
          variables: ['value'],
          chartType: 'line',
          xAxis: 'Time',
          yAxis: 'Value',
        },
      }
    } else if (type === 'history') {
      newBlock = {
        type: 'history',
        config: {
          variable: 'value',
          title: 'History',
          maxEntries: 10,
        },
      }
    } else if (type === 'entry') {
      newBlock = {
        type: 'entry',
        config: {
          label: 'Set Value',
          placeholder: 'Enter value',
          variable: 'value',
        },
      }
    } else if (type === 'custom-block') {
      newBlock = {
        type: 'custom-block',
        component: AVAILABLE_BLOCKS[0],
        config: { variable: 'value', min: 0, max: 100 },
      }
    }

    setFormData({
      ...formData,
      blocks: [...formData.blocks, newBlock],
    })
    setShowAddBlock(false)
  }

  const handleEditBlock = (index) => {
    setEditingBlockIndex(index)
    setBlockForm({ ...formData.blocks[index] })
  }

  const handleSaveBlock = () => {
    const updatedBlocks = [...formData.blocks]
    updatedBlocks[editingBlockIndex] = blockForm
    setFormData({ ...formData, blocks: updatedBlocks })
    setEditingBlockIndex(null)
    setBlockForm(null)
  }

  const handleDeleteBlock = (index) => {
    const updatedBlocks = formData.blocks.filter((_, i) => i !== index)
    setFormData({ ...formData, blocks: updatedBlocks })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.split('-')[1])
      const newIndex = parseInt(over.id.split('-')[1])
      const newBlocks = arrayMove(formData.blocks, oldIndex, newIndex)
      setFormData({ ...formData, blocks: newBlocks })
    }
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    if (isNew) {
      const newLevel = addLevel(formData)
      navigate(`/admin/levels/${newLevel.id}`)
    } else {
      updateLevel(parseInt(id), formData)
      alert('Level updated successfully!')
    }
  }

  const handlePreview = () => {
    if (isNew && !formData.title.trim()) {
      alert('Please save the level first before previewing')
      return
    }
    const levelId = isNew ? formData.id || 'preview' : id
    window.open(`/level/${levelId}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Create New Level' : 'Edit Level'}
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Preview as Student
            </button>
            <button
              onClick={() => navigate('/admin/levels')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save Level
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <input
                      type="number"
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Metadata</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block Diagram (URL or path)
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.blockDiagram}
                    onChange={(e) => handleMetadataChange('blockDiagram', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="/uploads/diagram.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pinout</label>
                  <textarea
                    value={formData.metadata.pinout}
                    onChange={(e) => handleMetadataChange('pinout', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Components (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.components.join(', ')}
                    onChange={(e) => handleComponentsChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Component1, Component2, Component3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Link (URL or path)
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.pdfLink}
                    onChange={(e) => handleMetadataChange('pdfLink', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="/uploads/document.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Blocks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Blocks</h2>
                <button
                  onClick={() => setShowAddBlock(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  Add Block
                </button>
              </div>

              {showAddBlock && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAddBlock('api')}
                      className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      API
                    </button>
                    <button
                      onClick={() => handleAddBlock('graph')}
                      className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      Graph
                    </button>
                    <button
                      onClick={() => handleAddBlock('history')}
                      className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      History
                    </button>
                    <button
                      onClick={() => handleAddBlock('entry')}
                      className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      Entry
                    </button>
                    <button
                      onClick={() => handleAddBlock('custom-block')}
                      className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      Custom Block
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddBlock(false)}
                    className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {formData.blocks.length === 0 ? (
                <p className="text-gray-600">No blocks added. Add blocks to build your level.</p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={formData.blocks.map((_, i) => `block-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {formData.blocks.map((block, index) => (
                      <SortableBlock
                        key={index}
                        block={block}
                        index={index}
                        onEdit={handleEditBlock}
                        onDelete={handleDeleteBlock}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}

              {editingBlockIndex !== null && blockForm && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-primary-500">
                  <h3 className="font-semibold mb-4">Edit Block</h3>
                  {blockForm.type === 'api' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">API Block - Edit fields below:</p>
                      {blockForm.fields.map((field, idx) => (
                        <div key={idx}>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => {
                              const newFields = [...blockForm.fields]
                              newFields[idx].label = e.target.value
                              setBlockForm({ ...blockForm, fields: newFields })
                            }}
                            placeholder="Label"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {blockForm.type === 'graph' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={blockForm.config?.title || ''}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: { ...blockForm.config, title: e.target.value },
                          })
                        }
                        placeholder="Chart Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={blockForm.config?.variables?.join(', ') || ''}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: {
                              ...blockForm.config,
                              variables: e.target.value.split(',').map((v) => v.trim()),
                            },
                          })
                        }
                        placeholder="Variables (comma-separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <select
                        value={blockForm.config?.chartType || 'line'}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: { ...blockForm.config, chartType: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                      </select>
                    </div>
                  )}
                  {blockForm.type === 'history' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={blockForm.config?.variable || ''}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: { ...blockForm.config, variable: e.target.value },
                          })
                        }
                        placeholder="Variable name"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        value={blockForm.config?.maxEntries || 10}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: {
                              ...blockForm.config,
                              maxEntries: parseInt(e.target.value),
                            },
                          })
                        }
                        placeholder="Max entries"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                  {blockForm.type === 'entry' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={blockForm.config?.label || ''}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: { ...blockForm.config, label: e.target.value },
                          })
                        }
                        placeholder="Label"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={blockForm.config?.variable || ''}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: { ...blockForm.config, variable: e.target.value },
                          })
                        }
                        placeholder="Variable name"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                  {blockForm.type === 'custom-block' && (
                    <div className="space-y-3">
                      <select
                        value={blockForm.component || AVAILABLE_BLOCKS[0]}
                        onChange={(e) =>
                          setBlockForm({ ...blockForm, component: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        {AVAILABLE_BLOCKS.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={blockForm.config?.variable || ''}
                        onChange={(e) =>
                          setBlockForm({
                            ...blockForm,
                            config: { ...blockForm.config, variable: e.target.value },
                          })
                        }
                        placeholder="Variable name"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={handleSaveBlock}
                      className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBlockIndex(null)
                        setBlockForm(null)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevelEditor


