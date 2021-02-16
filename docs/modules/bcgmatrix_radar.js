export {config}
import {getEntriesFilteredByTags} from './viewpoint_helpers.js'

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
    show_logos: false,
    blip_displayStyle:"shapes"
    ,all_tags: false
    , print_layout: true,
    // zoomed_quadrant: 0,
    //ENTRIES
    entries: radarEntries,
    getEntries: (noFilter) => { return (noFilter? radarEntries: getEntriesFilteredByTags()) }
  }
// // entry.tags && entry.tags.includes('data')) // example filter - only show entries with a data tag