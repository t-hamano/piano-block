/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	// @ts-ignore: has no exported member
	useResizeObserver,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { KEYBOARD_WIDTH, KEYBOARD_PADDING, KEYS } from '../constants';
import type { Key } from '../constants';

type Props = {
	activeKeys: Key[];
	onKeyClick: ( note: string, octave: number ) => void;
};

const Keyboard = ( { activeKeys, onKeyClick }: Props ) => {
	// Hooks to control the display of horizontal scroll bars
	const [ resizeListener, keysInnerSizes ] = useResizeObserver();

	// Mouse cursor is clicked or the Enter key is pressed on the keyboard.
	const onClick = ( note: string, octave: number ) => {
		onKeyClick( note, octave );
	};

	return (
		<div
			className={ classnames( 'piano-block-keyboard', {
				'is-scroll': keysInnerSizes.width < KEYBOARD_WIDTH + KEYBOARD_PADDING * 2,
			} ) }
		>
			{ resizeListener }
			<div
				className="piano-block-keyboard__inner"
				style={ { width: `${ KEYBOARD_WIDTH }px`, padding: `0 ${ KEYBOARD_PADDING }px` } }
			>
				{ KEYS.map( ( key, index ) => (
					<button
						key={ index }
						className={ classnames( 'piano-block-keyboard__key', {
							'piano-block-keyboard__key--white': ! key.isBlackKey,
							'piano-block-keyboard__key--black': key.isBlackKey,
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
						onClick={ () => onClick( key.note, key.octave ) }
					>
						{ key.name.join( ' ' ) }
					</button>
				) ) }
			</div>
		</div>
	);
};

export default Keyboard;
