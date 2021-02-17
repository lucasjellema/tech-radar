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
  title: "AMIS | Conclusion BCG Growth Share Radar — 2021.01",
  label: "BCG Growth Share Matrix Radar",

  quadrants: [
    { name: "Dogs", image: "https://cdn.pixabay.com/photo/2019/07/06/14/02/drawing-4320529_960_720.png" },
    { name: "Cashcows", image: "https://dappimg.com/media/image/app/eaa3cb625c164f659ecd6db2aae39e46.png" },
    { name: "Stars", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Golden_star.svg/1200px-Golden_star.svg.png" },
    { name: "Questions Marks", image: "http://assets.stickpng.com/thumbs/5a461418d099a2ad03f9c999.png" }
  ],
  rings: [
    { name: "Huge", color: "#93c47d" },
    { name: "Substantial", color: "#93d2c2" },
    { name: "Minor", color: "#fbdb84" },
    { name: "None to Tiny", color: "#efafa9" }
  ],
  show_logos: false,
  blip_displayStyle: "shapes"
  , all_tags: false
  , print_layout: true,
  // zoomed_quadrant: 0,
  //ENTRIES
  entries: radarEntries,
  getEntries: (noFilter) => { return (noFilter ? radarEntries : getEntriesFilteredByTags()) }
  , getRing: (entry) => { return entry.magnitude ? entry.magnitude : (entry.ring ? entry.ring : 3) }
  , getQuadrant: (entry) => { return entry.growthShareStatus ? growthShareStatusQuadrantMap[entry.growthShareStatus] : (entry.quadrant ? entry.quadrant : 1) }
}
// // entry.tags && entry.tags.includes('data')) // example filter - only show entries with a data tag

const growthShareStatusQuadrantMap =
{
  "dog": 0
  , "cash cow": 1
  , "star": 2
  , "question mark": 3
}