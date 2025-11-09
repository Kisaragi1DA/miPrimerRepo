// Global variables
let allCollaborators = [];
let currentFilter = 'all';

// Load data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadCollaborators();
    setupFilterButtons();
});

// Load collaborators from data.json
async function loadCollaborators() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Update project info
        document.getElementById('projectName').textContent = data.project.name;
        document.getElementById('projectDescription').textContent = data.project.description;
        
        // Store collaborators
        allCollaborators = data.collaborators;
        
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
        
        // Render all collaborators
        renderCollaborators(allCollaborators);
        
    } catch (error) {
        console.error('Error loading collaborators:', error);
        document.getElementById('loading').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle"></i> 
                Error loading team data. Please try again later.
            </div>
        `;
    }
}

// Render collaborator cards
function renderCollaborators(collaborators) {
    const grid = document.getElementById('collaboratorsGrid');
    grid.innerHTML = '';
    
    collaborators.forEach((collab, index) => {
        const card = createCollaboratorCard(collab, index);
        grid.appendChild(card);
    });
}

// Create a single collaborator card
function createCollaboratorCard(collab, index) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 fade-in';
    col.style.animationDelay = `${index * 0.1}s`;
    
    // Create skills HTML
    const skillsHTML = collab.skills.map(skill => 
        `<span class="skill-badge">${skill}</span>`
    ).join('');
    
    // Create social links HTML
    const socialHTML = `
        <a href="${collab.social.github}" target="_blank" title="GitHub">
            <i class="bi bi-github"></i>
        </a>
        <a href="${collab.social.linkedin}" target="_blank" title="LinkedIn">
            <i class="bi bi-linkedin"></i>
        </a>
        <a href="${collab.social.twitter}" target="_blank" title="Twitter">
            <i class="bi bi-twitter"></i>
        </a>
    `;
    
    col.innerHTML = `
        <div class="card collaborator-card" data-role="${collab.role.toLowerCase()}">
            <div class="card-img-wrapper">
                <img src="${collab.avatar}" class="card-img-top" alt="${collab.name}">
                <span class="role-badge">${collab.role}</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${collab.name}</h5>
                <p class="card-text">${collab.bio}</p>
                
                <div class="mb-3">
                    <strong class="d-block mb-2" style="color: #2c3e50;">Skills:</strong>
                    ${skillsHTML}
                </div>
                
                <div class="social-links text-center mt-3">
                    ${socialHTML}
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Setup filter button functionality
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            currentFilter = filter;
            
            // Filter and render
            filterCollaborators(filter);
        });
    });
}

// Filter collaborators based on role
function filterCollaborators(filter) {
    const cards = document.querySelectorAll('.collaborator-card');
    
    cards.forEach(card => {
        const cardRole = card.getAttribute('data-role');
        const cardCol = card.closest('.col-12');
        
        if (filter === 'all') {
            // Show all cards
            cardCol.style.display = 'block';
            setTimeout(() => {
                cardCol.style.opacity = '1';
                cardCol.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Check if card matches filter
            if (cardRole.includes(filter)) {
                cardCol.style.display = 'block';
                setTimeout(() => {
                    cardCol.style.opacity = '1';
                    cardCol.style.transform = 'translateY(0)';
                }, 10);
            } else {
                cardCol.style.opacity = '0';
                cardCol.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    cardCol.style.display = 'none';
                }, 300);
            }
        }
    });
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add card click animation
document.addEventListener('click', (e) => {
    const card = e.target.closest('.collaborator-card');
    if (card) {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }
});