let radarEntries = [
    {
      quadrant: 3,
      ring: 3,
      label: "Spark",
      active: false,
      link: "https://engineering.zalando.com/tags/apache-spark.html",
      moved: 0
      ,tags:['apache','data','data analytics','sql','machine learning','open source']
    },
    {
      quadrant: 3,
      ring: 2,
      label: "Elasticsearch",
      active: false,
      link: "https://engineering.zalando.com/tags/elasticsearch.html",
      moved: 0,
      importance: 0.5,
      logo: "data:image/png;base64,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"
      ,tags:['data','data analytics','nosql','database']
    },
    {
      quadrant: 3,
      ring: 1,
      label: "PostgreSQL",
      active: false,
      link: "https://engineering.zalando.com/tags/postgresql.html",
      moved: 0
      ,tags:['data','database','sql','rdbms','open source']
    },
    {
      quadrant: 3,
      ring: 2,
      label: "Redis",
      active: false,
      link: "https://engineering.zalando.com/tags/redis.html",
      moved: 0
      ,tags:['data','database','cache','open source']
    },
    {
      quadrant: 3,
      ring: 0,
      label: "Oracle Database",
      active: false,
      importance: 2,
      moved: 0
      ,tags:['data','database','sql','rdbms','oracle']
    },
    {
      quadrant: 2,
      ring: 0,
      label: "Node.js",
      active: false,
      importance:1.5,
      link: "https://engineering.zalando.com/tags/nodejs.html",
      moved: 0
      ,tags:['programming', 'open source']
    },
    {
      quadrant: 2,
      ring: 0,
      label: "ReactJS",
      active: false,
      link: "https://engineering.zalando.com/tags/react.html",
      moved: 0
      ,tags:['web','facebook','javascript','browser','open source']
    },
    {
      quadrant: 1,
      ring: 1,
      label: "Docker",
      active: false,
      link: "https://engineering.zalando.com/tags/docker.html",
      moved: 0,
      logo:"https://www.docker.com/sites/default/files/social/docker_facebook_share.png"
    },
    {
      quadrant: 1,
      ring: 2,
      label: "Kubernetes",
      active: false,
      link: "https://engineering.zalando.com/tags/kubernetes.html",
      moved: 0,
      logo:"data:image/png;base64,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"
      ,tags:['cncf','container','cluster','open source']
    },
    {
      quadrant: 0,
      ring: 0,
      label: "Java",
      active: true,
      link: "https://engineering.zalando.com/tags/java.html",
      moved: 0
      ,tags:['programming','java','open source','oo']

    },
    {
      quadrant: 0,
      ring: 3,
      label: "Python",
      active: true,
      link: "https://engineering.zalando.com/tags/python.html",
      moved: 0
    },
]
