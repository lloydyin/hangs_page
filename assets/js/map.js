const map = L.map('map', {
  worldCopyJump: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function fitMapToPhotoData(photoData) {
  const points = photoData
    .filter(photo => Number.isFinite(photo.lat) && Number.isFinite(photo.lng))
    .map(photo => [photo.lat, photo.lng]);

  if (!points.length) {
    map.setView([35, 65], 3);
    return;
  }

  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, {
    padding: [36, 36],
    maxZoom: 3
  });
}

fetch('images/coordinates_photos/coordinates_photos.json')
  .then(response => response.json())
  .then(photoData => {
    photoData.forEach(photo => {
      const popupContent = `
        <div>
          <div style="text-align: center">
            <strong>${photo.place}</strong><br>
          </div>
          <img src="${photo.file}" class="popup-img">
          <div style="text-align: right">
            <strong>${photo.date}</strong><br>
          </div>
        </div>
      `;
      L.marker([photo.lat, photo.lng]).addTo(map).bindPopup(popupContent);
    });
    setTimeout(() => {
      map.invalidateSize();
      fitMapToPhotoData(photoData);
    }, 100);
  })
  .catch(error => {
    console.error('Error loading photo data:', error);
    map.setView([35, 65], 3);
  });
