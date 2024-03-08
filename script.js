let loadedImages = []; 

document.getElementById('stitchButton').addEventListener('click', stitchSheets);

async function stitchSheets() {
     drawImages(loadedImages);
}
document.getElementById('spriteSheets').addEventListener('change', async function() {
    const files = this.files;
    if (files.length) {
        await loadImages(files);
        this.value = '';
    }
});
async function loadImages(files) {
    const images = await Promise.all(Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = () => resolve({ img: img, name: file.name });
                img.onerror = reject;
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }));

    // Add newly loaded images to the array of loaded images
    loadedImages = loadedImages.concat(images);
    updateLoadedImagesList();
}

function updateLoadedImagesList() {
    const listElement = document.getElementById('loadedImagesList');
    listElement.innerHTML = 'Loaded Images: <br>'; // Reset list

    loadedImages.forEach((item, index) => {
        listElement.innerHTML += `${index + 1}. ${item.name} <br>`; // Display names of loaded images
    });
}
function drawImages(images) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 0; // Clear previous drawing
    canvas.height = 0;

    let totalWidth = 0;
    // Use item.img.height because now each item is an object { img, name }
    const maxHeight = Math.max(...images.map(item => item.img.height)); 

    // Calculate total width of the combined image
    images.forEach(item => {
        totalWidth += item.img.width; 
    });

    canvas.width = totalWidth;
    canvas.height = maxHeight;

    // Draw images side by side
    let x = 0;
    images.forEach(item => {
        ctx.drawImage(item.img, x, 0); // Use item.img here
        x += item.img.width; 
    });
}


document.getElementById('exportButton').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'stitched-sprite-sheet.png';
    a.click();
});
