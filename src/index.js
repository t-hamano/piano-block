/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import metadata from './block.json';
import edit from './edit';
import { blockIcon as icon } from './icon';

registerBlockType( metadata.name, {
	title: __( 'Piano', 'piano-block' ),
	description: __( 'Play the melody.', 'piano-block' ),
	icon,
	edit,
	save: () => null,
} );
