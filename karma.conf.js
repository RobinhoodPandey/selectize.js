module.exports = function(config) {
	var saucelabsBrowsers = [
		// mobile
		{platform: 'OS X 10.10', browserName: 'iPhone', version: '8.1'},
		{platform: 'OS X 10.10 ', browserName: 'iPhone', version: '6.0'},
		{platform: 'OS X 10.10', browserName: 'iPad', version: '8.1'},
		{platform: 'OS X 10.10', browserName: 'iPad', version: '6.0'},
		{platform: 'Linux', browserName: 'android', version: '4.4'},
		{platform: 'Linux', browserName: 'android', version: '4.3'},
		// desktop (safari)
		{platform: 'OS X 10.8', browserName: 'safari', version: 6},
		{platform: 'OS X 10.9', browserName: 'safari', version: 7},
		{platform: 'OS X 10.10', browserName: 'safari', version: 8},
		// desktop (chrome)
		{platform: 'OS X 10.10', browserName: 'chrome', version: 39},
		{platform: 'OS X 10.10', browserName: 'chrome', version: 38},
		{platform: 'OS X 10.10', browserName: 'chrome', version: 37},
		{platform: 'Windows 7', browserName: 'chrome', version: 39},
		{platform: 'Windows 7', browserName: 'chrome', version: 38},
		{platform: 'Windows 7', browserName: 'chrome', version: 37},
		// desktop (firefox)
		{platform: 'Windows 7', browserName: 'firefox', version: 35},
		{platform: 'Windows 8', browserName: 'firefox', version: 35},
		{platform: 'OS X 10.10', browserName: 'firefox', version: 34},
		{platform: 'OS X 10.10', browserName: 'firefox', version: 33},
		{platform: 'OS X 10.10', browserName: 'firefox', version: 32},
		// desktop (internet explorer)
		{platform: 'Windows 8', browserName: 'iexplore', version: 10},
		{platform: 'Windows 8.1', browserName: 'iexplore', version: 11},
		{platform: 'Windows 7', browserName: 'iexplore', version: 9}
	];

	var customLaunchers = {};
	saucelabsBrowsers.forEach(function(browser, i) {
		browser.base = 'SauceLabs';
		customLaunchers['sl' + i] = browser;
	});

	var targets = {
		'saucelabs': Object.keys(customLaunchers),
		'phantomjs': ['PhantomJS']
	};

	var reporters = ['mocha'];
	if (process.env.TRAVIS_CI) {
		reporters = process.env.TARGET === 'saucelabs'
			? ['progress', 'saucelabs']
			: ['mocha', 'coverage', 'coveralls']
	}

	config.set({
		frameworks: ['mocha', 'chai'],
		files: [
			'bower_components/jquery/jquery.js',
			'bower_components/microplugin/src/microplugin.js',
			'bower_components/sifter/sifter.js',
			'test/support/*.js',
			'src/contrib/*.js',
			'src/constants.js',
			'src/utils.js',
			'src/selectize.js',
			'src/defaults.js',
			'src/selectize.jquery.js',
			'test/*.js'
		],
		preprocessors: {
			'src/**/*.js': ['coverage']
		},
		coverageReporter: {
			type: process.env.TRAVIS_CI ? 'lcov' : 'text-summary',
			dir: 'coverage/'
		},
		sauceLabs: {
			startConnect: true,
			tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
			build: process.env.TRAVIS_BUILD_NUMBER,
			testName: process.env.COMMIT_MESSAGE,
			tags: ['selectize', 'test'],
			options: {
				'selenium-version': '2.41.0'
			}
		},
		customLaunchers: customLaunchers,
		reporters: reporters,
		port: 8888,
		colors: true,
		captureTimeout: 0,
		logLevel: config.LOG_INFO,
		browsers: targets[process.env.TARGET || 'phantomjs'],
		browserDisconnectTolerance: 2,
		browserDisconnectTimeout: 10000,
		browserNoActivityTimeout: 120000,
		singleRun: true
	});
};