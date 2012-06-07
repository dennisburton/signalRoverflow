using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace overflow.Models
{
    public class Question
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public string Author { get; set; }
        public List<Vote> Votes = new List<Vote>();

        public string toJSON()
        {
            var clientQuestion = toClient();
            string json = JsonConvert.SerializeObject(clientQuestion);
            return json;
        }

        public object toClient()
        {
            return new { id = Id, content = Content, author = Author, votes = Votes.toClient() };
        }
    }

    public class Vote
    {
        public string VoteType { get; set; }
        public string Voter { get; set; }
    }

    public static class OverflowExtentions
    {
        public static string toJSON(this IEnumerable<Question> sourceQuestions)
        {
            var questions = sourceQuestions.Select(sourceQuestion => sourceQuestion.toClient());
            string json = JsonConvert.SerializeObject(questions);
            return json;
        }

        public static Array toClient(this IEnumerable<Vote> sourceVotes)
        {
            var votes = sourceVotes.Select(sourceVote => new { voteType = sourceVote.VoteType, voter = sourceVote.Voter });
            return votes.ToArray();
        }
    }
}