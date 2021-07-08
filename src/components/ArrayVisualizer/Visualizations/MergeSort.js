import {useImperativeHandle, forwardRef, useState, useEffect} from 'react';
import Array from './Array';

import {
	resetAllColors,
	setArrayColorByIndices,
	setArrayColorByRange,
} from '../../../helper/functions';

const DEFAULT_COLOR = '#006eff';
const OUT_OF_RANGE_COLOR = '#a8cdff';
const SMALL_COLOR = 'green';
const BIG_COLOR = 'grey';
const SORTED_COLOR = 'purple';

/*
steps[
	index of smaller value, 
	index of bigger value (defaults to -1 if one of the arrays have been expended), 
	current range of values being sorted together
]
*/

const MergeSort = forwardRef(({array, isSorting, updateArray, steps}, ref) => {
	const [subArray, setSubArray] = useState([]);
	const [currentRange, setCurrentRange] = useState([-1, -1]);
	const [sortedIndices, setSortedIndices] = useState([]);

	//useEffect(() => console.log(subArray), [subArray]);
	useEffect(() => console.log(sortedIndices), [sortedIndices]);

	useImperativeHandle(ref, () => ({
		updateColors(index) {
			let rects =
				document.getElementsByClassName('array-wrapper')[0].children;
			const [smallIndex, bigIndex, range] = steps[index];

			if (range !== currentRange) {
				setCurrentRange(range);
				setSubArray([]);
				setSortedIndices([]);
				sortPreviousSection(index - 1, steps);
			}
			pushNewBar(steps[index]);

			setArrayColorByRange(
				range[0],
				range[1],
				DEFAULT_COLOR,
				OUT_OF_RANGE_COLOR
			);
			setArrayColorByIndices(sortedIndices, SORTED_COLOR);

			rects[smallIndex].style.backgroundColor = SMALL_COLOR;
			if (bigIndex !== -1) {
				rects[bigIndex].style.backgroundColor = BIG_COLOR;
			}

			if (index + 1 === steps.length) {
				sortPreviousSection(index);
				resetAllColors(DEFAULT_COLOR);
				//get rid of bottom array after halk a second
				setTimeout(() => {
					setSubArray([]);
					setSortedIndices([]);
				}, 500);
			}

			if (!isSorting) {
				this.reset();
			}
		},
		reset() {
			resetAllColors(DEFAULT_COLOR);
			setSubArray([]);
		},
	}));

	const resetPreviousColors = (index) => {};

	const sortPreviousSection = (index) => {
		if (index < 0) return;

		const [start, end] = steps[index][2];
		let tempArr = [...array];
		let tempSlice = array.slice(start, end + 1);
		tempSlice.sort((a, b) => a - b);
		for (var i = start, j = 0; i <= end; i++, j++) {
			tempArr[i] = tempSlice[j];
		}

		updateArray(tempArr);
	};

	const pushNewBar = (step) => {
		let smallIndex = step[0];

		setSubArray((subArray) => [...subArray, array[smallIndex]]);
		setSortedIndices((sortedIndices) => [...sortedIndices, smallIndex]);
	};

	return (
		<>
			<Array array={array} />
			<Array array={subArray} />
		</>
	);
});

export default MergeSort;
