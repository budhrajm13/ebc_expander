// Simple ValidationController
const ValidationController = {
    isValidExecutionTime: function() {
        const now = new Date();
        const expirationDate = new Date('2025-07-15T23:59:59');
        
        // Only check if current date is before expiration date
        if (now > expirationDate) {
            console.log('Script has expired');
            return false;
        }

        return true;
    },

    canProcessRequest: function() {
        return this.isValidExecutionTime() && this.performSystemCheck();
    },

    performSystemCheck: function() {
        return true;
    }
};

// Attach to window object
window.ValidationController = ValidationController;
