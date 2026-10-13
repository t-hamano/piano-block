/**
 * WordPress dependencies
 */
import { createRoot, useState } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import Piano from './components/piano';
import { parseViewAttributes } from './utils';
import type { BlockAttributes } from './constants';

function View( props: BlockAttributes ) {
	const [ settings, setSettings ] = useState( props );

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
		const viewProps = parseViewAttributes( domNode );
		if ( ! viewProps ) {
			return;
		}

		const root = createRoot( domNode );
		root.render( <View { ...viewProps } /> );
	} );
} );
