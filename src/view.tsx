/**
 * WordPress dependencies
 */
import { render, useState } from '@wordpress/element';
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
	const block = document.querySelector( '.wp-block-piano-block-piano' );

	if ( block ) {
		render( <View />, block );
	}
} );
