﻿module("TransactionViewModel Tests");

test("Properties Set", function () {
    var transaction = {
        Description = "description",
        Value = -123.54
    };

    var vm = new App.ViewModels.TransactionViewModel(transaction);

    equal(vm.description(), "description", "The description property should have been set");
    equal(vm.value(), -123.54, "The value property should have been set");
});

module("AnalysisResultsViewModel Tests");

test("Plots Results", function () {
    //set up a fake jqplot handler
    var plotResultsId = null;
    var plotData = null;
    var plotOptions = null;
    jQuery.jqplot = function (resultsDivId, data, options) {
        plotResultsId = resultsDivId;
        plotData = data;
        plotOptions = options;
    };

    //call the function
    var data = {
        Transactions: [],
        CategoryCounts: [["Category", 1], ["Category2", 2]]
    };
    var vm = new App.ViewModels.AnalysisResultsViewModel("resultsDiv", data);

    //check that jqplot was called
    equal(plotResultsId, "resultsDiv", "The results div should have been passed to jqplot");
    deepEqual(plotData, [data.CategoryCounts], "The category counts should have been passed to jqplot");

    //check the options
    var expectedOptions = {
        seriesDefaults: {
            renderer: $.jqplot.PieRenderer,
            rendererOptions: {
                showDataLabels: true
            }
        },
        legend: {
            show: true,
            location: "e"
        }
    };
    deepEqual(expectedOptions, plotOptions, "The options object should have been set up");
});

test("Displays Transactions", function () {
    //set up a fake jqplot handler
    jQuery.jqplot = function () { };

    //create the vm
    var data = {
        Transactions: [
            { Name: "Transaction1", Value: 123.0 },
            { Name: "Transaction2", Value: -456.0 }
        ],
        CategoryCounts: [["Category", 1], ["Category2", 2]]
    };
    var vm = new App.ViewModels.AnalysisResultsViewModel("resultsDiv", data);

    ///check that the transactions property is populated
    equal(vm.transactions().length, 2, "Expected 2 transactions");
    deepEqual(vm.transactions()[0].name(), "Transaction1", "Expected transactions from the results");
    deepEqual(vm.transactions()[1].name(), "Transaction2", "Expected transactions from the results");
});