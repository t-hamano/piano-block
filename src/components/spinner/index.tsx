const Spinner = () => {
	return (
		<svg
			className="piano-block-spinner"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			role="presentation"
			focusable="false"
		>
			<path
				className="piano-block-spinner__indicator"
				d="m 50 0 a 50 50 0 0 1 0 100"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
};

export default Spinner;
