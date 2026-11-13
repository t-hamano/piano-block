/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { Icon, close, help } from '@wordpress/icons';

const Help = () => {
	const toggleRef = useRef< HTMLButtonElement >( null );
	const bubbleRef = useRef< HTMLDivElement >( null );
	const closeRef = useRef< HTMLButtonElement >( null );

	useEffect( () => {
		const toggle = toggleRef.current;
		const bubble = bubbleRef.current;
		const closeButton = closeRef.current;
		if ( ! toggle || ! bubble || ! closeButton ) {
			return;
		}
		toggle.popoverTargetElement = bubble;
		closeButton.popoverTargetElement = bubble;
		closeButton.popoverTargetAction = 'hide';

		const onToggle = ( event: ToggleEvent ) => {
			if ( event.newState === 'open' ) {
				bubble.focus();
			}
		};
		bubble.addEventListener( 'toggle', onToggle );
		return () => bubble.removeEventListener( 'toggle', onToggle );
	}, [] );

	return (
		<>
			<button
				ref={ toggleRef }
				type="button"
				className="piano-block-help__toggle"
				aria-label={ __( 'Help', 'piano-block' ) }
				aria-haspopup="dialog"
			>
				<Icon icon={ help } size={ 20 } />
			</button>
			<div
				ref={ bubbleRef }
				className="piano-block-help__bubble"
				popover="auto"
				role="dialog"
				aria-label={ __( 'Help', 'piano-block' ) }
				tabIndex={ -1 }
			>
				<ul>
					<li>{ __( 'You can play a variety of tones using the keyboard.', 'piano-block' ) }</li>
					<li>
						{ __(
							'Click a key with the mouse, or press the corresponding key on your computer keyboard, to play a note.',
							'piano-block'
						) }
					</li>
					<li>
						{ __(
							'Some key combinations may not play sound because they conflict with OS or browser shortcuts.',
							'piano-block'
						) }
					</li>
				</ul>
				<button
					ref={ closeRef }
					type="button"
					className="piano-block-help__close"
					aria-label={ __( 'Close', 'piano-block' ) }
				>
					<Icon icon={ close } size={ 20 } />
				</button>
			</div>
		</>
	);
};

export default Help;
