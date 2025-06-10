// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check which page we're on
  const isLoginPage = document.getElementById("loginForm") !== null
  const isSignupPage = document.getElementById("signupForm") !== null
  const isMapPage = document.getElementById("map") !== null
  const isFavoritesPage = document.querySelector(".favorites-container") !== null
  const isAboutPage = document.querySelector(".about-container") !== null
  const isSettingsPage = document.querySelector(".settings-container") !== null
  const isHelpPage = document.querySelector(".help-container") !== null

  // Initialize sidebar for all pages except login and signup
  if (!isLoginPage && !isSignupPage) {
    initSidebar()
  }

  // Load user data from localStorage
  loadUserData()

  if (isLoginPage) {
    initLoginPage()
  } else if (isSignupPage) {
    initSignupPage()
  } else if (isMapPage) {
    initMapPage()
  } else if (isFavoritesPage) {
    initFavoritesPage()
  } else if (isSettingsPage) {
    initSettingsPage()
  } else if (isHelpPage) {
    initHelpPage()
  }
})

// User data management
function loadUserData() {
  // Try to get user data from localStorage
  const userData = localStorage.getItem("userData")

  if (userData) {
    window.currentUser = JSON.parse(userData)

    // Update user info in the UI if on settings page
    updateUserInfoUI()
  } else {
    window.currentUser = null
  }

  // Load app settings
  const appSettings = localStorage.getItem("appSettings")
  if (appSettings) {
    window.appSettings = JSON.parse(appSettings)
    applyAppSettings()
  } else {
    // Default settings
    window.appSettings = {
      theme: "light",
      distanceUnit: "km",
      mapStyle: "standard",
      highContrast: false,
      largeText: false,
      reduceMotion: false,
    }
    localStorage.setItem("appSettings", JSON.stringify(window.appSettings))
  }

  // Load favorites
  const favorites = localStorage.getItem("favorites")
  if (favorites) {
    window.favorites = JSON.parse(favorites)
  } else {
    window.favorites = []
  }
}

// Apply app settings to the UI
function applyAppSettings() {
  if (!window.appSettings) return

  // Apply theme
  document.body.classList.remove("theme-dark", "theme-light")
  document.body.classList.add(`theme-${window.appSettings.theme}`)

  // Apply accessibility settings
  if (window.appSettings.highContrast) {
    document.body.classList.add("high-contrast")
  } else {
    document.body.classList.remove("high-contrast")
  }

  if (window.appSettings.largeText) {
    document.body.classList.add("large-text")
  } else {
    document.body.classList.remove("large-text")
  }

  if (window.appSettings.reduceMotion) {
    document.body.classList.add("reduce-motion")
  } else {
    document.body.classList.remove("reduce-motion")
  }
}

// Update user info in the UI
function updateUserInfoUI() {
  if (!window.currentUser) return

  // Update profile info on settings page
  const profileName = document.querySelector(".profile-details h4")
  const profileEmail = document.querySelector(".profile-details p")

  if (profileName && profileEmail) {
    profileName.textContent = window.currentUser.fullName
    profileEmail.textContent = window.currentUser.email
  }
}

// Login Page Initialization
function initLoginPage() {
  const loginForm = document.getElementById("loginForm")
  const guestLoginBtn = document.getElementById("guestLoginBtn")

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // In a real application, you would validate credentials with a server
      // For this demo, we'll check if the user exists in localStorage
      const userData = localStorage.getItem("userData")

      if (userData) {
        const user = JSON.parse(userData)
        if (user.email === email && user.password === password) {
          // Set current user
          window.currentUser = user
          localStorage.setItem("currentUser", JSON.stringify(user))

          // Redirect to map page
          window.location.href = "/map"
        } else {
          alert("Invalid email or password. Please try again.")
        }
      } else {
        alert("No account found. Please sign up first.")
      }
    })
  }

  // Handle guest login
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener("click", () => {
      // Set guest user
      window.currentUser = {
        fullName: "Guest User",
        email: "guest@example.com",
        isGuest: true,
      }
      localStorage.setItem("currentUser", JSON.stringify(window.currentUser))

      window.location.href = "/map"
    })
  }
}

// Initialize signup page
function initSignupPage() {
  const signupForm = document.getElementById("signupForm")
  const guestLoginBtn = document.getElementById("guestLoginBtn")
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")
  const strengthSegments = document.querySelectorAll(".strength-segment")
  const strengthText = document.getElementById("strengthText")

  // Password strength checker
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      const strength = checkPasswordStrength(password)

      // Update strength meter
      strengthSegments.forEach((segment, index) => {
        segment.classList.remove("weak", "medium", "strong")

        if (index < strength) {
          if (strength === 1) {
            segment.classList.add("weak")
          } else if (strength === 2) {
            segment.classList.add("medium")
          } else if (strength === 3) {
            segment.classList.add("strong")
          }
        }
      })

      // Update strength text
      if (strength === 0) {
        strengthText.textContent = "Weak"
        strengthText.className = "text-danger"
      } else if (strength === 1) {
        strengthText.textContent = "Weak"
        strengthText.className = "text-danger"
      } else if (strength === 2) {
        strengthText.textContent = "Medium"
        strengthText.className = "text-warning"
      } else {
        strengthText.textContent = "Strong"
        strengthText.className = "text-success"
      }
    })
  }

  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const fullName = document.getElementById("fullName").value
      const email = document.getElementById("email").value
      const password = passwordInput.value
      const confirmPassword = confirmPasswordInput.value
      const termsAgree = document.getElementById("termsAgree").checked

      // Validate passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      // Validate password strength
      if (checkPasswordStrength(password) < 2) {
        alert("Please choose a stronger password!")
        return
      }

      // Validate terms agreement
      if (!termsAgree) {
        alert("You must agree to the Terms of Service and Privacy Policy!")
        return
      }

      // In a real application, you would send this data to a server
      // For this demo, we'll store it in localStorage
      const userData = {
        fullName,
        email,
        password,
        dateJoined: new Date().toISOString(),
      }

      localStorage.setItem("userData", JSON.stringify(userData))

      // Set as current user
      window.currentUser = userData
      localStorage.setItem("currentUser", JSON.stringify(userData))

      // Redirect to the map page after successful signup
      window.location.href = "/map"
    })
  }

  // Handle guest login
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener("click", () => {
      // Set guest user
      window.currentUser = {
        fullName: "Guest User",
        email: "guest@example.com",
        isGuest: true,
      }
      localStorage.setItem("currentUser", JSON.stringify(window.currentUser))

      window.location.href = "/map"
    })
  }
}

// Check password strength (returns 0-3)
function checkPasswordStrength(password) {
  let strength = 0

  // Length check
  if (password.length >= 8) {
    strength += 1
  }

  // Complexity checks
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    strength += 1
  }

  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) {
    strength += 1
  }

  return Math.min(strength, 3)
}

// Initialize sidebar functionality
function initSidebar() {
  const toggleSidebarBtn = document.getElementById("toggleSidebar")
  const closeSidebarBtn = document.getElementById("closeSidebar")
  const sidebar = document.getElementById("sidebar")

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("show")
    })
  }

  // Close sidebar when clicking outside on mobile
  if (sidebar) {
    document.addEventListener("click", (event) => {
      const isClickInsideSidebar = sidebar.contains(event.target)
      const isClickOnToggleButton = toggleSidebarBtn && toggleSidebarBtn.contains(event.target)

      if (!isClickInsideSidebar && !isClickOnToggleButton && window.innerWidth < 992) {
        sidebar.classList.remove("show")
      }
    })
  }
}

// Map Page Initialization
function initMapPage() {
  // Initialize the map
  const map = initMap()

  // Load toilet data and populate the map
  loadToiletData(map)

  // Initialize current location button
  initCurrentLocationButton(map)

  // Initialize search functionality
  initSearch(map)

  // Initialize filters
  initFilters(map)

  // Initialize toilet details sidebar
  initToiletDetailsSidebar()

  // Initialize mobile toilet details panel
  initMobileToiletDetails()
}

// Initialize the map
function initMap() {
  // Check if map element exists
  const mapElement = document.getElementById("map")
  if (!mapElement) return null

  // Create a map centered on a default location (London)
  const map = L.map("map").setView([51.505, -0.09], 13)

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  return map
}

// Initialize current location button
function initCurrentLocationButton(map) {
  const currentLocationBtn = document.getElementById("currentLocationBtn")
  if (!currentLocationBtn || !map) return

  currentLocationBtn.addEventListener("click", () => {
    // Show loading spinner
    showSpinner("Finding your location...")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          // Center map on user's location
          map.setView([lat, lng], 16)

          // Add a marker for the user's location with custom icon
          const userIcon = L.divIcon({
            html: `<div style="background-color: #4cc9f0; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
            className: "user-location-marker",
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          })

          const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map)
          userMarker.bindPopup("<b>You are here</b>").openPopup()

          // Update location info in top bar
          updateLocationInfo("Current Location")

          // Find nearest toilets based on current location
          findNearestToilets(lat, lng, map)

          // Hide spinner
          hideSpinner()
        },
        (error) => {
          hideSpinner()
          alert("Unable to retrieve your location: " + error.message)
        },
      )
    } else {
      hideSpinner()
      alert("Geolocation is not supported by your browser")
    }
  })
}

// Update location info in top bar
function updateLocationInfo(locationName) {
  const locationInfo = document.getElementById("locationInfo")
  if (locationInfo) {
    locationInfo.innerHTML = `<i class="bi bi-geo-alt"></i> <span>${locationName}</span>`
  }
}

// Initialize search functionality
function initSearch(map) {
  const searchButton = document.getElementById("searchButton")
  const searchInput = document.getElementById("searchInput")
  if (!searchButton || !searchInput || !map) return

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim()
    if (searchTerm) {
      searchLocation(searchTerm, map)
    }
  })

  // Also trigger search on Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim()
      if (searchTerm) {
        searchLocation(searchTerm, map)
      }
    }
  })
}

// Search for a location
function searchLocation(searchTerm, map) {
  showSpinner("Searching location...")

  // Use Nominatim API for geocoding (OpenStreetMap's geocoding service)
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`)
    .then((response) => response.json())
    .then((data) => {
      hideSpinner()

      if (data && data.length > 0) {
        const location = data[0]
        const lat = Number.parseFloat(location.lat)
        const lng = Number.parseFloat(location.lon)

        // Center map on the found location
        map.setView([lat, lng], 16)

        // Add a marker for the searched location
        const searchMarker = L.marker([lat, lng]).addTo(map)
        searchMarker.bindPopup(`<b>${location.display_name}</b>`).openPopup()

        // Update location info in top bar
        updateLocationInfo(searchTerm)

        // Find nearest toilets based on searched location
        findNearestToilets(lat, lng, map)
      } else {
        alert("Location not found. Please try a different search term.")
      }
    })
    .catch((error) => {
      hideSpinner()
      console.error("Error searching for location:", error)
      alert("Error searching for location. Please try again.")
    })
}

// Initialize filters
function initFilters(map) {
  const filterCheckboxes = document.querySelectorAll('.filters-grid input[type="checkbox"]')
  const resetFiltersBtn = document.getElementById("resetFilters")

  if (!filterCheckboxes.length) return

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      // Apply filters to the toilet markers
      applyFilters(map)
    })
  })

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      // Reset all checkboxes to their default state
      document.getElementById("wheelchairAccessible").checked = true
      document.getElementById("changingTable").checked = false
      document.getElementById("openNow").checked = false
      document.getElementById("freeToUse").checked = false

      // Apply filters with reset values
      applyFilters(map)
    })
  }
}

// Apply filters to toilet markers
function applyFilters(map) {
  const wheelchairAccessible = document.getElementById("wheelchairAccessible")?.checked || false
  const changingTable = document.getElementById("changingTable")?.checked || false
  const openNow = document.getElementById("openNow")?.checked || false
  const freeToUse = document.getElementById("freeToUse")?.checked || false

  // Get all toilet markers and apply filters
  // In a real application, you would filter the actual data
  console.log("Filters applied:", { wheelchairAccessible, changingTable, openNow, freeToUse })

  // Refresh the toilet list based on filters
  updateToiletsList(getSampleToiletData(), map)
}

// Initialize toilet details sidebar
function initToiletDetailsSidebar() {
  const toiletDetailsSidebar = document.getElementById("toiletDetailsSidebar")
  const closeDetailsSidebarBtn = document.getElementById("closeDetailsSidebar")

  if (!toiletDetailsSidebar || !closeDetailsSidebarBtn) return

  closeDetailsSidebarBtn.addEventListener("click", () => {
    toiletDetailsSidebar.classList.remove("show")
  })
}

// Initialize mobile toilet details panel
function initMobileToiletDetails() {
  const mobileToiletDetails = document.getElementById("mobileToiletDetails")

  if (!mobileToiletDetails) return

  // Add touch events for dragging
  let startY = 0
  let currentY = 0

  mobileToiletDetails.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY
    mobileToiletDetails.style.transition = "none"
  })

  mobileToiletDetails.addEventListener("touchmove", (e) => {
    currentY = e.touches[0].clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      // Only allow dragging down
      mobileToiletDetails.style.transform = `translateY(${deltaY}px)`
    }
  })

  mobileToiletDetails.addEventListener("touchend", () => {
    mobileToiletDetails.style.transition = "transform var(--transition-speed)"

    const deltaY = currentY - startY
    if (deltaY > 100) {
      // If dragged down more than 100px, close the panel
      mobileToiletDetails.style.transform = "translateY(100%)"
    } else {
      // Otherwise, snap back to open position
      mobileToiletDetails.style.transform = "translateY(0)"
    }
  })
}

// Load toilet data and populate the map
function loadToiletData(map) {
  if (!map) return

  showSpinner("Loading toilet locations...")

  // In a real application, you would fetch this data from an API
  // For this demo, we'll use sample data
  setTimeout(() => {
    const toiletData = getSampleToiletData()

    // Add toilet markers to the map
    toiletData.forEach((toilet) => {
      addToiletMarker(map, toilet)
    })

    // Update the toilets list in the sidebar
    updateToiletsList(toiletData, map)

    // Update toilets count
    updateToiletsCount(toiletData.length)

    hideSpinner()
  }, 1000)
}

// Update toilets count badge
function updateToiletsCount(count) {
  const toiletsCount = document.getElementById("toiletsCount")
  if (toiletsCount) {
    toiletsCount.textContent = count
  }
}

// Add a toilet marker to the map
function addToiletMarker(map, toilet) {
  if (!map) return

  // Create a custom icon for the toilet marker
  const markerHtml = `<div class="toilet-marker ${toilet.accessibility}"><i class="bi bi-${toilet.accessibility === "accessible" ? "universal-access" : "toilet"}" aria-hidden="true"></i></div>`
  const toiletIcon = L.divIcon({
    html: markerHtml,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })

  // Create the marker and add it to the map
  const marker = L.marker([toilet.lat, toilet.lng], { icon: toiletIcon }).addTo(map)

  // Create popup content
  const popupContent = `
        <div class="toilet-popup">
            <div class="toilet-popup-title">${toilet.name}</div>
            <div class="toilet-popup-address">${toilet.address}</div>
            <div class="toilet-popup-features">
                ${toilet.wheelchairAccessible ? '<span class="feature-badge"><i class="bi bi-universal-access"></i> Accessible</span>' : ""}
                ${toilet.changingTable ? '<span class="feature-badge"><i class="bi bi-table"></i> Changing Table</span>' : ""}
                ${toilet.freeToUse ? '<span class="feature-badge"><i class="bi bi-cash-stack"></i> Free</span>' : ""}
                ${toilet.openNow ? '<span class="feature-badge"><i class="bi bi-clock"></i> Open Now</span>' : ""}
            </div>
            <div class="toilet-popup-actions">
                <button class="btn btn-sm btn-primary" onclick="showToiletDetails(${toilet.id})">View Details</button>
                <button class="btn btn-sm btn-outline-primary" onclick="getDirections(${toilet.lat}, ${toilet.lng})">Directions</button>
            </div>
        </div>
    `

  // Bind the popup to the marker
  marker.bindPopup(popupContent)

  // Add click event to the marker
  marker.on("click", () => {
    showToiletDetails(toilet.id)
  })
}

// Update the toilets list in the sidebar
function updateToiletsList(toilets = getSampleToiletData(), map) {
  const toiletsList = document.getElementById("toiletsList")
  if (!toiletsList) return

  // Apply filters if needed
  const wheelchairAccessible = document.getElementById("wheelchairAccessible")?.checked || false
  const changingTable = document.getElementById("changingTable")?.checked || false
  const openNow = document.getElementById("openNow")?.checked || false
  const freeToUse = document.getElementById("freeToUse")?.checked || false

  // Filter toilets based on selected filters
  const filteredToilets = toilets.filter((toilet) => {
    if (wheelchairAccessible && !toilet.wheelchairAccessible) return false
    if (changingTable && !toilet.changingTable) return false
    if (openNow && !toilet.openNow) return false
    if (freeToUse && !toilet.freeToUse) return false
    return true
  })

  // Clear the current list
  toiletsList.innerHTML = ""

  // Update toilets count
  updateToiletsCount(filteredToilets.length)

  // Add each toilet to the list
  if (filteredToilets.length > 0) {
    filteredToilets.forEach((toilet) => {
      const toiletItem = document.createElement("div")
      toiletItem.className = "toilet-list-item"
      toiletItem.setAttribute("data-toilet-id", toilet.id)

      // Add click event to show toilet details
      toiletItem.addEventListener("click", function () {
        // Remove active class from all items
        document.querySelectorAll(".toilet-list-item").forEach((item) => {
          item.classList.remove("active")
        })

        // Add active class to clicked item
        this.classList.add("active")

        // Show toilet details
        showToiletDetails(toilet.id)
      })

      // Create toilet item content
      toiletItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${toilet.name}</h6>
                        <p class="mb-1 text-muted small">${toilet.address}</p>
                    </div>
                    <span class="badge rounded-pill bg-light text-dark">${toilet.distance}</span>
                </div>
                <div class="features">
                    ${toilet.wheelchairAccessible ? '<span class="feature-badge"><i class="bi bi-universal-access"></i></span>' : ""}
                    ${toilet.changingTable ? '<span class="feature-badge"><i class="bi bi-table"></i></span>' : ""}
                    ${toilet.freeToUse ? '<span class="feature-badge"><i class="bi bi-cash-stack"></i></span>' : ""}
                    ${toilet.openNow ? '<span class="feature-badge"><i class="bi bi-clock"></i></span>' : ""}
                </div>
                <div class="rating">
                    ${getRatingStars(toilet.rating)}
                    <span>${toilet.rating.toFixed(1)}</span>
                </div>
            `

      // Add the toilet item to the list
      toiletsList.appendChild(toiletItem)
    })
  } else {
    // No toilets match the filters
    toiletsList.innerHTML = `
            <div class="placeholder-message">
                <i class="bi bi-filter-circle"></i>
                <p>No toilets match your filters</p>
                <button id="resetFiltersBtn" class="btn btn-sm btn-primary mt-2">Reset Filters</button>
            </div>
        `

    // Add event listener to the reset filters button
    const resetFiltersBtn = document.getElementById("resetFiltersBtn")
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        document.getElementById("wheelchairAccessible").checked = true
        document.getElementById("changingTable").checked = false
        document.getElementById("openNow").checked = false
        document.getElementById("freeToUse").checked = false

        applyFilters(map)
      })
    }
  }
}

// Generate rating stars HTML
function getRatingStars(rating) {
  let starsHtml = ""
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += '<i class="bi bi-star-fill"></i>'
    } else if (i === fullStars + 1 && hasHalfStar) {
      starsHtml += '<i class="bi bi-star-half"></i>'
    } else {
      starsHtml += '<i class="bi bi-star"></i>'
    }
  }

  return starsHtml
}

// Show toilet details
function showToiletDetails(toiletId) {
  const toilets = getSampleToiletData()
  const toilet = toilets.find((t) => t.id === toiletId)

  if (!toilet) return

  // Desktop details sidebar
  const toiletDetailsSidebar = document.getElementById("toiletDetailsSidebar")
  const toiletDetailsContent = document.getElementById("toiletDetailsContent")

  // Mobile details panel
  const mobileToiletDetails = document.getElementById("mobileToiletDetails")
  const mobileToiletContent = document.getElementById("mobileToiletContent")

  if (toiletDetailsSidebar && toiletDetailsContent) {
    // Show the sidebar
    toiletDetailsSidebar.classList.add("show")

    // Update content
    toiletDetailsContent.innerHTML = generateToiletDetailsHTML(toilet)
  }

  if (mobileToiletDetails && mobileToiletContent && window.innerWidth < 992) {
    // Show the mobile panel
    mobileToiletDetails.style.transform = "translateY(0)"

    // Update content
    mobileToiletContent.innerHTML = generateToiletDetailsHTML(toilet)
  }
}

// Generate toilet details HTML
function generateToiletDetailsHTML(toilet) {
  // Check if this toilet is in favorites
  const isFavorite = window.favorites && window.favorites.some((fav) => fav.id === toilet.id)

  return `
    <div class="toilet-details">
      <h3>${toilet.name}</h3>
      <p class="address">${toilet.address}</p>
      
      <div class="rating mb-3">
        ${getRatingStars(toilet.rating)}
        <span>${toilet.rating.toFixed(1)} (${toilet.reviewCount} reviews)</span>
      </div>
      
      <div class="mb-3">
        <p>${toilet.description}</p>
      </div>
      
      <div class="mb-3">
        <h5>Accessibility Features</h5>
        <ul class="list-unstyled">
          <li class="d-flex align-items-center mb-2">
            <i class="bi ${toilet.wheelchairAccessible ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2"></i>
            Wheelchair Accessible
          </li>
          <li class="d-flex align-items-center mb-2">
            <i class="bi ${toilet.changingTable ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2"></i>
            Changing Table
          </li>
          <li class="d-flex align-items-center mb-2">
            <i class="bi ${toilet.freeToUse ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2"></i>
            Free to Use
          </li>
          <li class="d-flex align-items-center mb-2">
            <i class="bi ${toilet.openNow ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2"></i>
            Open Now
          </li>
        </ul>
      </div>
      
      <div class="mb-3">
        <h5>Opening Hours</h5>
        <ul class="list-unstyled">
          <li class="d-flex justify-content-between mb-1">
            <span>Monday - Friday:</span>
            <span>${toilet.openingHours.weekdays}</span>
          </li>
          <li class="d-flex justify-content-between mb-1">
            <span>Saturday:</span>
            <span>${toilet.openingHours.saturday}</span>
          </li>
          <li class="d-flex justify-content-between mb-1">
            <span>Sunday:</span>
            <span>${toilet.openingHours.sunday}</span>
          </li>
        </ul>
      </div>
      
      <div class="mb-3">
        <h5>Distance</h5>
        <p>${toilet.distance} from your location</p>
      </div>
      
      <div class="d-grid gap-2">
        <button class="btn btn-primary" onclick="getDirections(${toilet.lat}, ${toilet.lng})">
          <i class="bi bi-map"></i> Get Directions
        </button>
        <button class="btn btn-outline-primary" onclick="${isFavorite ? `removeFromFavorites(${toilet.id})` : `addToFavorites(${toilet.id})`}">
          <i class="bi bi-${isFavorite ? "star-fill" : "star"}"></i> ${isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <button class="btn btn-outline-secondary" onclick="reportIssue(${toilet.id})">
          <i class="bi bi-exclamation-triangle"></i> Report Issue
        </button>
      </div>
    </div>
  `
}

// Get directions to a toilet
function getDirections(lat, lng) {
  // In a real application, you would integrate with a routing service
  // For this demo, we'll open Google Maps directions

  // Try to get the user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude

        // Open Google Maps directions in a new tab
        const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}`
        window.open(url, "_blank")
      },
      (error) => {
        // If we can't get the user's location, just use the destination
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        window.open(url, "_blank")
      },
    )
  } else {
    // Fallback if geolocation is not available
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, "_blank")
  }
}

// Add toilet to favorites
function addToFavorites(toiletId) {
  const toilets = getSampleToiletData()
  const toilet = toilets.find((t) => t.id === toiletId)

  if (!toilet) return

  // Initialize favorites array if it doesn't exist
  if (!window.favorites) {
    window.favorites = []
  }

  // Check if already in favorites
  if (window.favorites.some((fav) => fav.id === toiletId)) {
    alert("This toilet is already in your favorites!")
    return
  }

  // Add to favorites
  window.favorites.push(toilet)

  // Save to localStorage
  localStorage.setItem("favorites", JSON.stringify(window.favorites))

  // Update UI if on details page
  const detailsContent = document.getElementById("toiletDetailsContent")
  if (detailsContent) {
    detailsContent.innerHTML = generateToiletDetailsHTML(toilet)
  }

  alert("Toilet added to favorites!")
}

// Remove from favorites
function removeFromFavorites(toiletId) {
  if (!window.favorites) return

  // Filter out the toilet to remove
  window.favorites = window.favorites.filter((fav) => fav.id !== toiletId)

  // Save to localStorage
  localStorage.setItem("favorites", JSON.stringify(window.favorites))

  // Update UI if on favorites page
  if (document.querySelector(".favorites-container")) {
    renderFavorites()
  }

  // Update UI if on details page
  const toilets = getSampleToiletData()
  const toilet = toilets.find((t) => t.id === toiletId)

  if (toilet) {
    const detailsContent = document.getElementById("toiletDetailsContent")
    if (detailsContent) {
      detailsContent.innerHTML = generateToiletDetailsHTML(toilet)
    }
  }

  alert("Toilet removed from favorites!")
}

// Report an issue with a toilet
function reportIssue(toiletId) {
  // In a real application, you would show a form to report issues
  alert("Report issue functionality would be implemented here.")
}

// Find nearest toilets based on location
function findNearestToilets(lat, lng, map) {
  // In a real application, you would query an API with the coordinates
  // For this demo, we'll use our sample data and calculate distances

  const toilets = getSampleToiletData()

  // Calculate distance for each toilet
  toilets.forEach((toilet) => {
    toilet.distanceValue = calculateDistance(lat, lng, toilet.lat, toilet.lng)
    toilet.distance = formatDistance(toilet.distanceValue)
  })

  // Sort toilets by distance
  toilets.sort((a, b) => a.distanceValue - b.distanceValue)

  // Update the toilets list with the sorted data
  updateToiletsList(toilets, map)
}

// Calculate distance between two coordinates (using Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

// Convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Format distance for display
function formatDistance(distance) {
  if (distance < 1) {
    // Convert to meters
    return `${Math.round(distance * 1000)}m`
  } else {
    // Keep as kilometers with one decimal place
    return `${distance.toFixed(1)}km`
  }
}

// Show loading spinner
function showSpinner(message = "Loading...") {
  // Create spinner if it doesn't exist
  if (!document.querySelector(".spinner-overlay")) {
    const spinnerOverlay = document.createElement("div")
    spinnerOverlay.className = "spinner-overlay"
    spinnerOverlay.innerHTML = `
            <div class="spinner-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-text">${message}</div>
            </div>
        `
    document.body.appendChild(spinnerOverlay)
  } else {
    // Update existing spinner message
    document.querySelector(".spinner-text").textContent = message
    document.querySelector(".spinner-overlay").style.display = "flex"
  }
}

// Hide loading spinner
function hideSpinner() {
  const spinner = document.querySelector(".spinner-overlay")
  if (spinner) {
    spinner.style.display = "none"
  }
}

// Initialize favorites page
function initFavoritesPage() {
  // Render favorites
  renderFavorites()

  // Search functionality for favorites
  const favoritesSearchInput = document.getElementById("favoritesSearchInput")
  if (favoritesSearchInput) {
    favoritesSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const favoriteItems = document.querySelectorAll(".favorite-item")

      favoriteItems.forEach((item) => {
        const title = item.querySelector("h3").textContent.toLowerCase()
        const address = item.querySelector(".address").textContent.toLowerCase()

        if (title.includes(searchTerm) || address.includes(searchTerm)) {
          item.style.display = "flex"
        } else {
          item.style.display = "none"
        }
      })
    })
  }

  // Sort functionality
  const sortDropdownItems = document.querySelectorAll("[data-sort]")
  if (sortDropdownItems.length) {
    sortDropdownItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        const sortBy = e.target.getAttribute("data-sort")
        sortFavorites(sortBy)
      })
    })
  }
}

// Render favorites
function renderFavorites() {
  const favoritesList = document.getElementById("favoritesList")
  const emptyFavorites = document.getElementById("emptyFavorites")

  if (!favoritesList) return

  // Clear current list
  favoritesList.innerHTML = ""

  // Check if we have favorites
  if (!window.favorites || window.favorites.length === 0) {
    if (emptyFavorites) {
      emptyFavorites.style.display = "flex"
    }
    return
  }

  // Hide empty state
  if (emptyFavorites) {
    emptyFavorites.style.display = "none"
  }

  // Render each favorite
  window.favorites.forEach((toilet) => {
    const favoriteItem = document.createElement("div")
    favoriteItem.className = "favorite-item"
    favoriteItem.setAttribute("data-toilet-id", toilet.id)

    favoriteItem.innerHTML = `
      <div class="favorite-content">
        <h3>${toilet.name}</h3>
        <p class="address">${toilet.address}</p>
        <div class="features">
          ${toilet.wheelchairAccessible ? '<span class="feature-badge"><i class="bi bi-universal-access"></i></span>' : ""}
          ${toilet.changingTable ? '<span class="feature-badge"><i class="bi bi-table"></i></span>' : ""}
          ${toilet.freeToUse ? '<span class="feature-badge"><i class="bi bi-cash-stack"></i></span>' : ""}
        </div>
        <div class="rating">
          ${getRatingStars(toilet.rating)}
          <span>${toilet.rating.toFixed(1)}</span>
        </div>
      </div>
      <div class="favorite-actions">
        <button class="btn btn-primary btn-sm view-favorite" data-toilet-id="${toilet.id}"><i class="bi bi-map"></i> View</button>
        <button class="btn btn-outline-danger btn-sm delete-favorite" data-toilet-id="${toilet.id}"><i class="bi bi-trash"></i></button>
      </div>
    `

    favoritesList.appendChild(favoriteItem)
  })

  // Add event listeners to view and delete buttons
  document.querySelectorAll(".view-favorite").forEach((button) => {
    button.addEventListener("click", function () {
      const toiletId = Number.parseInt(this.getAttribute("data-toilet-id"))
      viewFavoriteOnMap(toiletId)
    })
  })

  document.querySelectorAll(".delete-favorite").forEach((button) => {
    button.addEventListener("click", function () {
      const toiletId = Number.parseInt(this.getAttribute("data-toilet-id"))
      removeFromFavorites(toiletId)
    })
  })
}

// View favorite on map
function viewFavoriteOnMap(toiletId) {
  // Store the toilet ID to view in localStorage
  localStorage.setItem("viewToiletId", toiletId)

  // Redirect to map page
  window.location.href = "/map"
}

// Sort favorites
function sortFavorites(sortBy) {
  if (!window.favorites || !window.favorites.length) return

  // Sort the favorites array
  if (sortBy === "name") {
    window.favorites.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === "rating") {
    window.favorites.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === "distance") {
    window.favorites.sort((a, b) => a.distanceValue - b.distanceValue)
  } else if (sortBy === "date-added") {
    // In a real app, you would have a dateAdded property
    // For this demo, we'll just use the current order
  }

  // Re-render the favorites
  renderFavorites()
}

// Initialize settings page
function initSettingsPage() {
  // Update user info
  updateUserInfoUI()

  // Theme selection
  const themeOptions = document.querySelectorAll(".theme-option")
  if (themeOptions.length) {
    // Mark the current theme as active
    themeOptions.forEach((option) => {
      const themeType = option.querySelector(".theme-preview").classList.contains("light-theme")
        ? "light"
        : option.querySelector(".theme-preview").classList.contains("dark-theme")
          ? "dark"
          : "system"

      if (window.appSettings && window.appSettings.theme === themeType) {
        option.classList.add("active")
      } else {
        option.classList.remove("active")
      }

      option.addEventListener("click", () => {
        // Remove active class from all options
        themeOptions.forEach((opt) => opt.classList.remove("active"))

        // Add active class to clicked option
        option.classList.add("active")

        // Update theme setting
        const themeType = option.querySelector(".theme-preview").classList.contains("light-theme")
          ? "light"
          : option.querySelector(".theme-preview").classList.contains("dark-theme")
            ? "dark"
            : "system"

        if (window.appSettings) {
          window.appSettings.theme = themeType
        }

        // Apply theme
        applyTheme(themeType)
      })
    })
  }

  // Distance unit selection
  const distanceUnitSelect = document.getElementById("distanceUnit")
  if (distanceUnitSelect && window.appSettings) {
    distanceUnitSelect.value = window.appSettings.distanceUnit

    distanceUnitSelect.addEventListener("change", () => {
      window.appSettings.distanceUnit = distanceUnitSelect.value
    })
  }

  // Map style selection
  const mapStyleSelect = document.getElementById("mapStyle")
  if (mapStyleSelect && window.appSettings) {
    mapStyleSelect.value = window.appSettings.mapStyle

    mapStyleSelect.addEventListener("change", () => {
      window.appSettings.mapStyle = mapStyleSelect.value
    })
  }

  // Accessibility settings
  const highContrastCheck = document.getElementById("highContrastMode")
  const largeTextCheck = document.getElementById("largeText")
  const reduceMotionCheck = document.getElementById("reduceMotion")

  if (highContrastCheck && window.appSettings) {
    highContrastCheck.checked = window.appSettings.highContrast

    highContrastCheck.addEventListener("change", () => {
      window.appSettings.highContrast = highContrastCheck.checked

      if (highContrastCheck.checked) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }
    })
  }

  if (largeTextCheck && window.appSettings) {
    largeTextCheck.checked = window.appSettings.largeText

    largeTextCheck.addEventListener("change", () => {
      window.appSettings.largeText = largeTextCheck.checked

      if (largeTextCheck.checked) {
        document.body.classList.add("large-text")
      } else {
        document.body.classList.remove("large-text")
      }
    })
  }

  if (reduceMotionCheck && window.appSettings) {
    reduceMotionCheck.checked = window.appSettings.reduceMotion

    reduceMotionCheck.addEventListener("change", () => {
      window.appSettings.reduceMotion = reduceMotionCheck.checked

      if (reduceMotionCheck.checked) {
        document.body.classList.add("reduce-motion")
      } else {
        document.body.classList.remove("reduce-motion")
      }
    })
  }

  // Save settings button
  const saveSettingsBtn = document.getElementById("saveSettings")
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      // Save settings to localStorage
      localStorage.setItem("appSettings", JSON.stringify(window.appSettings))

      // Apply settings
      applyAppSettings()

      // Show confirmation
      alert("Settings saved successfully!")
    })
  }
}

// Apply theme
function applyTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark", "theme-system")
  document.body.classList.add(`theme-${theme}`)
}

// Initialize help page
function initHelpPage() {
  // Help modal content update
  const helpLinks = document.querySelectorAll(".help-links a")
  if (helpLinks.length) {
    helpLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const title = e.target.getAttribute("data-title")
        const helpModalLabel = document.getElementById("helpModalLabel")

        if (helpModalLabel) {
          helpModalLabel.textContent = title
        }

        // In a real app, you would load the specific help content for this topic
      })
    })
  }

  // Contact support button
  const contactSupportBtn = document.getElementById("contactSupportBtn")
  if (contactSupportBtn) {
    contactSupportBtn.addEventListener("click", () => {
      // In a real app, you would show a contact form or open a chat
      alert("Contact support functionality would be implemented here.")
    })
  }

  // Help search functionality
  const helpSearchInput = document.getElementById("helpSearchInput")
  if (helpSearchInput) {
    helpSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      // Search in FAQ accordion
      const faqItems = document.querySelectorAll(".accordion-item")
      faqItems.forEach((item) => {
        const question = item.querySelector(".accordion-button").textContent.toLowerCase()
        const answer = item.querySelector(".accordion-body").textContent.toLowerCase()

        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          item.style.display = "block"

          // Expand this item if it contains the search term
          if (searchTerm.length > 2) {
            const collapseEl = item.querySelector(".accordion-collapse")
            const button = item.querySelector(".accordion-button")

            if (collapseEl && button && button.classList.contains("collapsed")) {
              button.classList.remove("collapsed")
              collapseEl.classList.add("show")
            }
          }
        } else {
          item.style.display = "none"
        }
      })

      // Search in help cards
      const helpCards = document.querySelectorAll(".help-card")
      helpCards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase()
        const links = Array.from(card.querySelectorAll("a")).map((a) => a.textContent.toLowerCase())

        const matchesSearch = title.includes(searchTerm) || links.some((link) => link.includes(searchTerm))

        card.closest(".col-lg-4").style.display = matchesSearch ? "block" : "none"
      })
    })
  }
}

// Get sample toilet data
function getSampleToiletData() {
  return [
    {
      id: 1,
      name: "Central Park Public Toilet",
      address: "Central Park, Main Entrance",
      lat: 51.505,
      lng: -0.09,
      description:
        "Modern accessible toilet facility located at the main entrance of Central Park. Features include automatic doors, spacious interior, and emergency call button.",
      wheelchairAccessible: true,
      changingTable: true,
      freeToUse: true,
      openNow: true,
      accessibility: "accessible",
      distance: "0.3km",
      distanceValue: 0.3,
      rating: 4.5,
      reviewCount: 28,
      openingHours: {
        weekdays: "7:00 AM - 8:00 PM",
        saturday: "8:00 AM - 8:00 PM",
        sunday: "8:00 AM - 6:00 PM",
      },
    },
    {
      id: 2,
      name: "City Hall Restroom",
      address: "City Hall, Ground Floor",
      lat: 51.507,
      lng: -0.095,
      description:
        "Public toilet located on the ground floor of City Hall. Requires key from reception. Well-maintained and cleaned regularly.",
      wheelchairAccessible: true,
      changingTable: false,
      freeToUse: true,
      openNow: true,
      accessibility: "accessible",
      distance: "0.5km",
      distanceValue: 0.5,
      rating: 3.8,
      reviewCount: 15,
      openingHours: {
        weekdays: "9:00 AM - 5:00 PM",
        saturday: "10:00 AM - 4:00 PM",
        sunday: "Closed",
      },
    },
    {
      id: 3,
      name: "Shopping Mall Facilities",
      address: "Metro Shopping Center, Level 2",
      lat: 51.503,
      lng: -0.087,
      description:
        "Multiple toilet facilities located on Level 2 of the shopping mall, near the food court. Includes family restroom with changing facilities.",
      wheelchairAccessible: true,
      changingTable: true,
      freeToUse: true,
      openNow: true,
      accessibility: "accessible",
      distance: "0.7km",
      distanceValue: 0.7,
      rating: 4.2,
      reviewCount: 42,
      openingHours: {
        weekdays: "9:00 AM - 9:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "11:00 AM - 6:00 PM",
      },
    },
    {
      id: 4,
      name: "Train Station Toilet",
      address: "Central Station, West Exit",
      lat: 51.51,
      lng: -0.085,
      description:
        "Public toilet at the west exit of Central Station. Small fee required (£0.50). Attended during peak hours.",
      wheelchairAccessible: true,
      changingTable: false,
      freeToUse: false,
      openNow: true,
      accessibility: "accessible",
      distance: "0.9km",
      distanceValue: 0.9,
      rating: 3.5,
      reviewCount: 31,
      openingHours: {
        weekdays: "5:00 AM - 12:00 AM",
        saturday: "5:00 AM - 12:00 AM",
        sunday: "6:00 AM - 11:00 PM",
      },
    },
    {
      id: 5,
      name: "Riverside Park Toilet",
      address: "Riverside Park, South Entrance",
      lat: 51.5,
      lng: -0.1,
      description:
        "Basic toilet facilities at the south entrance of Riverside Park. Limited accessibility features but has grab bars installed.",
      wheelchairAccessible: false,
      changingTable: false,
      freeToUse: true,
      openNow: false,
      accessibility: "partially",
      distance: "1.2km",
      distanceValue: 1.2,
      rating: 2.8,
      reviewCount: 12,
      openingHours: {
        weekdays: "8:00 AM - 6:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "8:00 AM - 6:00 PM",
      },
    },
    {
      id: 6,
      name: "Community Center Restroom",
      address: "Community Center, 123 Main St",
      lat: 51.508,
      lng: -0.11,
      description:
        "Clean and accessible toilet facilities inside the community center. Includes accessible shower facilities and changing area.",
      wheelchairAccessible: true,
      changingTable: true,
      freeToUse: true,
      openNow: false,
      accessibility: "accessible",
      distance: "1.5km",
      distanceValue: 1.5,
      rating: 4.7,
      reviewCount: 19,
      openingHours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "10:00 AM - 6:00 PM",
        sunday: "Closed",
      },
    },
  ]
}

// Define L for Leaflet if it's not already defined
var L
