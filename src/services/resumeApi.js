import { queryClient } from '../lib/queryClient'

// Mock API service - replace with actual endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ResumeApiService {
  // Fetch all resumes for a user
  async fetchUserResumes(userId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock data - replace with actual API call
    const mockResumes = JSON.parse(localStorage.getItem(`resumes_${userId}`) || '[]')
    return mockResumes
  }

  // Fetch single resume
  async fetchResume(id) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock implementation
    const allResumes = JSON.parse(localStorage.getItem('all_resumes') || '[]')
    const resume = allResumes.find(r => r.id === id)
    if (!resume) throw new Error('Resume not found')
    return resume
  }

  // Create new resume
  async createResume(resumeData) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newResume = {
      id: Date.now().toString(),
      ...resumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Mock storage
    const allResumes = JSON.parse(localStorage.getItem('all_resumes') || '[]')
    allResumes.push(newResume)
    localStorage.setItem('all_resumes', JSON.stringify(allResumes))
    
    return newResume
  }

  // Update resume
  async updateResume(id, resumeData) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const allResumes = JSON.parse(localStorage.getItem('all_resumes') || '[]')
    const index = allResumes.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Resume not found')
    
    allResumes[index] = {
      ...allResumes[index],
      ...resumeData,
      updatedAt: new Date().toISOString(),
    }
    
    localStorage.setItem('all_resumes', JSON.stringify(allResumes))
    return allResumes[index]
  }

  // Delete resume
  async deleteResume(id) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const allResumes = JSON.parse(localStorage.getItem('all_resumes') || '[]')
    const filteredResumes = allResumes.filter(r => r.id !== id)
    localStorage.setItem('all_resumes', JSON.stringify(filteredResumes))
    
    return { success: true }
  }

  // Save resume as template
  async saveAsTemplate(resumeId, templateName) {
    await new Promise(resolve => setTimeout(resolve, 700))
    
    const resume = await this.fetchResume(resumeId)
    const template = {
      id: `template_${Date.now()}`,
      name: templateName,
      data: resume,
      createdAt: new Date().toISOString(),
    }
    
    const templates = JSON.parse(localStorage.getItem('resume_templates') || '[]')
    templates.push(template)
    localStorage.setItem('resume_templates', JSON.stringify(templates))
    
    return template
  }
}

export const resumeApi = new ResumeApiService()

// React Query hooks
export const resumeQueries = {
  // Get all resumes for user
  userResumes: (userId) => ({
    queryKey: ['resumes', 'user', userId],
    queryFn: () => resumeApi.fetchUserResumes(userId),
    enabled: !!userId,
  }),

  // Get single resume
  resume: (id) => ({
    queryKey: ['resumes', 'detail', id],
    queryFn: () => resumeApi.fetchResume(id),
    enabled: !!id,
  }),

  // Create resume mutation
  createResume: () => ({
    mutationFn: resumeApi.createResume,
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['resumes'])
    },
  }),

  // Update resume mutation
  updateResume: () => ({
    mutationFn: ({ id, data }) => resumeApi.updateResume(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['resumes'])
      queryClient.invalidateQueries(['resumes', 'detail', variables.id])
    },
  }),

  // Delete resume mutation
  deleteResume: () => ({
    mutationFn: resumeApi.deleteResume,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['resumes'])
    },
  }),
}
