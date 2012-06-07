using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using overflow.Models;
using SignalR.Hubs;

namespace overflow.Hubs
{
    public class QuestionHub : Hub
    {
        public static List<Question> questions = new List<Question>();

        public void AddQuestion(string id, string content, string author)
        {
            var newQuestion = new Question { Id = id, Author = author, Content = content };
            var questionJson = newQuestion.toJSON();
            questions.Add(newQuestion);

            Clients.questionAdded(Context.ConnectionId, questionJson);
        }

        public void FetchQuestions()
        {
            var questionsJson = questions.toJSON();
            Caller.loadQuestions(questionsJson);
        }

        public void AddVote(string questionId, string voteType, string voter)
        {
            var existingQuestion = questions.FirstOrDefault(question => question.Id == questionId);
            if (existingQuestion != null)
            {
                var userVote = existingQuestion.Votes.FirstOrDefault(vote => vote.Voter == voter);
                if (userVote != null)
                {
                    if (userVote.VoteType != voteType)
                    {
                        existingQuestion.Votes.Remove(userVote);
                    }
                }
                else
                {
                    var newVote = new Vote { VoteType = voteType, Voter = voter };
                    existingQuestion.Votes.Add(newVote);
                }
                Clients.questionUpdated(existingQuestion.toJSON());
            }

        }
    }
}