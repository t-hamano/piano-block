/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import { blockIcon } from './icon';

registerBlockType( metadata.name, {
	title: __( 'Piano', 'piano-block' ),
	description: __( 'Play the melody.', 'piano-block' ),
	icon: blockIcon,
	edit,
	save: () => null,
} );
