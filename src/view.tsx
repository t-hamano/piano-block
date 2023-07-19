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
import { Piano } from './components';
import { DEFAULT_SETTINGS } from './constants';
import type { BlockAttributes } from './constants';

function View() {
	const [ settings, setSettings ] = useState< BlockAttributes >( {
		...DEFAULT_SETTINGS,
		...window?.pianoBlockVars?.settings,
	} );

	const onChange = ( newSettings: Partial< BlockAttributes > ) => {
		setSettings( {
			...settings,
			...newSettings,
		} );
	};

	return <Piano settings={ settings } onChange={ onChange } />;
}

domReady( function () {
	const domNode = document.querySelector( '.wp-block-piano-block-piano' );

	// If version is less than 18 use `render` to render the app
	// otherwise use `createRoot` to render the app
	if ( createRoot === undefined ) {
		render( <View />, domNode );
	} else {
		const root = createRoot( domNode );
		root.render( <View /> );
	}
} );
