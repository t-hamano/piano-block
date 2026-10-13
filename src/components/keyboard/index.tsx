/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { Key } from '../../constants';

type Props = {
	activeKeys: Key[];
	keys: Key[];
	keyIndicator: string;
	onKeyClick: ( note: string, octave: number ) => void;
};

const Keyboard = ( { activeKeys, keys, keyIndicator, onKeyClick }: Props ) => {
	return (
		<div className="piano-block-keyboard">
			<Stack className="piano-block-keyboard__inner">
				{ keys.map( ( key ) => {
					const isBlackKey = key.note.endsWith( '#' );
					return (
						<button
							key={ `${ key.note }${ key.octave }` }
							tabIndex={ -1 }
							className={ clsx( 'piano-block-keyboard__key', {
								'piano-block-keyboard__key--white': ! isBlackKey,
								'piano-block-keyboard__key--black': isBlackKey,
								'is-pressed': activeKeys.some(
									( { note, octave } ) => key.note === note && key.octave === octave
								),
							} ) }
							aria-label={ sprintf(
								/* translators: %s is replaced with the key name. */
								__( 'Note: %s', 'piano-block' ),
								key.note + key.octave
							) }
							type="button"
							onClick={ () => onKeyClick( key.note, key.octave ) }
						>
							{ keyIndicator === 'key' && key.name.join( ' ' ) }
							{ keyIndicator === 'spn' && `${ key.note }${ key.octave }` }
						</button>
					);
				} ) }
			</Stack>
		</div>
	);
};

export default Keyboard;
