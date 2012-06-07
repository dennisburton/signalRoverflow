overflow.hub = $.connection.questionHub;

$.extend(overflow.hub, {
    questionAdded: function (clientId, message) {
        if ($.connection.hub.id !== clientId) {
            var newQuestionData = JSON.parse(message);
            var questionVM = new overflow.QuestionViewModel(newQuestionData);

            overflowViewModel.questions.push(questionVM);
        }
    }
});

$.extend(overflow.hub, {
    loadQuestions: function (questionsJson) {
        var questionData = JSON.parse(questionsJson);
        $.each(questionData, function (index, data) {
            var newQuestion = new overflow.QuestionViewModel(data);
            overflowViewModel.questions.push(newQuestion);
        });
    }
});

$.extend(overflow.hub, {
    questionUpdated: function(questionJSON) {
        var questionData = JSON.parse(questionJSON);
        var existingQuestions = _(overflowViewModel.questions()).filter(function (question) {
            return question.id === questionData.id;
        });

        if (existingQuestions.length > 0) {
            var existingQuestion = existingQuestions[0];
            existingQuestion.votes.removeAll();
            _(questionData.votes).each(function (voteData) {
                var vote = new overflow.VoteViewModel(voteData);
                existingQuestion.votes.push(vote);
            });
        }
    }
});