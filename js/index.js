window.onload = () => {
    setOnClickListener();
}

var map;
var markers = [];
var infoWindow;
var locationSelect;


function initMap() {
    var LosAngeles = { 
        lat: 34.063380,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById("map"), {
        center: LosAngeles,
        zoom: 11,
        mapTypeId: "roadmap",
    });
    infoWindow = new google.maps.InfoWindow();
    // showStoresMarkers();
}

function searchStores() {
    var zipCode = document.getElementById("zip-code-input").value;
    var foundStores = [];
    if (zipCode) {
        for(var store of stores) {
            var postal = store["address"]["postalCode"].substring(0, 5);
            if(postal == zipCode) {
                foundStores.push(store);
            }
        }
    }
    else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(elem, index) {
        elem.addEventListener("click", function(){
            new google.maps.event.trigger(markers[index], "click");
        })
    });
}

function displayStores(stores) {
    var storesHtml = "";
    for(var [index, store] of stores.entries()) {
        var storeAddress = store['addressLines'];
        var storePhone = store['phoneNumber'];
        storesHtml += `
        <div class="store-container">
            <div class="store-info">
                <div class="store-address">
                    <span>${storeAddress[0]}</span>
                    <span>${storeAddress[1]}</span>
                </div>
                <div class="store-phone">
                    ${storePhone}
                </div>
            </div>
            <div class="store-number-container"> 
                <div class="store-number">
                    ${index+1}
                </div>
            </div>
        </div>
        `
        document.querySelector(".store-list").innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()) {
        var latlng = new google.maps.LatLng(
           store["coordinates"]["latitude"],
           store["coordinates"]["longitude"]
        );
        var name = store["name"];
        var address = store['addressLines'][0];
        var openStatusText = store["openStatusText"];
        var storePhone = store['phoneNumber'];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, storePhone, index+1)
    }
    map.fitBounds(bounds)
}

function createMarker(latlng, name, address, openStatusText, storePhone, index) {
    var html = `
                <div class="Store-info-widow">
                    <div class="Store-info-pop">
                        <div class="Store-info-name">${name}</div>
                        <div class="Store-info-address">${address}</div>
                        <hr>
                        <div class="Store-info-status">
                            <i class="fas fa-clock"></i>
                            ${openStatusText}
                        </div>
                        <div class="Store-info-phone">
                            <i class="fas fa-phone-square"></i>
                            ${storePhone}
                        </div>
                    </div>
                </div>    
                `
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}