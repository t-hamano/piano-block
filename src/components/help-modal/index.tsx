/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';

type Props = {
	onClose: () => void;
};

const HelpModal = ( { onClose }: Props ) => {
	return (
		<Modal
			title={ __( 'About Piano Block', 'piano-block' ) }
			className="piano-block-help-modal"
			onRequestClose={ onClose }
			size="medium"
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
		</Modal>
	);
};

export default HelpModal;
