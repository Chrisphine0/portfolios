// utils/github.ts
// Utility functions for GitHub API integration

export interface GitHubRepo {
    id: number
    name: string
    description: string | null
    html_url: string
    homepage: string | null
    language: string | null
    stargazers_count: number
    forks_count: number
    topics: string[]
    updated_at: string
    created_at: string
    size: number
    archived: boolean
    disabled: boolean
    fork: boolean
    owner: {
      avatar_url: string
      login: string
    }
  }
  
  export interface Project {
    id: number
    title: string
    description: string
    image: string
    technologies: string[]
    githubUrl: string
    liveUrl: string
    category: string
    stars: number
    forks: number
    lastUpdated: string
  }
  
  // Configuration from environment variables
  export const getGitHubConfig = () => ({
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || '',
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
    excludedRepos: process.env.NEXT_PUBLIC_EXCLUDED_REPOS?.split(',').map(s => s.trim()) || [],
    maxRepos: parseInt(process.env.NEXT_PUBLIC_MAX_REPOS || '12'),
    featuredCount: parseInt(process.env.NEXT_PUBLIC_FEATURED_COUNT || '6'),
    customCategories: parseKeyValuePairs(process.env.NEXT_PUBLIC_REPO_CATEGORIES || ''),
    customDescriptions: parseKeyValuePairs(process.env.NEXT_PUBLIC_CUSTOM_DESCRIPTIONS || ''),
    customImages: parseKeyValuePairs(process.env.NEXT_PUBLIC_REPO_IMAGES || ''),
  })
  
  // Parse key:value,key:value format
  function parseKeyValuePairs(str: string): Record<string, string> {
    if (!str) return {}
    
    return str.split(',').reduce((acc, pair) => {
      const [key, value] = pair.split(':').map(s => s.trim())
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
  }
  
  // Technology colors mapping
  export const techColors: Record<string, string> = {
    React: "bg-blue-500 hover:bg-blue-600",
    "Next.js": "bg-black hover:bg-gray-800",
    "Node.js": "bg-green-500 hover:bg-green-600",
    TypeScript: "bg-blue-600 hover:bg-blue-700",
    JavaScript: "bg-yellow-500 hover:bg-yellow-600",
    Python: "bg-blue-400 hover:bg-blue-500",
    Java: "bg-orange-600 hover:bg-orange-700",
    "C++": "bg-blue-700 hover:bg-blue-800",
    "C#": "bg-purple-700 hover:bg-purple-800",
    PHP: "bg-indigo-600 hover:bg-indigo-700",
    Ruby: "bg-red-600 hover:bg-red-700",
    Go: "bg-cyan-600 hover:bg-cyan-700",
    Rust: "bg-orange-700 hover:bg-orange-800",
    Swift: "bg-orange-500 hover:bg-orange-600",
    Kotlin: "bg-purple-500 hover:bg-purple-600",
    Dart: "bg-blue-500 hover:bg-blue-600",
    HTML: "bg-orange-500 hover:bg-orange-600",
    CSS: "bg-blue-500 hover:bg-blue-600",
    Vue: "bg-green-500 hover:bg-green-600",
    Angular: "bg-red-600 hover:bg-red-700",
    Svelte: "bg-orange-600 hover:bg-orange-700",
    MongoDB: "bg-green-600 hover:bg-green-700",
    PostgreSQL: "bg-blue-700 hover:bg-blue-800",
    MySQL: "bg-blue-600 hover:bg-blue-700",
    Redis: "bg-red-500 hover:bg-red-600",
    Docker: "bg-blue-500 hover:bg-blue-600",
    Kubernetes: "bg-blue-600 hover:bg-blue-700",
    AWS: "bg-orange-500 hover:bg-orange-600",
    Firebase: "bg-orange-500 hover:bg-orange-600",
    Tailwind: "bg-cyan-500 hover:bg-cyan-600",
    Bootstrap: "bg-purple-600 hover:bg-purple-700",
    Express: "bg-gray-600 hover:bg-gray-700",
    Django: "bg-green-700 hover:bg-green-800",
    Flask: "bg-gray-800 hover:bg-gray-900",
    Laravel: "bg-red-500 hover:bg-red-600",
    "Spring Boot": "bg-green-600 hover:bg-green-700",
    GraphQL: "bg-pink-500 hover:bg-pink-600",
    REST: "bg-blue-500 hover:bg-blue-600",
    "Socket.io": "bg-purple-500 hover:bg-purple-600",
    WebRTC: "bg-red-600 hover:bg-red-700",
    Flutter: "bg-blue-400 hover:bg-blue-500",
    "React Native": "bg-cyan-600 hover:bg-cyan-700",
    Expo: "bg-gray-800 hover:bg-gray-900",
    Electron: "bg-gray-700 hover:bg-gray-800",
    Solidity: "bg-gray-500 hover:bg-gray-600",
    "Web3.js": "bg-orange-500 hover:bg-orange-600",
    Ethereum: "bg-blue-800 hover:bg-blue-900",
    Bitcoin: "bg-orange-600 hover:bg-orange-700",
    TensorFlow: "bg-orange-500 hover:bg-orange-600",
    PyTorch: "bg-red-600 hover:bg-red-700",
    Pandas: "bg-blue-600 hover:bg-blue-700",
    NumPy: "bg-blue-500 hover:bg-blue-600",
    Jupyter: "bg-orange-400 hover:bg-orange-500",
  }
  
  // Get category based on repository characteristics
  export const getCategoryFromRepo = (repo: GitHubRepo, customCategories: Record<string, string>): string => {
    // Check custom categories first
    if (customCategories[repo.name]) {
      return customCategories[repo.name]
    }
  
    const name = repo.name.toLowerCase()
    const description = repo.description?.toLowerCase() || ""
    const topics = repo.topics.map(topic => topic.toLowerCase())
    const language = repo.language?.toLowerCase() || ""
    
    // AI/ML Detection
    if (
      topics.some(t => ['ai', 'ml', 'machine-learning', 'artificial-intelligence', 'deep-learning', 'neural-network', 'tensorflow', 'pytorch'].includes(t)) ||
      description.includes('ai') || description.includes('machine learning') || description.includes('neural') ||
      language === 'python' && (description.includes('model') || description.includes('data'))
    ) {
      return "AI/ML"
    }
    
    // Mobile Detection
    if (
      topics.some(t => ['mobile', 'react-native', 'flutter', 'ios', 'android', 'expo', 'swift', 'kotlin', 'dart'].includes(t)) ||
      description.includes('mobile') || description.includes('app') ||
      language === 'swift' || language === 'kotlin' || language === 'dart'
    ) {
      return "Mobile"
    }
    
    // Blockchain Detection
    if (
      topics.some(t => ['blockchain', 'web3', 'cryptocurrency', 'ethereum', 'bitcoin', 'solidity', 'smart-contract', 'defi', 'nft'].includes(t)) ||
      description.includes('blockchain') || description.includes('crypto') || description.includes('web3') ||
      language === 'solidity'
    ) {
      return "Blockchain"
    }
    
    // Real-time Detection
    if (
      topics.some(t => ['realtime', 'websocket', 'socket.io', 'chat', 'messaging', 'live'].includes(t)) ||
      description.includes('real-time') || description.includes('websocket') || description.includes('chat') ||
      description.includes('live')
    ) {
      return "Real-time"
    }
    
    // Data Science Detection
    if (
      topics.some(t => ['data', 'analytics', 'visualization', 'dashboard', 'statistics', 'analysis', 'jupyter', 'pandas', 'numpy'].includes(t)) ||
      description.includes('data') || description.includes('analytics') || description.includes('visualization') ||
      language === 'python' && (description.includes('analysis') || description.includes('dashboard'))
    ) {
      return "Data Science"
    }
    
    // Game Development Detection
    if (
      topics.some(t => ['game', 'unity', 'unreal', 'gamedev', 'gaming', 'engine'].includes(t)) ||
      description.includes('game') || description.includes('unity') || description.includes('gaming')
    ) {
      return "Game Development"
    }
    
    // DevOps Detection
    if (
      topics.some(t => ['devops', 'docker', 'kubernetes', 'ci-cd', 'deployment', 'infrastructure', 'terraform', 'ansible'].includes(t)) ||
      description.includes('devops') || description.includes('deployment') || description.includes('infrastructure')
    ) {
      return "DevOps"
    }
    
    // Full Stack Detection
    if (
      topics.some(t => ['fullstack', 'full-stack'].includes(t)) ||
      (topics.includes('frontend') && topics.includes('backend')) ||
      description.includes('full-stack') || description.includes('fullstack')
    ) {
      return "Full Stack"
    }
    
    // Frontend Detection
    if (
      topics.some(t => ['frontend', 'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'website', 'ui', 'ux'].includes(t)) ||
      description.includes('frontend') || description.includes('website') || description.includes('ui') ||
      ['javascript', 'typescript'].includes(language) && (description.includes('react') || description.includes('vue'))
    ) {
      return "Frontend"
    }
    
    // Backend Detection
    if (
      topics.some(t => ['backend', 'api', 'server', 'microservice', 'rest', 'graphql', 'database'].includes(t)) ||
      description.includes('backend') || description.includes('api') || description.includes('server') ||
      ['java', 'python', 'go', 'rust', 'c#', 'php', 'ruby'].includes(language)
    ) {
      return "Backend"
    }
    
    // Desktop App Detection
    if (
      topics.some(t => ['desktop', 'electron', 'tauri', 'gui', 'application'].includes(t)) ||
      description.includes('desktop') || description.includes('application') ||
      language === 'electron'
    ) {
      return "Desktop"
    }
    
    // Default category
    return "Web Development"
  }
  
  // Get technologies from repository
  export const getTechnologiesFromRepo = (repo: GitHubRepo): string[] => {
    const technologies: string[] = []
    
    // Add primary language
    if (repo.language && techColors[repo.language]) {
      technologies.push(repo.language)
    }
    
    // Add technologies based on topics
    repo.topics.forEach(topic => {
      const normalizedTopic = topic.toLowerCase()
      
      // Direct matches
      Object.keys(techColors).forEach(tech => {
        const normalizedTech = tech.toLowerCase().replace(/[.\s]/g, "")
        if (
          normalizedTopic === normalizedTech ||
          normalizedTopic.includes(normalizedTech) ||
          (tech === 'Next.js' && normalizedTopic === 'nextjs') ||
          (tech === 'Node.js' && normalizedTopic === 'nodejs') ||
          (tech === 'React Native' && normalizedTopic === 'react-native') ||
          (tech === 'Vue.js' && normalizedTopic === 'vue') ||
          (tech === 'Socket.io' && normalizedTopic === 'socketio')
        ) {
          if (!technologies.includes(tech)) {
            technologies.push(tech)
          }
        }
      })
    })
    
    // Add common combinations
    if (technologies.includes('React') && repo.topics.includes('typescript')) {
      technologies.push('TypeScript')
    }
    if (technologies.includes('Node.js') && repo.topics.includes('express')) {
      technologies.push('Express')
    }
    
    // Limit to 5 technologies for better UI
    return technologies.slice(0, 5)
  }
  
  // Fetch repositories from GitHub API
  export const fetchGitHubRepositories = async (): Promise<GitHubRepo[]> => {
    const config = getGitHubConfig()
    
    if (!config.username) {
      throw new Error("GitHub username not configured")
    }
  
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website',
    }
  
    // Add token if available
    if (config.token) {
      headers['Authorization'] = `token ${config.token}`
    }
  
    const response = await fetch(
      `https://api.github.com/users/${config.username}/repos?sort=updated&per_page=${config.maxRepos}&type=owner`,
      { headers }
    )
  
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid GitHub token")
      } else if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded")
      } else if (response.status === 404) {
        throw new Error("GitHub user not found")
      } else {
        throw new Error(`GitHub API error: ${response.status}`)
      }
    }
  
    const repos: GitHubRepo[] = await response.json()
    return repos
  }
  
  // Filter and convert repositories to projects
  export const convertReposToProjects = (repos: GitHubRepo[]): Project[] => {
    const config = getGitHubConfig()
    
    return repos
      .filter(repo => {
        // Filter out forks, archived, disabled repos
        if (repo.fork || repo.archived || repo.disabled) return false
        
        // Filter out excluded repos
        if (config.excludedRepos.includes(repo.name)) return false
        
        // Filter out repos without description (unless they have topics)
        if (!repo.description && repo.topics.length === 0) return false
        
        return true
      })
      .slice(0, config.featuredCount)
      .map(repo => ({
        id: repo.id,
        title: formatRepoName(repo.name),
        description: config.customDescriptions[repo.name] || repo.description || "",
        image: config.customImages[repo.name] || generateRepoImage(repo),
        technologies: getTechnologiesFromRepo(repo),
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || "",
        category: getCategoryFromRepo(repo, config.customCategories),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastUpdated: repo.updated_at,
      }))
  }
  
  // Format repository name for display
  const formatRepoName = (name: string): string => {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bApi\b/g, 'API')
      .replace(/\bUi\b/g, 'UI')
      .replace(/\bDb\b/g, 'DB')
      .replace(/\bAi\b/g, 'AI')
      .replace(/\bMl\b/g, 'ML')
  }
  
  // Generate a placeholder image based on repository
  const generateRepoImage = (repo: GitHubRepo): string => {
    const category = getCategoryFromRepo(repo, {})
    const colors = {
      'AI/ML': 'from-purple-500-to-pink-500',
      'Mobile': 'from-blue-500-to-cyan-500',
      'Blockchain': 'from-yellow-500-to-orange-500',
      'Real-time': 'from-green-500-to-teal-500',
      'Data Science': 'from-indigo-500-to-purple-500',
      'Game Development': 'from-red-500-to-pink-500',
      'DevOps': 'from-gray-500-to-gray-700',
      'Full Stack': 'from-blue-600-to-purple-600',
      'Frontend': 'from-cyan-200-to-blue-500',
      'Backend': 'from-green-600-to-blue-600',
      'Desktop': 'from-gray-600-to-gray-800',
      'Web Development': 'from-blue-500-to-purple-500',
    }
    
    const gradient = colors[category as keyof typeof colors] || 'from-purple-500-to-blue-500'
    return `/api/placeholder/400/300?gradient=${gradient}&text=${encodeURIComponent(repo.name)}`
  }
  
  // Main function to get projects
  export const getGitHubProjects = async (): Promise<Project[]> => {
    try {
      const repos = await fetchGitHubRepositories()
      return convertReposToProjects(repos)
    } catch (error) {
      console.error('Error fetching GitHub projects:', error)
      throw error
    }
  }