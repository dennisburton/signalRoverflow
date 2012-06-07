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

        $.connection.questionHub.addQuestion(questionVM.id, questionVM.content, questionVM.author);
    }
}

overflow.QuestionViewModel = function (questionData) {
    var self = this;

    self.id = questionData.id || overflow.newGuid();
    self.content = questionData.content;
    self.author = questionData.author;
    self.votes = ko.observableArray([]);

    if (questionData.votes) {
        _(questionData.votes).each(function (voteData) {
            var voteVM = new overflow.VoteViewModel(voteData);
            self.votes.push(voteVM);
        });
    }


    self.addVote = function (voteType, voter) {
        var userVotes = self.userVotes(voter);
        if (userVotes.length > 0) {
            var userVote = userVotes[0];
            if (userVote.voteType !== voteType) {
                self.votes.remove(function (currentVote) {
                    return currentVote.voteType !== voteType;
                });
            }
        } else {
            var voteData = { voteType: voteType, voter: voter };
            var voteVM = new overflow.VoteViewModel(voteData);
            self.votes.push(voteVM);
        }
        $.connection.questionHub.addVote(self.id, voteType, voter);
    }

    self.voteUp = function () {
        self.addVote(overflow.voteUp, overflowViewModel.userName());
    }

    self.voteDown = function () {
        self.addVote(overflow.voteDown, overflowViewModel.userName());
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

    self.userVotes = function (userName) {
        var userVotes = ko.utils.arrayFilter(self.votes(), function (currentVote) {
            return currentVote.voter === userName;
        });
        return userVotes;
    }

    self.userVotesOfType = function (userName, voteType) {
        var userVotes = self.userVotes(userName);
        var typeVotes = self.votesOfType(userVotes, voteType);
        return typeVotes;
    }

    self.didUserVoteUp = ko.computed(function () {
        var upVotes = self.userVotesOfType(overflowViewModel.userName(), overflow.voteUp);
        return upVotes.length > 0;
    });

    self.didUserVoteDown = ko.computed(function () {
        var downVotes = self.userVotesOfType(overflowViewModel.userName(), overflow.voteDown);
        return downVotes.length > 0;
    });

}

overflow.voteUp = "0";
overflow.voteDown = "1";

overflow.VoteViewModel = function (voteData) {
    var self = this;

    self.voteType = voteData.voteType;
    self.voter = voteData.voter;
}
