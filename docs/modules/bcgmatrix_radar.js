export {config}

let config = {
    svg_id: "radar",
    width: 1450,
    height: 1000,
    colors: {
      background: "#fff",
      grid: "#bbb",
      inactive: "#ddd"
    },
    title: "AMIS | Conclusion BCG Growth Share Radar — 2021.01",
    label: "BCG Growth Share Matrix Radar",

    quadrants: [
      { name: "Dogs" },
      { name: "Cashcows" },
      { name: "Stars" },
      { name: "Questions Marks" }
    ],
    rings: [
      { name: "ADOPT", color: "#93c47d" },
      { name: "TRIAL", color: "#93d2c2" },
      { name: "ASSESS", color: "#fbdb84" },
      { name: "HOLD", color: "#efafa9" }
    ],
    show_logos: false
    , print_layout: true,
    // zoomed_quadrant: 0,
    //ENTRIES
    entries: radarEntries
  }
