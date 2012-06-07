/// <reference path="knockout-2.1.0.js" />

overflow.OverflowViewModel = function () {
    var self = this;

    self.userName = ko.observable("");
    self.isLoggedIn = ko.observable(false);
    self.newQuestionText = ko.observable("");
    self.questions = ko.observableArray([]);
    
    self.loginUser = function () {
        self.isLoggedIn(self.userName() !== "")
    }

    self.addQuestion = function () {
        var questionData = { content: self.newQuestionText(), author: self.userName() };
        var questionVM = new overflow.QuestionViewModel(questionData);
        self.questions.push(questionVM);
        self.newQuestionText("");
    }
}

overflow.QuestionViewModel = function (questionData) {
    var self = this;

    self.content = questionData.content;
    self.author = questionData.author;
    self.votes = ko.observableArray([]);

    self.voteUp = function () {
        var voteData = { voteType: overflow.voteUp, voter: overflowViewModel.userName() };
        var voteVM = new overflow.VoteViewModel(voteData);
        self.votes.push(voteVM);
    }

    self.voteDown = function () {
        var voteData = { voteType: overflow.voteDown, voter: overflowViewModel.userName() };
        var voteVM = new overflow.VoteViewModel(voteData);
        self.votes.push(voteVM);
    }

    self.votesOfType = function (votes, voteType) {
        var typeVotes = ko.utils.arrayFilter(votes, function (currentVote) {
            return currentVote.voteType === voteType;
        });
        return typeVotes;
    }

    self.voteCount = ko.computed(function () {
        var upVotes = self.votesOfType(self.votes(), overflow.voteUp);
        var downVotes = self.votesOfType(self.votes(), overflow.voteDown);
        return upVotes.length - downVotes.length;
    });

}

overflow.voteUp = "0";
overflow.voteDown = "1";

overflow.VoteViewModel = function (voteData) {
    var self = this;

    self.voteType = voteData.voteType;
    self.voter = voteData.voter;
}
