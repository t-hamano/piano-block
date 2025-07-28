/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import { useViewportMatch } from '@wordpress/compose';

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
	const isMobile = useViewportMatch( 'medium', '<' );
	const dropdownMenuProps = {
		label: __( 'Settings', 'piano-block' ),
		...( ! isMobile && {
			popoverProps: {
				placement: 'left-start',
				offset: 259,
			},
		} ),
	};

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'piano-block' ) }
					resetAll={ () => {
						setAttributes( {
							showOnFront: false,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Display on the front end', 'piano-block' ) }
						isShownByDefault
						hasValue={ () => !! settings.showOnFront }
						onDeselect={ () => setAttributes( { showOnFront: false } ) }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Display on the front end', 'piano-block' ) }
							checked={ settings.showOnFront }
							onChange={ ( value ) => onChange( { showOnFront: value } ) }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...blockProps }>
				<Piano settings={ settings } onChange={ onChange } />
			</div>
		</>
	);
}
