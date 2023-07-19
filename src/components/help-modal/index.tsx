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
		>
			<div className="piano-block-help-modal__content">
				<ul>
					<li>{ __( 'You can play a variety of tones using the keyboard.', 'piano-block' ) }</li>
					<li>
						{ __(
							'Clicking on the keyboard with the mouse or typing the keys indicated on the keyboard will play audio.',
							'piano-block'
						) }
					</li>
					<li>
						{ __(
							'Due to conflicts with OS or browser shortcuts, some audio may not play depending on the combination of keys you are pressing.',
							'piano-block'
						) }
					</li>
				</ul>
			</div>
		</Modal>
	);
};

export default HelpModal;
