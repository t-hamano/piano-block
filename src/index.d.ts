// Global variables output by wp_localize_script
export interface PianoBlockVars {
	assetsUrl: string;
}

declare global {
	interface Window {
		pianoBlockVars: PianoBlockVars;
	}
}
