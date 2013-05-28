(function () {

	var TvFr = function () {
		this.settings = {
			modes: ['live', 'replay']
		};

		this.init();
	};

	TvFr.prototype.init = function () {
		if (!this.channels) {
			this.update();
		}

		var modeNodes = document.querySelectorAll('[name="mode"]');
		for (var i in modeNodes) {
			if (modeNodes[i].tagName == 'INPUT') {
				modeNodes[i].addEventListener('change', this.fill.bind(this));
			}
		}
	};


	TvFr.prototype.update = function () {
		var
			self = this
			, r = new XMLHttpRequest()
		;
		r.open("get", "data/channels.json", true);
		r.onreadystatechange = function () {
			if (r.readyState != 4 || r.status != 200) return;

			self.channels = JSON.parse(r.responseText);
			self.fill();
		};
		r.send();
	};

	TvFr.prototype.fill = function () {
		var
			self = this
			, remote = document.getElementById("remote")
			, choices = document.querySelectorAll('[name="mode"]')
			, mode = "live"
		;

		for (var i in choices) {
			if (choices[i].checked && self.settings.modes.indexOf(choices[i].value) != -1) {
				mode = choices[i].value;
				break;
			}
		}

		remote.innerHTML = '';

		for (var k in self.channels) {
			var channel = self.channels[k];

			var fragment = document.createDocumentFragment();

			var link = fragment.appendChild(document.createElement('a'));
			link.href = channel[mode];

			var img = link.appendChild(document.createElement('img'));
			img.src = channel.logo;

			remote.appendChild(fragment);

			link.addEventListener('click', self.eventChannelClick.bind(self));
		}
	};

	TvFr.prototype.eventChannelClick = function (event) {
		var
			container = document.getElementById('content')
			, link = event.target
		;

		if (link.tagName == 'IMG') {
			link = link.parentNode;
		}

		container.innerHTML = '';
		var iframe = container.appendChild(document.createElement('iframe'));
		iframe.src = link.href;

		var links = document.querySelectorAll('nav a');
		for (var i = 0; i < links.length; ++i) {
			links[i].classList.remove('active');
		}
		link.classList.add('active');

		event.preventDefault();
	};

	window.tvfr = new TvFr();
}());
