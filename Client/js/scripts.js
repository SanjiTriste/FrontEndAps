
// Endereço do Servidor
const API_URL = 'http://127.0.0.1:8000'; 

// Chaves para localStorage
const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};

const Auth = {
    /**
     * Realiza o login do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} - Dados do usuário e token
     */
    async login(email, password) {
        try {
            // URL http://127.0.0.1:8000/auth/login
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Armazena token e dados do usuário
            if (data.access_token) {
                localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
            }
            
            if (data.user) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },

    /**
     * Registra um novo usuário
     * @param {string} name - Nome do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} - Dados do usuário criado
     */
    async register(name, email, password) {
        try {
            // URL corrigida: http://127.0.0.1:8000/auth/signup
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar usuário');
            }

            return data;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    },

    // ... (restante do objeto Auth - logout, isAuthenticated, getToken, getUser)
    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        Tasks.clearCache();
    },

    isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    }
};


const Tasks = {
    // Cache local das tarefas
    _tasksCache: [],

    /**
     * Obtém headers com autenticação
     * @returns {Object}
     */
    _getAuthHeaders() {
        const token = Auth.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },

    /**
     * Busca todas as tarefas do usuário
     * @returns {Promise<Array>}
     */
    async fetchTasks() {
        try {
            // URL corrigida: http://127.0.0.1:8000/tasks
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'GET',
                headers: this._getAuthHeaders()
            });

            if (response.status === 401) {
                // Token inválido ou expirado
                Auth.logout();
                window.location.href = 'index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar tarefas');
            }

            // Atualiza cache
            this._tasksCache = Array.isArray(data) ? data : (data.tasks || []);
            return this._tasksCache;
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            throw error;
        }
    },
    
    // ... (Os demais métodos do objeto Tasks - createTask, updateTask, etc. - foram mantidos inalterados, pois já usam a API_URL corretamente)
    
    async createTask(title, description = '') {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: this._getAuthHeaders(),
                body: JSON.stringify({ 
                    title, 
                    description,
                    completed: false 
                })
            });

            if (response.status === 401) {
                Auth.logout();
                window.location.href = 'index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar tarefa');
            }

            const newTask = data.task || data;
            this._tasksCache.push(newTask);

            return newTask;
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            throw error;
        }
    },

    async updateTask(id, title, description = '') {
        try {
            const task = this.getTaskById(id);
            
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: this._getAuthHeaders(),
                body: JSON.stringify({ 
                    title, 
                    description,
                    completed: task ? task.completed : false
                })
            });

            if (response.status === 401) {
                Auth.logout();
                window.location.href = 'index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar tarefa');
            }

            const index = this._tasksCache.findIndex(t => t.id == id);
            if (index !== -1) {
                this._tasksCache[index] = { ...this._tasksCache[index], title, description };
            }

            return data.task || data;
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            throw error;
        }
    },

    async toggleTask(id, completed) {
        try {
            const task = this.getTaskById(id);
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }

            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: this._getAuthHeaders(),
                body: JSON.stringify({ 
                    ...task,
                    completed 
                })
            });

            if (response.status === 401) {
                Auth.logout();
                window.location.href = 'index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar tarefa');
            }

            const index = this._tasksCache.findIndex(t => t.id == id);
            if (index !== -1) {
                this._tasksCache[index].completed = completed;
            }

            return data.task || data;
        } catch (error) {
            console.error('Erro ao alternar tarefa:', error);
            throw error;
        }
    },

    async deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: this._getAuthHeaders()
            });

            if (response.status === 401) {
                Auth.logout();
                window.location.href = 'index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erro ao deletar tarefa');
            }

            this._tasksCache = this._tasksCache.filter(t => t.id != id);
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            throw error;
        }
    },

    getTasks() {
        return [...this._tasksCache];
    },

    getTaskById(id) {
        return this._tasksCache.find(t => t.id == id) || null;
    },

    clearCache() {
        this._tasksCache = [];
    }
};

const UI = {
    // ... (todo o código UI foi mantido)
    showMessage(message, type = 'success', duration = 5000) {
        const messageEl = document.getElementById('message');
        
        if (!messageEl) {
            console.warn('Elemento de mensagem não encontrado');
            return;
        }

        messageEl.classList.remove('hidden', 'success', 'error');
        
        messageEl.classList.add(type);
        messageEl.textContent = message;

        if (duration > 0) {
            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, duration);
        }
    },

    hideMessage() {
        const messageEl = document.getElementById('message');
        if (messageEl) {
            messageEl.classList.add('hidden');
        }
    }
};


function formatDate(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

