document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
    const themeToggle = document.getElementById("themeToggle");
    const notificationToggle = document.getElementById("notificationToggle");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileForm = document.getElementById("editProfileForm");
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const recentActivityContainer = document.getElementById("recentActivity");

    const API_URL = "https://jsonplaceholder.typicode.com/users/1"; // Replace with actual API
    const UPDATE_API_URL = "https://jsonplaceholder.typicode.com/users/1"; // Replace with real update API
    const RECENT_ACTIVITY_API = "https://jsonplaceholder.typicode.com/posts?_limit=5"; // Mock recent activities

    // ✅ Sidebar Toggle
    toggleSidebarBtn.addEventListener("click", function () {
        sidebar.classList.toggle("expanded");
    });

    // ✅ Fixing Dark Mode Toggle
    function loadDarkMode() {
        let isDarkMode = localStorage.getItem("darkMode") === "true";
        document.body.classList.toggle("dark-mode", isDarkMode);
        themeToggle.checked = isDarkMode;
    }

    themeToggle.addEventListener("change", function () {
        let isDarkMode = themeToggle.checked;
        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("darkMode", isDarkMode);
    });

    // Load Dark Mode on page load
    loadDarkMode();

    // ✅ Fixing Notification Toggle
    function loadNotificationSetting() {
        let isNotificationsEnabled = localStorage.getItem("notifications") === "true";
        notificationToggle.checked = isNotificationsEnabled;
    }

    notificationToggle.addEventListener("change", function () {
        let isNotificationsEnabled = notificationToggle.checked;
        localStorage.setItem("notifications", isNotificationsEnabled);
        alert(isNotificationsEnabled ? "Notifications Enabled" : "Notifications Disabled");
    });

    // Load Notification Setting on page load
    loadNotificationSetting();

    // ✅ Fetch user data from API or localStorage
    function fetchUserData() {
        let storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            storedUserData = JSON.parse(storedUserData);
            updateProfileUI(storedUserData);
        } else {
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const userData = {
                        name: data.name,
                        email: data.email,
                        bio: "This is my bio",
                        phone: data.phone,
                        address: `${data.address.suite}, ${data.address.street}, ${data.address.city}`
                    };
                    localStorage.setItem("userData", JSON.stringify(userData));
                    updateProfileUI(userData);
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }

    // ✅ Update UI with user data
    function updateProfileUI(userData) {
        document.getElementById("profileName").textContent = userData.name;
        document.getElementById("profileEmail").textContent = userData.email;
        document.getElementById("profileBio").textContent = userData.bio;
        document.getElementById("profilePhone").textContent = userData.phone;
        document.getElementById("profileAddress").textContent = userData.address;

        document.getElementById("nameInput").value = userData.name;
        document.getElementById("emailInput").value = userData.email;
        document.getElementById("bioInput").value = userData.bio;
        document.getElementById("phoneInput").value = userData.phone;
        document.getElementById("addressInput").value = userData.address;
    }

    // ✅ Show edit form
    editProfileBtn.addEventListener("click", function () {
        editProfileForm.style.display = "block";
    });

    // ✅ Save updated profile data and send API request
    saveProfileBtn.addEventListener("click", function () {
        const updatedUserData = {
            name: document.getElementById("nameInput").value,
            email: document.getElementById("emailInput").value,
            bio: document.getElementById("bioInput").value,
            phone: document.getElementById("phoneInput").value,
            address: document.getElementById("addressInput").value
        };

        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        updateProfileUI(updatedUserData);

        // Send update request to API
        fetch(UPDATE_API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUserData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("User data updated successfully:", data);
            alert("Profile updated successfully!");
        })
        .catch(error => console.error("Error updating data:", error));

        editProfileForm.style.display = "none";
    });

    // ✅ Fetch recent activity from API
    function fetchRecentActivity() {
        fetch(RECENT_ACTIVITY_API)
            .then(response => response.json())
            .then(data => {
                recentActivityContainer.innerHTML = "";
                data.forEach(activity => {
                    const activityItem = document.createElement("div");
                    activityItem.classList.add("activity-item");
                    activityItem.innerHTML = `<strong>${activity.title}</strong><p>${activity.body}</p>`;
                    recentActivityContainer.appendChild(activityItem);
                });
            })
            .catch(error => console.error("Error fetching recent activity:", error));
    }

    // ✅ Load user data and recent activity on page load
    fetchUserData();
    fetchRecentActivity();
});
