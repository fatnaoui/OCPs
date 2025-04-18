document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadResumeSection = document.getElementById('upload-resume-section');
    const jobDescriptionSection = document.getElementById('job-description-section');
    const resultsSection = document.getElementById('results-section');
    
    const step1Number = document.getElementById('step1-number');
    const step2Number = document.getElementById('step2-number');
    const step3Number = document.getElementById('step3-number');
    
    const dropZone = document.getElementById('drop-zone');
    const resumeUpload = document.getElementById('resume-upload');
    const folderUpload = document.getElementById('folder-upload');
    const jobUpload = document.getElementById('job-upload');
    const selectFileBtn = document.getElementById('select-file-btn');
    const selectFolderBtn = document.getElementById('select-folder-btn');
    const uploadJobBtn = document.getElementById('upload-job-btn');
    const toggleFileListBtn = document.getElementById('toggle-file-list');
    const fileListContainer = document.getElementById('file-list-container');
    const fileList = document.getElementById('file-list');
    const fileCount = document.getElementById('file-count');
    
    const continueToJobBtn = document.getElementById('continue-to-job-btn');
    const backToResumeBtn = document.getElementById('back-to-resume-btn');
    const submitDocumentsBtn = document.getElementById('submit-documents-btn');
    const matchResumeBtn = document.getElementById('match-resume-btn');
    const backToJobBtn = document.getElementById('back-to-job-btn');
    const uploadSuccessMessage = document.getElementById('upload-success-message');
    const resumeFilename = document.getElementById('resume-filename');
    const jobDescription = document.getElementById('job-description');
    
    // Store candidate data
    let candidatesData = [];
    
    const candidatesGrid = document.getElementById('candidates-grid');
    const detailedView = document.getElementById('detailed-view');
    const backToGridBtn = document.getElementById('back-to-grid-btn');
    const detailedCandidateName = document.getElementById('detailed-candidate-name');
    const detailedScoreContent = document.getElementById('detailed-score-content');
    const detailedMatchedSkills = document.getElementById('detailed-matched-skills');
    const detailedMissingSkills = document.getElementById('detailed-missing-skills');
    const detailedRecommendations = document.getElementById('detailed-recommendations');
    const exportInsightBtn = document.getElementById('export-insight-btn');
    const exportAllBtn = document.getElementById('export-all-btn');
    
    // API URL - change this to your backend URL
    const API_URL = 'https://8000-01jn2a4rdakmhm1hazd2318er7.cloudspaces.litng.ai'; // Updated to match the new backend port

    // Store files
    let resumeFiles = [];
    let jobFile = null;
    let jobText = null;
    
    // Toggle file list view
    let isFileListVisible = false;

    // Step Navigation
    function goToStep(step) {
        // Hide all sections
        uploadResumeSection.classList.remove('active-section');
        jobDescriptionSection.classList.remove('active-section');
        resultsSection.classList.remove('active-section');
        
        uploadResumeSection.classList.add('hidden-section');
        jobDescriptionSection.classList.add('hidden-section');
        resultsSection.classList.add('hidden-section');
        
        // Reset step numbers
        step1Number.classList.remove('active', 'completed', 'flash');
        step2Number.classList.remove('active', 'completed', 'flash');
        step3Number.classList.remove('active', 'completed', 'flash');
        
        // Add flash effect to just-completed steps
        const previousStep = getCurrentStep();
        if (previousStep < step && previousStep > 0) {
            // Add flash effect to the step we're coming from
            document.getElementById(`step${previousStep}-number`).classList.add('flash');
            
            // Remove flash after animation completes
            setTimeout(() => {
                document.getElementById(`step${previousStep}-number`).classList.remove('flash');
            }, 1000);
        }
        
        // Update progress lines
        updateProgressLines(step);
        
        // Show active section
        if (step === 1) {
            uploadResumeSection.classList.remove('hidden-section');
            uploadResumeSection.classList.add('active-section');
            step1Number.classList.add('active');
        } else if (step === 2) {
            jobDescriptionSection.classList.remove('hidden-section');
            jobDescriptionSection.classList.add('active-section');
            step1Number.classList.add('completed');
            step2Number.classList.add('active');
        } else if (step === 3) {
            resultsSection.classList.remove('hidden-section');
            resultsSection.classList.add('active-section');
            step1Number.classList.add('completed');
            step2Number.classList.add('completed');
            step3Number.classList.add('active');
        }
    }

    // Get current active step
    function getCurrentStep() {
        if (uploadResumeSection.classList.contains('active-section')) return 1;
        if (jobDescriptionSection.classList.contains('active-section')) return 2;
        if (resultsSection.classList.contains('active-section')) return 3;
        return 0;
    }

    // Update progress lines based on current step
    function updateProgressLines(step) {
        const step1Line = document.querySelector('#step1 .step-line');
        const step2Line = document.querySelector('#step2 .step-line');
        
        if (step >= 2) {
            // Mark first line as completed
            if (step1Line) step1Line.classList.add('completed-line');
        } else {
            if (step1Line) step1Line.classList.remove('completed-line');
        }
        
        if (step >= 3) {
            // Mark second line as completed
            if (step2Line) step2Line.classList.add('completed-line');
        } else {
            if (step2Line) step2Line.classList.remove('completed-line');
        }
    }

    // File Uploads
    function handleResumeUpload(files) {
        if (!files || files.length === 0) return;
        
        // Process file or files
        const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
        const validFiles = [];
        const invalidFiles = [];
        
        // Convert FileList to Array for easier processing
        Array.from(files).forEach(file => {
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (allowedTypes.includes(fileExtension)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });
        
        // Alert if any invalid files
        if (invalidFiles.length > 0) {
            alert(`${invalidFiles.length} file(s) were skipped due to unsupported format. Please upload only PDF, DOCX, DOC, or TXT files.`);
        }
        
        // If we have valid files
        if (validFiles.length > 0) {
            resumeFiles = validFiles;
            fileCount.textContent = validFiles.length;
            updateFileList(validFiles);
            uploadSuccessMessage.style.display = 'flex';
            
            // Show toggle button if we have multiple files
            if (validFiles.length > 1) {
                toggleFileListBtn.style.display = 'block';
            } else {
                toggleFileListBtn.style.display = 'none';
            }
            
            continueToJobBtn.disabled = false;
        }
    }
    
    function updateFileList(files) {
        // Clear previous list
        fileList.innerHTML = '';
        
        // Add each file to the list
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Add file icon based on type
            const fileExtension = file.name.split('.').pop().toLowerCase();
            let fileIcon = '';
            
            if (fileExtension === 'pdf') {
                fileIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
            } else if (fileExtension === 'docx' || fileExtension === 'doc') {
                fileIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
            } else {
                fileIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
            }
            
            fileItem.innerHTML = `${fileIcon} ${file.name}`;
            fileList.appendChild(fileItem);
        });
    }
    
    function handleJobTextChange() {
        jobText = jobDescription.value.trim();
        submitDocumentsBtn.disabled = !(jobText || jobFile) || resumeFiles.length === 0;
    }
    
    function handleJobFileUpload(file) {
        if (!file) return;
        
        // Check file type
        const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            alert('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT file.');
            return;
        }
        
        jobFile = file;
        jobDescription.placeholder = `File selected: ${file.name}`;
        submitDocumentsBtn.disabled = resumeFiles.length === 0;
    }

    // API Calls
    async function submitDocuments() {
        try {
            const formData = new FormData();
            
            // Add the job description file or text
            if (jobFile) {
                formData.append('offer', jobFile);
            } else if (jobText) {
                // Create a text file from the input
                const textBlob = new Blob([jobText], { type: 'text/plain' });
                formData.append('offer', textBlob, 'job_description.txt');
            } else {
                alert('Please provide a job description.');
                return;
            }
            
            // Add the resume files
            if (resumeFiles && resumeFiles.length > 0) {
                resumeFiles.forEach(file => {
                    formData.append('cvs', file);
                });
            } else {
                alert('Please upload at least one resume.');
                return;
            }
            
            // Show loading state
            submitDocumentsBtn.disabled = true;
            submitDocumentsBtn.textContent = 'Uploading...';
            
            // Send the files to the backend
            const response = await fetch(`${API_URL}/`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            
            // Update UI after successful submission
            submitDocumentsBtn.textContent = 'Documents Submitted';
            submitDocumentsBtn.classList.add('success-btn');
            matchResumeBtn.disabled = false;
            
            // Show success message
            alert('Documents uploaded successfully! You can now click "Match Resume" to get results.');
            
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files. Please try again.');
            submitDocumentsBtn.disabled = false;
            submitDocumentsBtn.textContent = 'Submit Documents';
        }
    }
    
    async function getScores() {
        try {
            // Show loading state
            matchResumeBtn.disabled = true;
            matchResumeBtn.textContent = 'Processing...';
            
            // Navigate to results section
            goToStep(3);
            candidatesGrid.innerHTML = '<div class="loading-container"><div class="loading">Analyzing resumes and job description...</div></div>';
            
            // Fetch the scores from the backend
            const response = await fetch(`${API_URL}/scores`);
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            
            const data = await response.json();
            processResults(data);
            
        } catch (error) {
            console.error('Error getting scores:', error);
            candidatesGrid.innerHTML = '<div class="error">Error retrieving results. Please try again.</div>';
            matchResumeBtn.disabled = false;
            matchResumeBtn.textContent = 'Match Resume';
        }
    }
    
    // Process multiple resume results
    function processResults(data) {
        // Clear any previous results
        candidatesGrid.innerHTML = '';
        candidatesData = [];
        
        if (!data.scores || data.scores.length === 0) {
            candidatesGrid.innerHTML = '<div class="no-results">No results found. Please try again with different resumes.</div>';
            return;
        }
        
        // Process each score into candidate data
        data.scores.forEach((scoreText, index) => {
            // Parse the score from format "the score for Name is 0.4"
            const match = scoreText.match(/the score for (\w+) is ([0-9.]+)/);
            if (match && match.length >= 3) {
                const name = match[1];
                const score = parseFloat(match[2]);
                const scorePercentage = score * 100;
                
                // Determine score level
                let scoreLevel;
                if (scorePercentage < 40) {
                    scoreLevel = 'low';
                } else if (scorePercentage < 70) {
                    scoreLevel = 'medium';
                } else {
                    scoreLevel = 'high';
                }
                
                // Get the filename from the uploaded files
                const filename = resumeFiles[index] ? resumeFiles[index].name : `${name.toLowerCase()}.pdf`;
                
                // Generate skills - in a real implementation, these would come from the backend
                const matchedSkills = generateRandomSkills(3 + Math.floor(score * 5));
                const missingSkills = generateRandomSkills(8 - Math.floor(score * 5));
                
                // Generate recommendations
                const recommendations = [
                    {
                        title: 'Highlight These Skills',
                        content: `Add or emphasize experience with ${missingSkills[0]}`
                    },
                    {
                        title: 'Overall Assessment',
                        content: scoreLevel === 'low' ?
                            'This candidate may not be the best fit. Consider looking for candidates with more relevant experience.' :
                            scoreLevel === 'medium' ?
                            'This candidate has potential but may need additional training in key areas.' :
                            'This candidate is a strong match for the position.'
                    }
                ];
                
                // Store candidate data
                const candidateData = {
                    id: index,
                    name,
                    filename,
                    score,
                    scorePercentage,
                    scoreLevel,
                    matchedSkills,
                    missingSkills,
                    recommendations
                };
                
                candidatesData.push(candidateData);
                
                // Create and append candidate card
                const candidateCard = createCandidateCard(candidateData);
                candidatesGrid.appendChild(candidateCard);
            }
        });
        
        // Re-enable the match button
        matchResumeBtn.disabled = false;
        matchResumeBtn.textContent = 'Match Resume';
    }
    
    // Create a candidate card element
    function createCandidateCard(candidate) {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.dataset.candidateId = candidate.id;
        
        const scoreFormatted = Math.round(candidate.scorePercentage);
        
        card.innerHTML = `
            <div class="card-header ${candidate.scoreLevel}">
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-file">${candidate.filename}</div>
            </div>
            <div class="card-content">
                <div class="score-display">
                    <div class="score-circle-small ${candidate.scoreLevel}">${scoreFormatted}%</div>
                    <div class="score-text">
                        <div class="score-label">Match Score</div>
                        <div class="score-description">${getScoreDescription(candidate.scoreLevel)}</div>
                    </div>
                </div>
                <div class="card-summary">
                    <div class="matched-count">${candidate.matchedSkills.length} skills matched</div>
                    <div class="missing-count">${candidate.missingSkills.length} skills missing</div>
                </div>
            </div>
            <div class="card-footer">
                <button class="view-details-btn">
                    View Detailed Analysis
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        `;
        
        // Add click event to view details
        card.querySelector('.view-details-btn').addEventListener('click', () => {
            showCandidateDetail(candidate.id);
        });
        
        return card;
    }
    
    // Show detailed view for a candidate
    function showCandidateDetail(candidateId) {
        const candidate = candidatesData.find(c => c.id === candidateId);
        if (!candidate) return;
        
        // Hide grid, show detail view
        candidatesGrid.style.display = 'none';
        detailedView.classList.remove('hidden');
        
        // Update candidate name
        detailedCandidateName.textContent = candidate.name;
        
        // Update score content
        updateDetailedScoreContent(candidate);
        
        // Update skills sections
        detailedMatchedSkills.innerHTML = candidate.matchedSkills
            .map(skill => `<span class="skill-tag">${skill}</span>`)
            .join(' ');
            
        detailedMissingSkills.innerHTML = candidate.missingSkills
            .map(skill => `<span class="skill-tag missing-tag">${skill}</span>`)
            .join(' ');
            
        // Update recommendations
        updateDetailedRecommendations(candidate);
    }
    
    // Go back to grid view
    function showCandidateGrid() {
        detailedView.classList.add('hidden');
        candidatesGrid.style.display = 'grid';
    }
    
    // Update the detailed score content
    function updateDetailedScoreContent(candidate) {
        const scoreFormatted = Math.round(candidate.scorePercentage);
        
        detailedScoreContent.innerHTML = `
            <div class="score-circle ${candidate.scoreLevel}">${scoreFormatted}%</div>
            <div class="score-message">
                <p>${getScoreDescription(candidate.scoreLevel)}</p>
                <div class="score-details">
                    <div class="score-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>${candidate.matchedSkills.length} Skills Matched</span>
                    </div>
                    <div class="score-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>${candidate.missingSkills.length} Skills Missing</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update the detailed recommendations section
    function updateDetailedRecommendations(candidate) {
        detailedRecommendations.innerHTML = '';
        
        candidate.recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            
            let icon;
            if (rec.title.includes('Highlight')) {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>';
            } else {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
            }
            
            recItem.innerHTML = `
                <h4>${icon} ${rec.title}</h4>
                <p>${rec.content}</p>
            `;
            
            detailedRecommendations.appendChild(recItem);
        });
    }
    
    // Export candidate insights to PDF
    function exportCandidateInsights(candidateId) {
        const candidate = candidatesData.find(c => c.id === candidateId);
        if (!candidate) return;
        
        alert(`Exporting insights for ${candidate.name}. In a real implementation, this would generate a PDF with detailed analysis.`);
    }
    
    // Export all results to PDF
    function exportAllResults() {
        if (candidatesData.length === 0) {
            alert('No results to export.');
            return;
        }
        
        alert(`Exporting insights for ${candidatesData.length} candidates. In a real implementation, this would generate a PDF with all candidate analyses.`);
    }
    
    // Helper function to get score description based on level
    function getScoreDescription(scoreLevel) {
        switch(scoreLevel) {
            case 'low':
                return 'Low match. This candidate\'s qualifications don\'t align well with the job requirements.';
            case 'medium':
                return 'Moderate match. This candidate has some relevant qualifications for the position.';
            case 'high':
                return 'Strong match. This candidate\'s qualifications align well with the job requirements.';
            default:
                return 'Match score unavailable.';
        }
    }
    
    // Generate random skills for demo purposes
    function generateRandomSkills(count) {
        const allSkills = [
            'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'TypeScript',
            'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'MongoDB', 'SQL',
            'Data Analysis', 'Machine Learning', 'Deep Learning', 'NLP',
            'Project Management', 'Agile', 'Communication', 'Teamwork'
        ];
        
        // Shuffle and take first 'count' elements
        return [...allSkills]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(count, allSkills.length));
    }
    
    // This function has been replaced by processResults, createCandidateCard, etc.

    // Event Listeners
    // Drag and drop for resume
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleResumeUpload(e.dataTransfer.files);
        }
    });
    
    // Click to browse for multiple files
    selectFileBtn.addEventListener('click', () => {
        resumeUpload.click();
    });
    
    resumeUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleResumeUpload(e.target.files);
        }
    });
    
    // Click to browse for folder
    selectFolderBtn.addEventListener('click', () => {
        folderUpload.click();
    });
    
    folderUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleResumeUpload(e.target.files);
        }
    });
    
    // Toggle file list visibility
    toggleFileListBtn.addEventListener('click', () => {
        isFileListVisible = !isFileListVisible;
        
        if (isFileListVisible) {
            fileListContainer.style.display = 'block';
            toggleFileListBtn.textContent = 'Hide files';
        } else {
            fileListContainer.style.display = 'none';
            toggleFileListBtn.textContent = 'Show files';
        }
    });
    
    // Job description text input
    jobDescription.addEventListener('input', handleJobTextChange);
    
    // Job description file upload
    uploadJobBtn.addEventListener('click', () => {
        jobUpload.click();
    });
    
    jobUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleJobFileUpload(e.target.files[0]);
        }
    });
    
    // Navigation buttons
    continueToJobBtn.addEventListener('click', () => goToStep(2));
    backToResumeBtn.addEventListener('click', () => goToStep(1));
    submitDocumentsBtn.addEventListener('click', submitDocuments);
    matchResumeBtn.addEventListener('click', getScores);
    backToJobBtn.addEventListener('click', () => goToStep(2));
    
    // Detailed view navigation
    backToGridBtn.addEventListener('click', showCandidateGrid);
    
    // Export buttons
    exportInsightBtn.addEventListener('click', () => {
        // Get the current candidate ID from the URL or data attribute
        const candidateId = parseInt(detailedCandidateName.dataset.candidateId || 0);
        exportCandidateInsights(candidateId);
    });
    
    exportAllBtn.addEventListener('click', exportAllResults);
    
    // Initialize
    goToStep(1);
    
    // Initially disable the match resume button
    matchResumeBtn.disabled = true;
});
