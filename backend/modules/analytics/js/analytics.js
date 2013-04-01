/**
 * Interaction for the analytics module
 *
 * @author	Annelies Vanextergem <annelies@netlash.com>
 * @author	Thomas Deceuninck <thomas@fronto.be>
 * @author	Tijs Verkoyen <tijs@sumocoders.be>
 */
jsBackend.analytics =
{
	init: function()
	{
		// variables
		$chartPieChart = $('#chartPieChart');
		$chartWidget = $('#chartWidget');
		$chartDoubleMetricPerDay = $('#chartDoubleMetricPerDay');
		$chartSingleMetricPerDay = $('#chartSingleMetricPerDay');

		jsBackend.analytics.charts.init();
		jsBackend.analytics.chartDoubleMetricPerDay.init();
		jsBackend.analytics.chartPieChart.init();
		jsBackend.analytics.chartSingleMetricPerDay.init();
		jsBackend.analytics.chartWidget.init();
		jsBackend.analytics.loading.init();
		jsBackend.analytics.resize.init();
	}
}

jsBackend.analytics.charts =
{
	init: function()
	{
		if($chartPieChart.length > 0 || $chartDoubleMetricPerDay.length > 0 || $chartSingleMetricPerDay.length > 0 || $chartWidget.length > 0)
		{
			Highcharts.setOptions(
			{
				colors: ['#058DC7', '#50b432', '#ED561B', '#EDEF00', '#24CBE5', '#64E572', '#FF9655'],
				title: { text: '' },
				legend:
				{
					layout: 'vertical',
					backgroundColor: '#FFF',
					borderWidth: 0,
					shadow: false,
					symbolPadding: 12,
					symbolWidth: 10,
					itemStyle: { cursor: 'pointer', color: '#000', lineHeight: '18px' },
					itemHoverStyle: { color: '#666' }
				}
			});
		}
	}
}

jsBackend.analytics.chartPieChart =
{
	chart: '',

	init: function()
	{
		if($chartPieChart.length > 0) { jsBackend.analytics.chartPieChart.create(); }
	},

	// add new chart
	create: function()
	{
		// variables
		$pieChartValues = $('#dataChartPieChart ul.data li');
		var pieChartData = [];

		$pieChartValues.each(function()
		{
			// variables
			$this = $(this);

			pieChartData.push(
			{
				'name': $this.children('span.label').html(),
				'y': parseInt($this.children('span.value').html()),
				'percentage': parseInt($this.children('span.percentage').html())
			});
		});

		var containerWidth = $chartPieChart.width();

		$chartPieChart.highcharts({
			chart: { height: 200, width: containerWidth, margin: [0, 160, 0, 0], backgroundColor: 'transparent' },
			credits: { enabled: false },
			tooltip: {
				formatter: function() {
					var percentage = String(this.point.percentage);
					return '<b>'+ this.point.name +'</b>: '+ this.y + ' (' + percentage.substring(0, $.inArray('.', percentage) + 3) + '%)';
				},
				borderWidth: 2, shadow: false
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					dataLabels: {
						enabled: false
					},
					showInLegend: true
				}
			},
			legend: { align: 'right' },
			series: [ { type: 'pie', data: pieChartData } ]
		});
	},

	// destroy chart
	destroy: function()
	{
		$chartPieChart.highcharts().destroy();
	}
}

jsBackend.analytics.chartDoubleMetricPerDay =
{
	chart: '',

	init: function()
	{
		if($chartDoubleMetricPerDay.length > 0) { jsBackend.analytics.chartDoubleMetricPerDay.create(); }
	},

	// add new chart
	create: function()
	{
		var xAxisItems = $('#dataChartDoubleMetricPerDay ul.series li.serie:first-child ul.data li');
		var xAxisValues = [];
		var xAxisCategories = [];
		var counter = 0;
		var interval = Math.ceil(xAxisItems.length / 10);

		xAxisItems.each(function()
		{
			xAxisValues.push($(this).children('span.fulldate').html());
			var text = $(this).children('span.date').html();
			if(xAxisItems.length > 10 && counter%interval > 0) text = ' ';
			xAxisCategories.push(text);
			counter++;
		});

		var metric1Name = $('#dataChartDoubleMetricPerDay ul.series li#metric1serie span.name').html();
		var metric1Values = $('#dataChartDoubleMetricPerDay ul.series li#metric1serie span.value');
		var metric1Data = [];

		metric1Values.each(function() { metric1Data.push(parseInt($(this).html())); });

		var metric2Name = $('#dataChartDoubleMetricPerDay ul.series li#metric2serie span.name').html();
		var metric2Values = $('#dataChartDoubleMetricPerDay ul.series li#metric2serie span.value');
		var metric2Data = [];

		metric2Values.each(function() { metric2Data.push(parseInt($(this).html())); });

		var containerWidth = $('#chartDoubleMetricPerDay').width();

		$chartDoubleMetricPerDay.highcharts({
			chart: { height: 200, width: containerWidth, margin: [60, 0, 30, 40], defaultSeriesType: 'line', backgroundColor: 'transparent' },
			xAxis: { lineColor: '#CCC', lineWidth: 1, categories: xAxisCategories },
			yAxis: { min: 0, max: $('#dataChartDoubleMetricPerDay #maxYAxis').html(), tickInterval: ($('#dataChartDoubleMetricPerDay #tickInterval').html() == '' ? null : $('#dataChartDoubleMetricPerDay #tickInterval').html()), title: { text: '' } },
			credits: { enabled: false },
			tooltip: { formatter: function() { return '<b>'+ this.series.name +'</b><br/>'+ xAxisValues[this.point.x] +': '+ this.y; } },
			plotOptions:
			{
				line: { marker: { enabled: false, states: { hover: { enabled: true, radius: 5, lineWidth: 1 } } } },
				area: {	marker: { enabled: false, states: { hover: { enabled: true, radius: 5, lineWidth: 1 } } } },
				column: { pointPadding: 0.2, borderWidth: 0 },
				series: { fillOpacity: 0.3 }
			},
			series: [{name: metric1Name, data: metric1Data, type: 'area' }, { name: metric2Name, data: metric2Data }],
			legend: { layout: 'horizontal', verticalAlign: 'top' }
		});
	},

	// destroy chart
	destroy: function()
	{
		$chartDoubleMetricPerDay.highcharts().destroy();
	}
}

jsBackend.analytics.chartSingleMetricPerDay =
{
	chart: '',

	init: function()
	{
		if($chartSingleMetricPerDay.length > 0) { jsBackend.analytics.chartSingleMetricPerDay.create(); }
	},

	// add new chart
	create: function()
	{
		var xAxisItems = $('#dataChartSingleMetricPerDay ul.series li.serie:first-child ul.data li');
		var xAxisValues = [];
		var xAxisCategories = [];
		var counter = 0;
		var interval = Math.ceil(xAxisItems.length / 10);

		xAxisItems.each(function()
		{
			xAxisValues.push($(this).children('span.fulldate').html());
			var text = $(this).children('span.date').html();
			if(xAxisItems.length > 10 && counter%interval > 0) text = ' ';
			xAxisCategories.push(text);
			counter++;
		});

		var singleMetricName = $('#dataChartSingleMetricPerDay ul.series li#metricserie span.name').html();
		var singleMetricValues = $('#dataChartSingleMetricPerDay ul.series li#metricserie span.value');
		var singleMetricData = [];

		singleMetricValues.each(function() { singleMetricData.push(parseInt($(this).html())); });

		var containerWidth = $('#chartSingleMetricPerDay').width();

		$chartSingleMetricPerDay.highcharts({
			chart: { height: 200, width: containerWidth, margin: [60, 0, 30, 40], defaultSeriesType: 'area', backgroundColor: 'transparent' },
			xAxis: { lineColor: '#CCC', lineWidth: 1, categories: xAxisCategories },
			yAxis: { min: 0, max: $('#dataChartSingleMetricPerDay #maxYAxis').html(), tickInterval: ($('#dataChartSingleMetricPerDay #tickInterval').html() == '' ? null : $('#dataChartSingleMetricPerDay #tickInterval').html()), title: { text: '' } },
			credits: { enabled: false },
			tooltip: { formatter: function() { return '<b>'+ this.series.name +'</b><br/>'+ xAxisValues[this.point.x] +': '+ this.y; } },
			plotOptions:
			{
				area: { marker: { enabled: false, states: { hover: { enabled: true, radius: 5, lineWidth: 1 } } } },
				column: { pointPadding: 0.2, borderWidth: 0 },
				series: { fillOpacity: 0.3 }
			},
			series: [{ name: singleMetricName, data: singleMetricData }],
			legend: { layout: 'horizontal', verticalAlign: 'top' }
		});
	},

	// destroy chart
	destroy: function()
	{
		$chartSingleMetricPerDay.highcharts().destroy();
	}
}

jsBackend.analytics.chartWidget =
{
	chart: '',

	init: function()
	{
		if($chartWidget.length > 0) { jsBackend.analytics.chartWidget.create(); }
	},

	// add new chart
	create: function()
	{
		var xAxisItems = $('#dataChartWidget ul.series li.serie:first-child ul.data li');
		var xAxisValues = [];
		var xAxisCategories = [];
		var counter = 0;
		var interval = Math.ceil(xAxisItems.length / 10);

		xAxisItems.each(function()
		{
			xAxisValues.push($(this).children('span.fulldate').html());
			var text = $(this).children('span.date').html();
			if(xAxisItems.length > 10 && counter%interval > 0) text = ' ';
			xAxisCategories.push(text);
			counter++;
		});

		var metric1Name = $('#dataChartWidget ul.series li#metric1serie span.name').html();
		var metric1Values = $('#dataChartWidget ul.series li#metric1serie span.value');
		var metric1Data = [];

		metric1Values.each(function() { metric1Data.push(parseInt($(this).html())); });

		var metric2Name = $('#dataChartWidget ul.series li#metric2serie span.name').html();
		var metric2Values = $('#dataChartWidget ul.series li#metric2serie span.value');
		var metric2Data = [];

		metric2Values.each(function() { metric2Data.push(parseInt($(this).html())); });

		$chartWidget.highcharts({
			chart: { defaultSeriesType: 'line', margin: [30, 0, 30, 0], height: 200, width: 270, defaultSeriesType: 'line', backgroundColor: 'transparent' },
			xAxis: { categories: xAxisCategories },
			yAxis: { min: 0, max: $('#dataChartWidget #maxYAxis').html(), tickInterval: ($('#dataChartWidget #tickInterval').html() == '' ? null : $('#dataChartWidget #tickInterval').html()), title: { enabled: false } },
			credits: { enabled: false },
			legend: { layout: 'horizontal', backgroundColor: 'transparent' },
			tooltip: { formatter: function() { return '<b>'+ this.series.name +'</b><br/>'+ xAxisValues[this.point.x] +': '+ this.y; } },
			plotOptions:
			{
				line: { marker: { enabled: false, states: { hover: { enabled: true, radius: 5, lineWidth: 1 } } } },
				area: { marker: { enabled: false, states: { hover: { enabled: true, radius: 5, lineWidth: 1 } } } },
				column: { pointPadding: 0.2, borderWidth: 0 },
				series: { fillOpacity: 0.3 }
			},
			series: [ { name: metric1Name, data: metric1Data, type: 'area' }, { name: metric2Name, data: metric2Data } ],
			legend: { enabled: false }
		});
	},

	// destroy chart
	destroy: function()
	{
		$chartWidget.highcharts().destroy();
	}
}

jsBackend.analytics.loading =
{
	page: 'index',
	identifier: '',
	interval: '',

	init: function()
	{
		// variables
		$longLoader = $('#longLoader');

		if($longLoader.length > 0)
		{
			// loading bar stuff
			$longLoader.show();

			// get the page to get data for
			var page = jsBackend.data.get('analytics.data.page');
			var identifier = jsBackend.data.get('analytics.data.identifier');

			// save data
			jsBackend.analytics.loading.page = page;
			jsBackend.analytics.loading.identifier = identifier;

			// check status every 5 seconds
			jsBackend.analytics.loading.interval = setInterval("jsBackend.analytics.loading.checkStatus()", 5000);
		}
	},

	checkStatus: function()
	{
		// get data
		var page = jsBackend.analytics.loading.page;
		var identifier = jsBackend.analytics.loading.identifier;
		$longLoader = $('#longLoader');
		$statusError = $('#statusError');
		$loading = $('#loading');

		// make the call to check the status
		$.ajax(
		{
			timeout: 5000,
			data:
			{
				fork: { action: 'check_status' },
				page: page,
				identifier: identifier
			},
			success: function(data, textStatus)
			{
				// redirect
				if(data.data.status == 'unauthorized') { window.location = jsBackend.data.get('analytics.data.settingsUrl'); }

				if(data.code == 200)
				{
					// get redirect url
					var url = document.location.protocol +'//'+ document.location.host;
					if(jsBackend.data.exists('analytics.data.redirect')) url += jsBackend.data.get('analytics.data.redirect');
					if(jsBackend.data.exists('analytics.data.redirectGet')) url += '&' + jsBackend.data.get('analytics.data.redirectGet');

					// redirect
					if(data.data.status == 'done') window.location = url;
				}
				else
				{
					// clear interval
					clearInterval(jsBackend.analytics.loading.interval);

					// loading bar stuff
					$longLoader.show();

					// show box
					$statusError.show();
					$loading.hide();

					// show message
					jsBackend.messages.add('error', textStatus);

					// alert the user
					if(jsBackend.debug) alert(textStatus);
				}

				// alert the user
				if(data.code != 200 && jsBackend.debug) { alert(data.message); }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				// clear interval
				clearInterval(jsBackend.analytics.loading.interval);

				// show box and hide loading bar
				$statusError.show();
				$loading.hide();
				$longLoader.hide();

				// show message
				jsBackend.messages.add('error', textStatus);

				// alert the user
				if(jsBackend.debug) alert(textStatus);
			}
		});
	}
}

jsBackend.analytics.resize =
{
	interval: 1000,
	timeout: false,

	init: function()
	{
		$(window).on('resize', function()
		{
			resizeTime = new Date();
			if(jsBackend.analytics.resize.timeout === false)
			{
				timeout = true;
				setTimeout(jsBackend.analytics.resize.resizeEnd, jsBackend.analytics.resize.interval);
			}
		});
	},

	resizeEnd: function()
	{
		if(new Date() - resizeTime < jsBackend.analytics.resize.interval)
		{
			setTimeout(jsBackend.analytics.resize.resizeEnd, jsBackend.analytics.resize.interval);
		}
		else
		{
			timeout = false;
			if($chartPieChart.length > 0)
			{
				jsBackend.analytics.chartPieChart.destroy();
				jsBackend.analytics.chartPieChart.create();
			}
			if($chartDoubleMetricPerDay.length > 0)
			{
				jsBackend.analytics.chartDoubleMetricPerDay.destroy();
				jsBackend.analytics.chartDoubleMetricPerDay.create();
			}
			if($chartSingleMetricPerDay.length > 0)
			{
				jsBackend.analytics.chartSingleMetricPerDay.destroy();
				jsBackend.analytics.chartSingleMetricPerDay.create();
			}
			if($chartWidget.length > 0)
			{
				jsBackend.analytics.chartWidget.destroy();
				jsBackend.analytics.chartWidget.create();
			}
		}
	}
}

$(jsBackend.analytics.init);
