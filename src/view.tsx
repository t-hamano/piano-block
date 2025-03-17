/**
 * WordPress dependencies
 */
import { render, createRoot, useState } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import Piano from './components/piano';
import {
	DEFAULT_ENVELOPE,
	DEFAULT_OSCILLATOR_TYPE,
	DEFAULT_SETTINGS,
	INSTRUMENTS,
} from './constants';
import type { BlockAttributes } from './constants';

function View( props: BlockAttributes ) {
	const [ settings, setSettings ] = useState< BlockAttributes >( props );

	const onChange = ( newSettings: Partial< BlockAttributes > ) => {
		setSettings( {
			...settings,
			...newSettings,
		} );
	};

	return <Piano settings={ settings } onChange={ onChange } />;
}

domReady( function () {
	const domNodes = document.querySelectorAll( '.wp-block-piano-block-piano' );

	if ( domNodes.length === 0 ) {
		return;
	}

	domNodes.forEach( ( domNode ) => {
		const instrument = domNode.getAttribute( 'data-instrument' ) || DEFAULT_SETTINGS.instrument;

		const allowedInstrument = INSTRUMENTS.find( ( { value } ) => value === instrument );
		if ( ! allowedInstrument ) {
			return;
		}

		const volume = parseFloat( domNode.getAttribute( 'data-volume' ) || '' );
		const useSustainPedal = domNode.getAttribute( 'data-use-sustain-pedal' ) === '1';
		const octaveOffset = parseFloat( domNode.getAttribute( 'data-octave-offset' ) || '' );
		const keyLayout = domNode.getAttribute( 'data-key-layout' ) || DEFAULT_SETTINGS.keyLayout;
		const keyIndicator =
			domNode.getAttribute( 'data-key-indicator' ) || DEFAULT_SETTINGS.keyIndicator;

		const synthesizerSetting = domNode.getAttribute( 'data-synthesizer-setting' );
		const parsedSynthesizerSetting = synthesizerSetting ? JSON.parse( synthesizerSetting ) : {};

		const { oscillator, envelope } = parsedSynthesizerSetting;

		const normalizedSynthesizerSetting = {
			oscillator: {
				type: oscillator?.type || DEFAULT_OSCILLATOR_TYPE,
			},
			envelope: {
				attack: envelope?.attack ? parseFloat( envelope.attack ) : DEFAULT_ENVELOPE.attack,
				decay: envelope?.decay ? parseFloat( envelope.decay ) : DEFAULT_ENVELOPE.decay,
				sustain: envelope?.sustain ? parseFloat( envelope.sustain ) : DEFAULT_ENVELOPE.sustain,
				release: envelope?.release ? parseFloat( envelope.release ) : DEFAULT_ENVELOPE.release,
			},
		};

		const viewProps = {
			volume,
			useSustainPedal,
			octaveOffset,
			instrument: allowedInstrument.value,
			keyLayout,
			keyIndicator,
			synthesizerSetting: normalizedSynthesizerSetting,
			showOnFront: true,
		};

		// If version is less than 18 use `render` to render the app
		// otherwise use `createRoot` to render the app
		if ( createRoot === undefined ) {
			render( <View { ...viewProps } />, domNode );
		} else {
			const root = createRoot( domNode );
			root.render( <View { ...viewProps } /> );
		}
	} );
} );
