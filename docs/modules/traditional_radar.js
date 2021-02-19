export { config }
import { getEntriesFilteredByTags } from './viewpoint_helpers.js'

let config = {
  svg_id: "radar",
  width: 1450,
  height: 1000,
  colors: {
    background: "#fff",
    grid: "#bbb",
    inactive: "#ddd"
  },
  title: "AMIS | Conclusion Tech Radar — 2021.01",
  label: "Traditional Radar",
  quadrants: [
    { name: "Languages" },
    { name: "Infrastructure" },
    { name: "Frameworks" },
    { name: "Data Management" }
  ],
  rings: [
    { name: "ADOPT", color: "#93c47d" },
    { name: "TRIAL", color: "#93d2c2" },
    { name: "ASSESS", color: "#fbdb84" },
    { name: "HOLD", color: "#efafa9" }
  ],
  show_logos: false,
  blip_displayStyle: "shapes"
  , all_tags: false
  , print_layout: true,
  // zoomed_quadrant: 0,
  //ENTRIES
  entries: radarEntries,
  getEntries: (noFilter) => { return (noFilter ? radarEntries : getEntriesFilteredByTags()) }
  , getRing: (entry) => {
    const ambitionRingMap = { 0: 3, 5: 3, 1: 2, 2: 1, 3: 0, 4: 0 }
    const r = ambitionRingMap[entry.ambition]
    return (r != null) ? r : (entry.ring ? entry.ring : 3)
  }
  , getQuadrant: (entry) => {
    const categoryQuadrantMap = { "platform": 3, "infra": 1, "language": 0, "tool": 2, "library": 2, "framework": 2, "concept": 2 }
    const q = categoryQuadrantMap[entry.category]
    return (q != null) ? q : (entry.quadrant ? entry.quadrant : 3)
  }
  , getSize: (entry) => {
      return (entry !=null && entry.magnitude!=null)? entry.magnitude : 1
  }


}
