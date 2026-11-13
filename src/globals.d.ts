// Global variables output by wp_add_inline_script
export interface PianoBlockVars {
	assetsUrl: string;
}

declare global {
	interface Window {
		pianoBlockVars: PianoBlockVars;
	}
}

declare module 'react' {
	interface HTMLAttributes< T > extends DOMAttributes< T > {
		popover?: '' | 'auto' | 'manual' | 'hint';
	}
}
