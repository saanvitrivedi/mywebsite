const events = [];
let editingEventIndex = null;


// Show the correct location field based on event modality
function updateLocationOptions() {
    const modality = document.getElementById("event_modality").value;

    const locationContainer = document.getElementById("location_container");
    const remoteUrlContainer = document.getElementById("remote_url_container");

    const locationInput = document.getElementById("event_location");
    const remoteUrlInput = document.getElementById("event_remote_url");

    if (modality === "in-person") {
        locationContainer.style.display = "block";
        remoteUrlContainer.style.display = "none";

        locationInput.required = true;
        remoteUrlInput.required = false;
    } else if (modality === "remote") {
        locationContainer.style.display = "none";
        remoteUrlContainer.style.display = "block";

        locationInput.required = false;
        remoteUrlInput.required = true;
    }
}


// Start creating a new event
function startCreateEvent() {
    editingEventIndex = null;

    const form = document.getElementById("event_form");
    form.reset();

    updateLocationOptions();
}


// Save a new event or update an existing event
function saveEvent() {
    const form = document.getElementById("event_form");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const name = document.getElementById("event_name").value;
    const weekday = document.getElementById("event_weekday").value;
    const time = document.getElementById("event_time").value;
    const modality = document.getElementById("event_modality").value;
    const location = document.getElementById("event_location").value;
    const remoteUrl = document.getElementById("event_remote_url").value;
    const attendees = document.getElementById("event_attendees").value;
    const category = document.getElementById("event_category").value;

    const eventDetails = {
        name: name,
        weekday: weekday,
        time: time,
        modality: modality,
        location: modality === "in-person" ? location : null,
        remote_url: modality === "remote" ? remoteUrl : null,
        attendees: attendees,
        category: category
    };


    // Creating a new event
    if (editingEventIndex === null) {
        events.push(eventDetails);
        addEventToCalendarUI(eventDetails);
    }


    // Updating an existing event
    else {
        const oldCard = document.querySelector(
            `.event[data-event-index="${editingEventIndex}"]`
        );

        // Update the event in the events array
        events[editingEventIndex] = eventDetails;

        // Remove the old card from the calendar
        oldCard.remove();

        // Add the updated card to the correct weekday
        addEventToCalendarUI(eventDetails);

        // Stop editing
        editingEventIndex = null;
    }

    console.log(events);

    // Reset the form
    form.reset();
    updateLocationOptions();

    // Close the modal
    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();
}


// Create the visual event card
function createEventCard(eventDetails, eventIndex) {
    const eventElement = document.createElement("div");

    // Base classes
    eventElement.className = "event row border rounded m-1 py-1";

    // Remember which event this card belongs to
    eventElement.setAttribute("data-event-index", eventIndex);

    // Color the card based on category
    if (eventDetails.category === "academic") {
        eventElement.classList.add("bg-primary", "text-white");
    } else if (eventDetails.category === "work") {
        eventElement.classList.add("bg-success", "text-white");
    } else if (eventDetails.category === "personal") {
        eventElement.classList.add("bg-warning", "text-dark");
    } else if (eventDetails.category === "social") {
        eventElement.classList.add("bg-info", "text-dark");
    }

    // Create the event content
    const eventContent = document.createElement("div");

    eventContent.innerHTML = `
        <strong>${eventDetails.name}</strong>
        <div>Time: ${eventDetails.time}</div>
        <div>Modality: ${eventDetails.modality}</div>
        <div>Category: ${eventDetails.category}</div>
        <div>${
            eventDetails.modality === "in-person"
                ? `Location: ${eventDetails.location}`
                : `URL: ${eventDetails.remote_url}`
        }</div>
        <div>Attendees: ${eventDetails.attendees}</div>
    `;

    eventElement.appendChild(eventContent);

    // Make the card clickable
    eventElement.style.cursor = "pointer";

    eventElement.addEventListener("click", function () {
        editEvent(eventDetails);
    });

    return eventElement;
}


// Add an event to the correct weekday column
function addEventToCalendarUI(eventInfo) {
    const eventIndex = events.indexOf(eventInfo);

    const eventCard = createEventCard(
        eventInfo,
        eventIndex
    );

    const dayColumn = document.getElementById(eventInfo.weekday);

    dayColumn.appendChild(eventCard);
}


// Open the modal with the existing event's information
function editEvent(eventDetails) {
    const index = events.indexOf(eventDetails);

    editingEventIndex = index;

    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_weekday").value = eventDetails.weekday;
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_modality").value = eventDetails.modality;
    document.getElementById("event_category").value = eventDetails.category;
    document.getElementById("event_attendees").value = eventDetails.attendees;

    // Fill in the appropriate location field
    if (eventDetails.modality === "in-person") {
        document.getElementById("event_location").value =
            eventDetails.location;
    } else {
        document.getElementById("event_remote_url").value =
            eventDetails.remote_url;
    }

    updateLocationOptions();

    // Change modal title to Update Event
    document.getElementById("eventModalLabel").textContent = "Update Event";

    // Open modal
    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}