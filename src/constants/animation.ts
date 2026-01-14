/**
 * Centralized animation constants
 * Single source of truth for animation timing
 */

/** Duration of the flying cart animation in milliseconds */
export const FLYING_ANIMATION_DURATION_MS = 800;

/** Delay before updating cart state (slightly less than animation to feel snappy) */
export const CART_UPDATE_DELAY_MS = 600;

/** CSS transition timing function for flying animation */
export const FLYING_ANIMATION_EASING = 'cubic-bezier(0.2, 1, 0.3, 1)';
