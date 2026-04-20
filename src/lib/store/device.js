// lib/stores/device.js
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

// 📱 Mobile
export const isMobile = readable(false, (set) => {
	if (!browser) return;

	function update() {
		set(window.innerWidth < 750.5);
	}

	update();
	window.addEventListener('resize', update);

	return () => window.removeEventListener('resize', update);
});

// 👆 Touch
export const isTouch = readable(false, (set) => {
	if (!browser) return;

	function update() {
		const touch =
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			navigator.msMaxTouchPoints > 0;

		set(touch);
	}

	update();
	window.addEventListener('resize', update);

	return () => window.removeEventListener('resize', update);
});