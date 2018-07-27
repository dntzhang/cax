
import cax from '../../src/index.js'


const stage = new cax.Stage(300, 400, '#canvasCtn');

for (var i = 0; i < 25; i++) {
	var circle = new cax.Circle((i + 1) * 4, {
		lineWidth: 15,
		strokeStyle: '#113355'
	});

	circle.alpha = 1 - i * 0.02;
	circle.x = Math.random() * 300;
	circle.y = Math.random() * 400;
	circle.compositeOperation = "lighter";

	cax.To.get(circle).to({ x: 150, y: 200 }, (0.5 + i * 0.04) * 1500, cax.easing.bounceOut).start()
	stage.add(circle);
}


stage.on('click', function (evt) {
	stage.children.forEach((child, index) => {
		cax.To.get(child).to({ x: evt.stageX, y: evt.stageY }, (0.5 + index * 0.04) * 1500, cax.easing.bounceOut).start()
	})
})

cax.tick(function () {
	stage.update()
})