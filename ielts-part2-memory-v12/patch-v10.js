(function(){
const P=window.P2_DATA_PARTS||[];
const get=id=>P.find(x=>x.id===id);
const topic=(t,q)=>t&&t.topics.find(x=>x.q===q);

// Q04 / Q22: Claire is already a long-time friend. Keep the help and volunteer
// evidence, but remove the contradictory "met her again / found out" timeline.
{
  const t=get('concert-volunteer');
  t.shared[0]="One time, Claire and I planned to attend a K-pop concert in Korea. It was my first time there, and I couldn't understand the public transport system. I got confused at a bus station, so Claire showed me the way to the venue.";
  t.shared[1]="At the venue, Claire worked as a volunteer. She helped foreign fans who had problems, kept the fan queues in order, helped the staff sell merchandise and guided people to different areas.";
}

// Q05 shares the concert-trip background with Q07 / Q44, but its main line is
// waiting for a ticket seller. The hotel cancellation belongs only to the
// organization/teamwork answers.
{
  const t=get('concert-team');
  topic(t,'Q05').omitSharedIndexes=[3];
  topic(t,'Q05').ending="I was annoyed by the long wait, and next time I would buy tickets earlier or use a more reliable seller.";

  const q7=topic(t,'Q07');
  q7.omitSharedIndexes=[2,3];
  q7.middle="Before the trip, I made a simple schedule and checked our budget with everyone. I also reminded the group about the meeting point, the ticket time and what we needed to bring.";
  q7.ending="Because everyone finished their task, the trip went smoothly. We arrived early, took photos outside the venue and sang along during the show. Afterwards, we had dinner together and kept talking about our favourite moments. Seeing everyone so excited made me feel that the event was truly successful.";
}

// Make the K11 adaptations less repetitive.
{
  const t=get('k11');
  topic(t,'Q09').intro="I'd like to talk about my older sister's home, which I enjoy visiting but would not want to live in.";
  topic(t,'Q33').middle="Inside, there are artworks and colourful lights, so it looks more creative than an ordinary shopping mall.";
  topic(t,'Q34').middle="I went there with my sister one weekend. At first the exhibitions were interesting, but after a while many of the shops started to look similar.";
}

// Q13: keep the Zootopia mother story but remove repeated evaluation and bring
// the answer back below 180 words.
{
  const q=topic(get('zootopia'),'Q13');
  q.middle="I watched it at home with a friend last weekend because I wanted something light and easy to watch.";
  q.ending="I enjoyed the funny characters and the clear message about prejudice.";
}

// Q14 / Q51 / Q52: one pottery-media mother story, with no repeated discovery
// sentence or repeated conclusion.
{
  const t=get('pottery-media');
  Object.assign(topic(t,'Q14'),{
    intro:"I'd like to talk about a pottery programme I watched recently.",
    middle:"I do not watch this kind of programme often, but I watched this one until the end because the modern pottery looked interesting.",
    ending:"It also made me want to learn more about pottery."
  });
  Object.assign(topic(t,'Q51'),{
    intro:"An interesting video I watched recently was about a local pottery market.",
    middle:'',
    ending:"The colourful designs made the video memorable, and it made me want to try pottery myself."
  });
}

// Q15: make the famous-person advertisement and the mooncake demonstration one
// consistent event instead of switching between an ad and an unrelated show.
{
  const t=get('mooncake');
  t.shared[0]="The advertisement was a short online video made by a local coffee brand. A Chinese member of my favourite K-pop group appeared in it and showed viewers how to make a mooncake. The brand introduced several new flavours, including ice cream and mango. My idol chose an easy type called a snow-skin mooncake and used food colouring to give it a bright appearance.";
  topic(t,'Q15').ending="I was happy to see my idol in the advertisement. It also taught me a simple way to make mooncakes for my family.";
}

// Q16: the important opinion is already clear; shorten the local explanation so
// it does not overrun the user's preferred speaking length.
{
  const q=topic(get('island-bike'),'Q16');
  q.middle="I used to think that a good trip needed a clear plan. If something went wrong, I thought the trip would be ruined.";
  q.ending="That experience changed my opinion. I realised that an unexpected change does not always ruin a trip and can sometimes make it better.";
}

// Q25: remove the duplicated opening sentence.
topic(get('yellow-river'),'Q25').intro="I'd like to talk about the Yellow River, one of the best-known rivers in China.";

// Q28 stays in the same Claire/language tab because the person and background
// are highly similar, but the detailed language-study paragraph is deleted for
// the best-friend question.
{
  const q=topic(get('claire-learning'),'Q28');
  q.intro="The best friend I would like to describe is Claire.";
  q.omitSharedIndexes=[2];
  q.middle="We both love K-pop, and a concert brought us closer. After that, we found that we had similar personalities and endless topics to talk about.";
  q.ending="I like her because she is reliable and easy to talk to. I have also learned a lot from the way she plans her life.";
}

// Q31: remove the repeated explanation about independent artists.
{
  const q=topic(get('claire-art-business'),'Q31');
  q.middle="After university, she contacted several independent artists, explained her plan, and invited them to sell their work through the platform.";
}

// Q42: state the changed plan directly instead of calling it only a change of
// transport.
topic(get('concert-change'),'Q42').intro="A plan I changed recently was spending the weekend working overtime. My friend and I changed it and went to a concert instead.";

// Q57 shares the festival setting with Q40, but the reason it was unpleasant is
// the heavy rain. Remove the phone-ban paragraph from this answer.
{
  const q=topic(get('bad-concert'),'Q57');
  q.omitSharedIndexes=[1,2];
  q.middle="It suddenly started pouring before the performance. The grass turned to mud, we had not brought umbrellas, and I was wearing white shoes, so I felt completely hopeless. Even though the group performed many songs and the fans sang along, I could not relax. My clothes were wet, my shoes were covered in mud, and I felt cold and uncomfortable.";
  q.ending="The music itself was fine, but the heavy rain made the event difficult to enjoy. Next time I will bring an umbrella and wear casual shoes.";
}

// Q58 / Q59: keep Claire's drawing core but remove repeated relationship,
// exhibition and "ordinary moments" sentences.
{
  const t=get('claire-drawing');
  topic(t,'Q58').middle="Because of her, I have started to understand art better.";
  topic(t,'Q59').intro="I'd like to talk about Claire, a well-known online artist I would like to meet again.";
}
})();
