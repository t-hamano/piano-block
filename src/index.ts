/**
 * WordPress dependencies
 */
import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import metadata from './block.json';
import edit from './edit';
import { blockIcon as icon } from './icon';
import type { BlockAttributes } from './constants';

registerBlockType( metadata as BlockConfiguration< BlockAttributes >, {
	icon,
	edit,
	save: () => null,
} );
