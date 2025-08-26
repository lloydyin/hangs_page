const map = L.map('map').setView([18, 150], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('../images/coordinates_photos/coordinates_photos.json')
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
    }, 100);
  })
  .catch(error => console.error('Error loading photo data:', error));
