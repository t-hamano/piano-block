/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Piano from './components/piano';
import { DEFAULT_SETTINGS } from './constants';
import type { BlockAttributes } from './constants';

export default function Edit( { attributes, setAttributes }: BlockEditProps< BlockAttributes > ) {
	const settings = {
		...DEFAULT_SETTINGS,
		...attributes,
	};

	const onChange = ( newAttributes: Partial< BlockAttributes > ) => {
		setAttributes( {
			...attributes,
			...newAttributes,
		} );
	};

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'piano-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Display on the front end', 'piano-block' ) }
						checked={ settings.showOnFront }
						onChange={ ( value ) => onChange( { showOnFront: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<Piano settings={ settings } onChange={ onChange } />
			</div>
		</>
	);
}
