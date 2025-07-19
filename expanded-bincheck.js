(function() {
    // Check if notification was previously closed
    const notificationId = 'script_update_notification_v1'; // Change version number for new updates
    const wasNotificationClosed = localStorage.getItem(notificationId);
    
    // Don't show notification if it was previously closed
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
            <span>A new version of this script is available. Click here to update</span>
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
        // Store in localStorage that notification was closed
        localStorage.setItem(notificationId, 'true');
        notification.remove();
    });

    // Find the tabs header element using partial class name match
    const tabsHeader = document.querySelector('[class^="awsui_tabs-header_"]');
    if (tabsHeader) {
        tabsHeader.parentNode.insertBefore(notification, tabsHeader.nextSibling);
    }
})();
