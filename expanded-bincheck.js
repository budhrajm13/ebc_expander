(function() {
    // Get current version from Tampermonkey script
    const currentVersion = GM_info.script.version; // This gets the current script version
    const minimumVersion = "1.2.0"; // Version threshold
    
    // Compare versions function
    function compareVersions(current, minimum) {
        const current_parts = current.split('.').map(Number);
        const minimum_parts = minimum.split('.').map(Number);
        
        for (let i = 0; i < 3; i++) {
            if (current_parts[i] > minimum_parts[i]) return false;
            if (current_parts[i] < minimum_parts[i]) return true;
        }
        return false;
    }

    // Only proceed if current version is less than or equal to minimum version
    if (!compareVersions(currentVersion, minimumVersion)) {
        return;
    }

    // Check if notification was previously closed
    const notificationId = 'script_update_notification_v1';
    const wasNotificationClosed = localStorage.getItem(notificationId);
    
    if (wasNotificationClosed) {
        return;
    }

    const notification = document.createElement('div');
    notification.style.cssText = `
        width: 100%;
        height: 40px;
        background-color: #232f3e;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: "Amazon Ember", Arial, sans-serif;
        cursor: pointer;
        border-top: 1px solid #e9eced;
        position: relative;
    `;

    notification.innerHTML = `
        <div style="flex-grow: 1; text-align: center;">
            <span>EBC Expander script has been updated. Click here to update the script.</span>
        </div>
        <div style="
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            padding: 5px 10px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            border-radius: 3px;
            transition: background-color 0.2s;
        " id="closeButton">✖</div>
    `;

    // Add click event for update
    notification.addEventListener('click', function(e) {
        if (e.target.id !== 'closeButton') {
            window.location.href = 'https://axzile.corp.amazon.com/-/carthamus/download_script/ebc-expander.user.js';
        }
    });

    // Add click event for close button
    const closeButton = notification.querySelector('#closeButton');
    closeButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    closeButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });

    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        localStorage.setItem(notificationId, 'true');
        notification.remove();
    });

    // Find the tabs header element using partial class name match
    const tabsHeader = document.querySelector('[class^="awsui_tabs-header_"]');
    if (tabsHeader) {
        tabsHeader.parentNode.insertBefore(notification, tabsHeader.nextSibling);
    }
})();
