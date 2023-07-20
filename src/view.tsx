/**
 * WordPress dependencies
 */
import {
	render,
	// @ts-ignore: has no exported member
	// eslint-disable-next-line import/named
	createRoot,
	useState,
} from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import Piano from './components/piano';
import { DEFAULT_SETTINGS } from './constants';
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
		const volume = parseFloat( domNode.getAttribute( 'data-volume' ) || '' );
		const useSustainPedal = domNode.getAttribute( 'data-use-sustain-pedal' ) === '1';
		const octaveOffset = parseFloat( domNode.getAttribute( 'data-octave-offset' ) || '' );
		const instrument = domNode.getAttribute( 'data-instrument' ) || DEFAULT_SETTINGS.instrument;
		const keyLayout = domNode.getAttribute( 'data-key-layout' ) || DEFAULT_SETTINGS.keyLayout;
		const synthesizerSetting = domNode.getAttribute( 'data-synthesizer-setting' );
		const parsedSynthesizerSetting = synthesizerSetting
			? JSON.parse( synthesizerSetting )
			: DEFAULT_SETTINGS.synthesizerSetting;

		const normalizedSynthesizerSetting = {
			...parsedSynthesizerSetting,
			envelope: {
				attack: parseFloat( parsedSynthesizerSetting.envelope.attack ),
				decay: parseFloat( parsedSynthesizerSetting.envelope.decay ),
				sustain: parseFloat( parsedSynthesizerSetting.envelope.sustain ),
				release: parseFloat( parsedSynthesizerSetting.envelope.release ),
			},
		};

		const viewProps = {
			volume,
			useSustainPedal,
			octaveOffset,
			instrument,
			keyLayout,
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
