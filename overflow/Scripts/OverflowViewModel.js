/// <reference path="knockout-2.1.0.js" />

overflow.OverflowViewModel = function () {
    var self = this;

    self.userName = ko.observable("");
    self.isLoggedIn = ko.observable(false);

    self.loginUser = function () {
        self.isLoggedIn(self.userName() !== "")
    }
}