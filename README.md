# AMIS | Conclusion Technology Radar

Clone from the Zalando Tech Radar (https://github.com/zalando/tech-radar)

A number of modifications are intended:
= technology selection for AMIS
- richer data model for the blips (the entries in the radar)
- extended presentation for the blips
  - size
  - color
  - shape
  - content of bubble/balloon text
  - filter on labels
  - tag cloud for the labels?
  - additional attributes for blips: 
    - rationale
    - logo
    - vendor
    - priority/weight (volume)


# Entries
The file entries.js contain the data that is visualized in the radar. This seem data could be retrieved using an HTTP request to an API or from an external URL.

Each entry represents both:
* objective: a technology, concept, product, cloud service, open source project
* subjective: our and the community's assessment (the blip on the radar)

For both angles, there are several properties identified for each entry:

## Objective properties

| Property  | Description  | Values  | Notes  |   
|---|---|---|---|
| datestamp  | Date on which the entry was concluded  | 2021, 2021-01, 2021-01-31  |   |   
| reporter  | Person responsible for the entry  |   |   |   
| label  | Display label for Tool/Technology/Concept/...  |   |   |
| description  | description  |   |   |   
| logo  | URL to image or base64 representation of image  | https://w7.png.com/png-oracle-db.png , data:image/png;base64,iVBOR...II="  |   |   
| homepage  | Link to (most relevant) website for this entry  | https://www.postgresql.org/  |   |   
| vendor  | Name of primary organization or company that owns, sponsors, coordinates the item  | Red Hat, Oracle, Microsoft, Apache, CNCF, AWS, IBM, Google  |   |   
| initialReleaseDate  | Year or date of first relevant presence  | 1982, 1982-05, 2019-09-15  |   |   
| lastMajorUpdateDate  | Year or date of the most recent major update or release  |  2020, 2020-12, 2021-01-15  |   |   
| updateLabel  | Label for most recent major update - version, project name,   | 21c, macOS Big Sur (11.2.1), Windows 10 Build 20H2   |   |   
| category  | Category, Classification or Type  | concept, tool, framework, library, platform, infra, language, technique  |   |   
| licenseModel  | How is this item offered?  | oss, commercial, subscription, n/a    | Open Source/Public Domain, commercial license, usage based subscription (also commercial), not applicable (for example for concepts and trends)   |   
| tags  | keywords or qualifiers that provide additional guidance  | data, cloud, security, container  |   |   
| granularity  | level of detail and specificity  | 0, 1, 2  | 0 - high over, abstract, for example Azure, HashiCorp, .NET, Data Lake, DevOps, automated testing; 1 - large, tangible for example Oracle Database, Apache Kafka, Azure Data Lake (Gen2),Visual Studio Code;2 - detail, specific, feature within platform service within public cloud; for example A/B Testing, Java Servlets, Istio, Azure Logic Apps Connector for SalesForce    |   
|   |   |   |   |   

## Context Sensitive properties and Subjective Assessments 

| Property  | Description  | Values  | Notes  |   
|---|---|---|---|
| communityRating  | (our assessment of the) community sentiment, adoption and momentum  | 0,1,2,3  | derived from market share, GitHub stars, stackoverflow activity, appetite; perhaps distinguish between momentum/enthusiasm (future) and actual marketshare/usage (present); 3 = highest, 2 = medium, 1 = starting/limited/dwindling, 0 = embryonic |   
| hypeCycleStatus  | (our assessment of the) Status in terms of the Hype Cycle  | 0,1,2,3,4 | 0 = innovationTrigger, 1 = peakOfInflatedExpectations, 2= throughOfDisillusionment, 3 = slopeOfElightenment, 4 = plateauOfProductivity      |   
| marketAdoptionStatus  | (our assessment of the) Status in terms of market adoption/penetration  |0,1,2,3,4 | 0 = innovator, 1 = earlyAdoptor, 2= earlyMajority, 3 = lateMajority, 4 = laggard     |   
| scope  | What is the scope of the information below; who are the *we* that is referred to  | AMIS, Conclusion, the AMIS Integration Practice, Ursula Panini  |  this can be a an ecosystem, company, virtual team or guild, a department or an individual |   
| introductionDate  | Date when this entry first appeared on our radar  | 2016, 2016-4 |   |   
| relevance  | Indication of how important this entry is for us (our customers, our colleagues, our strategy)  | 0, 1, 2, 3  | 0 = hardly relevant, 1= limited relevance/maybe some potential, 2 = quite relevant, should have , 3 = crucial, must have |   
| magnitude  | Indication of size of entry in our organization |  0, 1, 2, 3 | 0 = niche (< 5 % ), 1 = occasionally, some people, 2 = many people, very often, 3 = virtually everyone and/or very frequently or almost all the time - based on number or % of people that is involved with this entry and the frequency and duration of their involvement  |    
| growthShareStatus  | Status according to BCG Growth Market Share Matrix given our organization and our customers & strategy | star, dog, questionMark, cashcow  | *dog* = low marketshare/activity, low growth (little to be gained), *star* = substantial current activity (or foundation to launch activity from), high growth/potential (so worth investing), *cash cow* = low growth, substantial marketshare/activity/revenue (no high investments, milk it ); *question mark* = high market growth, low current activity and no easy entrance  |   
| rationale  | explanation of the the subjective ratings - how did we arrive at our assessment  |   |   |   
| currentStatus  | What is (until) today the status of this entry for us?  | 0,1,2,3,4,5  | 0 = nothing done yet/interested, 1 = exploring/explored, 2=trying out (prototype/PoC), 3 = (ready for) applying/applied for real, 4=retiring/deprecated, 5=not interested (now/anymore)  | 
| ambition  | What is our ambition/where do we want to go from today onwards  | 0,1,2,3,4,5  | Based on the above assessments, what is our intention with this entry? 0 = nothing yet (Hold), 1 = assess/explore, learn, play; 2=start a trial, do a prototype/PoC, 3 = apply - no restrictions or holding back; push it enthusiastically, 4=deprecate - no further investments, do not use in new environments; continued use where already in place, 5 = RIP/ stop using ; not interested (now/anymore)  | 
|   |   |   |   |   

* scope (personal, department, company)


# Radar elements

The radar has a well known appearance. It shows four concentric circles - the rings - that are divided into four areas by two orthogonal lines (that could be interpreted as axes) - the quadrants. The rings and quadrants are used to convey information: the location of each entry on the radar is meaningful.

Traditionally, the rings indicate the status assigned to an entry (hold, assess, trial, adopt are the original values) and the quadrants indicate the category of an entry (for examples tools, platforms, languages & frameworks, techniques).  
![](images/radar-traditional.png)
These work fine. However, it is quite possible to also present the entries in different configurations of the quadrants and rings.

* Quadrants - the radar is divided into four areas; these areas can be made to mean different things. A common designation is by category. Another could be by status (growth-share matrix, Gartner hypecycle, Gartner maqic qudadrant/Forrester Wave) or by any other grouping (such as AWS, Azure, GCP and others) or even by assessment (which is originally plotted in rings) 
* Rings - the four rings originally were used to visualize assessment (hold, assess, trial, adopt - indicating the ambition); rings can be used in different ways - such as maturity (how long a technology has been around), relevance to the company, community sentiment, marketshare, number of users within company
* Blips - each entry (tool, technology, ..) is plotted somewhere on the radar - in a quadrant and a ring. The blip itself can have visual characteristics: size, color, shape, icon. Each visual characteristic can be used to express something. For example: size to indicate the relative importance, color or shape to indicate ambition (while ring is used to indicate current situation) or vibrancy (how alive and kicking is the entry - based on market adoption, community activity, vendor involvement, release). Note: instead of plotting shapes we could use logo's or name badges for plotting the blips; we lose some of the details, but gain in instant recognition.  



# Original Motivation by Zalando

At [Zalando](http://zalando.de), we maintain a [public Tech

Radar](http://zalando.github.io/tech-radar/) to help our engineering teams
align on technology choices. It is based on the [pioneering work
by ThoughtWorks](https://www.thoughtworks.com/radar).

This repository contains the code to generate the visualization:
[`radar.js`](/docs/radar.js) (based on [d3.js v4](https://d3js.org)).
Feel free to use and adapt it for your own purposes.

## Usage

1. include `d3.js` and `radar.js`:

```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="http://zalando.github.io/tech-radar/release/radar-0.5.js"></script>
```

2. insert an empty `svg` tag:

```html
<svg id="radar"></svg>
```

3. configure the radar visualization:

```js
radar_visualization({
  svg_id: "radar",
  width: 1450,
  height: 1000,
  colors: {
    background: "#fff",
    grid: "#bbb",
    inactive: "#ddd"
  },
  title: "My Radar",
  quadrants: [
    { name: "Bottom Right" },
    { name: "Bottom Left" },
    { name: "Top Left" },
    { name: "Top Right" }
  ],
  rings: [
    { name: "INNER",  color: "#93c47d" },
    { name: "SECOND", color: "#b7e1cd" },
    { name: "THIRD",  color: "#fce8b2" },
    { name: "OUTER",  color: "#f4c7c3" }
  ],
  print_layout: true,
  entries: [
   {
      label: "Some Entry",
      quadrant: 3,          // 0,1,2,3 (counting clockwise, starting from bottom right)
      ring: 2,              // 0,1,2,3 (starting from inside)
      moved: -1             // -1 = moved out (triangle pointing down)
                            //  0 = not moved (circle)
                            //  1 = moved in  (triangle pointing up)
   },
    // ...
  ]
});
```

Entries are positioned automatically so that they don't overlap.

As a working example, you can check out `docs/index.html` &mdash; the source of our [public Tech
Radar](http://zalando.github.io/tech-radar/).

## Local Development

1. install dependencies with yarn (or npm):

```
yarn 
```

2. start local dev server:

```
yarn start
```

3. your default browser should automatically open and show the url
 
```
http://localhost:3000/
```

## License

```
The MIT License (MIT)

Copyright (c) 2017 Zalando SE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
