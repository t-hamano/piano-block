/**
 * Internal dependencies
 */
import type { BlockAttributes } from './constants';

// Global variables output by wp_localize_script
export interface PianoBlockVars {
	assetsUrl: string;
	settings: BlockAttributes
}

declare global {
	interface Window {
		pianoBlockVars: PianoBlockVars;
	}
}
