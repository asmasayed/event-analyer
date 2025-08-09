// AI-Powered College Event Analyzer - Main Application Logic

class EventAnalyzer {
    constructor() {
        this.data = [];
        this.analysisResults = null;
        this.charts = {};
        this.sampleData = {
            "academicSeminar": [
                {"feedback": "The seminar was extremely informative and well-structured. I would definitely recommend it to other students.", "timestamp": "2024-01-15"},
                {"feedback": "Speaker was knowledgeable but the presentation was too long and boring. Could be improved.", "timestamp": "2024-01-15"},
                {"feedback": "Excellent content, loved the interactive elements. Will attend similar events in the future.", "timestamp": "2024-01-15"},
                {"feedback": "Not what I expected. The topic was misleading and didn't provide practical insights.", "timestamp": "2024-01-16"},
                {"feedback": "Great session! The examples were relevant and the Q&A was very helpful.", "timestamp": "2024-01-16"},
                {"feedback": "Average presentation. Nothing special but not terrible either.", "timestamp": "2024-01-16"},
                {"feedback": "Waste of time. Poor organization and unclear explanations throughout.", "timestamp": "2024-01-17"},
                {"feedback": "Fantastic seminar! I learned so much and would highly recommend to anyone interested in the topic.", "timestamp": "2024-01-17"},
                {"feedback": "Good information but room was too crowded and difficult to see the slides.", "timestamp": "2024-01-17"},
                {"feedback": "The speaker was engaging and the material was presented clearly. Worth attending.", "timestamp": "2024-01-18"}
            ],
            "orientation": [
                {"feedback": "Orientation was comprehensive and helped me feel welcome to the campus community.", "timestamp": "2024-08-20"},
                {"feedback": "Too much information crammed into one day. Should be spread over multiple sessions.", "timestamp": "2024-08-20"},
                {"feedback": "Great organization and friendly staff. Made the transition to college much easier.", "timestamp": "2024-08-20"},
                {"feedback": "Confusing schedule and poor directions. Got lost several times during the day.", "timestamp": "2024-08-21"},
                {"feedback": "Excellent introduction to campus resources. The campus tour was particularly helpful.", "timestamp": "2024-08-21"},
                {"feedback": "Boring presentations and outdated information. Needs significant improvement.", "timestamp": "2024-08-21"},
                {"feedback": "Perfect balance of information and activities. Would recommend to all new students.", "timestamp": "2024-08-22"},
                {"feedback": "Staff were amazing and answered all my questions. Felt supported from day one.", "timestamp": "2024-08-22"}
            ],
            "sportsEvent": [
                {"feedback": "Amazing game! The atmosphere was electric and the team played fantastically.", "timestamp": "2024-10-05"},
                {"feedback": "Disappointing performance by the team. Expected much better after all the hype.", "timestamp": "2024-10-05"},
                {"feedback": "Great event organization but the concessions were overpriced and low quality.", "timestamp": "2024-10-05"},
                {"feedback": "Loved every minute of it! Will definitely attend more games this season.", "timestamp": "2024-10-06"},
                {"feedback": "Poor seating arrangements and couldn't see well. Sound system was also problematic.", "timestamp": "2024-10-06"},
                {"feedback": "Exciting match with great school spirit. The halftime show was entertaining too.", "timestamp": "2024-10-06"},
                {"feedback": "Not worth the ticket price. Team needs improvement and venue needs upgrades.", "timestamp": "2024-10-07"},
                {"feedback": "Incredible energy from the crowd and excellent performance. Highly recommend!", "timestamp": "2024-10-07"}
            ]
        };
        
        this.sentimentWords = {
            "positive": {
                "amazing": 3, "excellent": 3, "fantastic": 3, "incredible": 3, "outstanding": 3,
                "great": 2, "good": 2, "wonderful": 2, "awesome": 2, "brilliant": 2,
                "helpful": 2, "useful": 2, "informative": 2, "engaging": 2, "exciting": 2,
                "love": 2, "like": 1, "enjoy": 2, "recommend": 2, "perfect": 3,
                "clear": 1, "easy": 1, "friendly": 1, "welcome": 2, "supported": 2
            },
            "negative": {
                "terrible": -3, "awful": -3, "horrible": -3, "disgusting": -3, "hate": -3,
                "bad": -2, "poor": -2, "disappointing": -2, "boring": -2, "confusing": -2,
                "waste": -2, "useless": -2, "unclear": -2, "difficult": -2, "problematic": -2,
                "overpriced": -1, "crowded": -1, "outdated": -1, "misleading": -2,
                "wrong": -1, "lost": -1, "average": 0
            },
            "intensifiers": ["very", "extremely", "really", "quite", "rather", "pretty", "fairly", "highly", "incredibly", "absolutely"],
            "negations": ["not", "never", "nothing", "nobody", "nowhere", "neither", "none", "no", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "cannot", "couldn't", "shouldn't", "mustn't"]
        };
        
        this.stopWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "through", "during", "before", "after", "above", "below", "between", "among", "throughout", "beyond", "is", "was", "are", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "will", "would", "should", "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't", "hadn't", "doesn't", "don't", "didn't", "won't", "wouldn't", "shan't", "shouldn't", "can't", "cannot", "couldn't", "mustn't", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's"];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File upload
        const fileUploadArea = document.getElementById('fileUploadArea');
        const csvFileInput = document.getElementById('csvFileInput');
        const uploadTrigger = document.querySelector('.upload-trigger');

        uploadTrigger.addEventListener('click', () => csvFileInput.click());
        csvFileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0]));
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files[0]);
        });

        // Text input
        const textInput = document.getElementById('textInput');
        textInput.addEventListener('input', () => this.handleTextInput(textInput.value));

        // Sample data buttons
        document.getElementById('loadAcademicSample').addEventListener('click', () => this.loadSampleData('academicSeminar'));
        document.getElementById('loadOrientationSample').addEventListener('click', () => this.loadSampleData('orientation'));
        document.getElementById('loadSportsSample').addEventListener('click', () => this.loadSampleData('sportsEvent'));

        // Analysis controls
        const sentimentSensitivity = document.getElementById('sentimentSensitivity');
        sentimentSensitivity.addEventListener('input', () => {
            document.getElementById('sentimentSensitivityValue').textContent = sentimentSensitivity.value;
        });

        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeData());

        // Export buttons
        document.getElementById('exportResults').addEventListener('click', () => this.exportCurrentView());
        document.getElementById('exportJSON').addEventListener('click', () => this.exportAsJSON());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportAsCSV());
        document.getElementById('generateReport').addEventListener('click', () => this.generateReport());

        // Filter
        document.getElementById('filterSentiment').addEventListener('change', (e) => this.filterResults(e.target.value));

        // Notification close
        document.getElementById('notificationClose').addEventListener('click', () => this.hideNotification());
    }

    handleFileUpload(file) {
        if (!file) return;
        
        if (!file.name.endsWith('.csv')) {
            this.showNotification('Please upload a CSV file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const parsed = this.parseCSV(csv);
                if (parsed.length > 0) {
                    this.data = parsed;
                    this.updateDataPreview();
                    this.showNotification(`Successfully loaded ${parsed.length} feedback entries`, 'success');
                } else {
                    this.showNotification('No valid feedback data found in CSV', 'error');
                }
            } catch (error) {
                this.showNotification('Error reading CSV file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('CSV must have header and at least one data row');
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const feedbackIndex = headers.findIndex(h => h.includes('feedback') || h.includes('comment') || h.includes('review'));
        const timestampIndex = headers.findIndex(h => h.includes('date') || h.includes('time') || h.includes('timestamp'));
        
        if (feedbackIndex === -1) {
            throw new Error('CSV must contain a feedback/comment column');
        }

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values[feedbackIndex] && values[feedbackIndex].trim()) {
                data.push({
                    feedback: values[feedbackIndex].trim().replace(/"/g, ''),
                    timestamp: timestampIndex !== -1 ? values[timestampIndex]?.trim().replace(/"/g, '') || `Entry ${i}` : `Entry ${i}`
                });
            }
        }
        
        return data;
    }

    handleTextInput(text) {
        if (!text.trim()) return;
        
        const lines = text.split('\n').filter(line => line.trim());
        this.data = lines.map((line, index) => ({
            feedback: line.trim(),
            timestamp: `Entry ${index + 1}`
        }));
        
        this.updateDataPreview();
    }

    loadSampleData(type) {
        this.data = [...this.sampleData[type]];
        this.updateDataPreview();
        this.showNotification(`Loaded ${this.data.length} sample feedback entries`, 'success');
    }

    updateDataPreview() {
        const preview = document.getElementById('dataPreview');
        const previewCount = document.getElementById('previewCount');
        const previewTable = document.getElementById('previewTable').getElementsByTagName('tbody')[0];
        
        preview.style.display = 'block';
        previewCount.textContent = this.data.length;
        
        previewTable.innerHTML = '';
        this.data.slice(0, 5).forEach(entry => {
            const row = previewTable.insertRow();
            row.insertCell(0).textContent = entry.feedback.substring(0, 100) + (entry.feedback.length > 100 ? '...' : '');
            row.insertCell(1).textContent = entry.timestamp;
        });
    }

    async analyzeData() {
        if (this.data.length === 0) {
            this.showNotification('Please load some data first', 'error');
            return;
        }

        this.showProgressModal();
        
        try {
            const sensitivity = parseFloat(document.getElementById('sentimentSensitivity').value);
            const keywordCount = parseInt(document.getElementById('keywordCount').value);
            
            // Perform analysis
            this.updateProgress(20, 'Analyzing sentiment...');
            const sentimentResults = this.analyzeSentiment(this.data, sensitivity);
            
            this.updateProgress(50, 'Extracting keywords...');
            const keywords = this.extractKeywords(this.data, keywordCount);
            
            this.updateProgress(70, 'Calculating NPS...');
            const npsData = this.calculateNPS(sentimentResults);
            
            this.updateProgress(90, 'Generating visualizations...');
            
            this.analysisResults = {
                sentiment: sentimentResults,
                keywords: keywords,
                nps: npsData,
                settings: { sensitivity, keywordCount }
            };
            
            await this.delay(500); // Smooth transition
            this.displayResults();
            
            this.updateProgress(100, 'Analysis complete!');
            await this.delay(1000);
            this.hideProgressModal();
            
        } catch (error) {
            this.hideProgressModal();
            this.showNotification('Analysis failed: ' + error.message, 'error');
        }
    }

    analyzeSentiment(data, threshold = 0.1) {
        return data.map(entry => {
            const score = this.calculateSentimentScore(entry.feedback);
            let category;
            if (score > threshold) category = 'positive';
            else if (score < -threshold) category = 'negative';
            else category = 'neutral';
            
            return {
                ...entry,
                sentimentScore: score,
                sentimentCategory: category
            };
        });
    }

    calculateSentimentScore(text) {
        const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
        let score = 0;
        let intensifier = 1;
        let negate = false;
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            
            // Check for negation
            if (this.sentimentWords.negations.includes(word)) {
                negate = true;
                continue;
            }
            
            // Check for intensifiers
            if (this.sentimentWords.intensifiers.includes(word)) {
                intensifier = 1.5;
                continue;
            }
            
            // Check for sentiment words
            let wordScore = 0;
            if (this.sentimentWords.positive[word]) {
                wordScore = this.sentimentWords.positive[word];
            } else if (this.sentimentWords.negative[word]) {
                wordScore = this.sentimentWords.negative[word];
            }
            
            if (wordScore !== 0) {
                if (negate) wordScore *= -1;
                score += wordScore * intensifier;
                
                // Reset modifiers
                negate = false;
                intensifier = 1;
            }
        }
        
        // Normalize score to -1 to 1 range
        return Math.max(-1, Math.min(1, score / 10));
    }

    extractKeywords(data, count = 15) {
        // Calculate TF-IDF
        const documents = data.map(entry => this.preprocessText(entry.feedback));
        const vocabulary = this.buildVocabulary(documents);
        const tfidfMatrix = this.calculateTFIDF(documents, vocabulary);
        
        // Average TF-IDF scores across all documents
        const avgScores = {};
        for (const word of vocabulary) {
            avgScores[word] = tfidfMatrix.reduce((sum, doc) => sum + (doc[word] || 0), 0) / documents.length;
        }
        
        // Sort and return top keywords
        return Object.entries(avgScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, count)
            .map(([word, score]) => ({ word, score: parseFloat(score.toFixed(4)) }));
    }

    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !this.stopWords.includes(word));
    }

    buildVocabulary(documents) {
        const vocabulary = new Set();
        documents.forEach(doc => doc.forEach(word => vocabulary.add(word)));
        return Array.from(vocabulary);
    }

    calculateTFIDF(documents, vocabulary) {
        const N = documents.length;
        
        return documents.map(doc => {
            const tfidf = {};
            const termCounts = {};
            const docLength = doc.length;
            
            // Calculate term frequencies
            doc.forEach(word => {
                termCounts[word] = (termCounts[word] || 0) + 1;
            });
            
            // Calculate TF-IDF for each term
            vocabulary.forEach(word => {
                if (termCounts[word]) {
                    const tf = termCounts[word] / docLength;
                    const df = documents.filter(d => d.includes(word)).length;
                    const idf = Math.log(N / df);
                    tfidf[word] = tf * idf;
                } else {
                    tfidf[word] = 0;
                }
            });
            
            return tfidf;
        });
    }

    calculateNPS(sentimentResults) {
        // Convert sentiment to NPS categories
        const promoters = sentimentResults.filter(r => r.sentimentScore > 0.3).length;
        const passives = sentimentResults.filter(r => r.sentimentScore >= -0.1 && r.sentimentScore <= 0.3).length;
        const detractors = sentimentResults.filter(r => r.sentimentScore < -0.1).length;
        
        const total = sentimentResults.length;
        const promoterPercent = (promoters / total) * 100;
        const detractorPercent = (detractors / total) * 100;
        const npsScore = Math.round(promoterPercent - detractorPercent);
        
        return {
            promoters,
            passives,
            detractors,
            total,
            promoterPercent: Math.round(promoterPercent),
            passivePercent: Math.round((passives / total) * 100),
            detractorPercent: Math.round(detractorPercent),
            npsScore
        };
    }

    displayResults() {
        // Update summary cards
        document.getElementById('totalFeedback').textContent = this.analysisResults.sentiment.length;
        
        const avgSentiment = this.analysisResults.sentiment.reduce((sum, r) => sum + r.sentimentScore, 0) / this.analysisResults.sentiment.length;
        document.getElementById('averageSentiment').textContent = avgSentiment.toFixed(2);
        
        const npsElement = document.getElementById('npsScore');
        npsElement.textContent = this.analysisResults.nps.npsScore;
        npsElement.className = 'summary-value nps-score ' + (this.analysisResults.nps.npsScore > 0 ? 'positive' : this.analysisResults.nps.npsScore < 0 ? 'negative' : '');
        
        document.getElementById('recommendation').textContent = this.getRecommendation(this.analysisResults.nps.npsScore);
        
        // Create visualizations
        this.createSentimentChart();
        this.createKeywordsCloud();
        this.createNPSChart();
        this.createTimelineChart();
        
        // Update results table
        this.updateResultsTable();
        
        // Show results section
        document.getElementById('resultsDashboard').style.display = 'block';
    }

    createSentimentChart() {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        if (this.charts.sentiment) this.charts.sentiment.destroy();
        
        const sentimentCounts = {
            positive: this.analysisResults.sentiment.filter(r => r.sentimentCategory === 'positive').length,
            negative: this.analysisResults.sentiment.filter(r => r.sentimentCategory === 'negative').length,
            neutral: this.analysisResults.sentiment.filter(r => r.sentimentCategory === 'neutral').length
        };
        
        this.charts.sentiment = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
                    backgroundColor: ['#1FB8CD', '#B4413C', '#5D878F'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    createKeywordsCloud() {
        const container = document.getElementById('keywordsCloud');
        container.innerHTML = '';
        
        const maxScore = Math.max(...this.analysisResults.keywords.map(k => k.score));
        
        this.analysisResults.keywords.forEach(keyword => {
            const element = document.createElement('span');
            element.className = 'keyword-item';
            element.textContent = keyword.word;
            
            // Scale font size based on score
            const fontSize = 0.8 + (keyword.score / maxScore) * 1.2;
            element.style.fontSize = fontSize + 'rem';
            element.title = `Score: ${keyword.score}`;
            
            container.appendChild(element);
        });
    }

    createNPSChart() {
        const ctx = document.getElementById('npsChart').getContext('2d');
        if (this.charts.nps) this.charts.nps.destroy();
        
        this.charts.nps = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Promoters', 'Passives', 'Detractors'],
                datasets: [{
                    label: 'Count',
                    data: [this.analysisResults.nps.promoters, this.analysisResults.nps.passives, this.analysisResults.nps.detractors],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createTimelineChart() {
        const ctx = document.getElementById('timelineChart').getContext('2d');
        if (this.charts.timeline) this.charts.timeline.destroy();
        
        // Group by date
        const dateGroups = {};
        this.analysisResults.sentiment.forEach(entry => {
            const date = entry.timestamp.split(' ')[0] || entry.timestamp;
            if (!dateGroups[date]) {
                dateGroups[date] = { positive: 0, negative: 0, neutral: 0 };
            }
            dateGroups[date][entry.sentimentCategory]++;
        });
        
        const dates = Object.keys(dateGroups).sort();
        const positiveData = dates.map(date => dateGroups[date].positive);
        const negativeData = dates.map(date => dateGroups[date].negative);
        const neutralData = dates.map(date => dateGroups[date].neutral);
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Positive',
                        data: positiveData,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Negative',
                        data: negativeData,
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Neutral',
                        data: neutralData,
                        borderColor: '#5D878F',
                        backgroundColor: 'rgba(93, 135, 143, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateResultsTable(filter = 'all') {
        const tbody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        
        let filteredResults = this.analysisResults.sentiment;
        if (filter !== 'all') {
            filteredResults = this.analysisResults.sentiment.filter(r => r.sentimentCategory === filter);
        }
        
        filteredResults.forEach(result => {
            const row = tbody.insertRow();
            
            // Feedback
            const feedbackCell = row.insertCell(0);
            feedbackCell.textContent = result.feedback.substring(0, 150) + (result.feedback.length > 150 ? '...' : '');
            feedbackCell.title = result.feedback;
            
            // Sentiment
            const sentimentCell = row.insertCell(1);
            const sentimentSpan = document.createElement('span');
            sentimentSpan.className = `sentiment-label sentiment-${result.sentimentCategory}`;
            sentimentSpan.textContent = result.sentimentCategory;
            sentimentCell.appendChild(sentimentSpan);
            
            // Score
            const scoreCell = row.insertCell(2);
            scoreCell.className = 'sentiment-score';
            scoreCell.textContent = result.sentimentScore.toFixed(3);
            
            // Category (NPS)
            const categoryCell = row.insertCell(3);
            let npsCategory;
            if (result.sentimentScore > 0.3) npsCategory = 'Promoter';
            else if (result.sentimentScore >= -0.1) npsCategory = 'Passive';
            else npsCategory = 'Detractor';
            categoryCell.textContent = npsCategory;
            
            // Keywords
            const keywordsCell = row.insertCell(4);
            const feedbackKeywords = this.extractFeedbackKeywords(result.feedback, 3);
            keywordsCell.textContent = feedbackKeywords.join(', ');
        });
    }

    extractFeedbackKeywords(text, count = 3) {
        const words = this.preprocessText(text);
        const wordCounts = {};
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        
        return Object.entries(wordCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, count)
            .map(([word]) => word);
    }

    filterResults(filter) {
        this.updateResultsTable(filter);
    }

    getRecommendation(npsScore) {
        if (npsScore > 50) return 'Excellent';
        if (npsScore > 0) return 'Good';
        if (npsScore > -50) return 'Needs Improvement';
        return 'Critical';
    }

    exportCurrentView() {
        const filter = document.getElementById('filterSentiment').value;
        this.exportAsCSV(filter);
    }

    exportAsJSON() {
        const data = JSON.stringify(this.analysisResults, null, 2);
        this.downloadFile(data, 'event-analysis-results.json', 'application/json');
    }

    exportAsCSV(filter = 'all') {
        let data = this.analysisResults.sentiment;
        if (filter !== 'all') {
            data = data.filter(r => r.sentimentCategory === filter);
        }
        
        const headers = ['Feedback', 'Sentiment Category', 'Sentiment Score', 'NPS Category', 'Timestamp'];
        let csv = headers.join(',') + '\n';
        
        data.forEach(row => {
            const npsCategory = row.sentimentScore > 0.3 ? 'Promoter' : row.sentimentScore >= -0.1 ? 'Passive' : 'Detractor';
            const values = [
                `"${row.feedback.replace(/"/g, '""')}"`,
                row.sentimentCategory,
                row.sentimentScore.toFixed(3),
                npsCategory,
                row.timestamp
            ];
            csv += values.join(',') + '\n';
        });
        
        this.downloadFile(csv, 'event-feedback-analysis.csv', 'text/csv');
    }

    generateReport() {
        const report = {
            summary: {
                totalFeedback: this.analysisResults.sentiment.length,
                averageSentiment: (this.analysisResults.sentiment.reduce((sum, r) => sum + r.sentimentScore, 0) / this.analysisResults.sentiment.length).toFixed(2),
                npsScore: this.analysisResults.nps.npsScore,
                recommendation: this.getRecommendation(this.analysisResults.nps.npsScore)
            },
            sentimentBreakdown: {
                positive: this.analysisResults.sentiment.filter(r => r.sentimentCategory === 'positive').length,
                negative: this.analysisResults.sentiment.filter(r => r.sentimentCategory === 'negative').length,
                neutral: this.analysisResults.sentiment.filter(r => r.sentimentCategory === 'neutral').length
            },
            topKeywords: this.analysisResults.keywords.slice(0, 10),
            npsBreakdown: this.analysisResults.nps,
            generatedAt: new Date().toISOString()
        };
        
        const reportText = `Event Feedback Analysis Report
Generated: ${new Date().toLocaleString()}

=== SUMMARY ===
Total Feedback: ${report.summary.totalFeedback}
Average Sentiment: ${report.summary.averageSentiment}
NPS Score: ${report.summary.npsScore}
Recommendation: ${report.summary.recommendation}

=== SENTIMENT BREAKDOWN ===
Positive: ${report.sentimentBreakdown.positive}
Negative: ${report.sentimentBreakdown.negative}
Neutral: ${report.sentimentBreakdown.neutral}

=== TOP KEYWORDS ===
${report.topKeywords.map(k => `${k.word}: ${k.score}`).join('\n')}

=== NPS BREAKDOWN ===
Promoters: ${report.npsBreakdown.promoters} (${report.npsBreakdown.promoterPercent}%)
Passives: ${report.npsBreakdown.passives} (${report.npsBreakdown.passivePercent}%)
Detractors: ${report.npsBreakdown.detractors} (${report.npsBreakdown.detractorPercent}%)
`;
        
        this.downloadFile(reportText, 'event-analysis-report.txt', 'text/plain');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Downloaded ${filename}`, 'success');
    }

    showProgressModal() {
        document.getElementById('progressModal').classList.remove('hidden');
    }

    hideProgressModal() {
        document.getElementById('progressModal').classList.add('hidden');
    }

    updateProgress(percent, text) {
        document.getElementById('progressFill').style.width = percent + '%';
        document.getElementById('progressText').textContent = text;
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        messageEl.textContent = message;
        notification.className = 'notification ' + type;
        notification.classList.remove('hidden');
        
        setTimeout(() => this.hideNotification(), 5000);
    }

    hideNotification() {
        document.getElementById('notification').classList.add('hidden');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new EventAnalyzer();
});