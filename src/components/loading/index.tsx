/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

const Loading = () => {
	return (
		<div className="piano-block-loading">
			<Spinner />
			{ __( 'Loading…', 'piano-block' ) }
		</div>
	);
};

export default Loading;
