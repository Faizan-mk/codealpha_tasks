document.addEventListener('DOMContentLoaded', () => {
    // Sample image data with more details
    const images = [
        { 
            id: 1,
            src: 'https://source.unsplash.com/random/800x600?nature,water', 
            title: 'Serene Waters',
            category: 'nature',
            description: 'A peaceful lake surrounded by lush green mountains under a clear blue sky.',
            date: '2025-05-20',
            likes: 42
        },
        { 
            id: 2,
            src: 'https://source.unsplash.com/random/800x600?modern,building', 
            title: 'Urban Majesty',
            category: 'architecture',
            description: 'Stunning modern architecture with clean lines and glass facades.',
            date: '2025-05-18',
            likes: 28
        },
        { 
            id: 3,
            src: 'https://source.unsplash.com/random/800x600?abstract,art', 
            title: 'Colorful Abstractions',
            category: 'abstract',
            description: 'Vibrant colors blending in an abstract composition that sparks imagination.',
            date: '2025-05-15',
            likes: 36
        },
        { 
            id: 4,
            src: 'https://source.unsplash.com/random/800x600?portrait,woman', 
            title: 'Ethereal Beauty',
            category: 'portrait',
            description: 'A captivating portrait with dramatic lighting and emotional depth.',
            date: '2025-05-12',
            likes: 54
        },
        { 
            id: 5,
            src: 'https://source.unsplash.com/random/800x600?mountain,landscape', 
            title: 'Mountain Dreams',
            category: 'nature',
            description: 'Majestic mountain peaks touching the clouds in a breathtaking landscape.',
            date: '2025-05-10',
            likes: 31
        },
        { 
            id: 6,
            src: 'https://source.unsplash.com/random/800x600?bridge,night', 
            title: 'Neon Reflections',
            category: 'architecture',
            description: 'A futuristic bridge illuminated by neon lights reflecting on the water.',
            date: '2025-05-08',
            likes: 47
        },
        { 
            id: 7,
            src: 'https://source.unsplash.com/random/800x600?paint,texture', 
            title: 'Textured Dreams',
            category: 'abstract',
            description: 'Rich textures and layers creating depth and movement in abstract form.',
            date: '2025-05-05',
            likes: 23
        },
        { 
            id: 8,
            src: 'https://source.unsplash.com/random/800x600?portrait,man', 
            title: 'The Thinker',
            category: 'portrait',
            description: 'A thoughtful expression captured in perfect black and white contrast.',
            date: '2025-05-01',
            likes: 39
        }
    ];

    // DOM Elements
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('closeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const imageTitle = document.getElementById('imageTitle');
    const imageDesc = document.getElementById('imageDesc');
    const imageDate = document.getElementById('imageDate');
    const imageLikes = document.getElementById('imageLikes');
    const likeBtn = document.getElementById('likeBtn');
    const filterTags = document.querySelectorAll('.tag');
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    let currentImageIndex = 0;
    let filteredImages = [...images];
    let likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];

    // Initialize the gallery
    function initGallery() {
        displayImages(images);
        initParticles();
        initEventListeners();
        updateLikedButtons();
    }

    // Display images in the gallery
    function displayImages(imagesToShow) {
        galleryGrid.innerHTML = '';
        
        if (imagesToShow.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                    <h3>No images found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        imagesToShow.forEach((image, index) => {
            const isLiked = likedImages.includes(image.id);
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-id', image.id);
            galleryItem.setAttribute('data-category', image.category);
            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.title}">
                <div class="item-info">
                    <h3 class="item-title">${image.title}</h3>
                    <p class="item-category">${image.category}</p>
                </div>
                <div class="like-indicator ${isLiked ? 'liked' : ''}">
                    <i class="fas fa-heart"></i>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });

        // Add parallax effect to gallery items
        addParallaxEffect();
    }

    // Initialize particles.js
    function initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00f7ff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00f7ff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }

    // Add parallax effect to gallery items
    function addParallaxEffect() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                item.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(20px)`;
                item.style.boxShadow = `${-angleY}px ${angleX}px 30px rgba(0, 0, 0, 0.3)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                item.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            });
        });
    }

    // Open lightbox with selected image
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Update lightbox image and info
    function updateLightboxImage() {
        const image = filteredImages[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.title;
        imageTitle.textContent = image.title;
        imageDesc.textContent = image.description;
        imageDate.textContent = formatDate(image.date);
        imageLikes.textContent = image.likes + (likedImages.includes(image.id) ? 1 : 0);
        
        // Update like button state
        const likeIcon = likeBtn.querySelector('i');
        if (likedImages.includes(image.id)) {
            likeBtn.classList.add('liked');
            likeIcon.classList.remove('far');
            likeIcon.classList.add('fas');
        } else {
            likeBtn.classList.remove('liked');
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
        }
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate to previous image
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        updateLightboxImage();
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        updateLightboxImage();
    }

    // Filter images based on search query and category
    function filterImages() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeFilter = document.querySelector('.tag.active').dataset.filter;
        
        filteredImages = images.filter(image => {
            const matchesSearch = image.title.toLowerCase().includes(searchTerm) || 
                                image.description.toLowerCase().includes(searchTerm);
            const matchesCategory = activeFilter === 'all' || image.category === activeFilter;
            return matchesSearch && matchesCategory;
        });
        
        displayImages(filteredImages);
    }

    // Toggle like status
    function toggleLike() {
        const currentImage = filteredImages[currentImageIndex];
        const index = likedImages.indexOf(currentImage.id);
        
        if (index === -1) {
            // Like the image
            likedImages.push(currentImage.id);
            currentImage.likes += 1;
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').classList.replace('far', 'fas');
        } else {
            // Unlike the image
            likedImages.splice(index, 1);
            currentImage.likes = Math.max(0, currentImage.likes - 1);
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').classList.replace('fas', 'far');
        }
        
        // Update likes count
        imageLikes.textContent = currentImage.likes;
        
        // Save to localStorage
        localStorage.setItem('likedImages', JSON.stringify(likedImages));
        
        // Update like buttons in gallery
        updateLikedButtons();
    }

    // Update like buttons in gallery
    function updateLikedButtons() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            const itemId = parseInt(item.dataset.id);
            const likeIndicator = item.querySelector('.like-indicator');
            
            if (likedImages.includes(itemId)) {
                likeIndicator.classList.add('liked');
                likeIndicator.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                likeIndicator.classList.remove('liked');
                likeIndicator.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    // Custom cursor effect
    function initCustomCursor() {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            // Delayed follower effect
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            }, 100);
        });

        // Add hover effects
        const interactiveElements = document.querySelectorAll('button, a, .gallery-item, input, .tag');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-follower-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-follower-hover');
            });
        });
    }

    // Initialize event listeners
    function initEventListeners() {
        // Gallery item click
        galleryGrid.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const itemId = parseInt(galleryItem.dataset.id);
                const index = filteredImages.findIndex(img => img.id === itemId);
                if (index !== -1) {
                    openLightbox(index);
                }
            }
        });

        // Lightbox controls
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPreviousImage);
        nextBtn.addEventListener('click', showNextImage);
        likeBtn.addEventListener('click', toggleLike);

        // Search functionality
        searchBtn.addEventListener('click', filterImages);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterImages();
            }
        });

        // Filter tags
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                filterImages();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'l':
                case 'L':
                    toggleLike();
                    break;
            }
        });

        // Close lightbox when clicking outside
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Initialize custom cursor
        initCustomCursor();
    }

    // Show loading animation
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loadingDiv);
        
        // Simulate loading
        setTimeout(() => {
            loadingDiv.style.opacity = '0';
            setTimeout(() => {
                loadingDiv.remove();
            }, 500);
        }, 1500);
    }

    // Initialize the gallery when the DOM is loaded
    showLoading();
    setTimeout(initGallery, 1500);
});
                    openLightbox(index);
                }
            }
        });

        // Lightbox controls
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPreviousImage);
        nextBtn.addEventListener('click', showNextImage);
        likeBtn.addEventListener('click', toggleLike);

        // Search functionality
        searchBtn.addEventListener('click', filterImages);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterImages();
            }
        });

        // Filter tags
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                filterImages();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'l':
                case 'L':
                    toggleLike();
                    break;
            }
        });

        // Close lightbox when clicking outside
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Initialize custom cursor
        initCustomCursor();
    }

    // Show loading animation
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loadingDiv);
        
        // Simulate loading
        setTimeout(() => {
            loadingDiv.style.opacity = '0';
            setTimeout(() => {
                loadingDiv.remove();
            }, 500);
        }, 1500);
    }

    // Initialize the gallery when the DOM is loaded
    showLoading();
    setTimeout(initGallery, 1500);
});