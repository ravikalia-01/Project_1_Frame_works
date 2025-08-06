import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { resumeApi } from '../services/resumeApi'

const AdvancedResumeManager = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  // Advanced query with pagination and filtering
  const { 
    data: resumes, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['resumes', 'user', user?.id],
    queryFn: () => resumeApi.fetchUserResumes(user?.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })

  // Mutations with optimistic updates
  const createResumeMutation = useMutation({
    mutationFn: resumeApi.createResume,
    onMutate: async (newResume) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['resumes', 'user', user?.id])

      // Snapshot previous value
      const previousResumes = queryClient.getQueryData(['resumes', 'user', user?.id])

      // Optimistically update
      queryClient.setQueryData(['resumes', 'user', user?.id], (old) => [
        ...(old || []),
        { ...newResume, id: Date.now().toString(), isOptimistic: true }
      ])

      return { previousResumes }
    },
    onError: (err, newResume, context) => {
      // Rollback on error
      queryClient.setQueryData(['resumes', 'user', user?.id], context.previousResumes)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['resumes', 'user', user?.id])
    }
  })

  const updateResumeMutation = useMutation({
    mutationFn: ({ id, data }) => resumeApi.updateResume(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(['resumes', 'user', user?.id])
      
      const previousResumes = queryClient.getQueryData(['resumes', 'user', user?.id])
      
      queryClient.setQueryData(['resumes', 'user', user?.id], (old) =>
        old?.map(resume => 
          resume.id === id ? { ...resume, ...data } : resume
        )
      )

      return { previousResumes }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['resumes', 'user', user?.id], context.previousResumes)
    }
  })

  const deleteResumeMutation = useMutation({
    mutationFn: resumeApi.deleteResume,
    onMutate: async (id) => {
      await queryClient.cancelQueries(['resumes', 'user', user?.id])
      
      const previousResumes = queryClient.getQueryData(['resumes', 'user', user?.id])
      
      queryClient.setQueryData(['resumes', 'user', user?.id], (old) =>
        old?.filter(resume => resume.id !== id)
      )

      return { previousResumes }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['resumes', 'user', user?.id], context.previousResumes)
    }
  })

  const [selectedResume, setSelectedResume] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    bio: ''
  })

  const handleCreateResume = () => {
    createResumeMutation.mutate({
      name: 'New Resume',
      email: user?.email || '',
      mobile: '',
      bio: '',
      createdAt: new Date().toISOString()
    })
  }

  const handleUpdateResume = (id, updates) => {
    updateResumeMutation.mutate({ id, data: updates })
  }

  const handleDeleteResume = (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteResumeMutation.mutate(id)
    }
  }

  const handleSelectResume = (resume) => {
    setSelectedResume(resume)
    setFormData({
      name: resume.name || '',
      email: resume.email || '',
      mobile: resume.mobile || '',
      bio: resume.bio || ''
    })
  }

  if (isLoading) return <div className="loading">Loading resumes...</div>
  if (error) return <div className="error">Error: {error.message}</div>

  return (
    <div className="advanced-resume-manager">
      <h2>Advanced Resume Manager</h2>
      
      <div className="toolbar">
        <button 
          onClick={handleCreateResume}
          disabled={createResumeMutation.isLoading}
          className="btn btn-primary"
        >
          {createResumeMutation.isLoading ? 'Creating...' : 'Create New Resume'}
        </button>
        
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-secondary"
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="resume-grid">
        {resumes?.map(resume => (
          <div key={resume.id} className="resume-card">
            <h3>{resume.name}</h3>
            <p>{resume.email}</p>
            <p className="date">Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
            
            <div className="actions">
              <button 
                onClick={() => handleSelectResume(resume)}
                className="btn btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteResume(resume.id)}
                disabled={deleteResumeMutation.isLoading}
                className="btn btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedResume && (
        <div className="resume-editor">
          <h3>Edit Resume</h3>
          
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value
                setFormData(prev => ({ ...prev, name: newName }))
                handleUpdateResume(selectedResume.id, { name: newName })
              }}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                const newEmail = e.target.value
                setFormData(prev => ({ ...prev, email: newEmail }))
                handleUpdateResume(selectedResume.id, { email: newEmail })
              }}
            />
          </div>

          <div className="form-group">
            <label>Mobile:</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => {
                const newMobile = e.target.value
                setFormData(prev => ({ ...prev, mobile: newMobile }))
                handleUpdateResume(selectedResume.id, { mobile: newMobile })
              }}
            />
          </div>

          <div className="form-group">
            <label>Bio:</label>
            <textarea
              value={formData.bio}
              onChange={(e) => {
                const newBio = e.target.value
                setFormData(prev => ({ ...prev, bio: newBio }))
                handleUpdateResume(selectedResume.id, { bio: newBio })
              }}
            />
          </div>

          <button onClick={() => setSelectedResume(null)} className="btn btn-close">
            Close Editor
          </button>
        </div>
      )}
    </div>
  )
}

export default AdvancedResumeManager
