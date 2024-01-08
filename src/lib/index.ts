// function Drawer({
// 	width = 640,
// 	height = 480,
// 	curve: Curve = d3.curveBasis,
// 	stroke = 'black',
// 	strokeWidth = 1.5,
// 	lineCap = 'round',
// 	lineJoin = 'round'
// } = {}) {
// 	const context = DOM.context2d(width, height);
// 	const strokes = (context.canvas.value = []);
// 	const curve = Curve(context);
// 	const redo = [];

// 	context.lineJoin = lineJoin;
// 	context.lineCap = lineCap;

// 	// Render and report the new value.
// 	function render() {
// 		context.clearRect(0, 0, width, height);
// 		for (const stroke of strokes) {
// 			context.strokeStyle = stroke.stroke;
// 			context.lineWidth = stroke.strokeWidth;
// 			context.beginPath();
// 			curve.lineStart();
// 			for (const point of stroke) {
// 				curve.point(...point);
// 			}
// 			if (stroke.length === 1) curve.point(...stroke[0]);
// 			curve.lineEnd();
// 			context.stroke();
// 		}
// 		context.canvas.value = strokes;
// 		context.canvas.dispatchEvent(new CustomEvent('input'));
// 	}

// 	d3.select(context.canvas).call(
// 		d3
// 			.drag()
// 			.container(context.canvas)
// 			.subject(dragsubject)
// 			.on('start drag', dragged)
// 			.on('start.render drag.render', render)
// 	);

// 	context.canvas.undo = () => {
// 		if (strokes.length === 0) return;
// 		redo.push(strokes.pop());
// 		render();
// 	};

// 	context.canvas.redo = (stroke) => {
// 		if (redo.length === 0) return;
// 		strokes.push(redo.pop());
// 		render();
// 	};

// 	// Create a new empty stroke at the start of a drag gesture.
// 	function dragsubject() {
// 		const currentStroke = [];
// 		currentStroke.stroke = typeof stroke === 'function' ? stroke() : stroke;
// 		currentStroke.strokeWidth = typeof strokeWidth === 'function' ? strokeWidth() : strokeWidth;
// 		strokes.push(currentStroke);
// 		redo.length = 0;
// 		return currentStroke;
// 	}

// 	// Add to the stroke when dragging.
// 	function dragged({ subject, x, y }) {
// 		subject.push([x, y]);
// 	}

// 	return context.canvas;
// }
