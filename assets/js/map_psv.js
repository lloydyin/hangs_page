import { Viewer } from '@photo-sphere-viewer/core';

const map = L.map('map').setView([20,150],1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
	attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);

const previewModal = document.getElementById('previewModal');
let viewer = null;

// 点击背景关闭模态框
previewModal.addEventListener('click', (e)=>{
	if(e.target === previewModal){
		previewModal.style.display='none';
		if(viewer){
			viewer.destroy();
			viewer = null;
		}
	}
});

fetch('../images/photosphere/photosphere.json')
.then(res=>res.json())
.then(photoData=>{
	photoData.forEach(photo=>{
		const marker = L.marker([photo.lat,photo.lng]).addTo(map);

		marker.on('click', ()=>{
			previewModal.style.display='flex';
			if(!viewer){
				viewer = new Viewer({
					container: document.querySelector('#viewer'),
					panorama: photo.file,
					caption: photo.place
				});
			}else{
				viewer.setPanorama(photo.file)
					.catch(err=>console.error('Failed to load panorama',err));
			}
		});
	});
	setTimeout(()=>map.invalidateSize(),100);
})
.catch(err=>console.error('Error loading photo data:',err));
