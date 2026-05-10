/**
 * 美丽导航 - Quiz Logic
 * Personalized Face Yoga Recommendation System
 */

(function() {
    'use strict';
    
    // Quiz State
    const state = {
        currentStep: 1,
        totalSteps: 5,
        answers: {
            gender: null,
            age: null,
            concerns: [],
            time: null,
            goal: null
        }
    };
    
    // Exercise Database with concern mappings
    const exercises = {
        'jawline-lift': {
            id: 'jawline',
            name: '下颌线提升',
            nameKey: 'page.exercises.exercise1.name',
            desc: '紧致下颌线条，消除双下巴',
            duration: '5分钟',
            level: '初级',
            concerns: ['double-chin', 'jawline', 'sagging'],
            goals: ['contouring', 'anti-aging'],
            matchScore: 0
        },
        'forehead-smoothing': {
            id: 'forehead',
            name: '额头抚平',
            nameKey: 'page.exercises.exercise2.name',
            desc: '减少额头皱纹，提升眉眼',
            duration: '3分钟',
            level: '初级',
            concerns: ['wrinkles', 'forehead-lines'],
            goals: ['anti-aging', 'relaxation'],
            matchScore: 0
        },
        'cheek-sculpting': {
            id: 'cheeks',
            name: '苹果肌塑形',
            nameKey: 'page.exercises.exercise3.name',
            desc: '提升面部中部，恢复年轻饱满',
            duration: '4分钟',
            level: '中级',
            concerns: ['sagging', 'jawline'],
            goals: ['contouring', 'radiance'],
            matchScore: 0
        },
        'eye-rejuvenation': {
            id: 'eyes',
            name: '眼部舒缓',
            nameKey: 'page.exercises.exercise4.name',
            desc: '消除眼袋和黑眼圈',
            duration: '3分钟',
            level: '初级',
            concerns: ['eye-bags', 'wrinkles'],
            goals: ['anti-aging', 'relaxation', 'radiance'],
            matchScore: 0
        },
        'facial-massage': {
            id: 'massage',
            name: '淋巴排毒按摩',
            nameKey: 'page.massage.title',
            desc: '促进血液循环，消除面部浮肿',
            duration: '10分钟',
            level: '初级',
            concerns: ['sagging', 'eye-bags', 'double-chin'],
            goals: ['relaxation', 'radiance', 'contouring'],
            matchScore: 0
        }
    };
    
    // DOM Elements
    let progressFill, progressSteps, currentStepEl;
    let prevBtn, nextBtn, quizNav;
    let quizSteps;
    
    // Initialize Quiz
    function init() {
        progressFill = document.getElementById('progress-fill');
        progressSteps = document.querySelectorAll('.progress-step');
        currentStepEl = document.getElementById('current-step');
        prevBtn = document.getElementById('prev-btn');
        nextBtn = document.getElementById('next-btn');
        quizNav = document.getElementById('quiz-nav');
        quizSteps = document.querySelectorAll('.quiz-step');
        
        // Bind option click events
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', handleOptionClick);
        });
        
        // Bind navigation events
        prevBtn.addEventListener('click', goToPrevStep);
        nextBtn.addEventListener('click', goToNextStep);
        
        // Initialize first step
        updateProgress();
        updateNavButtons();
    }
    
    // Handle Option Click
    function handleOptionClick(e) {
        const option = e.currentTarget;
        const field = option.dataset.field;
        const value = option.dataset.value;
        const isMultiSelect = option.closest('.multi-select');
        
        if (isMultiSelect) {
            // Toggle selection for multi-select
            option.classList.toggle('selected');
            
            if (option.classList.contains('selected')) {
                if (!state.answers[field].includes(value)) {
                    state.answers[field].push(value);
                }
            } else {
                state.answers[field] = state.answers[field].filter(v => v !== value);
            }
        } else {
            // Single select
            const siblings = option.parentElement.querySelectorAll('.quiz-option');
            siblings.forEach(sib => sib.classList.remove('selected'));
            option.classList.add('selected');
            state.answers[field] = value;
        }
        
        updateNavButtons();
    }
    
    // Update Progress
    function updateProgress() {
        const progress = (state.currentStep / state.totalSteps) * 100;
        progressFill.style.width = progress + '%';
        
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === state.currentStep) {
                step.classList.add('active');
            } else if (stepNum < state.currentStep) {
                step.classList.add('completed');
            }
        });
        
        currentStepEl.textContent = state.currentStep;
    }
    
    // Update Navigation Buttons
    function updateNavButtons() {
        // Previous button
        prevBtn.disabled = state.currentStep === 1;
        
        // Next button
        const isStepComplete = checkStepComplete(state.currentStep);
        nextBtn.disabled = !isStepComplete;
        
        // Update next button text for last step
        if (state.currentStep === state.totalSteps) {
            nextBtn.querySelector('span').textContent = getTranslatedText('quiz.nav.seeResults') || '查看结果';
        } else {
            nextBtn.querySelector('span').textContent = getTranslatedText('quiz.nav.next') || '下一步';
        }
    }
    
    // Check if current step is complete
    function checkStepComplete(step) {
        switch(step) {
            case 1: return state.answers.gender !== null;
            case 2: return state.answers.age !== null;
            case 3: return state.answers.concerns.length > 0;
            case 4: return state.answers.time !== null;
            case 5: return state.answers.goal !== null;
            default: return false;
        }
    }
    
    // Go to Previous Step
    function goToPrevStep() {
        if (state.currentStep > 1) {
            state.currentStep--;
            showStep(state.currentStep);
            updateProgress();
            updateNavButtons();
        }
    }
    
    // Go to Next Step
    function goToNextStep() {
        if (state.currentStep < state.totalSteps) {
            state.currentStep++;
            showStep(state.currentStep);
            updateProgress();
            updateNavButtons();
        } else {
            // Show results
            showResults();
        }
    }
    
    // Show Step
    function showStep(stepNum) {
        quizSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === stepNum) {
                step.classList.add('active');
            }
        });
    }
    
    // Show Results
    function showResults() {
        // Hide navigation
        quizNav.style.display = 'none';
        
        // Calculate recommendations
        const recommendations = calculateRecommendations();
        
        // Show results step
        quizSteps.forEach(step => {
            step.classList.remove('active');
            if (step.dataset.step === 'results') {
                step.classList.add('active');
            }
        });
        
        // Update progress to 100%
        progressFill.style.width = '100%';
        progressSteps.forEach(step => step.classList.add('completed'));
        
        // Render profile tags
        renderProfileTags();
        
        // Render recommendations
        renderRecommendations(recommendations);
    }
    
    // Calculate Recommendations
    function calculateRecommendations() {
        // Reset scores
        Object.values(exercises).forEach(ex => ex.matchScore = 0);
        
        // Score each exercise
        Object.values(exercises).forEach(exercise => {
            // Score based on concerns (most important)
            state.answers.concerns.forEach(concern => {
                if (exercise.concerns.includes(concern)) {
                    exercise.matchScore += 30;
                }
            });
            
            // Score based on goal
            if (exercise.goals.includes(state.answers.goal)) {
                exercise.matchScore += 25;
            }
            
            // Score based on time availability
            const timeValue = parseInt(state.answers.time) || 5;
            const exerciseDuration = parseInt(exercise.duration) || 5;
            if (exerciseDuration <= timeValue) {
                exercise.matchScore += 15;
            }
            
            // Age-based adjustments
            const ageRange = state.answers.age;
            if (ageRange === '50+' && exercise.level === '初级') {
                exercise.matchScore += 10;
            }
            if ((ageRange === '40-49' || ageRange === '50+') && exercise.goals.includes('anti-aging')) {
                exercise.matchScore += 10;
            }
        });
        
        // Sort by score and return top 3
        return Object.values(exercises)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3);
    }
    
    // Render Profile Tags
    function renderProfileTags() {
        const container = document.getElementById('profile-tags');
        const tags = [];
        
        // Gender
        if (state.answers.gender) {
            const genderText = state.answers.gender === 'female' 
                ? (getTranslatedText('quiz.gender.female') || '女性')
                : (getTranslatedText('quiz.gender.male') || '男性');
            tags.push(genderText);
        }
        
        // Age
        if (state.answers.age) {
            tags.push(state.answers.age);
        }
        
        // Time
        if (state.answers.time) {
            const timeKey = `quiz.time.min${state.answers.time}`;
            tags.push(getTranslatedText(timeKey) || `${state.answers.time}分钟`);
        }
        
        // Goal
        if (state.answers.goal) {
            const goalKey = `quiz.goal.${state.answers.goal.replace('-', '')}`;
            if (state.answers.goal === 'anti-aging') {
                tags.push(getTranslatedText('quiz.goal.antiAging') || '抗衰老');
            } else if (state.answers.goal === 'contouring') {
                tags.push(getTranslatedText('quiz.goal.contouring') || '塑形紧致');
            } else if (state.answers.goal === 'relaxation') {
                tags.push(getTranslatedText('quiz.goal.relaxation') || '放松减压');
            } else if (state.answers.goal === 'radiance') {
                tags.push(getTranslatedText('quiz.goal.radiance') || '焕发光彩');
            }
        }
        
        container.innerHTML = tags.map(tag => 
            `<span class="profile-tag">${tag}</span>`
        ).join('');
    }
    
    // Render Recommendations
    function renderRecommendations(recommendations) {
        const container = document.getElementById('recommended-exercises');
        
        container.innerHTML = recommendations.map((ex, index) => `
            <div class="exercise-card" data-exercise="${ex.id}">
                <div class="exercise-rank">${index + 1}</div>
                <div class="exercise-info">
                    <h4>${getTranslatedText(ex.nameKey) || ex.name}</h4>
                    <p>${ex.desc}</p>
                    <div class="exercise-meta">
                        <span class="meta-item">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                                <path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            ${ex.duration}
                        </span>
                        <span class="meta-item">${ex.level}</span>
                        <span class="match-score">${Math.min(100, ex.matchScore)}% ${getTranslatedText('quiz.results.match') || '匹配'}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to cards
        container.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', () => {
                const exerciseId = card.dataset.exercise;
                window.location.href = `exercises.html#${exerciseId}`;
            });
            card.style.cursor = 'pointer';
        });
    }
    
    // Get Translated Text
    function getTranslatedText(key) {
        if (window.i18n && window.i18n.t) {
            return window.i18n.t(key);
        }
        return null;
    }
    
    // Restart Quiz (global function)
    window.restartQuiz = function() {
        // Reset state
        state.currentStep = 1;
        state.answers = {
            gender: null,
            age: null,
            concerns: [],
            time: null,
            goal: null
        };
        
        // Reset UI
        document.querySelectorAll('.quiz-option.selected').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Show navigation
        quizNav.style.display = 'flex';
        
        // Show first step
        showStep(1);
        updateProgress();
        updateNavButtons();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
