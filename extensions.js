

// YRS: This "DirectionsWorkflowExtension7" is working not working but it does have some of the functionality
// of the Autocomplete feature integrated into it.

export const DirectionsWorkflowExtension7 = {
  name: 'DirectionsWorkflow',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_directionsWorkflow7' || trace.payload?.name === 'ext_directionsWorkflow7',
  render: ({ trace, element }) => {
    // Extract properties from the payload
    const { 
      apiKey = 'AIzaSyA5y-Tq-IEhgS1NQxY7HgnXe4pPA4tPuH4', // API key
      pickupPoints = [], // Optional: can come from data
      workflowTitle = 'Find Your Pickup Location',
      height = '600',
      backgroundColor = '#ffffff',
      // Branding colors
      primaryColor = '#587C74',
      secondaryColor = '#3B534E',
      // Border options
      borderWidth = '2px',
      borderColor = '#587C74',
      borderStyle = 'solid',
      borderRadius = '12px',
      // Shadow and effects
      shadowColor = 'rgba(88, 124, 116, 0.2)',
      shadowSize = '8px',
      // Animation
      animateIn = true,
      // Default location bias
      defaultLat = 21.315603,
      defaultLng = -157.858093,
      defaultRadius = 30000.0
    } = trace.payload || {};

    // Default pickup points if none provided
    const defaultPickupPoints = [
      { 
        name: "Aloha Tower trolley stop", 
        lat: 21.30693198561091, 
        lon: -157.8663891824468, 
        instructions: "Go to the trolley stop in front of Aloha Tower Marketplace (155 Ala Moana Blvd, Honolulu, HI 96813)", 
        time: "6:45 AM", 
        image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_AlohaTowerDrive.png",
        mapsUrl: "https://www.google.com/maps/dir//Aloha+Tower,+155+Ala+Moana+Blvd,+Honolulu,+HI+96813,+United+States/@21.3071037,-157.9484283,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x7c006e0d29acdfe5:0x69da511e4d40c5f1!2m2!1d-157.8660706!2d21.3070747?entry=ttu"
      },
      { 
        name: "Ala Moana Hotel - curbside on Mahukona Street", 
        lat: 21.290298342118497, 
        lon: -157.84001436219415, 
        instructions: "Meet us near the curbside at Mahukona St", 
        time: "6:50 AM", 
        image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_AlaMoana.jpg", 
        mapsUrl: "https://maps.app.goo.gl/JmSDbRyNRbC9oTRS6"
      },
      { 
        name: "Hilton Hawaiian Village - Grand Islander bus depot", 
        lat: 21.282800616178037, 
        lon: -157.83548235215594, 
        instructions: "We will pick you up at 7:00AM from The Grand Islander Bus Depot (Paoa Pi Street)", 
        time: "7:00 AM", 
        image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_HiltonGrandislander.jpg",
        mapsUrl: "https://maps.app.goo.gl/GDD8cUcH6SGaGZyo6"
      }
    ];

    // Fixed Duke Paoa Kahanamoku Statue location
    const FIXED_PICKUP = {
      name: "Duke Paoa Kahanamoku Statue",
      lat: 21.277054,
      lon: -157.826810,
      instructions: "Meet in front of the Duke Paoa Kahanamoku Statue at Waikiki Beach, next to the police station. Look for our tour guide with a blue 'Aloha Tours' flag.",
      time: "8:00 AM",
      image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_DukeStatue.jpg",
      mapsUrl: "https://maps.app.goo.gl/u1YiZZ2wQNQdNiiu5"
    };

    // Tours data - 5 fictional Hawaiian tours
    const toursData = [
      {
        id: 'aloha-circle',
        name: 'Aloha Circle Island Adventure',
        description: 'Experience the complete beauty of Oahu with scenic coastal views, mountain ranges, and hidden gems',
        image: 'https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/Hawaii-Tour.jpg'
      },
      {
        id: 'waimea-valley',
        name: 'Waimea Valley Cultural Experience',
        description: 'Immerse yourself in Hawaiian traditions at sacred sites, lush botanical gardens, and spectacular waterfalls',
        image: 'https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PearlHarbor-Tour.jpg'
      },
      {
        id: 'volcano-discovery',
        name: 'Volcano Discovery Journey',
        description: 'Explore the fascinating volcanic landscapes that shaped the Hawaiian islands with expert guides',
        image: 'https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/NorthShore-Tour.jpg'
      },
      {
        id: 'polynesian-heritage',
        name: 'Polynesian Heritage Tour',
        description: 'Discover the rich cultural heritage of ancient Hawaii through authentic performances, crafts, and stories',
        image: 'https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/Hawaii-Tour.jpg'
      },
      {
        id: 'paradise-snorkel',
        name: 'Paradise Snorkel Safari',
        description: 'Swim alongside tropical fish and sea turtles in Hawaii\'s crystal clear waters at premier snorkeling spots',
        image: 'https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PearlHarbor-Tour.jpg'
      }
    ];

    // Clean element first
    element.innerHTML = '';

    // Create a container for the workflow
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = 'transparent';
    container.style.margin = '0';
    container.style.padding = '0';
    
    // Create the main wrapper with fixed width
    const wrapper = document.createElement('div');
    wrapper.className = 'directions-workflow-wrapper';
    
    // Apply styling with fixed pixel width
    const fixedWidth = '460px';
    wrapper.style.width = fixedWidth;
    wrapper.style.minWidth = fixedWidth;
    wrapper.style.maxWidth = fixedWidth;
    wrapper.style.border = `${borderWidth} ${borderStyle} ${borderColor}`;
    wrapper.style.borderRadius = borderRadius;
    wrapper.style.overflow = 'hidden';
    wrapper.style.backgroundColor = backgroundColor;
    wrapper.style.boxShadow = `0 4px ${shadowSize} ${shadowColor}`;
    wrapper.style.height = height + 'px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.margin = '0 auto';

    // Add animation if enabled
    if (animateIn) {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(20px)';
      wrapper.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }

    // Workflow data object
    const workflowData = {
      selectedTour: "",
      selectedTourName: "",
      userLocation: null,
      nearestPickup: FIXED_PICKUP,
      apiKey: apiKey,
      accommodationName: "",
      addressPlace: null, // Store the selected place object
      addressAutocomplete: null, // Store the autocomplete element
      addressEntered: false, // Flag to track if address is entered
      addressSelectionComplete: false // New flag to track when selection is fully processed
    };

    // Load Google Maps API with the bootstrap loader for alpha version
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        // Check if API is already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('Google Maps API already loaded');
          resolve();
          return;
        }
        
        // Create the bootstrap loader script
        const script = document.createElement('script');
        script.innerHTML = `
          (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
            key: "${apiKey}",
            v: "alpha" // Use alpha channel for Places API (Preview)
          });
        `;
        
        document.head.appendChild(script);
        
        // Create a timeout to wait for the API to load
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = 500; // 500ms
        
        const checkIfLoaded = () => {
          attempts++;
          if (window.google && window.google.maps) {
            // Try to load places library
            window.google.maps.importLibrary("places")
              .then(() => {
                console.log('Places library loaded successfully');
                resolve();
              })
              .catch(err => {
                console.warn('Error loading Places library:', err);
                if (attempts < maxAttempts) {
                  setTimeout(checkIfLoaded, checkInterval);
                } else {
                  reject(new Error('Failed to load Places library after multiple attempts'));
                }
              });
          } else if (attempts < maxAttempts) {
            setTimeout(checkIfLoaded, checkInterval);
          } else {
            reject(new Error('Google Maps API failed to load after multiple attempts'));
          }
        };
        
        // Start checking if the API is loaded
        setTimeout(checkIfLoaded, checkInterval);
      });
    };

    // Initialize Google Places Autocomplete for the address field only
    function setupAutocomplete() {
      console.log('Setting up autocomplete...');
      
      // Enhanced API check with more detailed logging
      if (!window.google) {
        console.error('Google object not available');
        setTimeout(setupAutocomplete, 500);
        return;
      }
      if (!window.google.maps) {
        console.error('Google Maps object not available');
        setTimeout(setupAutocomplete, 500);
        return;
      }
      if (!window.google.maps.places) {
        console.error('Google Maps Places object not available');
        setTimeout(setupAutocomplete, 500);
        return;
      }
      if (!window.google.maps.places.PlaceAutocompleteElement) {
        console.error('PlaceAutocompleteElement not available');
        setTimeout(setupAutocomplete, 500);
        return;
      }
      
      // Only set up autocomplete for the address field
      const addressContainer = wrapper.querySelector('#address-container');
      
      if (!addressContainer) {
        console.error('Address container element not found');
        return;
      }
      
      // Clear container first to prevent duplicates
      addressContainer.innerHTML = '';
      
      try {
        // Create the address autocomplete element
        const addressAutocomplete = new google.maps.places.PlaceAutocompleteElement({
          types: ['address'],
          componentRestrictions: { country: 'us' }
        });
        
        addressAutocomplete.id = 'address';
        addressAutocomplete.placeholder = 'e.g. 2005 Kalia Rd';
        addressAutocomplete.style.width = '100%';
        addressAutocomplete.style.height = '44px';
        addressAutocomplete.style.borderRadius = '8px';
        addressAutocomplete.style.transition = 'border-color 0.3s ease';
        
        addressContainer.appendChild(addressAutocomplete);
        
        // Store the autocomplete element
        workflowData.addressAutocomplete = addressAutocomplete;
        
        // Add a selection status indicator
        const selectionIndicator = document.createElement('div');
        selectionIndicator.id = 'address-selection-indicator';
        selectionIndicator.style.color = '#999';
        selectionIndicator.style.fontSize = '12px';
        selectionIndicator.style.marginTop = '4px';
        selectionIndicator.textContent = 'Type and select an address from the dropdown';
        addressContainer.appendChild(selectionIndicator);
        
        // Listen for address selection with enhanced logging
        addressAutocomplete.addEventListener('gmp-placeselect', async (event) => {
          console.log('PLACE SELECT EVENT TRIGGERED'); // Debug line
          
          try {
            const prediction = event.place;
            
            // Visual feedback - update the input style to show selection is in progress
            addressAutocomplete.style.borderColor = '#FFA500'; // Orange while processing
            
            if (selectionIndicator) {
              selectionIndicator.textContent = 'Processing selection...';
              selectionIndicator.style.color = '#FFA500';
            }
            
            // Ensure we have a valid place object with necessary fields
            await prediction.fetchFields({
              fields: ['displayName', 'formattedAddress', 'location', 'placeId'],
            });
            
            console.log('Address selected:', prediction.formattedAddress);
            
            // Store the place and set the flags
            workflowData.addressPlace = prediction;
            workflowData.addressEntered = true;
            
            // Update user location data
            workflowData.userLocation = {
              address: prediction.formattedAddress,
              placeId: prediction.placeId,
              lat: prediction.location.lat,
              lng: prediction.location.lng
            };
            
            // Visual feedback - update the input style to show selection is complete
            addressAutocomplete.style.borderColor = primaryColor;
            
            if (selectionIndicator) {
              selectionIndicator.textContent = 'Address selected: ' + prediction.formattedAddress;
              selectionIndicator.style.color = primaryColor;
            }
            
            // Set flag that selection is fully processed
            workflowData.addressSelectionComplete = true;
            
            console.log('Address entered successfully. userLocation:', workflowData.userLocation);
          } catch (error) {
            console.error('Error processing selected place:', error);
            
            // Visual feedback for error
            addressAutocomplete.style.borderColor = 'red';
            
            if (selectionIndicator) {
              selectionIndicator.textContent = 'Error processing address. Please try again.';
              selectionIndicator.style.color = 'red';
            }
            
            // Reset flags on error
            workflowData.addressEntered = false;
            workflowData.addressSelectionComplete = false;
          }
        });
        
        // Listen for input changes to reset selection state when user modifies the input
        addressAutocomplete.addEventListener('input', () => {
          if (workflowData.addressSelectionComplete) {
            // Reset if the user changes the input after a successful selection
            workflowData.addressSelectionComplete = false;
            workflowData.addressEntered = false;
            
            // Reset visual indicators
            addressAutocomplete.style.borderColor = '';
            
            if (selectionIndicator) {
              selectionIndicator.textContent = 'Type and select an address from the dropdown';
              selectionIndicator.style.color = '#999';
            }
          }
        });
        
        console.log('Address autocomplete setup complete');
      } catch (error) {
        console.error('Error setting up autocomplete:', error);
        alert('There was an error setting up the address search. Please disable any ad blockers or try a different browser.');
      }
    }

    // HTML and CSS for the workflow
    wrapper.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        *, *::before, *::after {
          box-sizing: border-box;
        }
        
        .directions-workflow-container * {
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        
        .directions-workflow-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          color: #333;
          width: 100%;
          max-width: 100%;
          min-width: 100%;
        }
        
        .workflow-header {
          background-color: ${primaryColor};
          color: white;
          padding: 16px;
          text-align: center;
          font-weight: 600;
          width: 100%;
        }
        
        .workflow-header h2 {
          margin: 0;
          font-size: 18px;
        }
        
        .workflow-content {
          flex: 1;
          overflow-y: auto;
          position: relative;
          width: 100%;
        }
        
        .workflow-step {
          height: 100%;
          width: 100%;
          max-width: 100%;
          padding: 20px;
          display: none;
          animation: fadeIn 0.3s ease-in-out;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .workflow-step.active {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .progress-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
        }
        
        .step-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #e0e0e0;
          margin: 0 5px;
          transition: all 0.2s ease;
        }
        
        .step-indicator.active {
          background-color: ${primaryColor};
        }
        
        .tour-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-top: 10px;
          width: 100%;
          max-height: 350px;
          overflow-y: auto;
          padding-right: 5px;
          margin-bottom: 15px;
        }
        
        .tour-card {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        
        .tour-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(88, 124, 116, 0.2);
        }
        
        .tour-card.selected {
          border: 2px solid ${primaryColor};
        }
        
        .tour-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          background-color: #f0f0f0;
        }
        
        .tour-info {
          padding: 12px;
        }
        
        .tour-info h3 {
          margin: 0 0 8px;
          font-size: 16px;
        }
        
        .tour-info p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        
        .address-form {
          margin-top: 10px;
          width: 100%;
        }
        
        .form-group {
          margin-bottom: 16px;
          width: 100%;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 14px;
        }
        
        .form-control {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        
        .form-control:focus {
          outline: none;
          border-color: ${primaryColor};
        }
        
        /* Fix for google place autocomplete elements */
        gmp-place-autocomplete {
          width: 100%;
          display: block;
          font-family: 'Inter', sans-serif;
        }
        
        /* Loading Animation */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          width: 100%;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(88, 124, 116, 0.2);
          border-radius: 50%;
          border-top: 5px solid ${primaryColor};
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-text {
          font-size: 18px;
          font-weight: 500;
          margin-top: 15px;
        }
        
        .map-container, .route-map-container {
          margin-top: 15px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid ${primaryColor};
          width: 100%;
          position: relative;
          aspect-ratio: 4/3;
        }
        
        .map-container iframe, .route-map-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .confirmation-text {
          margin: 15px 0;
          text-align: center;
          font-weight: 500;
          width: 100%;
        }
        
        .pickup-card {
          border-radius: 12px;
          overflow: hidden;
          margin-top: 15px;
          box-shadow: 0 2px 4px rgba(88, 124, 116, 0.2);
          border: 2px solid ${primaryColor};
          width: 100%;
          box-sizing: border-box;
        }
        
        .pickup-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        
        .pickup-info {
          padding: 15px;
        }
        
        .pickup-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: ${primaryColor};
        }
        
        .pickup-address {
          font-size: 15px;
          margin-bottom: 10px;
        }
        
        .pickup-instructions {
          font-size: 14px;
          color: #555;
          border-left: 3px solid ${primaryColor};
          padding-left: 10px;
          margin-top: 10px;
        }
        
        .route-details {
          margin-top: 15px;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          font-size: 14px;
          border-left: 3px solid ${primaryColor};
          width: 100%;
          box-sizing: border-box;
        }
        
        .route-details p {
          margin: 5px 0;
        }
        
        .route-details .walk-time {
          font-weight: 600;
          color: ${primaryColor};
        }
        
        .btn-container {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 20px;
          width: 100%;
        }
        
        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-size: 15px;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background-color: ${primaryColor};
          color: white;
        }
        
        .btn-primary:hover {
          background-color: ${secondaryColor};
        }
        
        .btn-secondary {
          background-color: #f1f3f5;
          color: #495057;
        }
        
        .btn-secondary:hover {
          background-color: #e9ecef;
        }
        
        .btn-route {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background-color: ${primaryColor};
          color: white;
          margin-top: 15px;
        }
        
        .btn-route:hover {
          background-color: ${secondaryColor};
        }

        .map-fallback {
          display: none;
          padding: 20px;
          text-align: center;
          background-color: #f8f9fa;
          border-radius: 8px;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        
        h3, p, form, div.tour-options, div.progress-container, div.btn-container,
        div.pickup-card, div.route-details, button.btn-route,
        div.map-container, div.route-map-container, div.map-fallback {
          width: 100%;
          max-width: 420px;
        }
        
        img, iframe {
          max-width: 100%;
          border: 0;
        }
        
        /* New styles for address selection feedback */
        .address-selection-success {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 1px ${primaryColor};
        }
        
        .address-selection-processing {
          border-color: #FFA500 !important;
          box-shadow: 0 0 0 1px #FFA500;
        }
        
        .address-selection-error {
          border-color: #FF4136 !important;
          box-shadow: 0 0 0 1px #FF4136;
        }
      </style>
      
      <div class="directions-workflow-container">
        <div class="workflow-header">
          <h2>${workflowTitle}</h2>
        </div>
        
        <div class="workflow-content">
          <div class="workflow-step active" id="step-tour">
            <h3>Select Your Tour</h3>
            <p>Please select the tour you'll be joining:</p>
            
            <div class="progress-container">
              <div class="progress-steps">
                <div class="step-indicator active"></div>
                <div class="step-indicator"></div>
                <div class="step-indicator"></div>
                <div class="step-indicator"></div>
              </div>
            </div>
            
            <div class="tour-options">
              ${toursData.map(tour => `
                <div class="tour-card" data-tour-id="${tour.id}" data-tour-name="${tour.name}">
                  <img src="${tour.image}" alt="${tour.name}" class="tour-image">
                  <div class="tour-info">
                    <h3>${tour.name}</h3>
                    <p>${tour.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="btn-container">
              <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
              <button class="btn btn-primary" id="next-btn">Next</button>
            </div>
          </div>
          
          <div class="workflow-step" id="step-address">
            <h3>Enter Your Accommodation</h3>
            <p>Please enter the address where you're staying:</p>
            
            <div class="progress-container">
              <div class="progress-steps">
                <div class="step-indicator active"></div>
                <div class="step-indicator active"></div>
                <div class="step-indicator"></div>
                <div class="step-indicator"></div>
              </div>
            </div>
            
            <form class="address-form" id="address-form">
              <div class="form-group">
                <label for="accommodation-name">Accommodation Name (optional)</label>
                <input type="text" id="accommodation-name" class="form-control" placeholder="e.g. Hyatt Hotel">
              </div>
              
              <div class="form-group">
                <label for="address">Street Address*</label>
                <div id="address-container" style="width: 100%;"></div>
              </div>
              
              <div class="form-group">
                <label for="city">City*</label>
                <input type="text" id="city" class="form-control" value="Honolulu" required readonly>
              </div>
            </form>
            
            <div class="btn-container">
              <button class="btn btn-secondary" id="back-to-tour-btn">Back</button>
              <button class="btn btn-primary" id="find-pickup-btn">Find Pickup</button>
            </div>
          </div>
          
          <div class="workflow-step" id="step-searching">
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <div class="loading-text">Searching for location...</div>
            </div>
          </div>
          
          <div class="workflow-step" id="step-location-confirm">
            <h3>Confirm Your Location</h3>
            
            <div class="progress-container">
              <div class="progress-steps">
                <div class="step-indicator active"></div>
                <div class="step-indicator active"></div>
                <div class="step-indicator active"></div>
                <div class="step-indicator"></div>
              </div>
            </div>
            
            <div class="map-container" id="location-map"></div>
            <div class="map-fallback" id="location-map-fallback">
              <p>Unable to display map.</p>
              <p id="fallback-address"></p>
            </div>
            
            <p class="confirmation-text">Is this the correct location?</p>
            
            <div class="btn-container">
              <button class="btn btn-secondary" id="edit-address-btn">No, Edit</button>
              <button class="btn btn-primary" id="confirm-location-btn">Yes, Continue</button>
            </div>
          </div>
          
          <div class="workflow-step" id="step-finding-pickup">
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <div class="loading-text">Finding nearest pickup point...</div>
            </div>
          </div>
          
          <div class="workflow-step" id="step-pickup-info">
            <h3>Your Pickup Location</h3>
            
            <div class="progress-container">
              <div class="progress-steps">
                <div class="step-indicator active"></div>
                <div class="step-indicator active"></div>
                <div class="step-indicator active"></div>
                <div class="step-indicator active"></div>
              </div>
            </div>
            
            <div class="pickup-card">
              <img id="pickup-image" src="" alt="Pickup point image" class="pickup-image">
              <div class="pickup-info">
                <h3 class="pickup-title" id="pickup-title">Loading pickup location...</h3>
                <p class="pickup-address" id="pickup-address"></p>
                <div class="pickup-instructions" id="pickup-instructions">
                  <p id="pickup-time"></p>
                  <p id="pickup-details"></p>
                </div>
              </div>
            </div>
            
            <button class="btn btn-route" id="show-route-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Show Route
            </button>
            
            <div class="btn-container">
              <button class="btn btn-secondary" id="back-to-confirm-btn">Back</button>
              <button class="btn btn-primary" id="done-btn">Done</button>
            </div>
          </div>
          
          <div class="workflow-step" id="step-route">
            <h3>Getting to Your Pickup Point</h3>
            
            <div class="form-group">
              <label for="transport-mode">Transportation Mode:</label>
              <select id="transport-mode" class="form-control">
                <option value="walking" selected>Walking</option>
                <option value="bicycling">Bicycling</option>
                <option value="driving">Driving</option>
                <option value="transit">Public Transit</option>
              </select>
            </div>
            
            <div class="route-map-container" id="route-map"></div>
            <div class="map-fallback" id="route-map-fallback">
              <p>Unable to display route map.</p>
              <div id="fallback-route-details"></div>
            </div>
            
            <div class="route-details">
              <p><strong>From:</strong> <span id="route-from">Your accommodation</span></p>
              <p><strong>To:</strong> <span id="route-to">Duke Paoa Kahanamoku Statue, Waikiki Beach</span></p>
              <p class="walk-time" id="route-time">Calculating travel time...</p>
            </div>
            
            <div class="btn-container">
              <button class="btn btn-secondary" id="back-to-pickup-btn">Back</button>
              <button class="btn btn-primary" id="route-done-btn">Done</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add wrapper to container and container to element
    container.appendChild(wrapper);
    element.appendChild(container);

    // Apply animation and ensure scrollability
    if (animateIn) {
      setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
        const tourOptions = wrapper.querySelector('.tour-options');
        if (tourOptions) {
          tourOptions.style.maxHeight = '350px';
          tourOptions.style.overflowY = 'auto';
        }
      }, 100);
    }

    // Event listeners setup
    function setupEventListeners() {
      const tourCards = wrapper.querySelectorAll('.tour-card');
      const nextBtn = wrapper.querySelector('#next-btn');
      const cancelBtn = wrapper.querySelector('#cancel-btn');
      const backToTourBtn = wrapper.querySelector('#back-to-tour-btn');
      const findPickupBtn = wrapper.querySelector('#find-pickup-btn');
      const editAddressBtn = wrapper.querySelector('#edit-address-btn');
      const confirmLocationBtn = wrapper.querySelector('#confirm-location-btn');
      const backToConfirmBtn = wrapper.querySelector('#back-to-confirm-btn');
      const doneBtn = wrapper.querySelector('#done-btn');
      const showRouteBtn = wrapper.querySelector('#show-route-btn');
      const backToPickupBtn = wrapper.querySelector('#back-to-pickup-btn');
      const routeDoneBtn = wrapper.querySelector('#route-done-btn');
      const accommodationInput = wrapper.querySelector('#accommodation-name');

      // Store accommodation name when it changes
      if (accommodationInput) {
        accommodationInput.addEventListener('input', (e) => {
          workflowData.accommodationName = e.target.value;
        });
      }

      tourCards.forEach(card => {
        card.addEventListener('click', () => {
          tourCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          workflowData.selectedTour = card.dataset.tourId;
          workflowData.selectedTourName = card.dataset.tourName;
        });
      });

      nextBtn.addEventListener('click', () => {
        if (workflowData.selectedTour) {
          goToStep('step-address');
          setupAutocomplete(); // Ensure autocomplete is set up when moving to address step
        } else {
          alert('Please select a tour first.');
        }
      });

      cancelBtn.addEventListener('click', cancelWorkflow);
      
      backToTourBtn.addEventListener('click', () => {
        goToStep('step-tour');
      });
      
      findPickupBtn.addEventListener('click', () => {
        // Debug log to check the current state
        console.log('Find Pickup button clicked. Current workflow data:', {
          addressEntered: workflowData.addressEntered,
          addressSelectionComplete: workflowData.addressSelectionComplete,
          userLocation: workflowData.userLocation,
          addressAutocomplete: workflowData.addressAutocomplete ? 
            { value: workflowData.addressAutocomplete.value } : null
        });
        
        // Check for a properly selected address - either selection is complete or we have valid location data
        if ((workflowData.addressSelectionComplete || workflowData.addressEntered) && workflowData.userLocation) {
          goToStep('step-searching');
          setTimeout(() => {
            updateLocationMap(workflowData.userLocation);
            goToStep('step-location-confirm');
          }, 1000);
        }
        // If there's a value in the input but no completed selection, try geocoding
        else if (workflowData.addressAutocomplete && workflowData.addressAutocomplete.value) {
          // Try to geocode the manually entered address
          geocodeAddress(workflowData.addressAutocomplete.value);
        } 
        else {
          alert('Please enter a street address and select it from the dropdown menu');
        }
      });
      
      editAddressBtn.addEventListener('click', () => {
        goToStep('step-address');
      });
      
      confirmLocationBtn.addEventListener('click', findPickupPoint);
      
      backToConfirmBtn.addEventListener('click', () => {
        goToStep('step-location-confirm');
      });
      
      doneBtn.addEventListener('click', completeWorkflow);
      
      showRouteBtn.addEventListener('click', showRouteMap);
      
      backToPickupBtn.addEventListener('click', () => {
        goToStep('step-pickup-info');
      });
      
      routeDoneBtn.addEventListener('click', completeWorkflow);
    }

    // Navigate between steps
    function goToStep(stepId) {
      const steps = wrapper.querySelectorAll('.workflow-step');
      steps.forEach(step => step.classList.remove('active'));
      const targetStep = wrapper.querySelector(`#${stepId}`);
      if (targetStep) {
        targetStep.classList.add('active');
        enforceConsistentWidth();
      }
    }

    // Geocode an address manually
    function geocodeAddress(address) {
      const city = wrapper.querySelector('#city')?.value || 'Honolulu';
      const fullAddress = `${address}, ${city}`;
      
      goToStep('step-searching');
      
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            
            // Set the addressEntered flag to true since we've geocoded successfully
            workflowData.addressEntered = true;
            workflowData.addressSelectionComplete = true;
            
            workflowData.userLocation = {
              address: result.formatted_address,
              placeId: result.place_id,
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng
            };
            
            // Visual feedback if the autocomplete element is available
            if (workflowData.addressAutocomplete) {
              workflowData.addressAutocomplete.style.borderColor = primaryColor;
              
              const selectionIndicator = wrapper.querySelector('#address-selection-indicator');
              if (selectionIndicator) {
                selectionIndicator.textContent = 'Address found: ' + result.formatted_address;
                selectionIndicator.style.color = primaryColor;
              }
            }
            
            updateLocationMap(workflowData.userLocation);
            goToStep('step-location-confirm');
          } else {
            console.error('Geocoding API error:', data.status);
            alert('Unable to find location. Please enter a valid address.');
            goToStep('step-address');
          }
        })
        .catch(error => {
          console.error('Error geocoding address:', error);
          alert('Unable to find location. Please check your internet connection and try again.');
          goToStep('step-address');
        });
    }

    // Update location map with place data
    function updateLocationMap(locationData) {
      const mapContainer = wrapper.querySelector('#location-map');
      const mapFallback = wrapper.querySelector('#location-map-fallback');
      
      if (mapContainer) {
        try {
          const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${locationData.placeId}&zoom=17&maptype=roadmap`;
          mapContainer.innerHTML = `
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              style="border:0"
              src="${mapUrl}"
              allowfullscreen
              onload="document.getElementById('location-map').style.display='block'; document.getElementById('location-map-fallback').style.display='none';"
              onerror="document.getElementById('location-map').style.display='none'; document.getElementById('location-map-fallback').style.display='block';"
            ></iframe>
          `;
          
          if (mapFallback) {
            const fallbackAddressEl = mapFallback.querySelector('#fallback-address');
            if (fallbackAddressEl) {
              fallbackAddressEl.textContent = locationData.address;
            }
          }
        } catch (error) {
          console.error('Error embedding map:', error);
          if (mapContainer) mapContainer.style.display = 'none';
          if (mapFallback) mapFallback.style.display = 'block';
        }
      }
    }

    // Find pickup point (always uses the fixed pickup)
    function findPickupPoint() {
      goToStep('step-finding-pickup');
      
      setTimeout(() => {
        // Update pickup info UI
        const pickupImage = wrapper.querySelector('#pickup-image');
        const pickupTitle = wrapper.querySelector('#pickup-title');
        const pickupAddress = wrapper.querySelector('#pickup-address');
        const pickupTime = wrapper.querySelector('#pickup-time');
        const pickupDetails = wrapper.querySelector('#pickup-details');

        if (pickupImage) pickupImage.src = FIXED_PICKUP.image;
        if (pickupTitle) pickupTitle.textContent = FIXED_PICKUP.name;
        if (pickupAddress) pickupAddress.textContent = `Pickup address for ${workflowData.selectedTourName}`;
        if (pickupTime) pickupTime.innerHTML = `<strong>Pickup time:</strong> ${FIXED_PICKUP.time}`;
        if (pickupDetails) pickupDetails.textContent = FIXED_PICKUP.instructions;

        goToStep('step-pickup-info');
      }, 1500);
    }

    // Show route map with transportation mode
    function showRouteMap() {
      const transportMode = wrapper.querySelector('#transport-mode')?.value || 'walking';
      
      if (!workflowData.userLocation) {
        alert('Unable to find your location. Please go back and try again.');
        return;
      }
      
      const origin = `${workflowData.userLocation.lat},${workflowData.userLocation.lng}`;
      const destination = `${FIXED_PICKUP.lat},${FIXED_PICKUP.lon}`;
      
      const routeMapContainer = wrapper.querySelector('#route-map');
      const routeMapFallback = wrapper.querySelector('#route-map-fallback');
      
      if (routeMapContainer) {
        try {
          const directionsUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&mode=${transportMode}`;
          
          routeMapContainer.innerHTML = `
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              style="border:0"
              src="${directionsUrl}"
              allowfullscreen
              onload="document.getElementById('route-map').style.display='block'; document.getElementById('route-map-fallback').style.display='none';"
              onerror="document.getElementById('route-map').style.display='none'; document.getElementById('route-map-fallback').style.display='block';"
            ></iframe>
          `;
          
          if (routeMapFallback) {
            const fallbackRouteDetails = routeMapFallback.querySelector('#fallback-route-details');
            if (fallbackRouteDetails) {
              fallbackRouteDetails.innerHTML = `
                <p>${transportMode.charAt(0).toUpperCase() + transportMode.slice(1)} route from ${workflowData.userLocation.address} to ${FIXED_PICKUP.name}.</p>
              `;
            }
          }
        } catch (error) {
          console.error('Error embedding route map:', error);
          if (routeMapContainer) routeMapContainer.style.display = 'none';
          if (routeMapFallback) routeMapFallback.style.display = 'block';
        }
      }

      // Update route details
      const routeFrom = wrapper.querySelector('#route-from');
      const routeTo = wrapper.querySelector('#route-to');
      const routeTime = wrapper.querySelector('#route-time');

      if (routeFrom) routeFrom.textContent = workflowData.userLocation.address;
      if (routeTo) routeTo.textContent = FIXED_PICKUP.name;

      // Calculate travel time based on mode
      const distance = calculateDistance(
        workflowData.userLocation.lat, 
        workflowData.userLocation.lng, 
        FIXED_PICKUP.lat, 
        FIXED_PICKUP.lon
      );
      
      const speeds = {
        walking: 4,     // km/h
        bicycling: 15,  // km/h
        driving: 40,    // km/h
        transit: 20     // km/h
      };
      
      const timeMinutes = Math.round((distance / (speeds[transportMode] || 4)) * 60);
      
      const modeDisplay = {
        walking: 'Walking',
        bicycling: 'Biking',
        driving: 'Driving',
        transit: 'Transit'
      };
      
      if (routeTime) {
        routeTime.textContent = `${modeDisplay[transportMode] || 'Travel'} time: ~${timeMinutes} minutes (${distance.toFixed(1)} km)`;
      }

      goToStep('step-route');
      
      // Add listener for transport mode changes
      const transportModeElement = wrapper.querySelector('#transport-mode');
      if (transportModeElement && !transportModeElement.dataset.listenerAdded) {
        transportModeElement.addEventListener('change', showRouteMap);
        transportModeElement.dataset.listenerAdded = 'true';
      }
    }

    // Calculate distance using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    // Enforce consistent width
    function enforceConsistentWidth() {
      const steps = wrapper.querySelectorAll('.workflow-step');
      steps.forEach(step => {
        step.style.width = '100%';
        step.style.maxWidth = '100%';
      });
      
      const contentElements = wrapper.querySelectorAll('.workflow-step > *');
      contentElements.forEach(element => {
        element.style.maxWidth = '100%';
        element.style.boxSizing = 'border-box';
      });
    }

    // Cancel workflow
    function cancelWorkflow() {
      // If integrated with Voiceflow, can signal cancellation
      if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.interact({
          type: 'request',
          payload: {
            type: 'directions-cancel'
          }
        });
      } else {
        // Simple fallback
        element.innerHTML = '<p>Workflow cancelled.</p>';
      }
    }

    // Complete workflow
    function completeWorkflow() {
      // Include accommodation name with location data
      const fullAddress = workflowData.accommodationName 
        ? `${workflowData.accommodationName}, ${workflowData.userLocation?.address || ''}`
        : workflowData.userLocation?.address || '';
      
      // If integrated with Voiceflow, can signal completion with data
      if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.interact({
          type: 'request',
          payload: {
            type: 'directions-complete',
            data: {
              selectedTour: workflowData.selectedTourName,
              userAddress: fullAddress,
              pickupPoint: FIXED_PICKUP.name,
              pickupTime: FIXED_PICKUP.time,
              pickupInstructions: FIXED_PICKUP.instructions,
              userLat: workflowData.userLocation?.lat || 0,
              userLon: workflowData.userLocation?.lng || 0,
              pickupLat: FIXED_PICKUP.lat,
              pickupLon: FIXED_PICKUP.lon
            }
          }
        });
      } else {
        // Simple fallback
        element.innerHTML = `
          <div style="padding: 20px; text-align: center;">
            <h3>Thank you for completing the workflow!</h3>
            <p>Your pickup has been confirmed at ${FIXED_PICKUP.name} for ${workflowData.selectedTourName}.</p>
            <p>Pickup time: ${FIXED_PICKUP.time}</p>
          </div>
        `;
      }
    }

    // Initialize workflow
    loadGoogleMapsScript()
      .then(() => {
        console.log('Google Maps API loaded successfully');
        setupEventListeners();
        setupAutocomplete();
        enforceConsistentWidth();
      })
      .catch(error => {
        console.error('Failed to load Google Maps API:', error);
        alert('There was an error loading the map service. Please disable any ad blockers or try a different browser.');
        setupEventListeners(); // Still set up event listeners even if Maps API fails
        enforceConsistentWidth();
      });
  },
};

// YRS: This "DirectionsWorkflowExtension22" is working correctly but I would like to integrate the Autocomplete feature in here.

export const DirectionsWorkflowExtension22 = {
    name: 'DirectionsWorkflow',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_directionsWorkflow22' || trace.payload?.name === 'ext_directionsWorkflow22',
    render: ({ trace, element }) => {
      // Extract properties from the payload
      const { 
        apiKey = 'AIzaSyA5y-Tq-IEhgS1NQxY7HgnXe4pPA4tPuH4', // API key
        pickupPoints = [], // This will come from your data
        workflowTitle = 'Find Your Pickup Location',
        height = '700', // Increased height to give more space for buttons
        padding = '15px',
        delay = 0,
        backgroundColor = '#ffffff',
        maxWidth = '500px', // Set consistent max-width
        // Branding colors
        primaryColor = '#587C74',
        secondaryColor = '#3B534E',
        // Border options
        borderWidth = '2px',
        borderColor = '#587C74',
        borderStyle = 'solid',
        borderRadius = '12px',
        // Shadow and effects
        shadowColor = 'rgba(88, 124, 116, 0.2)',
        shadowSize = '8px',
        // Animation
        animateIn = true,
        // Default location bias
        defaultLat = 21.315603,
        defaultLng = -157.858093,
        defaultRadius = 30000.0
      } = trace.payload || {};
  
      // Default pickup points if none are provided
      const defaultPickupPoints = [
        { 
          name: "Aloha Tower trolley stop", 
          lat: 21.30693198561091, 
          lon: -157.8663891824468, 
          instructions: "Go to the trolley stop in front of Aloha Tower Marketplace (155 Ala Moana Blvd, Honolulu, HI 96813)", 
          time: "6:45 AM", 
          image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_AlohaTowerDrive.png",
          mapsUrl: "https://www.google.com/maps/dir//Aloha+Tower,+155+Ala+Moana+Blvd,+Honolulu,+HI+96813,+United+States/@21.3071037,-157.9484283,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x7c006e0d29acdfe5:0x69da511e4d40c5f1!2m2!1d-157.8660706!2d21.3070747?entry=ttu"
        },
        { 
          name: "Ala Moana Hotel - curbside on Mahukona Street", 
          lat: 21.290298342118497, 
          lon: -157.84001436219415, 
          instructions: "Meet us near the curbside at Mahukona St", 
          time: "6:50 AM", 
          image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_AlaMoana.jpg", 
          mapsUrl: "https://maps.app.goo.gl/JmSDbRyNRbC9oTRS6"
        },
        { 
          name: "Hilton Hawaiian Village - Grand Islander bus depot", 
          lat: 21.282800616178037, 
          lon: -157.83548235215594, 
          instructions: "We will pick you up at 7:00AM from The Grand Islander Bus Depot (Paoa Pi Street)", 
          time: "7:00 AM", 
          image: "https://yannicksegaar.github.io/VF-extensions/RomAIx_GTH_Pickup_Photos/PickupPhoto_HiltonGrandislander.jpg",
          mapsUrl: "https://maps.app.goo.gl/GDD8cUcH6SGaGZyo6"
        }
      ];
  
      // Clean element first
      element.innerHTML = '';
  
      // Create a container for the workflow with fixed width
      const container = document.createElement('div');
      container.style.width = '100%';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.backgroundColor = 'transparent';
      container.style.margin = '0';
      container.style.padding = '0';
      
      // Create the main wrapper with FIXED WIDTH
      const wrapper = document.createElement('div');
      wrapper.className = 'directions-workflow-wrapper';
      
      // Apply styling with fixed pixel width
      const fixedWidth = '460px'; // Fixed pixel width for all steps
      wrapper.style.width = fixedWidth;
      wrapper.style.minWidth = fixedWidth;
      wrapper.style.maxWidth = fixedWidth;
      wrapper.style.border = `${borderWidth} ${borderStyle} ${borderColor}`;
      wrapper.style.borderRadius = borderRadius;
      wrapper.style.overflow = 'hidden';
      wrapper.style.backgroundColor = backgroundColor;
      wrapper.style.boxShadow = `0 4px ${shadowSize} ${shadowColor}`;
      wrapper.style.height = height + 'px';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.margin = '0 auto'; // Center the wrapper
      wrapper.style.position = 'relative'; // For absolute positioning inside
  
      // Add animation if enabled
      if (animateIn) {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(20px)';
        wrapper.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }
  
      // Tours data - 5 fictional Hawaiian tours
      const toursData = [
        {
          id: 'aloha-circle',
          name: 'Aloha Island Adventure',
          description: 'Experience the complete beauty of Oahu with scenic coastal views, mountain ranges, and hidden gems',
          image: 'https://yannicksegaar.github.io/VF-extensions/Carousel_MockupTours/Tour1_AlohaCircle_Mockup.png'
        },
        {
          id: 'waimea-valley',
          name: 'Waimea Valley Experience',
          description: 'Immerse yourself in Hawaiian traditions at sacred sites, lush botanical gardens, and spectacular waterfalls',
          image: 'https://yannicksegaar.github.io/VF-extensions/Carousel_MockupTours/Tour2_WaimeaValley_Mockup.png'
        },
        {
          id: 'volcano-discovery',
          name: 'Volcano Discovery Journey',
          description: 'Explore the fascinating volcanic landscapes that shaped the Hawaiian islands with expert guides',
          image: 'https://yannicksegaar.github.io/VF-extensions/Carousel_MockupTours/Tour3_VolcanoDiscovery_Mockup.png'
        },
        {
          id: 'polynesian-heritage',
          name: 'Polynesian Heritage Tour',
          description: 'Discover the rich cultural heritage of ancient Hawaii through authentic performances, crafts, and stories',
          image: 'https://yannicksegaar.github.io/VF-extensions/Carousel_MockupTours/Tour4_PolynesianHeritage_Mockup.png'
        },
        {
          id: 'paradise-snorkel',
          name: 'Paradise Snorkel Safari',
          description: 'Swim alongside tropical fish and sea turtles in Hawaii\'s crystal clear waters at premier snorkeling spots',
          image: 'https://yannicksegaar.github.io/VF-extensions/Carousel_MockupTours/Tour5_SnorkelSafari_Mockup.png'
        }
      ];
  
      // Fixed Duke Paoa Kahanamoku Statue location
      const FIXED_PICKUP = {
        name: "Duke Paoa Kahanamoku Statue",
        lat: 21.277054,
        lon: -157.826810,
        instructions: "Meet in front of the Duke Paoa Kahanamoku Statue at Waikiki Beach, next to the police station. Look for our tour guide with a blue 'Aloha Tours' flag.",
        time: "8:00 AM",
        image: "https://yannicksegaar.github.io/VF-extensions/Carousel_MockupTours/PickupPoint_Duke_Mockup.jpg",
        mapsUrl: "https://maps.app.goo.gl/u1YiZZ2wQNQdNiiu5"
      };
  
      // Updated function to load Google Maps API with Places library using bootstrap loader
      const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
          // Check if API is already loaded
          if (window.google && window.google.maps && window.google.maps.places) {
            console.log('Google Maps API already loaded');
            resolve();
            return;
          }
          
          // Define callback function that will be called by Google Maps API
          window.initGoogleMaps = function() {
            console.log('Google Maps API loaded successfully via callback');
            resolve();
          };
          
          // Set a timeout to catch loading failures
          const timeoutId = setTimeout(() => {
            console.error('Google Maps API loading timed out');
            reject(new Error('Google Maps API loading timed out'));
          }, 10000);
          
          // Create the bootstrap loader script
          const script = document.createElement('script');
          script.innerHTML = `
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
              key: "${apiKey}",
              v: "alpha" // Use alpha channel for Places API (Preview)
            });
          `;
          
          script.onload = function() {
            clearTimeout(timeoutId);
            console.log('Google Maps bootstrap script loaded');
            
            // Try to load the places library immediately
            setTimeout(async () => {
              try {
                if (window.google && window.google.maps) {
                  await window.google.maps.importLibrary("places");
                  clearTimeout(timeoutId);
                  console.log('Places library loaded via importLibrary');
                  resolve();
                }
              } catch (err) {
                console.warn('Initial importLibrary attempt failed:', err);
                // Don't reject here, the callback might still work
              }
            }, 500);
          };
          
          script.onerror = function(error) {
            clearTimeout(timeoutId);
            console.error('Error loading Google Maps bootstrap script:', error);
            reject(new Error('Failed to load Google Maps API'));
          };
          
          document.head.appendChild(script);
        });
      };
      
      // Initialize the mode icon when showing the route step
      const routeStepBtn = wrapper.querySelector('#show-route-btn');
      if (routeStepBtn) {
        routeStepBtn.addEventListener('click', function() {
          // Set the initial icon after a short delay to ensure DOM is ready
          setTimeout(() => {
            const modeSelect = wrapper.querySelector('#transport-mode');
            if (modeSelect) {
              updateTransportModeIcon(modeSelect.value);
            }
          }, 200);
        });
      }
      
      // Improved function to initialize Google Places Autocomplete with better error handling
      function setupAutocomplete() {
        console.log('Setting up autocomplete...');
        
        // Check if Google Maps API is loaded
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          console.error('Google Maps API not fully loaded, cannot set up autocomplete');
          return;
        }
        
        // Get input field
        const accommodationInput = wrapper.querySelector('#accommodation-input');
        
        // Debug info
        console.log('Accommodation input found:', !!accommodationInput);
        
        // Check if DOM element exists
        if (!accommodationInput) {
          console.error('Required input not found for autocomplete');
          return;
        }
        
        // Initialize autocomplete on the accommodation field
        console.log('Creating accommodation autocomplete');
        try {
          const accommodationOptions = {
            // Allow both establishments and addresses
            types: [], // No type restrictions to allow both
            componentRestrictions: {country: 'us'},
            // Add location bias for Honolulu
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(21.2, -158.0), // SW corner of Honolulu area
              new google.maps.LatLng(21.4, -157.6)  // NE corner of Honolulu area
            ),
            strictBounds: false, // Allow results outside the bounds
            fields: ['formatted_address', 'geometry', 'name', 'place_id']
          };
          
          const autocomplete = new google.maps.places.Autocomplete(accommodationInput, accommodationOptions);
          
          // When a place is selected
          autocomplete.addListener('place_changed', function() {
            const place = autocomplete.getPlace();
            
            if (!place.geometry) {
              console.error('No place details available for selection');
              return;
            }
            
            // The place data is already captured in the input field
            console.log('Place selected:', place.name);
            
            // Update the map with the selected place
            updateMapForLocation(place);
          });
          
          console.log('Accommodation autocomplete successfully initialized');
        } catch (error) {
          console.error('Error initializing accommodation autocomplete:', error);
        }
      }
  
      // Basic styling and tour selection HTML
      wrapper.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          *, *::before, *::after {
            box-sizing: border-box;
          }
          
          .directions-workflow-container * {
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
          }
          
          .directions-workflow-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            color: #333;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            position: relative;
          }
          
          .workflow-header {
            background-color: ${primaryColor};
            color: white;
            padding: 16px;
            text-align: center;
            font-weight: 600;
            width: 100%;
          }
          
          .workflow-header h2 {
            margin: 0;
            font-size: 18px;
          }
          
          .workflow-content {
            flex: 1;
            overflow-y: auto;
            position: relative;
            width: 100%;
          }
          
          .workflow-step {
            height: 100%;
            width: 100%;
            max-width: 100%;
            padding: 20px;
            display: none;
            animation: fadeIn 0.3s ease-in-out;
            box-sizing: border-box;
            overflow: hidden;
            position: relative;
          }
          
          .workflow-step.active {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* Progress Steps - Positioned in top right */
          .progress-container {
            position: absolute;
            top: 8px;
            right: 10px;
            z-index: 5;
          }
          
          .progress-steps {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 4px;
          }
          
          .workflow-step-indicator {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
            font-weight: 600;
            font-size: 14px;
            margin: 0 2px;
          }
          
          .workflow-step-indicator.active {
            background-color: ${primaryColor};
            color: white;
          }
          
          .workflow-step-indicator.completed {
            background-color: ${primaryColor};
            color: white;
          }
          
          /* Connector lines between step indicators */
          .workflow-step-indicator:not(:last-child):after {
            content: "";
            display: inline-block;
            position: absolute;
            width: 8px;
            height: 2px;
            background-color: #ddd;
            margin-left: 30px;
          }
          
          .workflow-step-indicator.completed:not(:last-child):after {
            background-color: ${primaryColor};
          }
          
          /* Tour Carousel - Smooth sliding with fixed card positions */
          .tour-carousel-container {
            width: 100%;
            position: relative;
            margin: 20px auto 50px;
            height: 360px; /* Fixed height to ensure visibility */
            overflow: visible;
          }
          
          /* Carousel track for smooth sliding */
          .carousel-track {
            display: flex;
            position: absolute;
            left: 0;
            right: 0;
            transition: transform 0.4s ease;
            width: 100%;
            height: 100%;
          }
          
          /* Main card styling */
          .tour-card {
            position: absolute;
            width: 280px;
            height: 360px;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.4s ease;
            transform-origin: center center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border: 2px solid transparent;
            background-color: white;
          }
          
          /* Center card */
          .tour-card.center {
            left: 50%;
            transform: translateX(-50%) scale(1);
            opacity: 1;
            z-index: 3;
          }
          
          /* Left card */
          .tour-card.left {
            left: 50%;
            transform: translateX(calc(-50% - 200px)) scale(0.8);
            opacity: 0.6;
            z-index: 1;
          }
          
          /* Right card */
          .tour-card.right {
            left: 50%;
            transform: translateX(calc(-50% + 200px)) scale(0.8);
            opacity: 0.6;
            z-index: 1;
          }
          
          /* Hide cards that are outside visible range */
          .tour-card.off-left {
            left: 50%;
            transform: translateX(calc(-50% - 400px)) scale(0.6);
            opacity: 0;
            z-index: 0;
          }
          
          .tour-card.off-right {
            left: 50%;
            transform: translateX(calc(-50% + 400px)) scale(0.6);
            opacity: 0;
            z-index: 0;
          }
          
          .tour-card.selected {
            border: 2px solid ${primaryColor};
          }
          
          .tour-image-container {
            width: 100%;
            height: 200px; /* Height for image */
            overflow: hidden;
            position: relative;
          }
          
          .tour-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .tour-info {
            padding: 12px 15px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .tour-info h4 {
            margin: 0 0 8px;
            font-size: 18px;
            color: #333;
          }
          
          .tour-description {
            font-size: 14px;
            color: #555;
            margin-bottom: 16px;
            flex: 1;
          }
          
          .select-tour-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: ${primaryColor};
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .select-tour-btn:hover {
            background-color: ${secondaryColor};
          }
          
          /* Carousel Arrows - with show/hide logic */
          .carousel-arrow {
            position: absolute;
            top: 40%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            background-color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .carousel-arrow:hover {
            background-color: #f5f5f5;
            box-shadow: 0 4px 8px rgba(0,0,0,0.25);
            transform: translateY(-50%) scale(1.1);
          }
          
          .carousel-arrow.prev {
            left: 5px;
          }
          
          .carousel-arrow.next {
            right: 5px;
          }
          
          .carousel-arrow.hidden {
            display: none;
          }
          
          .carousel-arrow svg {
            width: 24px;
            height: 24px;
            fill: #555;
          }
          
          /* Carousel indicators */
          .carousel-indicators {
            display: flex;
            justify-content: center;
            margin-top: 15px;
          }
          
          .carousel-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #ddd;
            margin: 0 4px;
            transition: all 0.2s;
            cursor: pointer;
          }
          
          .carousel-indicator.active {
            background-color: ${primaryColor};
            transform: scale(1.2);
          }
          
          /* Address Form */
          .address-form {
            margin-top: 10px;
            width: 100%;
          }
          
          .form-group {
            margin-bottom: 16px;
            width: 100%;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            font-size: 14px;
          }
          
          .form-control {
            width: 100%;
            padding: 12px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 15px;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }
          
          .form-control:focus {
            outline: none;
            border-color: ${primaryColor};
          }
          
          /* Material Icons Styling */
          .material-symbols-outlined {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
            vertical-align: middle;
            margin-right: 8px;
          }
          
          /* Transport Mode Icon Display */
          .transport-mode-container {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            justify-content: center;
            gap: 12px;
          }
          
          .transport-mode-icon {
            background-color: ${primaryColor};
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .transport-mode-icon img {
            width: 20px;
            height: 20px;
            display: block;
            filter: brightness(0) invert(1); /* Make SVG white */
          }
          
          /* Improve the transportation mode select styling */
          #transport-mode {
            min-width: 150px;
            height: 36px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 0 12px;
            font-size: 15px;
            background-color: white;
            cursor: pointer;
          }
  
          /* Fix for autocomplete dropdown */
          .pac-container {
            z-index: 10000 !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            border: 1px solid #eaeaea;
            margin-top: 4px;
            font-family: 'Inter', sans-serif;
          }
          
          .pac-item {
            padding: 8px 10px;
            cursor: pointer;
            font-family: 'Inter', sans-serif !important;
          }
          
          .pac-item:hover {
            background-color: #f5f5f5;
          }
          
          .pac-icon {
            margin-right: 8px;
          }
          
          .pac-item-query {
            font-size: 14px;
            font-weight: 500;
          }
          
          /* Loading Animation */
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            width: 100%;
          }
          
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(88, 124, 116, 0.2);
            border-radius: 50%;
            border-top: 5px solid ${primaryColor};
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-text {
            font-size: 18px;
            font-weight: 500;
            margin-top: 15px;
          }
          
          .route-map-container, .map-container {
            margin-top: 10px;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid ${primaryColor};
            width: 100%;
            position: relative;
            aspect-ratio: 4/3; /* Maintain aspect ratio */
          }
          
          .map-container iframe, .route-map-container iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          
          .confirmation-text {
            margin: 15px 0;
            text-align: center;
            font-weight: 500;
            width: 100%;
          }
          
          /* Pickup Card */
          .pickup-card {
            border-radius: 12px;
            overflow: hidden;
            margin-top: 15px;
            box-shadow: 0 2px 4px rgba(88, 124, 116, 0.2);
            border: 2px solid ${primaryColor};
            width: 100%;
            box-sizing: border-box;
          }
          
          .pickup-image {
            width: 100%;
            height: 180px; /* Fixed height for pickup images */
            object-fit: cover;
          }
          
          .pickup-info {
            padding: 15px;
          }
          
          .pickup-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: ${primaryColor};
          }
          
          .pickup-address {
            font-size: 15px;
            margin-bottom: 10px;
          }
          
          .pickup-instructions {
            font-size: 14px;
            color: #555;
            border-left: 3px solid ${primaryColor};
            padding-left: 10px;
            margin-top: 10px;
          }
          
          /* Route Details */
          .route-details {
            margin-top: 15px;
            padding: 12px;
            background-color: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
            border-left: 3px solid ${primaryColor};
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 70px; /* Add more space before the bottom buttons */
          }
          
          .route-details p {
            margin: 5px 0;
          }
          
          .route-details .walk-time {
            font-weight: 600;
            color: ${primaryColor};
          }
          
          /* Buttons */
          .btn-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            position: absolute;
            bottom: 15px;
            left: 0;
            padding: 0 20px;
            z-index: 10; /* Ensure buttons appear above other elements */
          }
          
          .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            font-size: 15px;
            transition: all 0.2s ease;
            min-width: 100px;
            margin-top: 15px;
          }
          
          .btn-primary {
            background-color: ${primaryColor};
            color: white;
          }
          
          .btn-primary:hover {
            background-color: ${secondaryColor};
          }
          
          .btn-secondary {
            background-color: #f1f3f5;
            color: #495057;
          }
          
          .btn-secondary:hover {
            background-color: #e9ecef;
          }
          
          .btn-route {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            background-color: ${primaryColor};
            color: white;
            margin-top: 15px;
            margin-bottom: 60px; /* Add space below the Show Route button to avoid collision with bottom buttons */
          }
          
          .btn-route:hover {
            background-color: ${secondaryColor};
          }
  
          /* Map fallback */
          .map-fallback {
            display: none;
            padding: 20px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 8px;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
          }
          
          /* Make all steps have consistent width */
          h3, p, form, div.progress-container,
          div.pickup-card, div.route-details, button.btn-route,
          div.map-container, div.route-map-container, div.map-fallback {
            width: 100%;
            max-width: 420px; /* slightly smaller than the container to ensure padding doesn't cause overflow */
          }
          
          /* Fix overflow issues with internal content */
          img, iframe {
            max-width: 100%;
            border: 0;
          }
  
          /* Custom styles for the combined accommodation-map step */
          .map-section {
            margin-top: 0;
            width: 100%;
            margin-bottom: 70px; /* Add more space for the buttons */
          }
  
          .map-confirmation-text {
            margin-top: 10px;
            margin-bottom: 5px;
            font-size: 14px;
            text-align: center;
          }
          
          /* Adjust the address form spacing */
          .address-form {
            margin-top: 5px;
            margin-bottom: 15px;
            width: 100%;
          }
  
          /* Search input with button inside */
          .search-input-container {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .search-input {
            padding-right: 100px; /* Make room for the search button */
          }
          
          .search-btn {
            position: absolute;
            right: 4px;
            height: calc(100% - 8px);
            background-color: ${primaryColor};
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 0 12px;
          }
          
          .search-btn:hover {
            background-color: ${secondaryColor};
          }
          
          .search-btn svg {
            width: 16px;
            height: 16px;
          }
          
          /* Spinner container styling */
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            border-radius: 12px;
          }
        </style>
        
        <div class="directions-workflow-container">
          <div class="workflow-header">
            <h2>${workflowTitle}</h2>
          </div>
          
          <div class="workflow-content">
            <!-- Step 1: Tour Selection with Carousel -->
            <div class="workflow-step active" id="step-tour">
              <h3>Select Your Tour</h3>
              <p>Please select the tour you'll be joining:</p>
              
              <div class="progress-container">
                <div class="progress-steps">
                  <div class="workflow-step-indicator active completed">1</div>
                  <div class="workflow-step-indicator">2</div>
                  <div class="workflow-step-indicator">3</div>
                </div>
              </div>
              
              <!-- Carousel with smooth sliding transitions -->
              <div class="tour-carousel-container">
                <!-- Left arrow -->
                <div class="carousel-arrow prev hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </div>
                
                <!-- Carousel track with cards -->
                <div class="carousel-track" id="carousel-track">
                  <!-- Cards will be dynamically generated here -->
                </div>
                
                <!-- Right arrow -->
                <div class="carousel-arrow next">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Indicators -->
              <div class="carousel-indicators" id="carousel-indicators">
                ${toursData.map((_, index) => `
                  <div class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                `).join('')}
              </div>
              
              <div class="btn-container">
                <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
                <button class="btn btn-primary" id="next-btn">Next</button>
              </div>
            </div>
            
            <!-- COMBINED STEP: Address Input + Location Confirmation -->
            <div class="workflow-step" id="step-address-confirm">
              <h3>Enter Your Accommodation</h3>
              
              <div class="progress-container">
                <div class="progress-steps">
                  <div class="workflow-step-indicator completed">1</div>
                  <div class="workflow-step-indicator active completed">2</div>
                  <div class="workflow-step-indicator">3</div>
                </div>
              </div>
              
              <form class="address-form" id="address-form">
                <div class="form-group search-input-container">
                  <input type="text" id="accommodation-input" class="form-control search-input" placeholder="Hotel name or full address" required>
                  <button type="button" class="search-btn" id="update-map-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Search
                  </button>
                </div>
              </form>
              
              <!-- Map Section -->
              <div class="map-section">
                <div class="map-container" id="location-map">
                  <!-- Default map of Honolulu will be inserted here -->
                </div>
                <div class="map-fallback" id="location-map-fallback">
                  <p>Unable to display map.</p>
                  <p id="fallback-address"></p>
                </div>
                
                <p class="map-confirmation-text">Is this the correct location?</p>
              </div>
              
              <div class="btn-container">
                <button class="btn btn-secondary" id="back-to-tour-btn">Back</button>
                <button class="btn btn-primary" id="find-pickup-btn">Yes, Continue</button>
              </div>
            </div>
            
            <!-- Step 3: Finding Pickup Animation -->
            <div class="workflow-step" id="step-finding-pickup">
              <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">Finding nearest pickup point...</div>
              </div>
            </div>
            
            <!-- Step 4: Pickup Point Info -->
            <div class="workflow-step" id="step-pickup-info">
              <h3>Your Pickup Location</h3>
              
              <div class="progress-container">
                <div class="progress-steps">
                  <div class="workflow-step-indicator completed">1</div>
                  <div class="workflow-step-indicator completed">2</div>
                  <div class="workflow-step-indicator active completed">3</div>
                </div>
              </div>
              
              <div class="pickup-card">
                <img id="pickup-image" src="" alt="Pickup point image" class="pickup-image">
                <div class="pickup-info">
                  <h3 class="pickup-title" id="pickup-title">Loading pickup location...</h3>
                  <p class="pickup-address" id="pickup-address"></p>
                  <div class="pickup-instructions" id="pickup-instructions">
                    <p id="pickup-time"></p>
                    <p id="pickup-details"></p>
                  </div>
                </div>
              </div>
              
              <button class="btn btn-route" id="show-route-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Show Route
              </button>
              
              <div class="btn-container">
                <button class="btn btn-secondary" id="back-to-confirm-btn">Back</button>
                <button class="btn btn-primary" id="done-btn">Done</button>
              </div>
            </div>
            
            <!-- Step 5: Route Map with Transportation Mode Selection -->
            <div class="workflow-step" id="step-route">
              <h3>Getting to Your Pickup Point</h3>
              
              <div class="transport-mode-container">
                <div class="transport-mode-icon" id="transport-mode-icon">
                  <img src="https://yannicksegaar.github.io/VF-extensions/GetDirectionsDemo_svgs/Material%20Icons%20Directions%20Walk.svg" alt="Walking" id="transport-mode-img">
                </div>
                <div style="flex: 1; max-width: 200px;">
                  <select id="transport-mode" class="form-control">
                    <option value="walking" selected>Walking</option>
                    <option value="bicycling">Bicycling</option>
                    <option value="driving">Driving</option>
                    <option value="transit">Public Transit</option>
                  </select>
                </div>
              </div>
              
              <div class="route-map-container" id="route-map">
                <!-- Route map will be inserted here -->
              </div>
              <div class="map-fallback" id="route-map-fallback">
                <p>Unable to display route map.</p>
                <div id="fallback-route-details"></div>
              </div>
              
              <div class="route-details">
                <p><strong>From:</strong> <span id="route-from">Your accommodation</span></p>
                <p><strong>To:</strong> <span id="route-to">Duke Paoa Kahanamoku Statue, Waikiki Beach</span></p>
                <!-- Removed redundant travel time text as it's visible in the map -->
              </div>
              
              <div class="btn-container">
                <button class="btn btn-secondary" id="back-to-pickup-btn">Back</button>
                <button class="btn btn-primary" id="route-done-btn">Done</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add the wrapper to the container
      container.appendChild(wrapper);
      element.appendChild(container);
  
      // Make sure the wrapper becomes visible and scroll is enabled
      if (animateIn) {
        setTimeout(() => {
          wrapper.style.opacity = '1';
          wrapper.style.transform = 'translateY(0)';
        }, 100);
      }
  
      // Initialize workflow with scoped variables
      const workflowData = {
        selectedTour: "",
        selectedTourName: "",
        userLocation: {
          address: "",
          placeId: "", 
          lat: 0,
          lng: 0
        },
        nearestPickup: FIXED_PICKUP, // Always use the fixed pickup location
        apiKey: apiKey,
        currentCarouselIndex: 0, // Track current carousel position
        mapInitialized: false
      };
  
      // Function to create and position carousel cards
      function createCarouselCards() {
        const carouselTrack = wrapper.querySelector('#carousel-track');
        if (!carouselTrack) return;
        
        // Clear existing content
        carouselTrack.innerHTML = '';
        
        // Create all tour cards with proper positioning classes
        toursData.forEach((tour, index) => {
          const card = document.createElement('div');
          
          // Determine position class based on index relative to current index
          let positionClass = '';
          if (index === workflowData.currentCarouselIndex) {
            positionClass = 'center';
          } else if (index === workflowData.currentCarouselIndex - 1) {
            positionClass = 'left';
          } else if (index === workflowData.currentCarouselIndex + 1) {
            positionClass = 'right';
          } else if (index < workflowData.currentCarouselIndex) {
            positionClass = 'off-left';
          } else {
            positionClass = 'off-right';
          }
          
          card.className = `tour-card ${positionClass}`;
          card.dataset.tourId = tour.id;
          card.dataset.tourName = tour.name;
          card.dataset.index = index;
          
          // Add selected class if this is the selected tour
          if (tour.id === workflowData.selectedTour) {
            card.classList.add('selected');
          }
          
          card.innerHTML = `
            <div class="tour-image-container">
              <img src="${tour.image}" alt="${tour.name}" class="tour-image">
            </div>
            <div class="tour-info">
              <h4>${tour.name}</h4>
              <div class="tour-description">${tour.description}</div>
              <button class="select-tour-btn" data-tour-id="${tour.id}" data-tour-name="${tour.name}">Select This Tour</button>
            </div>
          `;
          
          carouselTrack.appendChild(card);
        });
        
        // Add event listeners to all select buttons
        const selectButtons = carouselTrack.querySelectorAll('.select-tour-btn');
        selectButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            const tourId = e.target.dataset.tourId;
            const tourName = e.target.dataset.tourName;
            
            // Clear previous selections
            const cards = carouselTrack.querySelectorAll('.tour-card');
            cards.forEach(card => card.classList.remove('selected'));
            
            // Mark the parent card as selected
            const parentCard = e.target.closest('.tour-card');
            if (parentCard) {
              parentCard.classList.add('selected');
              workflowData.selectedTour = tourId;
              workflowData.selectedTourName = tourName;
            }
          });
        });
      }
  
      // Function to update carousel display
      function updateCarousel() {
        // Update card positions based on current index
        const cards = wrapper.querySelectorAll('.tour-card');
        
        cards.forEach((card, index) => {
          // Remove all position classes
          card.classList.remove('center', 'left', 'right', 'off-left', 'off-right');
          
          // Add appropriate position class
          if (index === workflowData.currentCarouselIndex) {
            card.classList.add('center');
          } else if (index === workflowData.currentCarouselIndex - 1) {
            card.classList.add('left');
          } else if (index === workflowData.currentCarouselIndex + 1) {
            card.classList.add('right');
          } else if (index < workflowData.currentCarouselIndex) {
            card.classList.add('off-left');
          } else {
            card.classList.add('off-right');
          }
        });
        
        // Update indicators
        const indicators = wrapper.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === workflowData.currentCarouselIndex);
        });
        
        // Update arrow visibility
        const prevArrow = wrapper.querySelector('.carousel-arrow.prev');
        const nextArrow = wrapper.querySelector('.carousel-arrow.next');
        
        if (prevArrow) {
          prevArrow.classList.toggle('hidden', workflowData.currentCarouselIndex === 0);
        }
        
        if (nextArrow) {
          nextArrow.classList.toggle('hidden', workflowData.currentCarouselIndex === toursData.length - 1);
        }
      }
  
      // Function to update the transport mode icon
      function updateTransportModeIcon(mode) {
        const iconImg = wrapper.querySelector('#transport-mode-img');
        if (!iconImg) return;
        
        // SVG paths from the repository
        const iconPaths = {
          walking: 'https://yannicksegaar.github.io/VF-extensions/GetDirectionsDemo_svgs/Material%20Icons%20Directions%20Walk.svg',
          bicycling: 'https://yannicksegaar.github.io/VF-extensions/GetDirectionsDemo_svgs/Bike%20Directions%20Icon.svg',
          driving: 'https://yannicksegaar.github.io/VF-extensions/GetDirectionsDemo_svgs/Car%20Directions%20Icon.svg',
          transit: 'https://yannicksegaar.github.io/VF-extensions/GetDirectionsDemo_svgs/Bus%20Icon.svg'
        };
        
        // Set the appropriate icon based on the mode
        const iconPath = iconPaths[mode] || iconPaths.walking;
        iconImg.src = iconPath;
        iconImg.alt = mode.charAt(0).toUpperCase() + mode.slice(1);
      }
  
      // Function to display the default map of Honolulu
      function showDefaultMap() {
        const mapContainer = wrapper.querySelector('#location-map');
        const mapFallback = wrapper.querySelector('#location-map-fallback');
        
        if (mapContainer) {
          try {
            // Create an iframe with default Honolulu location
            const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${defaultLat},${defaultLng}&zoom=13&maptype=roadmap`;
            
            mapContainer.innerHTML = `
              <iframe
                width="100%"
                height="100%"
                frameborder="0"
                style="border:0"
                src="${mapUrl}"
                allowfullscreen
                onload="document.getElementById('location-map').style.display='block'; document.getElementById('location-map-fallback').style.display='none';"
                onerror="document.getElementById('location-map').style.display='none'; document.getElementById('location-map-fallback').style.display='block';"
              ></iframe>
            `;
            
            // Fallback in case iframe doesn't load
            if (mapFallback) {
              const fallbackAddressEl = mapFallback.querySelector('#fallback-address');
              if (fallbackAddressEl) {
                fallbackAddressEl.textContent = "Honolulu, Hawaii";
              }
            }
          } catch (error) {
            console.error('Error embedding default map:', error);
            if (mapContainer) mapContainer.style.display = 'none';
            if (mapFallback) mapFallback.style.display = 'block';
          }
        }
      }
  
      // Function to show loading state in the map
      function showMapLoadingState() {
        const mapContainer = wrapper.querySelector('#location-map');
        
        if (mapContainer) {
          // Check if loading overlay already exists
          let loadingOverlay = mapContainer.querySelector('.loading-overlay');
          
          if (!loadingOverlay) {
            // Create loading overlay
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
              <div class="loading-spinner"></div>
            `;
            
            // Add loading overlay to the map container
            mapContainer.appendChild(loadingOverlay);
          } else {
            // Show existing loading overlay
            loadingOverlay.style.display = 'flex';
          }
        }
      }
  
      // Function to hide loading state in the map
      function hideMapLoadingState() {
        const mapContainer = wrapper.querySelector('#location-map');
        
        if (mapContainer) {
          const loadingOverlay = mapContainer.querySelector('.loading-overlay');
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }
        }
      }
  
      // Function to update the map with a selected place
      function updateMapForLocation(place) {
        if (!place || !place.geometry) {
          console.error('Invalid place object for map update');
          return;
        }
  
        // Format and save location data
        const locationData = {
          address: place.formatted_address || place.name,
          placeId: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        workflowData.userLocation = locationData;
        
        // Create and embed the map using place ID
        const mapContainer = wrapper.querySelector('#location-map');
        const mapFallback = wrapper.querySelector('#location-map-fallback');
        
        if (mapContainer) {
          try {
            // Use place ID for more accurate mapping
            const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${locationData.placeId}&zoom=17&maptype=roadmap`;
            
            // First create iframe element
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.frameBorder = '0';
            iframe.style.border = '0';
            iframe.src = mapUrl;
            iframe.allowFullscreen = true;
            
            // Add onload event to hide loading state when map is loaded
            iframe.onload = function() {
              hideMapLoadingState();
              mapContainer.style.display = 'block';
              if (mapFallback) mapFallback.style.display = 'none';
            };
            
            // Add onerror event
            iframe.onerror = function() {
              hideMapLoadingState();
              mapContainer.style.display = 'none';
              if (mapFallback) mapFallback.style.display = 'block';
            };
            
            // Clear the container but keep any loading overlay
            const loadingOverlay = mapContainer.querySelector('.loading-overlay');
            mapContainer.innerHTML = '';
            
            // Add iframe
            mapContainer.appendChild(iframe);
            
            // Re-add loading overlay if it existed
            if (loadingOverlay) {
              mapContainer.appendChild(loadingOverlay);
            }
            
            // Fallback in case iframe doesn't load
            if (mapFallback) {
              const fallbackAddressEl = mapFallback.querySelector('#fallback-address');
              if (fallbackAddressEl) {
                fallbackAddressEl.textContent = locationData.address;
              }
            }
          } catch (error) {
            console.error('Error embedding map:', error);
            hideMapLoadingState();
            if (mapContainer) mapContainer.style.display = 'none';
            if (mapFallback) mapFallback.style.display = 'block';
          }
        }
  
        // Set workflowData.mapInitialized to true once we've successfully updated the map
        workflowData.mapInitialized = true;
      }
      
      // Add event listeners and initialize carousel
      function setupEventListeners() {
        // Create initial carousel cards
        createCarouselCards();
        
        // Get carousel navigation elements
        const prevArrow = wrapper.querySelector('.carousel-arrow.prev');
        const nextArrow = wrapper.querySelector('.carousel-arrow.next');
        const indicators = wrapper.querySelectorAll('.carousel-indicator');
        
        // Previous slide
        if (prevArrow) {
          prevArrow.addEventListener('click', () => {
            if (workflowData.currentCarouselIndex > 0) {
              workflowData.currentCarouselIndex--;
              updateCarousel();
            }
          });
        }
        
        // Next slide
        if (nextArrow) {
          nextArrow.addEventListener('click', () => {
            if (workflowData.currentCarouselIndex < toursData.length - 1) {
              workflowData.currentCarouselIndex++;
              updateCarousel();
            }
          });
        }
        
        // Indicator clicks
        indicators.forEach((indicator) => {
          indicator.addEventListener('click', () => {
            workflowData.currentCarouselIndex = parseInt(indicator.dataset.index);
            updateCarousel();
          });
        });
        
        // Get all other DOM elements we need
        const nextBtn = wrapper.querySelector('#next-btn');
        const cancelBtn = wrapper.querySelector('#cancel-btn');
        const backToTourBtn = wrapper.querySelector('#back-to-tour-btn');
        const findPickupBtn = wrapper.querySelector('#find-pickup-btn');
        const backToConfirmBtn = wrapper.querySelector('#back-to-confirm-btn');
        const doneBtn = wrapper.querySelector('#done-btn');
        const showRouteBtn = wrapper.querySelector('#show-route-btn');
        const backToPickupBtn = wrapper.querySelector('#back-to-pickup-btn');
        const routeDoneBtn = wrapper.querySelector('#route-done-btn');
        const updateMapBtn = wrapper.querySelector('#update-map-btn');
        const accommodationInput = wrapper.querySelector('#accommodation-input');
  
        // Button event listeners
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (workflowData.selectedTour) {
              goToStep('step-address-confirm');
              setTimeout(() => {
                setupAutocomplete();
                
                // Show default map if not already initialized
                if (!workflowData.mapInitialized) {
                  showDefaultMap();
                }
              }, 500);
            } else {
              alert('Please select a tour first.');
            }
          });
        }
  
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            cancelWorkflow();
          });
        }
  
        if (backToTourBtn) {
          backToTourBtn.addEventListener('click', () => {
            goToStep('step-tour');
          });
        }
  
        // Update map button click
        if (updateMapBtn) {
          updateMapBtn.addEventListener('click', () => {
            const accommodationValue = accommodationInput ? accommodationInput.value : '';
            if (accommodationValue) {
              // Show loading state in the map container
              showMapLoadingState();
              
              // Start geocoding
              geocodeAddress(accommodationValue);
            } else {
              alert('Please enter your accommodation name or address');
            }
          });
        }
  
        // Enter key in accommodation input
        if (accommodationInput) {
          accommodationInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission
              updateMapBtn.click(); // Trigger the update map function
            }
          });
        }
  
        if (findPickupBtn) {
          findPickupBtn.addEventListener('click', () => {
            if (workflowData.mapInitialized) {
              findPickupPoint();
            } else {
              alert('Please enter and search for your accommodation first.');
            }
          });
        }
  
        if (backToConfirmBtn) {
          backToConfirmBtn.addEventListener('click', () => {
            goToStep('step-address-confirm');
          });
        }
  
        if (doneBtn) {
          doneBtn.addEventListener('click', () => {
            completeWorkflow();
          });
        }
  
        if (showRouteBtn) {
          showRouteBtn.addEventListener('click', () => {
            showRouteMap();
          });
        }
  
        if (backToPickupBtn) {
          backToPickupBtn.addEventListener('click', () => {
            goToStep('step-pickup-info');
          });
        }
  
        if (routeDoneBtn) {
          routeDoneBtn.addEventListener('click', () => {
            completeWorkflow();
          });
        }
      }
  
      // Helper function to navigate between steps
      function goToStep(stepId) {
        console.log('Navigating to step:', stepId);
        const steps = wrapper.querySelectorAll('.workflow-step');
        steps.forEach(step => {
          step.classList.remove('active');
        });
        const targetStep = wrapper.querySelector(`#${stepId}`);
        if (targetStep) {
          targetStep.classList.add('active');
          
          // Re-initialize autocomplete if we're going to the address step
          if (stepId === 'step-address-confirm') {
            console.log('Re-initializing autocomplete on step change to address-confirm');
            // Wait a moment for the DOM to update
            setTimeout(() => {
              setupAutocomplete();
              
              // Show default map if not already initialized
              if (!workflowData.mapInitialized) {
                showDefaultMap();
              }
            }, 300);
          }
        } else {
          console.error('Target step not found:', stepId);
        }
      }
  
      // Geocode an address using the Geocoding API
      function geocodeAddress(address) {
        const city = 'Honolulu'; // Always use Honolulu as the city
        const fullAddress = address.includes('Honolulu') ? address : `${address}, ${city}, Hawaii`;
        
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
        
        fetch(geocodingUrl)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'OK' && data.results && data.results.length > 0) {
              const result = data.results[0];
              
              // Create a mock place object that matches the Google Places structure
              const mockPlace = {
                formatted_address: result.formatted_address,
                place_id: result.place_id,
                name: result.formatted_address.split(',')[0],
                geometry: {
                  location: {
                    lat: () => result.geometry.location.lat,
                    lng: () => result.geometry.location.lng
                  }
                }
              };
              
              // Update the map with this place
              updateMapForLocation(mockPlace);
            } else {
              console.error('Geocoding API error or no results:', data.status);
              alert('Unable to find the location. Please try again with more specific address details.');
              
              // Hide loading state
              hideMapLoadingState();
              
              // Show error in map container
              const mapContainer = wrapper.querySelector('#location-map');
              if (mapContainer) {
                mapContainer.innerHTML = `
                  <div style="padding: 20px; text-align: center;">
                    <p>Unable to find the location.</p>
                    <p>Please try again with more specific address details.</p>
                  </div>
                `;
              }
            }
          })
          .catch(error => {
            console.error('Error using Geocoding API:', error);
            alert('Unable to find the location. Please check your internet connection and try again.');
            
            // Hide loading state
            hideMapLoadingState();
          });
      }
  
      // Haversine formula to calculate distance between coordinates
      function calculateDistance(lat1, lon1, lat2, lon2) {
        function toRadians(degrees) {
          return degrees * (Math.PI / 180);
        }
  
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
      }
  
      // Function to find the nearest pickup point - now always returns the fixed pickup
      function findPickupPoint() {
        goToStep('step-finding-pickup');
  
        setTimeout(() => {
          // Always use the fixed pickup location
          workflowData.nearestPickup = FIXED_PICKUP;
  
          // Update the pickup info
          const pickupImage = wrapper.querySelector('#pickup-image');
          const pickupTitle = wrapper.querySelector('#pickup-title');
          const pickupAddress = wrapper.querySelector('#pickup-address');
          const pickupTime = wrapper.querySelector('#pickup-time');
          const pickupDetails = wrapper.querySelector('#pickup-details');
  
          if (pickupImage) pickupImage.src = workflowData.nearestPickup.image;
          if (pickupTitle) pickupTitle.textContent = workflowData.nearestPickup.name;
          if (pickupAddress) pickupAddress.textContent = `Pickup address for ${workflowData.selectedTourName}`;
          if (pickupTime) pickupTime.innerHTML = `<strong>Pickup time:</strong> ${workflowData.nearestPickup.time}`;
          if (pickupDetails) pickupDetails.textContent = workflowData.nearestPickup.instructions;
  
          // Move to the pickup info step
          goToStep('step-pickup-info');
        }, 2000);
      }
  
      // Function to show the route map with transportation mode
      function showRouteMap() {
        // Get selected transportation mode
        const transportModeSelect = wrapper.querySelector('#transport-mode');
        const mode = transportModeSelect ? transportModeSelect.value : 'walking';
        
        // Format the origin and destination coordinates
        const origin = `${workflowData.userLocation.lat},${workflowData.userLocation.lng}`;
        const destination = `${workflowData.nearestPickup.lat},${workflowData.nearestPickup.lon}`;
        
        // Get the route map container
        const routeMapContainer = wrapper.querySelector('#route-map');
        const routeMapFallback = wrapper.querySelector('#route-map-fallback');
        
        if (routeMapContainer) {
          try {
            // Create an iframe with directions using the selected mode
            const directionsUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&mode=${mode}`;
            
            // First, add the loading overlay if not already present
            let loadingOverlay = routeMapContainer.querySelector('.loading-overlay');
            if (!loadingOverlay) {
              loadingOverlay = document.createElement('div');
              loadingOverlay.className = 'loading-overlay';
              loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div style="margin-top: 15px; font-weight: 500;">Loading route...</div>
              `;
              routeMapContainer.appendChild(loadingOverlay);
            } else {
              loadingOverlay.style.display = 'flex';
            }
            
            // Clear existing content except loading overlay
            const existingIframe = routeMapContainer.querySelector('iframe');
            if (existingIframe) {
              routeMapContainer.removeChild(existingIframe);
            }
            
            // Create iframe with a direct embed
            routeMapContainer.innerHTML = `
              <iframe
                width="100%"
                height="100%"
                frameborder="0"
                style="border:0"
                src="${directionsUrl}"
                allowfullscreen
                onload="
                  var overlay = this.parentNode.querySelector('.loading-overlay');
                  if (overlay) overlay.style.display = 'none';
                  this.style.display = 'block';
                "
                onerror="
                  this.style.display = 'none';
                  document.getElementById('route-map-fallback').style.display = 'block';
                "
              ></iframe>
            `;
            
            // Re-add loading overlay on top of iframe
            if (loadingOverlay) {
              routeMapContainer.appendChild(loadingOverlay);
            }
            
            // Make container visible
            routeMapContainer.style.display = 'block';
            
            // Fallback in case iframe doesn't load
            if (routeMapFallback) {
              const fallbackRouteDetails = routeMapFallback.querySelector('#fallback-route-details');
              if (fallbackRouteDetails) {
                fallbackRouteDetails.innerHTML = `
                  <p>${mode.charAt(0).toUpperCase() + mode.slice(1)} route from ${workflowData.userLocation.address} to ${workflowData.nearestPickup.name}.</p>
                `;
              }
            }
          } catch (error) {
            console.error('Error embedding route map:', error);
            if (routeMapContainer) routeMapContainer.style.display = 'none';
            if (routeMapFallback) routeMapFallback.style.display = 'block';
          }
        }
  
        // Update route details
        const routeFrom = wrapper.querySelector('#route-from');
        const routeTo = wrapper.querySelector('#route-to');
  
        if (routeFrom) routeFrom.textContent = workflowData.userLocation.address;
        if (routeTo) routeTo.textContent = workflowData.nearestPickup.name;
  
        // Calculate travel time based on mode
        const distance = calculateDistance(
          workflowData.userLocation.lat,
          workflowData.userLocation.lng,
          workflowData.nearestPickup.lat,
          workflowData.nearestPickup.lon
        );
        
        // Go to the route step
        goToStep('step-route');
        
        // Set up the transport mode icon update functionality
        const transportModeElement = wrapper.querySelector('#transport-mode');
        const transportModeIcon = wrapper.querySelector('#transport-mode-icon');
        
        if (transportModeElement && transportModeIcon && !transportModeElement.dataset.listenerAdded) {
          // Update icon when mode changes
          transportModeElement.addEventListener('change', function() {
            // Update the icon based on selected mode
            updateTransportModeIcon(this.value);
            // Refresh the route with the new mode
            showRouteMap();
          });
          transportModeElement.dataset.listenerAdded = 'true';
        }
      }
  
      // Function to handle workflow cancellation
      function cancelWorkflow() {
        // Signal to Voiceflow that the workflow is cancelled
        if (window.voiceflow && window.voiceflow.chat) {
          window.voiceflow.chat.interact({
            type: 'request',
            payload: {
              type: 'directions-cancel'
            }
          });
        }
      }
  
      // Function to handle workflow completion
      function completeWorkflow() {
        // Prepare data to send back to Voiceflow
        const completionData = {
          selectedTour: workflowData.selectedTourName,
          userAddress: workflowData.userLocation.address,
          pickupPoint: workflowData.nearestPickup.name,
          pickupTime: workflowData.nearestPickup.time,
          pickupInstructions: workflowData.nearestPickup.instructions,
          userLat: workflowData.userLocation.lat,
          userLon: workflowData.userLocation.lng,
          pickupLat: workflowData.nearestPickup.lat,
          pickupLon: workflowData.nearestPickup.lon
        };
  
        // Signal to Voiceflow that the workflow is complete with the collected data
        if (window.voiceflow && window.voiceflow.chat) {
          window.voiceflow.chat.interact({
            type: 'request',
            payload: {
              type: 'directions-complete',
              data: completionData
            }
          });
        }
      }
  
      // Setup event listeners immediately before API loading
      setupEventListeners();
  
      // Initialize the workflow with robust handling
      loadGoogleMapsScript()
        .then(() => {
          console.log('Google Maps API loaded successfully');
          setupAutocomplete();
        })
        .catch(error => {
          console.error('Failed to load Google Maps API:', error);
          // Add direct script tag as a desperate fallback (no callback)
          console.log('Adding direct script tag as fallback after API load failure');
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
          script.onload = () => {
            console.log('Fallback Google Maps API loaded');
            setTimeout(() => {
              setupAutocomplete();
            }, 500);
          };
          document.head.appendChild(script);
        });
    },
  };