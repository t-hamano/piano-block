/**
 * WordPress dependencies
 */
import { render, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Piano } from './components';
import { DEFAULT_SETTINGS } from './constants';
import type { BlockAttributes } from './constants';

function View() {
	const [ settings, setSettings ] = useState< BlockAttributes >( {
		...DEFAULT_SETTINGS,
		...window?.pianoBlockVars?.defaultSettings,
	} );

	const onChange = ( newSettings: Partial< BlockAttributes > ) => {
		setSettings( {
			...settings,
			...newSettings,
		} );
	};

	return <Piano settings={ settings } onChange={ onChange } />;
}

const block = document.querySelector( '.wp-block-piano-block-piano' );

if ( block ) {
	render( <View />, block );
}
