/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});

})(jQuery);
document.addEventListener('DOMContentLoaded', function() {
    const thumbLinks = document.querySelectorAll('.work-item a.image.fit.thumb');
    const modal = document.getElementById('previewModal');
    const previewImg = document.getElementById('previewImage');
    const closeBtn = document.querySelector('.close-btn');
    let currentGroup = [];
    let currentIndex = 0;

    // 创建加载指示器和导航按钮
    const loading = document.createElement('div');
    loading.className = 'loading';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn prev-btn';
    prevBtn.innerHTML = '&lt;';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn next-btn';
    nextBtn.innerHTML = '&gt;';

    modal.querySelector('.preview-content').append(prevBtn, nextBtn, loading);

    // 图片预加载
    function preloadImages(urls) {
        urls.forEach(url => {
            new Image().src = url;
        });
    }

    // 打开预览
    function openPreview(e) {
        e.preventDefault();
        const parentArticle = this.closest('[data-images]');
        currentGroup = JSON.parse(parentArticle.dataset.images);
        currentIndex = currentGroup.indexOf(this.href);
        
        // 如果当前链接不在数组中（可能data-images配置错误）
        if(currentIndex === -1) currentIndex = 0;
        
        preloadImages(currentGroup); // 预加载所有图片
        showImage(currentGroup[currentIndex]);
        modal.style.display = 'flex';
    }

    // 显示图片（带加载状态）
    function showImage(src) {
        loading.style.display = 'block';
        previewImg.style.opacity = 0;
        
        previewImg.onload = () => {
            loading.style.display = 'none';
            previewImg.style.opacity = 1;
        };
        previewImg.src = src;
    }

    // 导航控制
    function navigate(direction) {
        currentIndex = (currentIndex + direction + currentGroup.length) % currentGroup.length;
        showImage(currentGroup[currentIndex]);
    }
	// 获取热区元素
    const prevHotzone = document.querySelector('.prev-zone');
    const nextHotzone = document.querySelector('.next-zone');

    // 绑定点击事件
    if (prevHotzone && nextHotzone) {
        prevHotzone.addEventListener('click', () => navigate(-1));
        nextHotzone.addEventListener('click', () => navigate(1));
    } else {
        console.error('热区元素未找到，请检查HTML结构');
    }
    // 事件绑定
    thumbLinks.forEach(link => link.addEventListener('click', openPreview));
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => e.target === modal && (modal.style.display = 'none'));
    
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    
    // 键盘控制
    document.addEventListener('keydown', e => {
        if (modal.style.display === 'flex') {
            if(e.key === 'Escape') modal.style.display = 'none';
            if(e.key === 'ArrowLeft') navigate(-1);
            if(e.key === 'ArrowRight') navigate(1);
        }
    });
});
let touchStartX = 0;
let touchStartY = 0;
let isScrolling = null;

modal.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isScrolling = null; // 重置滚动判断
}, { passive: true });

modal.addEventListener('touchmove', e => {
    if (!isScrolling) {
        const xDiff = Math.abs(e.touches[0].clientX - touchStartX);
        const yDiff = Math.abs(e.touches[0].clientY - touchStartY);
        isScrolling = yDiff > xDiff; // 判断是垂直滚动还是水平滑动
    }
    
    if (!isScrolling) {
        e.preventDefault(); // 阻止默认滚动行为
        const deltaX = e.touches[0].clientX - touchStartX;
        previewImg.style.transform = `translateX(${deltaX}px)`;
    }
}, { passive: false });

modal.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const absDeltaX = Math.abs(deltaX);
    
    // 重置位置
    previewImg.style.transform = '';
    
    if (!isScrolling && absDeltaX > 30) { // 有效滑动阈值
        if (deltaX > 0) { // 向右滑动：上一张
            navigate(-1);
        } else { // 向左滑动：下一张
            navigate(1);
        }
    }
});