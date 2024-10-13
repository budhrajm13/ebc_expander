class CommentAnalyzer {
    constructor() {
this.testableCategories = {
	wrong_item: {
		phrases: ['wrong', 'got the wrong case', 'wrong item', 'incorrect item', 'not what i ordered', 'different from ordered', 'wrong product', 'size is wrong', 'wrong size', 'incorrect size', 'ordered large shirt and received small', 'too small', 'too big', 'incorrect', 'different color', ],
		confidence: 0.9
	},
	material_difference: {
		phrases: ['materially different', 'not as described', 'different material', 'different color', 'not as pictured', 'not as shown', 'style not as expected', 'not as per description.', 'used', 'refurbished', 'used item', 'pre-owned', 'previously used', 'not new', 'opened before', 'signs of use', 'used product', 'It is different than said', 'rusted', 'materially different', 'not as described', 'different material', 'not as pictured', 'not as shown', 'style not as expected', 'not as per description', 'not as expected', 'product does not meet expectations', 'not what i expected', 'item not as expected', 'item received materially different', 'used product', 'product looks used', 'seal', 'stain', 'hole', 'marks', 'powder is hard as a rock', 'impossible to scoop', 'scoop is stuck', 'dried', 'dry', 'zipper sewn in wrong', ],
		confidence: 0.8
	},
	compatibility_issue: {
		phrases: ['too small', 'too big', 'not compatible', 'too short', 'too small', 'small', 'too big', 'not fitting', 'did not fit', "doesn't fit", 'too large', 'didnt fit', 'too tight', 'doesnt fit', 'big', 'not fit', "don’t fit", 'dont fit', ],
		confidence: 0.85
	},
	item_parts_missing: {
		phrases: ['part missing', 'missing parts', 'missing or broken parts', 'no item in box', 'missing items', 'package delivered empty', 'not present', ],
		confidence: 0.95
	},
};

        this.sentimentWeights = {
            negationWords: ['no', 'not', 'never', 'neither', 'nor', 'nothing', 'cannot', 'cant', 'won\'t', 'wouldn\'t', 'shouldn\'t', 'isn\'t', 'aren\'t', 'didn\'t'],
            negationDistance: 3,
            weights: {
                positiveWord: 1,
                negativeWord: -1,
                negatedPositive: -1,
                negatedNegative: 0.5
            }
        };

        this.positiveWords = ['good', 'great', 'excellent', 'perfect', 'nice', 'fantastic'];
        this.negativeWords = ['bad', 'wrong', 'broken', 'damaged', 'poor', 'terrible'];
    }

    analyzeComment(text) {
        const analysis = {
            isTestable: false,
            categories: [],
            confidence: 0,
            sentiment: this.analyzeSentiment(text),
            details: this.getAdditionalDetails(text)
        };

        this.categorizeComment(text, analysis);
        return analysis;
    }

    categorizeComment(text, analysis) {
        const lowerCaseText = text.toLowerCase();
        for (const [category, data] of Object.entries(this.testableCategories)) {
            const matchedPhrases = data.phrases.filter(phrase => lowerCaseText.includes(phrase));
            if (matchedPhrases.length > 0) {
                analysis.isTestable = true;
                analysis.categories.push({
                    name: category,
                    confidence: this.calculateCategoryConfidence(matchedPhrases, data),
                    matchedPhrases
                });
            }
        }
    }

    calculateCategoryConfidence(matchedPhrases, data) {
        return data.confidence * (matchedPhrases.length / data.phrases.length);
    }

    analyzeSentiment(text) {
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;

        for (let i = 0; i < words.length; i++) {
            score += this.calculateWordSentiment(words, i);
            score += this.checkForPhrases(words, i);
        }

        const normalizedScore = score / Math.sqrt(words.length);
        return {
            score: normalizedScore,
            label: this.getSentimentLabel(normalizedScore),
            details: { rawScore: score, wordCount: words.length }
        };
    }

    calculateWordSentiment(words, index) {
        const word = words[index];
        const isPositive = this.positiveWords.includes(word);
        const isNegative = this.negativeWords.includes(word);
        const hasNegation = this.checkForNegation(words, index);

        if (isPositive) {
            return hasNegation ? this.sentimentWeights.weights.negatedPositive : this.sentimentWeights.weights.positiveWord;
        }
        if (isNegative) {
            return hasNegation ? this.sentimentWeights.weights.negatedNegative : this.sentimentWeights.weights.negativeWord;
        }
        return 0;
    }

    checkForNegation(words, currentIndex) {
        const start = Math.max(0, currentIndex - this.sentimentWeights.negationDistance);
        const segment = words.slice(start, currentIndex);
        return segment.some(word => this.sentimentWeights.negationWords.includes(word));
    }

    checkForPhrases(words, currentIndex) {
        const phrasesToCheck = [
            { phrase: ['not', 'as', 'described'], score: -2 },
            { phrase: ['not', 'as', 'expected'], score: -2 },
            { phrase: ['very', 'good'], score: 2 },
            { phrase: ['really', 'bad'], score: -2 }
        ];

        for (const phraseObj of phrasesToCheck) {
            if (this.checkPhraseMatch(words, currentIndex, phraseObj.phrase)) {
                return phraseObj.score;
            }
        }
        return 0;
    }

    checkPhraseMatch(words, startIndex, phrase) {
        return phrase.every((word, i) => words[startIndex + i] === word);
    }

    getSentimentLabel(score) {
        if (score < -0.5) return 'very negative';
        if (score < 0) return 'negative';
        if (score === 0) return 'neutral';
        if (score > 0.5) return 'very positive';
        return 'positive';
    }

    getAdditionalDetails(text) {
        return {
            wordCount: this.getWordCount(text),
            uniqueWords: this.getUniqueWords(text),
            sentenceCount: this.getSentenceCount(text),
            keyphrases: this.extractKeyPhrases(text)
        };
    }

    getWordCount(text) {
        return text.trim().split(/\s+/).length;
    }

    getUniqueWords(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        return [...new Set(words)];
    }

    getSentenceCount(text) {
        return (text.match(/[.!?]+/g) || []).length;
    }

    extractKeyPhrases(text) {
        // Placeholder for future expansion on key phrase extraction logic
        return [];
    }


    displayAnalysisResult(analysis, comment) {
        let result = `Comment: "${comment}"\n\n`;

        // Display Sentiment Analysis with detailed reasoning
        result += `Sentiment Analysis:\n`;
        result += `- Sentiment Label: ${analysis.sentiment.label}\n`;
        result += `- Sentiment Score: ${analysis.sentiment.score.toFixed(2)} (A score near -1 indicates strong negativity, near 1 indicates positivity)\n`;
        result += `- Raw Score: ${analysis.sentiment.details.rawScore.toFixed(2)} (This is the unadjusted score based on word sentiment)\n`;
        result += `- Word Count: ${analysis.sentiment.details.wordCount} (Total words analyzed in the comment)\n\n`;

        // Explain the reasoning behind testable categories
        if (analysis.isTestable) {
            result += `Testability:\n`;
            result += `The comment is testable because it matches phrases associated with specific categories.\n`;
            result += `Below are the detected categories along with their confidence levels and matched phrases:\n\n`;

            analysis.categories.forEach(category => {
                result += `- **Category: ${category.name.replace('_', ' ').toUpperCase()}**\n`;
                result += `  - Confidence Level: ${(category.confidence * 100).toFixed(2)}% (This reflects how strongly the comment matches this category)\n`;
                result += `  - Matched Phrases: ${category.matchedPhrases.join(', ')} (These phrases triggered the match for this category)\n\n`;
            });
        } else {
            result += `The comment is not testable.\n\n`;
        }

        return result;
    }

    // New function to process an array of comments and filter out testable ones
    processComments(comments) {
        const testableComments = [];
        let allComments = '';
        let allTestableComments = '';

        comments.forEach(comment => {
            const analysis = this.analyzeComment(comment);
            if (analysis.isTestable) {
                allTestableComments += `${comment}\n`;
                const formattedResult = this.displayAnalysisResult(analysis, comment);
                testableComments.push(formattedResult);
            }
            allComments += `- ${comment}\n`;
        });

        // Output the filtered testable comments and reasons
        let result = '';
        if (testableComments.length > 0) {
         //   result += `Testable Comments and Reasons:\n`;
         //   result += testableComments.join('\n');

        result += `\nAll Testable Comments:\n\n`;
        result += allTestableComments;

        } else {
            result += `No testable comments found.\n`;
        }

        // Output the list of all comments for reference
       // result += `\nAll Comments:\n`;
       // result += allComments;

        return result;
    }
}

// Example usage of the updated class with an array of comments
const analyzer = new CommentAnalyzer();
