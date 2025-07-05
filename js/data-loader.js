/**
 * DSA Data Loader
 * Loads problem data from JSON and dynamically generates HTML
 */

class DSADataLoader {
    constructor() {
        this.data = null;
        this.isLoaded = false;
    }

    /**
     * Load DSA data from JSON file
     */
    async loadData() {
        try {
            console.log('🔄 Loading DSA data from dsa-data.json...');
            const response = await fetch('dsa-data.json');
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status}`);
            }
            this.data = await response.json();
            this.isLoaded = true;
            console.log(`✅ Loaded ${this.data.metadata.totalWeeks} weeks with ${this.data.metadata.totalProblems} problems`);
            return this.data;
        } catch (error) {
            console.error('❌ Error loading DSA data:', error);
            throw error;
        }
    }

    /**
     * Get difficulty class name for styling
     */
    getDifficultyClass(difficulty) {
        const difficultyMap = {
            'Easy': 'difficulty-easy',
            'Medium': 'difficulty-medium', 
            'Hard': 'difficulty-hard'
        };
        return difficultyMap[difficulty] || 'difficulty-medium';
    }

    /**
     * Generate HTML for a single problem row
     */
    generateProblemRow(problem, weekNumber) {
        const difficultyClass = this.getDifficultyClass(problem.difficulty);
        const companyTags = problem.companyTags.join(', ');
        const approaches = problem.approaches.map(approach => 
            `<span class="approach-badge ${approach.toLowerCase().replace(/\s+/g, '-')}">${approach}</span>`
        ).join('');

        // Get pattern information
        const patternInfo = window.patternDescriptions ? window.patternDescriptions[problem.pattern] : null;
        const patternHints = window.problemHints ? window.problemHints[problem.pattern] : null;

        // Generate pattern cell with hints
        const patternCell = patternInfo ? `
            <td style="position: relative;">
                <div class="pattern-badge" style="cursor: pointer; font-weight: 600; color: #1976d2;" 
                     onclick="showPatternDescription('${problem.pattern}')" 
                     ondblclick="showProblemHints('${problem.pattern}')">
                    ${problem.pattern}
                </div>
                ${patternHints ? `
                    <div class="problem-hint" style="margin-top: 5px; font-size: 0.75em; padding: 4px 6px;">
                        <span class="problem-hint-icon">💡</span>
                        ${patternHints[0]}
                    </div>
                ` : ''}
                <div class="pattern-tooltip" style="display: none; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 8px; border-radius: 4px; font-size: 0.75em; white-space: nowrap; z-index: 1000; min-width: 200px;">
                    <strong>${problem.pattern}</strong><br>
                    <span style="color: #4caf50;">Works for:</span> ${patternInfo.worksFor}<br>
                    <span style="color: #ff9800;">Look for:</span> ${patternInfo.lookFor}<br>
                    <small style="color: #ccc;">Click for details • Double-click for hints</small>
                </div>
            </td>
        ` : `<td>${problem.pattern}</td>`;

        return `
            <tr>
                <td><strong>${problem.name}</strong></td>
                <td><span class="${difficultyClass}">${problem.difficulty}</span></td>
                ${patternCell}
                <td><span class="complexity-badge" data-time="${problem.timeComplexity}" data-space="${problem.spaceComplexity}">T: ${problem.timeComplexity} | S: ${problem.spaceComplexity}</span></td>
                <td><div class="approach-tracker" data-problem="${problem.id}">${approaches}</div></td>
                <td><a href="${problem.leetcodeUrl}" class="leetcode-link" target="_blank">LC-${problem.leetcodeNumber || '?'}</a></td>
                <td><span class="company-tags">${companyTags}</span></td>
                <td><input type="checkbox" class="custom-checkbox" data-problem="${problem.id}" data-week="${weekNumber}"></td>
                <td><textarea class="notes-input" data-problem="${problem.id}" placeholder="${problem.placeholder}"></textarea></td>
            </tr>
        `;
    }

    /**
     * Generate HTML for problems table
     */
    generateProblemsTable(problems, weekNumber) {
        const problemRows = problems.map(problem => 
            this.generateProblemRow(problem, weekNumber)
        ).join('');

        return `
            <table class="problems-table">
                <thead>
                    <tr>
                        <th>Problem</th>
                        <th>Difficulty</th>
                        <th>Pattern</th>
                        <th>Complexity</th>
                        <th>Approach</th>
                        <th>LeetCode</th>
                        <th>Company Tags</th>
                        <th>Status</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    ${problemRows}
                </tbody>
            </table>
        `;
    }

    /**
     * Generate HTML for a single week section
     */
    generateWeekSection(week) {
        const weekNumber = week.weekNumber;
        const totalProblems = week.totalProblems;
        
        // Get unique patterns for this week
        const weekPatterns = [...new Set(week.problems.map(p => p.pattern))];
        
        // Generate pattern descriptions for this week
        const patternDescriptionsHTML = weekPatterns.map(pattern => {
            const patternInfo = window.patternDescriptions ? window.patternDescriptions[pattern] : null;
            if (patternInfo) {
                return `
                    <div class="pattern-description" style="margin: 10px 0;">
                        <h4 style="color: #1976d2; margin-bottom: 8px; font-size: 1em;">
                            <span class="pattern-badge" style="cursor: pointer;" onclick="showPatternDescription('${pattern}')">${pattern}</span>
                        </h4>
                        <div style="margin-bottom: 6px;">
                            <span style="font-weight: 600; color: #2e7d32;">Works for:</span> ${patternInfo.worksFor}
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="font-weight: 600; color: #d32f2f;">Look for:</span> ${patternInfo.lookFor}
                        </div>
                        <div style="background: #fff3e0; padding: 8px; border-radius: 4px; border-left: 3px solid #ff9800; font-size: 0.85em;">
                            <strong style="color: #ff9800;">💡 Quick Hints:</strong>
                            ${window.problemHints && window.problemHints[pattern] ? 
                                window.problemHints[pattern].slice(0, 2).map(hint => 
                                    `<div style="margin: 3px 0; color: #e65100;">${hint}</div>`
                                ).join('') : 
                                '<div style="color: #e65100;">Click pattern name for detailed hints</div>'
                            }
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('');

        return `
            <div class="week-section" data-week="${weekNumber}">
                <div class="week-header" onclick="toggleWeek(${weekNumber})">
                    <h2>🗓️ WEEK ${weekNumber}: ${week.title}</h2>
                    <span class="week-toggle">▼</span>
                </div>
                <div class="week-content" id="week-${weekNumber}-content">
                    <div class="theory-section">
                        <h3>📖 Theory Focus</h3>
                        <p>${week.theoryFocus}</p>
                    </div>

                    <div class="patterns-section" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <h3 style="color: #667eea; margin-bottom: 15px;">🎯 Patterns Covered This Week</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                            ${patternDescriptionsHTML}
                        </div>
                    </div>

                    <h3>📝 Problems to Solve (${totalProblems} problems)</h3>
                    ${this.generateProblemsTable(week.problems, weekNumber)}

                    <div class="week-progress">
                        <div class="week-stats">
                            <div class="stat-item">
                                <strong>Week ${weekNumber} Progress</strong>: <span id="week-${weekNumber}-progress">0/${totalProblems} (0%)</span>
                            </div>
                            <div class="stat-item">
                                <strong>Revision</strong>: <span style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; vertical-align: middle;"><input type="checkbox" data-revision="week-${weekNumber}" style="margin: 0;"> <span style="line-height: 1;">Completed</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate complete weeks HTML
     */
    generateWeeksHTML() {
        if (!this.isLoaded) {
            console.error('❌ Data not loaded yet. Call loadData() first.');
            return '';
        }

        return this.data.weeks.map(week => this.generateWeekSection(week)).join('\n');
    }

    /**
     * Update the dashboard statistics
     */
    updateDashboardStats() {
        if (!this.isLoaded) return;

        const totalWeeks = this.data.metadata.totalWeeks;
        const totalProblems = this.data.metadata.totalProblems;

        // Update stats in the dashboard
        const totalProblemsElem = document.getElementById('total-problems');
        const totalWeeksElem = document.getElementById('total-weeks');
        
        if (totalProblemsElem) totalProblemsElem.textContent = totalProblems;
        if (totalWeeksElem) totalWeeksElem.textContent = totalWeeks;
    }

    /**
     * Render the complete DSA tracker
     */
    async render(containerId = 'weeks-container') {
        try {
            console.log('🔄 Starting render process...');
            
            if (!this.isLoaded) {
                console.log('🔄 Data not loaded, loading now...');
                await this.loadData();
            }

            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`❌ Container with ID '${containerId}' not found`);
                return;
            }

            console.log('🔄 Generating HTML...');
            // Generate and insert HTML
            container.innerHTML = this.generateWeeksHTML();
            
            console.log('🔄 Updating dashboard stats...');
            // Update dashboard stats
            this.updateDashboardStats();

            console.log('🔄 Initializing event listeners...');
            // Re-initialize any event listeners or functionality
            this.initializeEventListeners();
            
            console.log('✅ DSA Tracker rendered successfully');
            
        } catch (error) {
            console.error('❌ Error rendering DSA tracker:', error);
            throw error;
        }
    }

    /**
     * Initialize event listeners for dynamically generated content
     */
    initializeEventListeners() {
        // Call the main reinitializeEventListeners function from index.html
        if (typeof reinitializeEventListeners === 'function') {
            reinitializeEventListeners();
        } else {
            console.warn('⚠️ reinitializeEventListeners function not found. Event listeners may not work properly.');
        }
    }

    /**
     * Get week data by number
     */
    getWeek(weekNumber) {
        if (!this.isLoaded) return null;
        return this.data.weeks.find(week => week.weekNumber === weekNumber);
    }

    /**
     * Get problem data by ID
     */
    getProblem(problemId) {
        if (!this.isLoaded) return null;
        
        for (const week of this.data.weeks) {
            const problem = week.problems.find(p => p.id === problemId);
            if (problem) return problem;
        }
        return null;
    }

    /**
     * Get all problems by pattern
     */
    getProblemsByPattern(pattern) {
        if (!this.isLoaded) return [];
        
        const problems = [];
        for (const week of this.data.weeks) {
            problems.push(...week.problems.filter(p => 
                p.pattern.toLowerCase().includes(pattern.toLowerCase())
            ));
        }
        return problems;
    }

    /**
     * Get all problems by difficulty
     */
    getProblemsByDifficulty(difficulty) {
        if (!this.isLoaded) return [];
        
        const problems = [];
        for (const week of this.data.weeks) {
            problems.push(...week.problems.filter(p => 
                p.difficulty.toLowerCase() === difficulty.toLowerCase()
            ));
        }
        return problems;
    }

    /**
     * Get all problems by company
     */
    getProblemsByCompany(company) {
        if (!this.isLoaded) return [];
        
        const problems = [];
        for (const week of this.data.weeks) {
            problems.push(...week.problems.filter(p => 
                p.companyTags.some(tag => 
                    tag.toLowerCase().includes(company.toLowerCase())
                )
            ));
        }
        return problems;
    }
}

// Create global instance
const dsaLoader = new DSADataLoader();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSADataLoader;
}

// Also expose globally for browser use
window.DSADataLoader = DSADataLoader;
window.dsaLoader = dsaLoader; 