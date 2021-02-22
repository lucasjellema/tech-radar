export { config }
import { getEntriesFilteredByTags, getKeyForValue } from './viewpoint_helpers.js'

const relevanceColorMap = { 0: "lightgray", 1: "green", 2: "orange", 3: "red" }
const communityRatingShapeMap = { 0: "triangleDown", 1: "square", 2: "triangleUp", 3: "star" }

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
  dataSetLabel: "conclusion-technologies",

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
  show_logos: false, blipColors: {
    "colorTitle": "Relevance"
    , colorOptions: relevanceColorMap
  }, blipSizes: { sizeTitle: "Magnitude" },
  blipShapes: {
    shapeTitle: "Community Rating"
    , shapeOptions: communityRatingShapeMap
  },
  blip_displayStyle: "shapes"
  , all_tags: false
  , print_layout: true,
  // zoomed_quadrant: 0,
  //ENTRIES
  entries: radarEntries,
  getEntries: (noFilter) => { return (noFilter ? radarEntries : getEntriesFilteredByTags()) }
  , getRing: (entry) => {
    const r = magnitudeRingMap[entry.magnitude]
    return (r != null) ? r : (entry.ring ? entry.ring : 3)
  }
  , getQuadrant: (entry) => { return entry.growthShareStatus ? growthShareStatusQuadrantMap[entry.growthShareStatus] : (entry.quadrant ? entry.quadrant : 1) }
  , getSize: (entry) => {
    return (entry != null && entry.magnitude != null) ? entry.magnitude : 1
  }, handleSectorDrop: (entry, sector) => {
    entry.growthShareStatus = getKeyForValue(growthShareStatusQuadrantMap, sector.quadrant)
    entry.magnitude = getKeyForValue(magnitudeRingMap, sector.ring)
  },
  handleSizePick: (entry, size) => {
    entry.magnitude = size
  }
  , getShape: (entry) => {
    let shape = "circle"
    const q = communityRatingShapeMap[entry.communityRating]
    return (q != null) ? q : shape

  },
  handleShapePick: (entry, shapeLabel) => {
    entry.communityRating = getKeyForValue(communityRatingShapeMap, shapeLabel)
  }, getColor: (entry) => {
    return entry.relevance ? relevanceColorMap[entry.relevance] : "green"
  }
  , handleColorPick: (entry, color) => {
    entry.relevance = getKeyForValue(relevanceColorMap, color)
  }

}
// // entry.tags && entry.tags.includes('data')) // example filter - only show entries with a data tag

const growthShareStatusQuadrantMap =
{
  "dog": 0
  , "cash cow": 1
  , "star": 2
  , "question mark": 3
}
const magnitudeRingMap = { 0: 3, 1: 2, 2: 1, 3: 0 }
