let x = document.querySelector('#testimonials');
document.getElementById('test1').style.display = 'block';
document.getElementById('test2').style.display = 'none';
document.getElementById('test3').style.display = 'none';
const sliderOne = () => {
	setTimeout(() => {
	document.getElementById('test1').style.display = 'block';
	document.getElementById('test2').style.display = 'none';
	document.getElementById('test3').style.display = 'none';
	// console.log('1');
	}, 5000);
	// setTimeout(sliderTwo(), 5000);
}

const sliderTwo = () => {
	setTimeout(() => {
	document.getElementById('test1').style.display = 'none';
	document.getElementById('test2').style.display = 'block';
	document.getElementById('test3').style.display = 'none';
	// console.log('2');
	}, 5000);
	// setTimeout(sliderThree(), 5000);
}

const sliderThree = () => {
	setTimeout(() => {
	document.getElementById('test1').style.display = 'none';
	document.getElementById('test2').style.display = 'none';
	document.getElementById('test3').style.display = 'block';
	// console.log('3');
	}, 5000);
	// setTimeout(sliderOne(), 5000);
}

let runSlider = () => {
	sliderOne();
	sliderTwo();
	sliderThree();
}

const u = setInterval(() => {
	const i = Math.floor(Math.random() * 3);
	if ( i === 1) {
		sliderOne();
		// console.log('sliderOne')
	} else if (i === 2){
		sliderTwo();
		// console.log('sliderTwo')
	} else if (i === 3) {
		sliderThree();
		// console.log('sliderThree')
	}
}, 5000);

