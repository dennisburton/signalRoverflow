﻿$(function () {

    //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    overflow.newGuid = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    overflowViewModel = new overflow.OverflowViewModel();
    ko.applyBindings(overflowViewModel);

    $.connection.hub.start().done(function () {
        $.connection.questionHub.fetchQuestions();
    });
});